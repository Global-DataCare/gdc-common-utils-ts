import { ClaimsOrganizationSchemaorg, ClaimsServiceSchemaorg } from '../constants/schemaorg';
import { DataspaceSectors } from '../constants/sectors';

/**
 * @deprecated Animal-card vocabulary is owned by the consuming product SDK.
 * Retained only so consumers of 2.3.x can migrate without a breaking removal.
 */
export const AnimalSubjectKinds = Object.freeze({
  Animal: 'animal',
} as const);

/**
 * @deprecated Use the species registry from the consuming product SDK.
 * NCBI Taxonomy identifiers are external identifiers and are not a GDC model.
 */
export const NcbiTaxonomy = Object.freeze({
  Dog: '9615',
  Cat: '9685',
  Horse: '9796',
} as const);

/** @deprecated Import the taxonomy identifier type from the product SDK. */
export type NcbiTaxonomyId = string;

/** @deprecated Import the animal onboarding input from the product SDK. */
export type AnimalOnboardingInput = Readonly<{
  subjectId: string;
  cardDidWeb: string;
  alternateName: string;
  legalName?: string;
  birthDate?: string;
  birthYear?: number;
  gender?: 'female' | 'male' | 'other' | 'unknown';
  ncbiTaxonomyId: NcbiTaxonomyId;
  controllerEmail?: string;
  controllerTelephone?: string;
  sector?: string;
}>;

/** @deprecated Import the animal onboarding claims type from the product SDK. */
export type AnimalOnboardingClaims = Readonly<Record<string, string>>;

/**
 * @deprecated Use the taxonomy URI builder from the product SDK.
 *
 * Builds the canonical OBO URI for one NCBI Taxonomy numeric identifier.
 *
 * The URI is public taxonomy metadata, not an animal identifier. Callers must
 * keep microchip, registry and controller identifiers in their separately
 * typed confidential/index contracts.
 */
export function buildNcbiTaxonomyUri(id: NcbiTaxonomyId): string {
  const normalized = id.trim();
  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new TypeError('ncbiTaxonomyId must be a positive numeric NCBI Taxonomy identifier.');
  }
  if (normalized === '9606') {
    throw new TypeError('Human NCBI Taxonomy 9606 is not valid for animal onboarding.');
  }
  return `http://purl.obolibrary.org/obo/NCBITaxon_${normalized}`;
}

/**
 * @deprecated Use the animal onboarding builder from the product SDK. This
 * compatibility implementation will be removed in the next major release.
 *
 * Projects one controller-authorized animal card request to the existing
 * schema.org individual-organization claim envelope.
 *
 * The indexed subject is always an animal and its human actor is always a
 * responsible controller. Login identity proves only the application session;
 * GW must still verify the enrollment grant before accepting the request. A
 * card must not be shown as active until the authoritative GW transaction
 * returns success.
 */
export function buildAnimalOnboardingClaims(
  input: AnimalOnboardingInput,
): AnimalOnboardingClaims {
  const subjectId = input.subjectId.trim();
  const cardDidWeb = input.cardDidWeb.trim();
  const alternateName = input.alternateName.trim();
  if (!subjectId || !cardDidWeb || !alternateName) {
    throw new TypeError('subjectId, cardDidWeb and alternateName are required.');
  }

  const birthDate = input.birthDate?.trim()
    || (Number.isInteger(input.birthYear) ? String(input.birthYear) : '');
  const legalName = input.legalName?.trim();
  const gender = input.gender && input.gender !== 'unknown' ? input.gender : '';

  return Object.freeze({
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifierValue]: subjectId,
    [ClaimsOrganizationSchemaorg.additionalType]: AnimalSubjectKinds.Animal,
    [ClaimsOrganizationSchemaorg.alternateName]: alternateName,
    ...(legalName ? { [ClaimsOrganizationSchemaorg.legalName]: legalName } : {}),
    [ClaimsOrganizationSchemaorg.sameAs]: cardDidWeb,
    [ClaimsOrganizationSchemaorg.memberName]: alternateName,
    [ClaimsOrganizationSchemaorg.memberAdditionalType]: buildNcbiTaxonomyUri(input.ncbiTaxonomyId),
    [ClaimsOrganizationSchemaorg.memberRole]: 'RESPRSN',
    ...(birthDate ? { [ClaimsOrganizationSchemaorg.memberBirthDate]: birthDate } : {}),
    ...(gender ? { [ClaimsOrganizationSchemaorg.memberGender]: gender } : {}),
    [ClaimsOrganizationSchemaorg.ownerEmail]: input.controllerEmail?.trim() || '',
    [ClaimsOrganizationSchemaorg.ownerTelephone]: input.controllerTelephone?.trim() || '',
    [ClaimsServiceSchemaorg.category]: input.sector?.trim() || DataspaceSectors.AnimalCare,
  });
}
