// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

export type FamilyRegistrationStatus =
  | 'new_created'
  | 'resume_required'
  | 'already_exists'
  | 'not_found';

export type FamilyOrganizationSubjectInfo = Readonly<{
  identifierType?: string;
  identifierValue?: string;
  alternateName?: string;
  birthDate?: string;
  ownerTelephone?: string;
}>;

export type FamilyOrganizationSummary = Readonly<{
  status: FamilyRegistrationStatus;
  offerId?: string;
  organizationId?: string;
  subjectInfo?: FamilyOrganizationSubjectInfo;
  missingFields?: string[];
  updatedAt?: string;
}>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function normalizeStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.map((item) => normalizeText(item)).filter(Boolean) as string[];
  return items.length ? items : undefined;
}

/**
 * Reads the first family-organization summary returned by current GW-style
 * search or batch responses.
 *
 * Returns `null` when the response does not contain one usable summary or when
 * the registration status is explicitly `not_found`.
 */
export function readFamilyOrganizationSummaryFromResponseBody(
  body: unknown,
): FamilyOrganizationSummary | null {
  const root = asRecord(body);
  const bodyNode = asRecord(root.body);
  const rawEntries = Array.isArray(bodyNode.data)
    ? bodyNode.data
    : (Array.isArray(root.data) ? root.data : []);
  const firstEntry = rawEntries[0];
  if (!firstEntry || typeof firstEntry !== 'object') {
    return null;
  }

  const entry = asRecord(firstEntry);
  const entryMeta = asRecord(entry.meta);
  const entryResource = asRecord(entry.resource);
  const entryResourceMeta = asRecord(entryResource.meta);
  const claims = {
    ...asRecord(entryMeta.claims),
    ...asRecord(entryResourceMeta.claims),
  };

  const status = normalizeText(claims['org.schema.FamilyRegistration.status'] ?? claims.status) as FamilyRegistrationStatus | undefined;
  if (!status || status === 'not_found') {
    return null;
  }

  return {
    status,
    offerId: normalizeText(claims['org.schema.Offer.identifier']),
    organizationId: normalizeText(claims['org.schema.Organization.identifier.value'] ?? entryResource.id),
    subjectInfo: {
      identifierType: normalizeText(claims['org.schema.Organization.identifier.additionalType']),
      identifierValue: normalizeText(claims['org.schema.Organization.identifier.value']),
      alternateName: normalizeText(claims['org.schema.Organization.alternateName']),
      birthDate: normalizeText(claims['org.schema.Organization.foundingDate']),
      ownerTelephone: normalizeText(claims['org.schema.Organization.owner.telephone']),
    },
    missingFields: normalizeStringList(claims['org.schema.FamilyRegistration.missingFields'] ?? claims.missingFields),
    updatedAt: normalizeText(claims['org.schema.FamilyRegistration.updatedAt'] ?? claims.updatedAt),
  };
}
