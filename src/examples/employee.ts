import { ClaimsPersonSchemaorg } from '../constants/schemaorg';

/**
 * Canonical employee directory fixture shared by docs and tests.
 *
 * Semantics:
 * - `identifier` points to one technical employee profile
 * - `email` can map to multiple active roles
 * - a purged profile remains historically addressable by `identifier`
 */
export type ExampleEmployeeRecord = Readonly<{
  identifier: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'purged';
}>;

export const ExampleEmployeeEmails = Object.freeze({
  SharedProfessional: 'shared.professional@example.org',
} as const);

export const ExampleEmployeeRoles = Object.freeze({
  Controller: 'ISCO-08|1120',
  Doctor: 'ISCO-08|2211',
} as const);

export const EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE: ExampleEmployeeRecord = Object.freeze({
  identifier: 'urn:uuid:employee-controller-active-001',
  email: ExampleEmployeeEmails.SharedProfessional,
  role: ExampleEmployeeRoles.Controller,
  status: 'active',
});

export const EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE: ExampleEmployeeRecord = Object.freeze({
  identifier: 'urn:uuid:employee-doctor-active-001',
  email: ExampleEmployeeEmails.SharedProfessional,
  role: ExampleEmployeeRoles.Doctor,
  status: 'active',
});

export const EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL: ExampleEmployeeRecord = Object.freeze({
  identifier: 'urn:uuid:employee-doctor-purged-000',
  email: ExampleEmployeeEmails.SharedProfessional,
  role: ExampleEmployeeRoles.Doctor,
  status: 'purged',
});

export const EXAMPLE_EMPLOYEE_DIRECTORY_RECORDS = Object.freeze([
  EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE,
  EXAMPLE_EMPLOYEE_DOCTOR_PURGED_HISTORICAL,
] as const);

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
    id: record.identifier,
    meta: {
      status: record.status,
      claims: buildExampleEmployeeClaims(record),
    },
  })),
} as const);
