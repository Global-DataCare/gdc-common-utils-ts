// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

/**
 * Canonical W3C credential contexts reused by activation/VP helpers and tests.
 *
 * Keep these values centralized so examples and unit suites do not re-hardcode
 * W3C context URLs inline.
 */
export const W3cCredentialContexts = Object.freeze({
  V1: 'https://www.w3.org/2018/credentials/v1',
  V2: 'https://www.w3.org/ns/credentials/v2',
});

/**
 * Canonical W3C credential and presentation base types.
 */
export const W3cCredentialTypes = Object.freeze({
  VerifiableCredential: 'VerifiableCredential',
  VerifiablePresentation: 'VerifiablePresentation',
});

/**
 * Canonical activation VC subtype names currently accepted by CORE helpers.
 *
 * Notes:
 * - `LegalOrganizationCredential` and `PersonCredential` remain accepted as
 *   compatibility aliases while ICA/GW contracts converge.
 * - Example/test code must import these constants instead of re-hardcoding the
 *   subtype strings inline.
 */
export const ActivationCredentialTypes = Object.freeze({
  OrganizationCredential: 'OrganizationCredential',
  LegalOrganizationCredential: 'LegalOrganizationCredential',
  LegalRepresentativeCredential: 'LegalRepresentativeCredential',
  PersonCredential: 'PersonCredential',
});

/**
 * Canonical credential subtype names used by professional/member access flows.
 */
export const ProfessionalCredentialTypes = Object.freeze({
  EmployeeCredential: 'EmployeeCredential',
});

/**
 * Canonical credential subtype names used by inter-tenant authorization
 * contracts for cross-organization access.
 */
export const ContractCredentialTypes = Object.freeze({
  InterTenantAccessContractCredential: 'InterTenantAccessContractCredential',
});

export const ORGANIZATION_ACTIVATION_VC_TYPES = Object.freeze([
  ActivationCredentialTypes.OrganizationCredential,
  ActivationCredentialTypes.LegalOrganizationCredential,
]);

export const REPRESENTATIVE_ACTIVATION_VC_TYPES = Object.freeze([
  ActivationCredentialTypes.LegalRepresentativeCredential,
  ActivationCredentialTypes.PersonCredential,
]);
