/**
 * Compatibility contract for the older individual helper. New Subject
 * collection writes use `subject-identity.ts`: `sameAs` points to the unified
 * card and the lookup hash is derived from the identity claims themselves.
 */
import {
  HL7_V2_0203_IDENTIFIER_CODES,
  IdKind,
} from '../src/constants/identity-identifiers';
import {
  buildIndividualIdentifierCid,
  buildIndividualIdentifierLedgerAssetId,
  buildIndividualIdentifierToken,
  normalizeIndividualIdentifierType,
} from '../src/utils/individual-identifier';

const SPAIN = 'ES';
const US_CALIFORNIA = 'US-CA';
const NATIONAL_NUMBER = '12345678Z';
const DRIVER_LICENSE = 'D1234567';

describe('individual identifier aliases', () => {
  it('keeps national type and jurisdiction separate', () => {
    expect(buildIndividualIdentifierToken({
      type: HL7_V2_0203_IDENTIFIER_CODES.NationalNumber,
      jurisdiction: SPAIN,
      value: ` ${NATIONAL_NUMBER.toLowerCase()} `,
    })).toBe(`${IdKind.PersonalNationalNumber}|${SPAIN}|${NATIONAL_NUMBER}`);
  });

  it('supports an ISO 3166-2 jurisdiction without changing the DL type', () => {
    expect(buildIndividualIdentifierToken({
      type: IdKind.PersonalDriverLicense,
      jurisdiction: US_CALIFORNIA.toLowerCase(),
      value: DRIVER_LICENSE,
    })).toBe(`${IdKind.PersonalDriverLicense}|${US_CALIFORNIA}|${DRIVER_LICENSE}`);
  });

  it('maps the short code and canonical reverse-DNS type to the same CID', () => {
    const shortCodeCid = buildIndividualIdentifierCid({
      type: HL7_V2_0203_IDENTIFIER_CODES.PassportNumber,
      jurisdiction: SPAIN,
      value: NATIONAL_NUMBER,
    });
    const canonicalCid = buildIndividualIdentifierCid({
      type: IdKind.PersonalPassportNumber,
      jurisdiction: SPAIN,
      value: NATIONAL_NUMBER,
    });

    expect(shortCodeCid).toBe(canonicalCid);
    expect(shortCodeCid.startsWith('z')).toBe(true);
  });

  it('builds the opaque SHA3-384 multihash URN used by the global ledger', () => {
    const assetId = buildIndividualIdentifierLedgerAssetId({
      type: HL7_V2_0203_IDENTIFIER_CODES.NationalNumber,
      jurisdiction: SPAIN,
      value: NATIONAL_NUMBER,
    });
    expect(assetId.startsWith('urn:multibase:z')).toBe(true);
    expect(assetId).not.toContain(NATIONAL_NUMBER);
  });

  it('rejects unknown types and invalid jurisdictions', () => {
    expect(() => normalizeIndividualIdentifierType('OTHER')).toThrow('Unsupported individual identifier type');
    expect(() => buildIndividualIdentifierToken({
      type: HL7_V2_0203_IDENTIFIER_CODES.NationalNumber,
      jurisdiction: 'ESP',
      value: NATIONAL_NUMBER,
    })).toThrow('Invalid ISO 3166 jurisdiction');
  });
});
