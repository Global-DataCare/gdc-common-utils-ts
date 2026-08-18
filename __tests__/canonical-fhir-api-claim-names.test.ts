import * as fhirClaims from '../src/models/interoperable-claims/index.js';
import { ClaimConsent } from '../src/models/consent-rule.js';

const claimRegistryExports = Object.entries(fhirClaims)
  .filter(([name, value]) =>
    /(?:Claim|ClaimsFhirApi|ClaimsFhirApiExtended)$/.test(name)
    && value !== null
    && typeof value === 'object')
  .map(([name, value]) => [name, value as Record<string, unknown>] as const);

describe('canonical FHIR API claim names', () => {
  it('uses only version-independent resource plus kebab-case concrete parameters', () => {
    const registries = [
      ...claimRegistryExports,
      ['ClaimConsent', ClaimConsent as unknown as Record<string, unknown>] as const,
    ];

    for (const [registryName, registry] of registries) {
      for (const value of Object.values(registry)) {
        if (typeof value !== 'string' || !value.includes('.')) continue;
        const shortClaim = value.replace(/^org\.hl7\.fhir\.api\./, '');
        expect(value).not.toMatch(/^org\.hl7\.fhir\.(?:r4|r5)\./);
        expect(shortClaim).toMatch(/^[A-Z][A-Za-z0-9]+\.[a-z][a-z0-9-]*$/);
        expect(shortClaim.split('.')).toHaveLength(2);
        expect(shortClaim.split('.')[1]).not.toMatch(/[A-Z_]/);
      }
      expect(Object.keys(registry).length).toBeGreaterThan(0);
      expect(registryName).toBeTruthy();
    }
  });
});
