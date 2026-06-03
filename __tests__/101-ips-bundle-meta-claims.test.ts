import {
  createFhirMetaTagsFromClaims,
  DEFAULT_META_CLAIM_TAG_SYSTEM,
  extractResourceMetaClaimsFromBundle,
  toVersionAgnosticMetaClaimKey,
  withDerivedFhirMetaTagsFromClaims,
} from '../src/utils/ips-bundle-claims';
import { buildIpsClinicalHistoryBundleExample } from '../src/examples/ips-bundle';

describe('101 IPS bundle meta.claims extraction', () => {
  it('extracts all resource.meta.claims blocks from an IPS bundle and derives version-agnostic FHIR tags', () => {
    // Step 1.
    // Build one IPS-like bundle with multiple clinical resources authored in meta.claims.
    const { bundleInMemory } = buildIpsClinicalHistoryBundleExample();

    // Step 2.
    // Extract every resource claims block from the bundle.
    const extracted = extractResourceMetaClaimsFromBundle(bundleInMemory);

    expect(extracted.length).toBeGreaterThanOrEqual(3);
    expect(extracted.map((item) => item.resourceType)).toEqual(
      expect.arrayContaining(['AllergyIntolerance', 'Condition', 'MedicationStatement']),
    );

    // Step 3.
    // Pick one resource claims record and derive FHIR meta.tag[] from its claims.
    const medication = extracted.find((item) => item.resourceType === 'MedicationStatement');
    expect(medication).toBeDefined();

    const tags = createFhirMetaTagsFromClaims(medication!.claims);
    expect(tags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          system: DEFAULT_META_CLAIM_TAG_SYSTEM,
          code: 'MedicationStatement.identifier',
        }),
        expect.objectContaining({
          system: DEFAULT_META_CLAIM_TAG_SYSTEM,
          code: 'MedicationStatement.medication-text',
        }),
        expect.objectContaining({
          system: DEFAULT_META_CLAIM_TAG_SYSTEM,
          code: 'MedicationStatement.effective',
        }),
      ]),
    );

    // Step 4.
    // The tag code is version-agnostic, so org.hl7.fhir.api/r4 prefixes are removed.
    expect(toVersionAgnosticMetaClaimKey('org.hl7.fhir.api.Immunization.vaccine-code')).toBe(
      'Immunization.vaccine-code',
    );
    expect(toVersionAgnosticMetaClaimKey('org.hl7.fhir.r4.Condition.code')).toBe('Condition.code');

    // Step 5.
    // The same tag derivation can be written back into resource.meta.tag for UI use.
    const medicationEntry = bundleInMemory.data?.find(
      (entry) => entry.resource?.resourceType === 'MedicationStatement',
    );
    const resourceWithTags = withDerivedFhirMetaTagsFromClaims(medicationEntry!.resource!);

    expect(resourceWithTags.meta?.tag).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          system: DEFAULT_META_CLAIM_TAG_SYSTEM,
          code: 'MedicationStatement.subject',
        }),
      ]),
    );
  });
});
