export const ClinicalResourceReplacementDecision = Object.freeze({
  AllowOrganizationSuccessor: 'allow-organization-successor',
  Deny: 'deny',
} as const);

export type ClinicalResourceReplacementDecisionValue =
  typeof ClinicalResourceReplacementDecision[keyof typeof ClinicalResourceReplacementDecision];

export type ClinicalResourceVersionIdentity = Readonly<{
  resourceId: string;
  authorOwnerIdentifier: string;
  documentDate: string;
}>;

export type ClinicalDocumentAuthorOrganization = Readonly<{
  authorReference: string;
  organizationReference: string;
  documentDate: string;
}>;

type FhirResource = Readonly<{
  resourceType?: unknown;
  id?: unknown;
  author?: ReadonlyArray<Readonly<{ reference?: unknown }>>;
  custodian?: Readonly<{ reference?: unknown }>;
  organization?: Readonly<{ reference?: unknown }>;
  practitioner?: Readonly<{ reference?: unknown }>;
  date?: unknown;
}>;

type FhirBundleEntry = Readonly<{
  fullUrl?: unknown;
  resource?: FhirResource;
}>;

function cleanReference(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function resourceReference(resource: FhirResource | undefined): string {
  const resourceType = cleanReference(resource?.resourceType);
  const id = cleanReference(resource?.id);
  return resourceType && id ? `${resourceType}/${id}` : '';
}

/**
 * Resolves document ownership from the FHIR graph carried by an IPS Bundle.
 * A Composition may name its Organization directly or name a PractitionerRole
 * whose `organization` reference names it. Custodian is a compatibility
 * fallback only when the author is a Practitioner represented without a
 * PractitionerRole organization link.
 */
export function resolveClinicalDocumentAuthorOrganization(bundle: unknown):
ClinicalDocumentAuthorOrganization | undefined {
  const entries = Array.isArray((bundle as { entry?: unknown })?.entry)
    ? (bundle as { entry: FhirBundleEntry[] }).entry
    : [];
  const composition = entries.find(({ resource }) => resource?.resourceType === 'Composition')?.resource;
  const authorReference = cleanReference(composition?.author?.[0]?.reference);
  const documentDate = cleanReference(composition?.date);
  if (!composition || !authorReference || !documentDate || !Number.isFinite(Date.parse(documentDate))) {
    return undefined;
  }

  const findResource = (reference: string): FhirResource | undefined => entries.find((entry) => {
    const fullUrl = cleanReference(entry.fullUrl);
    const relativeReference = resourceReference(entry.resource);
    return reference === fullUrl
      || reference === relativeReference
      || (fullUrl && relativeReference && reference === `${fullUrl.replace(/\/$/, '')}/${relativeReference}`);
  })?.resource;

  const author = findResource(authorReference);
  let organizationReference = '';
  if (author?.resourceType === 'Organization') {
    organizationReference = authorReference;
  } else if (author?.resourceType === 'PractitionerRole') {
    organizationReference = cleanReference(author.organization?.reference);
  } else if (author?.resourceType === 'Practitioner') {
    const role = entries.find(({ resource }) => resource?.resourceType === 'PractitionerRole'
      && cleanReference(resource.practitioner?.reference) === authorReference)?.resource;
    organizationReference = cleanReference(role?.organization?.reference);
  }

  if (!organizationReference) {
    organizationReference = cleanReference(composition.custodian?.reference);
  }
  const organization = findResource(organizationReference);
  if (!organizationReference || organization?.resourceType !== 'Organization') {
    return undefined;
  }
  return { authorReference, organizationReference, documentDate };
}

/**
 * Evaluates the narrow provenance-preserving replacement exception.
 *
 * This does not authorize an actor or a delete. Gateways call it only after
 * authenticating the sender and resolving both document authors to their
 * registered owning organizations.
 */
export function evaluateClinicalResourceReplacement(input: Readonly<{
  existing: ClinicalResourceVersionIdentity;
  incoming: ClinicalResourceVersionIdentity;
}>): ClinicalResourceReplacementDecisionValue {
  const existingResourceId = String(input.existing.resourceId || '').trim();
  const incomingResourceId = String(input.incoming.resourceId || '').trim();
  const existingOwner = String(input.existing.authorOwnerIdentifier || '').trim();
  const incomingOwner = String(input.incoming.authorOwnerIdentifier || '').trim();
  const existingDate = Date.parse(String(input.existing.documentDate || '').trim());
  const incomingDate = Date.parse(String(input.incoming.documentDate || '').trim());
  if (
    !existingResourceId
    || incomingResourceId !== existingResourceId
    || !existingOwner
    || incomingOwner !== existingOwner
    || !Number.isFinite(existingDate)
    || !Number.isFinite(incomingDate)
    || incomingDate <= existingDate
  ) {
    return ClinicalResourceReplacementDecision.Deny;
  }
  return ClinicalResourceReplacementDecision.AllowOrganizationSuccessor;
}
