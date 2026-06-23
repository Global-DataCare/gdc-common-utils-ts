import { ClaimsOrganizationSchemaorg } from '../constants/schemaorg';
import { ClaimsRecord } from '../models/resource-document';

export type LegalOrganizationOnboardingErrorCode =
  | 'MISSING_IDENTIFIER_OR_TAX_ID'
  | 'EXPLICIT_ALTERNATE_NAME_NOT_ALLOWED';

export type LegalOrganizationOnboardingValidationError = {
  code: LegalOrganizationOnboardingErrorCode;
  message: string;
  claimPaths: string[];
};

export type ValidateLegalOrganizationOnboardingClaimsOptions = {
  /**
   * When `false` (default), `alternateName` is treated as a compatibility alias
   * derived from the canonical legal identifier. Callers may still send an
   * explicit value, but it must match the final normalized
   * `Organization.identifier.value`.
   *
   * When `true`, callers may keep an explicit `alternateName` that differs from
   * `Organization.identifier.value`.
   */
  allowExplicitAlternateNameForTenantId?: boolean;
};

export type ValidateLegalOrganizationOnboardingClaimsResult = {
  ok: boolean;
  errors: LegalOrganizationOnboardingValidationError[];
  missingClaims: string[];
  normalizedClaims: ClaimsRecord;
  derived: {
    identifierValueFromTaxId: boolean;
    alternateNameFromIdentifierValue: boolean;
  };
};

/**
 * JSON Schema for legal-organization onboarding claims used by high-level SDK
 * forms and assistants before they submit anything to GW CORE.
 *
 * Contract:
 * - one of `Organization.identifier.value` or `Organization.taxID` must be
 *   provided
 * - `alternateName` is optional at input time because current GW compatibility
 *   may derive it from the canonical legal identifier
 * - callers that want stricter tenant-alias behavior must still run the
 *   validator below because JSON Schema alone cannot express the
 *   runtime option `allowExplicitAlternateNameForTenantId`
 */
export const LEGAL_ORGANIZATION_ONBOARDING_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://gdc/common-utils/legal-organization-onboarding.schema.json',
  title: 'Legal Organization Onboarding Claims',
  type: 'object',
  properties: {
    '@context': {
      type: 'string',
      enum: ['org.schema'],
    },
    [ClaimsOrganizationSchemaorg.identifierValue]: {
      type: 'string',
      minLength: 1,
      description: 'Canonical legal identifier used by onboarding and tenant normalization.',
    },
    [ClaimsOrganizationSchemaorg.taxId]: {
      type: 'string',
      minLength: 1,
      description: 'Compatibility tax identifier that may backfill Organization.identifier.value.',
    },
    [ClaimsOrganizationSchemaorg.alternateName]: {
      type: 'string',
      minLength: 1,
      description: 'Optional compatibility alias. If omitted, callers may derive it from Organization.identifier.value.',
    },
  },
  oneOf: [
    { required: [ClaimsOrganizationSchemaorg.identifierValue] },
    { required: [ClaimsOrganizationSchemaorg.taxId] },
  ],
  additionalProperties: true,
} as const;

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

/**
 * Validates and normalizes legal-organization onboarding claims for SDKs,
 * forms, and assistant-style data collection flows.
 *
 * Main behavior:
 * - requires at least one of `Organization.identifier.value` or
 *   `Organization.taxID`
 * - if `identifier.value` is missing and `taxID` exists, copies
 *   `taxID -> identifier.value`
 * - if `alternateName` is missing and a canonical identifier exists, copies
 *   `identifier.value -> alternateName`
 * - when `allowExplicitAlternateNameForTenantId` is `false` (default),
 *   rejects explicit `alternateName` values that differ from the final
 *   canonical `identifier.value`
 *
 * The result shape is intentionally assistant-friendly:
 * - `missingClaims` tells UI/application flows what is still required
 * - `normalizedClaims` shows the post-derivation claim set
 * - `derived` explains which values were filled automatically
 */
export function validateLegalOrganizationOnboardingClaims(
  claims: ClaimsRecord,
  options: ValidateLegalOrganizationOnboardingClaimsOptions = {},
): ValidateLegalOrganizationOnboardingClaimsResult {
  const normalizedClaims: ClaimsRecord = { ...(claims || {}) };
  const errors: LegalOrganizationOnboardingValidationError[] = [];
  const missingClaims: string[] = [];

  const allowExplicitAlternateNameForTenantId = options.allowExplicitAlternateNameForTenantId === true;

  const identifierValue = normalizeOptionalString(normalizedClaims[ClaimsOrganizationSchemaorg.identifierValue]);
  const taxId = normalizeOptionalString(normalizedClaims[ClaimsOrganizationSchemaorg.taxId]);
  const explicitAlternateName = normalizeOptionalString(normalizedClaims[ClaimsOrganizationSchemaorg.alternateName]);

  let finalIdentifierValue = identifierValue;
  let identifierValueFromTaxId = false;
  let alternateNameFromIdentifierValue = false;

  if (!finalIdentifierValue && taxId) {
    finalIdentifierValue = taxId;
    normalizedClaims[ClaimsOrganizationSchemaorg.identifierValue] = taxId;
    identifierValueFromTaxId = true;
  }

  if (!finalIdentifierValue) {
    missingClaims.push(
      ClaimsOrganizationSchemaorg.identifierValue,
      ClaimsOrganizationSchemaorg.taxId,
    );
    errors.push({
      code: 'MISSING_IDENTIFIER_OR_TAX_ID',
      message: 'Legal organization onboarding requires Organization.identifier.value or Organization.taxID.',
      claimPaths: [
        ClaimsOrganizationSchemaorg.identifierValue,
        ClaimsOrganizationSchemaorg.taxId,
      ],
    });
  }

  if (!explicitAlternateName && finalIdentifierValue) {
    normalizedClaims[ClaimsOrganizationSchemaorg.alternateName] = finalIdentifierValue;
    alternateNameFromIdentifierValue = true;
  }

  if (
    explicitAlternateName
    && finalIdentifierValue
    && !allowExplicitAlternateNameForTenantId
    && explicitAlternateName !== finalIdentifierValue
  ) {
    errors.push({
      code: 'EXPLICIT_ALTERNATE_NAME_NOT_ALLOWED',
      message: 'Explicit Organization.alternateName is not allowed unless it matches Organization.identifier.value or the caller enables allowExplicitAlternateNameForTenantId.',
      claimPaths: [
        ClaimsOrganizationSchemaorg.alternateName,
        ClaimsOrganizationSchemaorg.identifierValue,
      ],
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    missingClaims,
    normalizedClaims,
    derived: {
      identifierValueFromTaxId,
      alternateNameFromIdentifierValue,
    },
  };
}
