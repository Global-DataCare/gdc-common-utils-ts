import {
  HL7_V2_0203_IDENTIFIER_CODES,
  INDIVIDUAL_IDENTIFIER_KIND_CODES,
  INDIVIDUAL_IDENTIFIER_KINDS,
} from '../src/constants/identity-identifiers';
import {
  assertIndividualIdentifierPeriod,
  buildIndividualIdentifierToken,
} from '../src/utils/individual-identifier';

/**
 * Beginner contract:
 * 1. JHN is a jurisdictional public-health number.
 * 2. HC is a health-card number, MB a member/beneficiary number and SN a subscriber number.
 * 3. Raw values stay confidential; the canonical token is only an input to hashing.
 * 4. Coverage policy/payor details use FHIR Coverage, whose period is distinct from Identifier.period.
 */
describe('linked subject identifiers', () => {
  it('exports the three health-insurance identifier choices without conflating JHN', () => {
    expect(INDIVIDUAL_IDENTIFIER_KIND_CODES[INDIVIDUAL_IDENTIFIER_KINDS.HealthNumber]).toBe('JHN');
    expect(INDIVIDUAL_IDENTIFIER_KIND_CODES[INDIVIDUAL_IDENTIFIER_KINDS.HealthCard]).toBe('HC');
    expect(INDIVIDUAL_IDENTIFIER_KIND_CODES[INDIVIDUAL_IDENTIFIER_KINDS.InsuranceMember]).toBe('MB');
    expect(INDIVIDUAL_IDENTIFIER_KIND_CODES[INDIVIDUAL_IDENTIFIER_KINDS.InsuranceSubscriber]).toBe('SN');
    expect(HL7_V2_0203_IDENTIFIER_CODES.MemberNumber).toBe('MB');
  });

  it('normalizes an insurance member number into the existing confidential lookup contract', () => {
    expect(buildIndividualIdentifierToken({ type: 'MB', jurisdiction: 'es', value: ' member-42 ' }))
      .toBe('org.hl7.terminology.CodeSystem.v2-0203.MB|ES|MEMBER-42');
  });

  it('accepts a bounded validity period and rejects reversed dates', () => {
    expect(() => assertIndividualIdentifierPeriod('2026-01-01', '2026-12-31')).not.toThrow();
    expect(() => assertIndividualIdentifierPeriod('2027-01-01', '2026-12-31')).toThrow(/periodStart/);
  });
});
