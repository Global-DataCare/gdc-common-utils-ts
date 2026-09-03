// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { getHealthcareRoleByClaim } from '../constants/healthcare.js';
import { isStableActorIdentifier } from './actor-identifier.js';
import { normalizeUuid } from './normalize-uuid.js';

export const FhirIpsCreatorKinds = Object.freeze({
  IndividualSubject: 'individual-subject',
  IndividualMember: 'individual-member',
  Professional: 'professional',
} as const);

export type FhirIpsCreatorKind =
  typeof FhirIpsCreatorKinds[keyof typeof FhirIpsCreatorKinds];

export type FhirIpsCreatorBundleEntry = Readonly<{
  fullUrl: string;
  resource: Readonly<Record<string, unknown>>;
}>;

type FhirIpsCreatorBase = Readonly<{
  /** Stable imported or locally generated actor identifier. */
  actorIdentifier: string;
  /** Stable identifier referenced by Composition.author for this role/relationship. */
  authorIdentifier: string;
}>;

export type FhirIpsCreatorAuthorInput =
  | (FhirIpsCreatorBase & Readonly<{
    kind: typeof FhirIpsCreatorKinds.IndividualSubject;
    subjectReference: string;
  }>)
  | (FhirIpsCreatorBase & Readonly<{
    kind: typeof FhirIpsCreatorKinds.IndividualMember;
    subjectReference: string;
    role: string;
  }>)
  | (FhirIpsCreatorBase & Readonly<{
    kind: typeof FhirIpsCreatorKinds.Professional;
    organizationReference: string;
    role: string;
  }>);

export type FhirIpsCreatorAuthor = Readonly<{
  authorReference: string;
  entries: readonly FhirIpsCreatorBundleEntry[];
}>;

/**
 * Builds the ordinary FHIR R4 resources referenced by an IPS
 * `Composition.author`.
 *
 * The helper preserves imported `urn:uuid` identifiers. It never derives an
 * author from email, telephone, an OIDC subject, DCR client id or key id.
 * ONESELF references the existing Patient/subject entry. A professional
 * references PractitionerRole while retaining the underlying Practitioner.
 * An individual member references RelatedPerson.
 */
export function buildFhirIpsCreatorAuthor(
  input: FhirIpsCreatorAuthorInput,
): FhirIpsCreatorAuthor {
  const actorIdentifier = requireUuidUrn(input.actorIdentifier, 'actorIdentifier');
  const authorIdentifier = requireUuidUrn(input.authorIdentifier, 'authorIdentifier');

  if (input.kind === FhirIpsCreatorKinds.IndividualSubject) {
    const subjectReference = requireUuidUrn(input.subjectReference, 'subjectReference');
    if (actorIdentifier !== subjectReference || authorIdentifier !== subjectReference) {
      throw new TypeError('ONESELF author must reference the individual subject identifier.');
    }
    return { authorReference: subjectReference, entries: [] };
  }

  const role = requireRoleCoding(input.role);
  if (input.kind === FhirIpsCreatorKinds.IndividualMember) {
    const subjectReference = requireUuidUrn(input.subjectReference, 'subjectReference');
    return {
      authorReference: authorIdentifier,
      entries: [{
        fullUrl: authorIdentifier,
        resource: {
          resourceType: 'RelatedPerson',
          id: uuidValue(authorIdentifier),
          identifier: [{ value: actorIdentifier }],
          patient: { reference: subjectReference },
          relationship: [{ coding: [role] }],
        },
      }],
    };
  }

  const organizationReference = requireReference(input.organizationReference, 'organizationReference');
  return {
    authorReference: authorIdentifier,
    entries: [
      {
        fullUrl: actorIdentifier,
        resource: {
          resourceType: 'Practitioner',
          id: uuidValue(actorIdentifier),
          identifier: [{ value: actorIdentifier }],
        },
      },
      {
        fullUrl: authorIdentifier,
        resource: {
          resourceType: 'PractitionerRole',
          id: uuidValue(authorIdentifier),
          identifier: [{ value: authorIdentifier }],
          practitioner: { reference: actorIdentifier },
          organization: { reference: organizationReference },
          code: [{ coding: [role] }],
        },
      },
    ],
  };
}

type ClinicalCreatorChannelAliases = Readonly<{
  /** Operational DIDs returned by authenticated profiles; never the stable FHIR identifier. */
  actorDids?: readonly string[];
  /** Verified contact hashes used only to find this binding. */
  verifiedContactIdentifiers?: readonly string[];
  /** Registered OAuth/DCR clients used only to find this binding. */
  dcrClientIds?: readonly string[];
  /** Registered signing keys used only to find this binding. */
  keyIds?: readonly string[];
}>;

/**
 * Durable clinical-creator identity stored behind the authenticated profile.
 * `actorIdentifier` identifies the person/member. `authorIdentifier` identifies
 * the concrete role or relationship assignment used as the FHIR author.
 * Contacts, DCR clients, keys and operational DIDs are aliases only.
 */
export type ClinicalCreatorBinding = ClinicalCreatorChannelAliases & Readonly<{
  kind: FhirIpsCreatorKind;
  actorIdentifier: string;
  authorIdentifier: string;
  /** Legal organization DID/URN or individual subject urn:uuid owning the assignment. */
  ownerIdentifier: string;
  /** Canonical governed ISCO/HL7 role claim; ONESELF is the subject relationship. */
  role: string;
}>;

export type AuthenticatedClinicalCreatorEvidence = Readonly<{
  actorDid?: string;
  verifiedContactIdentifiers?: readonly string[];
  dcrClientId?: string;
  keyId?: string;
}>;

export type ClinicalCreatorPermissionActor = Readonly<{
  /** UUID of the exact role/relationship assignment, never a contact address. */
  actorIdentifier: string;
  /** Governed role retained separately from the assignment UUID. */
  actorRole: string;
}>;

/** Builds the stable actor-and-role pair consumed by Consent permission rules. */
export function buildClinicalCreatorPermissionActor(
  binding: ClinicalCreatorBinding,
): ClinicalCreatorPermissionActor {
  requireUuidUrn(binding.actorIdentifier, 'binding.actorIdentifier');
  const actorIdentifier = requireUuidUrn(binding.authorIdentifier, 'binding.authorIdentifier');
  requireReference(binding.ownerIdentifier, 'binding.ownerIdentifier');
  requireRoleCoding(binding.role);
  return { actorIdentifier, actorRole: binding.role };
}

/**
 * Resolves already-authenticated channel evidence to one stable clinical
 * creator binding. Callers must verify the OIDC contact, DCR client or signing
 * key before invoking this deterministic matcher.
 */
export function resolveClinicalCreatorBinding(
  bindings: readonly ClinicalCreatorBinding[],
  evidence: AuthenticatedClinicalCreatorEvidence,
): ClinicalCreatorBinding | undefined {
  const evidenceContacts = new Set((evidence.verifiedContactIdentifiers || [])
    .map((value) => String(value || '').trim())
    .filter(isStableActorIdentifier));
  const actorDid = String(evidence.actorDid || '').trim();
  const dcrClientId = String(evidence.dcrClientId || '').trim();
  const keyId = String(evidence.keyId || '').trim();

  const matches = bindings.filter((binding) => {
    requireUuidUrn(binding.actorIdentifier, 'binding.actorIdentifier');
    requireUuidUrn(binding.authorIdentifier, 'binding.authorIdentifier');
    requireReference(binding.ownerIdentifier, 'binding.ownerIdentifier');
    requireRoleCoding(binding.role);
    return Boolean(
      (actorDid && binding.actorDids?.includes(actorDid))
      || (dcrClientId && binding.dcrClientIds?.includes(dcrClientId))
      || (keyId && binding.keyIds?.includes(keyId))
      || binding.verifiedContactIdentifiers?.some((identifier) => evidenceContacts.has(identifier)),
    );
  });
  if (matches.length > 1) {
    throw new Error('Authenticated channel resolves more than one clinical creator binding.');
  }
  return matches[0];
}

function requireUuidUrn(value: string, label: string): string {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized.startsWith('urn:uuid:') || !normalizeUuid(normalized)) {
    throw new TypeError(`${label} must be a canonical urn:uuid identifier.`);
  }
  return normalized;
}

function uuidValue(identifier: string): string {
  return identifier.slice('urn:uuid:'.length);
}

function requireReference(value: string, label: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) throw new TypeError(`${label} is required.`);
  return normalized;
}

function requireRoleCoding(roleClaim: string): Readonly<{ system: string; code: string; display?: string }> {
  const descriptor = getHealthcareRoleByClaim(String(roleClaim || '').trim());
  if (!descriptor) throw new TypeError('role must be a canonical governed healthcare role.');
  return {
    system: descriptor.codingSystem,
    code: descriptor.code,
    ...(descriptor.titleEn ? { display: descriptor.titleEn } : {}),
  };
}
