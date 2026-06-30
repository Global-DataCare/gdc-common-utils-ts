import { ClaimsPersonSchemaorg } from '../constants/schemaorg';

/**
 * Canonical employee directory fixture shared by docs and tests.
 *
 * Semantics:
 * - `resourceId` is the current internal GW profile id
 * - `resourceId` is a transport/runtime locator and should remain one
 *   `urn:uuid:*` technical anchor
 * - `identifier` is the exportable/interoperable employee identity and may be
 *   public, DID-based, or another stable external identifier
 * - `email` can map to multiple active roles
 * - a purged profile remains historically addressable by `identifier`
 */
export type ExampleEmployeeRecord = Readonly<{
  resourceId: string;
  identifier: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'purged';
}>;

export const ExampleEmployeeEmails = Object.freeze({
  SharedProfessional: 'shared.professional@example.org',
} as const);

export const ExampleEmployeeTelephones = Object.freeze({
  SharedProfessional: '+34 600 111 222',
} as const);

export const ExampleEmployeeCredentialMaterials = Object.freeze({
  SharedProfessionalSigningKid: 'did:key:z6Mkt2p7vKov6R6By7QjFv2F5x8f4H9g2m3c4n5p6q7r8s9t#z6Mkt2p7vKov6R6By7QjFv2F5x8f4H9g2m3c4n5p6q7r8s9t',
} as const);

export const ExampleEmployeeRoles = Object.freeze({
  Controller: 'ISCO-08|1120',
  Doctor: 'ISCO-08|2211',
} as const);

export const EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE: ExampleEmployeeRecord = Object.freeze({
  resourceId: 'urn:uuid:11111111-1111-4111-8111-111111111111',
  identifier: 'did:web:api.example.org:employee:shared.professional@example.org:ISCO-08|1120',
  email: ExampleEmployeeEmails.SharedProfessional,
  role: ExampleEmployeeRoles.Controller,
  status: 'active',
});

export const EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE: ExampleEmployeeRecord = Object.freeze({
  resourceId: 'urn:uuid:22222222-2222-4222-8222-222222222222',
  identifier: 'did:web:api.example.org:employee:shared.professional@example.org:ISCO-08|2211',
  email: ExampleEmployeeEmails.SharedProfessional,
  role: ExampleEmployeeRoles.Doctor,
  status: 'active',
});

export const EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL: ExampleEmployeeRecord = Object.freeze({
  resourceId: 'urn:uuid:33333333-3333-4333-8333-333333333333',
  identifier: 'did:web:api.example.org:employee:shared.professional@example.org:ISCO-08|2211:historical:000',
  email: ExampleEmployeeEmails.SharedProfessional,
  role: ExampleEmployeeRoles.Doctor,
  status: 'purged',
});

export const EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS = Object.freeze([
  EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL,
] as const);

/**
 * Canonical professional identity fixture reused by SMART/OpenID4VP tests and
 * SDK facade helpers.
 *
 * The public continuity alias is intentionally the employee email; phone is
 * kept separate so callers can hash/project it into
 * `org.schema.Person.telephone` without overloading `sameAs`.
 */
export const EXAMPLE_PROFESSIONAL_IDENTITY = Object.freeze({
  actorDid: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
  role: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role,
  email: EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email,
  telephone: ExampleEmployeeTelephones.SharedProfessional,
  credentialMaterial: ExampleEmployeeCredentialMaterials.SharedProfessionalSigningKid,
} as const);

export function buildExampleEmployeeClaims(
  record: ExampleEmployeeRecord,
): Readonly<Record<string, string>> {
  return Object.freeze({
    '@context': 'org.schema',
    [ClaimsPersonSchemaorg.identifier]: record.identifier,
    [ClaimsPersonSchemaorg.email]: record.email,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: record.role,
  });
}

/**
 * Canonical employee search/list response body reused by runtime and doc tests.
 *
 * This keeps one stable GW-style envelope for high-level tutorials that want
 * to show employee directory flows without reauthoring `meta.claims` by hand.
 */
export const EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY = Object.freeze({
  data: EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS.map((record) => ({
    id: record.resourceId,
    meta: {
      status: record.status,
      claims: buildExampleEmployeeClaims(record),
    },
  })),
} as const);
