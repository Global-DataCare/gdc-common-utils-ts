// Flow contract: import ChargeItem data into a shared twin -> retain its canonical subject, occurrence and supporting-information search claims -> expose the same typed keys to generic twin cards and Python consumers.

import {
  ChargeItemClaim,
  ChargeItemClaimsFhirApiExtended,
  ChargeItemClaimSpecs,
  ChargeItemSearchParamNames,
  contextualizeChargeItemClaims,
} from '../src';

describe('shared ChargeItem claims', () => {
  it('defines the canonical claims required by imported twin cards', () => {
    const requiredClaims = [
      ChargeItemClaim.Subject,
      ChargeItemClaim.Occurrence,
      ChargeItemClaim.SupportingInformation,
    ];
    expect(ChargeItemClaimSpecs.map(({ key }) => key)).toEqual(
      expect.arrayContaining(requiredClaims),
    );
    expect(ChargeItemClaim.Subject.endsWith(ChargeItemSearchParamNames.Subject)).toBe(true);
    expect(ChargeItemClaim.Occurrence.endsWith(ChargeItemSearchParamNames.Occurrence)).toBe(true);
    expect(
      ChargeItemClaim.SupportingInformation.endsWith(
        ChargeItemSearchParamNames.SupportingInformation,
      ),
    ).toBe(true);
  });

  it('contextualizes the shared canonical claims without a Python-only patch', () => {
    const exampleFor = (key: (typeof ChargeItemClaim)[keyof typeof ChargeItemClaim]) => {
      const spec = ChargeItemClaimSpecs.find((candidate) => candidate.key === key);
      if (!spec) throw new Error(`Missing canonical ChargeItem fixture for ${key}`);
      return spec.example;
    };
    const subject = exampleFor(ChargeItemClaim.Subject);
    const occurrence = exampleFor(ChargeItemClaim.Occurrence);
    const supportingInformation = exampleFor(ChargeItemClaim.SupportingInformation);

    expect(
      contextualizeChargeItemClaims({
        [ChargeItemClaim.Subject]: subject,
        [ChargeItemClaim.Occurrence]: occurrence,
        [ChargeItemClaim.SupportingInformation]: supportingInformation,
      }),
    ).toEqual({
      [ChargeItemClaimsFhirApiExtended.Subject]: subject,
      [ChargeItemClaimsFhirApiExtended.Occurrence]: occurrence,
      [ChargeItemClaimsFhirApiExtended.SupportingInformation]: supportingInformation,
    });
  });
});
