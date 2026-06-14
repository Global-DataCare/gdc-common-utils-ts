import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../constants/schemaorg';
import {
  EXAMPLE_INDIVIDUAL_MULTIBASE_ID,
  EXAMPLE_JURISDICTION,
  EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_TENANT_SERVICE_DID,
} from '../examples/shared';

/**
 * Stable phone fixture reused by family-registration tests across repositories.
 *
 * Keep this value centralized so tests do not drift into copy/pasted literals.
 */
export const EXAMPLE_FAMILY_REGISTRATION_OWNER_TELEPHONE = '+34600000001' as const;

/**
 * Stable controller identifier fixture reused by family-registration tests.
 */
export const EXAMPLE_FAMILY_REGISTRATION_OWNER_IDENTIFIER = 'IDCES-TEST-CONTROLLER' as const;

/**
 * Stable individual identifier fixture reused by family-registration tests.
 *
 * This is the canonical individual identity and therefore maps to
 * `identifier.value`. The DID form is derived separately and may be stored in
 * `identifier` only when a concrete DID reference is needed.
 */
export const EXAMPLE_FAMILY_REGISTRATION_PERSON_IDENTIFIER = EXAMPLE_INDIVIDUAL_MULTIBASE_ID;

/**
 * Builds the minimum normalized claim set expected by family-registration flows.
 *
 * The result intentionally mirrors the canonical claim shape consumed by
 * `FamilyManager` and by individual onboarding helpers:
 * - organization owner identity/contact
 * - subject identity/contact with canonical `identifier.value`
 * - provider service identity
 *
 * Downstream tests can override only the specific claims they need without
 * reintroducing ad-hoc inline fixtures.
 */
export function buildExampleFamilyRegistrationClaims(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    [ClaimsServiceSchemaorg.category]: 'health-care',
    [ClaimsOrganizationSchemaorg.addressCountry]: EXAMPLE_JURISDICTION,
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_SUBJECT_DID,
    [ClaimsOrganizationSchemaorg.identifierType]: 'UUID',
    [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_FAMILY_REGISTRATION_PERSON_IDENTIFIER,
    [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
    [ClaimsOrganizationSchemaorg.ownerTelephone]: EXAMPLE_FAMILY_REGISTRATION_OWNER_TELEPHONE,
    [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: EXAMPLE_FAMILY_REGISTRATION_OWNER_IDENTIFIER,
    [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
    [ClaimsPersonSchemaorg.email]: EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
    [ClaimsPersonSchemaorg.identifier]: EXAMPLE_SUBJECT_DID,
    [ClaimsPersonSchemaorg.identifierType]: 'UUID',
    [ClaimsPersonSchemaorg.identifierValue]: EXAMPLE_FAMILY_REGISTRATION_PERSON_IDENTIFIER,
    [ClaimsPersonSchemaorg.telephone]: EXAMPLE_FAMILY_REGISTRATION_OWNER_TELEPHONE,
    [ClaimsPersonSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
    [ClaimsServiceSchemaorg.identifier]: EXAMPLE_TENANT_SERVICE_DID,
    [ClaimsServiceSchemaorg.serviceType]: 'health-provider',
    [ClaimsServiceSchemaorg.termsOfService]: 'https://example.com/terms',
    ...overrides,
  };
}

/**
 * Builds a canonical family-registration content snapshot for repository and
 * manager tests.
 *
 * The `status` field is left as a plain string on purpose so each backend can
 * pass its own enum value without pulling framework-specific dependencies into
 * `gdc-common-utils-ts`.
 */
export function buildExampleFamilyRegistrationContent(input: {
  status: string;
  claims?: Record<string, unknown>;
  contained?: Array<Record<string, unknown>>;
}): {
  status: string;
  claims: Record<string, unknown>;
  contained: Array<Record<string, unknown>>;
} {
  return {
    status: input.status,
    claims: buildExampleFamilyRegistrationClaims(input.claims),
    contained: input.contained || [],
  };
}
