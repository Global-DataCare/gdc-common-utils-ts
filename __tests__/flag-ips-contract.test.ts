// Flow contract: author the IPS Alerts Composition section -> persist Flag search claims and standard extensions separately -> retain their canonical FHIR origins for projection and card display.

import {
  FlagClaim,
  FlagClaimSpecs,
  FlagStandardExtensionClaimSpecs,
  HealthcareSummarySections,
} from '../src';

describe('IPS Alerts and Flag claims', () => {
  it('keeps the Alerts section code separate from the Flag resource code', () => {
    expect(HealthcareSummarySections.Alert.code).toBe('104605-1');
    expect(FlagClaim.Code).toBe('Flag.code');
  });

  it('defines flag-detail and flag-priority as FHIR standard extensions', () => {
    expect(FlagStandardExtensionClaimSpecs).toEqual([
      expect.objectContaining({
        key: 'Flag.flag-detail',
        origin: 'fhir-standard-extension',
        canonicalUrl: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
        fhirType: 'Reference',
      }),
      expect.objectContaining({
        key: 'Flag.flag-priority',
        origin: 'fhir-standard-extension',
        canonicalUrl: 'http://hl7.org/fhir/StructureDefinition/flag-priority',
        fhirType: 'CodeableConcept',
      }),
    ]);
    expect(FlagClaimSpecs.map(({ key }) => key)).toEqual(
      expect.arrayContaining(['Flag.flag-detail', 'Flag.flag-priority']),
    );
  });
});
