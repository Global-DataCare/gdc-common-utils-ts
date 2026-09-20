// Flow contract: import ChargeItem data into a shared twin -> retain its canonical subject, occurrence and supporting-information search claims -> expose the same typed keys to generic twin cards and Python consumers.

import {
  ChargeItemClaim,
  ChargeItemClaimSpecs,
  ChargeItemSearchParamNames,
  contextualizeChargeItemClaims,
} from '../src';

describe('shared ChargeItem claims', () => {
  it('defines the canonical claims required by imported twin cards', () => {
    expect(ChargeItemClaim).toEqual(
      expect.objectContaining({
        Subject: 'ChargeItem.subject',
        Occurrence: 'ChargeItem.occurrence',
        SupportingInformation: 'ChargeItem.supporting-information',
      }),
    );
    expect(ChargeItemSearchParamNames).toEqual(
      expect.objectContaining({
        Subject: 'subject',
        Occurrence: 'occurrence',
        SupportingInformation: 'supporting-information',
      }),
    );
    expect(ChargeItemClaimSpecs.map(({ key }) => key)).toEqual(
      expect.arrayContaining([
        'ChargeItem.subject',
        'ChargeItem.occurrence',
        'ChargeItem.supporting-information',
      ]),
    );
  });

  it('contextualizes the shared canonical claims without a Python-only patch', () => {
    expect(
      contextualizeChargeItemClaims({
        'ChargeItem.subject': 'Patient/patient-1',
        'ChargeItem.occurrence': '2026-09-19',
        'ChargeItem.supporting-information': 'Invoice/invoice-1',
      }),
    ).toEqual({
      'org.hl7.fhir.api.ChargeItem.subject': 'Patient/patient-1',
      'org.hl7.fhir.api.ChargeItem.occurrence': '2026-09-19',
      'org.hl7.fhir.api.ChargeItem.supporting-information': 'Invoice/invoice-1',
    });
  });
});
