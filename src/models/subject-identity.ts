import type { BundleEntry } from './bundle';

/** Subject categories supported by the neutral identity collection. */
export type SubjectKind = 'person' | 'animal' | 'property';

/** Semantic resource types stored inside the neutral Subject collection. */
export type SubjectIdentityResourceType = 'Person' | 'Animal' | 'Place';

/** Exact private identifier input linked to one public unified card. */
export type SubjectIdentityInput = Readonly<{
  subjectKind: SubjectKind;
  cardId: string;
  /** Canonical identifier type/coding system. */
  codingSystem: string;
  /** ISO jurisdiction for scoped identifiers; empty for a global identifier. */
  jurisdiction: string;
  codeValue: string;
  /** Additional encrypted claims; canonical identifier and sameAs keys cannot be overridden. */
  additionalClaims?: Readonly<Record<string, unknown>>;
}>;

/** Normalized association recovered from one Subject collection entry. */
export type SubjectIdentityAssociation = SubjectIdentityInput & Readonly<{
  resourceType: SubjectIdentityResourceType;
  assetId: string;
}>;

/** Bundle entry used to write one semantic identity into the Subject collection. */
export type SubjectIdentityBundleEntry = BundleEntry & Readonly<{
  type: 'Subject-identity-link-v1.0';
  resource: NonNullable<BundleEntry['resource']> & Readonly<{
    resourceType: SubjectIdentityResourceType;
    meta: { claims: Record<string, unknown> };
  }>;
  request: { method: 'POST'; url: 'Subject' };
}>;
