import { describe, expect, it } from '@jest/globals';

import { ClaimsOrganizationSchemaorg } from '../src/constants/schemaorg';
import { EXAMPLE_ACTIVATE_ORGANIZATION_FROM_ICA_PROOF_INPUT } from '../src/examples/organization-controller';
import {
  LEGAL_ORGANIZATION_ONBOARDING_JSON_SCHEMA,
  validateLegalOrganizationOnboardingClaims,
} from '../src/utils/legal-organization-onboarding';

describe('legal organization onboarding utils', () => {
  it('derives identifier.value from taxID and alternateName from identifier.value when needed', () => {
    const claims = {
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.taxId]: 'VATES-B00112233',
    };

    const result = validateLegalOrganizationOnboardingClaims(claims);

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.missingClaims).toEqual([]);
    expect(result.normalizedClaims[ClaimsOrganizationSchemaorg.identifierValue]).toBe('VATES-B00112233');
    expect(result.normalizedClaims[ClaimsOrganizationSchemaorg.alternateName]).toBe('VATES-B00112233');
    expect(result.derived).toEqual({
      identifierValueFromTaxId: true,
      alternateNameFromIdentifierValue: true,
    });
  });

  it('reports a missing identifier requirement when neither identifier.value nor taxID is present', () => {
    const result = validateLegalOrganizationOnboardingClaims({
      '@context': 'org.schema',
    });

    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toEqual([
      'MISSING_IDENTIFIER_OR_TAX_ID',
    ]);
    expect(result.missingClaims).toEqual([
      ClaimsOrganizationSchemaorg.identifierValue,
      ClaimsOrganizationSchemaorg.taxId,
    ]);
  });

  it('rejects explicit alternateName values that diverge from identifier.value by default', () => {
    const result = validateLegalOrganizationOnboardingClaims({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.identifierValue]: 'VATES-B00112233',
      [ClaimsOrganizationSchemaorg.alternateName]: 'acme',
    });

    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toEqual([
      'EXPLICIT_ALTERNATE_NAME_NOT_ALLOWED',
    ]);
  });

  it('accepts explicit alternateName divergence when the caller enables it', () => {
    const result = validateLegalOrganizationOnboardingClaims({
      '@context': 'org.schema',
      [ClaimsOrganizationSchemaorg.identifierValue]: 'VATES-B00112233',
      [ClaimsOrganizationSchemaorg.alternateName]: 'acme',
    }, {
      allowExplicitAlternateNameForTenantId: true,
    });

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.normalizedClaims[ClaimsOrganizationSchemaorg.alternateName]).toBe('acme');
  });

  it('keeps canonical shared examples valid', () => {
    const result = validateLegalOrganizationOnboardingClaims(
      EXAMPLE_ACTIVATE_ORGANIZATION_FROM_ICA_PROOF_INPUT.additionalClaims,
    );

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.normalizedClaims[ClaimsOrganizationSchemaorg.alternateName]).toBe(
      String(EXAMPLE_ACTIVATE_ORGANIZATION_FROM_ICA_PROOF_INPUT.additionalClaims[ClaimsOrganizationSchemaorg.identifierValue]),
    );
  });

  it('exposes a form-friendly schema with a oneOf identifier requirement', () => {
    expect(LEGAL_ORGANIZATION_ONBOARDING_JSON_SCHEMA.type).toBe('object');
    expect(LEGAL_ORGANIZATION_ONBOARDING_JSON_SCHEMA.oneOf).toEqual([
      { required: [ClaimsOrganizationSchemaorg.identifierValue] },
      { required: [ClaimsOrganizationSchemaorg.taxId] },
    ]);
  });
});
