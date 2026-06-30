import {
  multibase58MultihashSha3_256,
  normalizeSameAsHash,
  normalizeSameAsHashCsv,
  normalizeSameAsHashList,
  normalizeTelephoneHash,
  sameAsValuesEqual,
} from '../src/utils/same-as';
import { ExampleEmployeeTelephones } from '../src/examples/employee';

describe('SameAs Utils', () => {
  const exampleEmail = 'Jane.Doe@Example.org';
  const exampleEmailLower = 'jane.doe@example.org';
  const examplePhone = 'tel:+34600111222';
  const exampleDid = 'did:web:example.org:controller:primary';
  const exampleMultibase = multibase58MultihashSha3_256(exampleEmailLower);
  const exampleUrnMultibase = `urn:multibase:${exampleMultibase}`;

  it('hashes plain email into the ICA-compatible urn:multibase format', () => {
    expect(normalizeSameAsHash(exampleEmail)).toBe(exampleUrnMultibase);
  });

  it('preserves phone identifiers as-is', () => {
    expect(normalizeSameAsHash(examplePhone)).toBe(examplePhone);
  });

  it('preserves arbitrary identifiers as-is', () => {
    expect(normalizeSameAsHash(exampleDid)).toBe(exampleDid);
  });

  it('normalizes bare multibase strings into urn:multibase form', () => {
    expect(normalizeSameAsHash(exampleMultibase)).toBe(exampleUrnMultibase);
  });

  it('preserves canonical urn:multibase identifiers', () => {
    expect(normalizeSameAsHash(exampleUrnMultibase)).toBe(exampleUrnMultibase);
  });

  it('compares emails and their hashed representation as equal', () => {
    expect(sameAsValuesEqual(exampleEmail, exampleUrnMultibase)).toBe(true);
  });

  it('normalizes CSV and array inputs into one deduplicated sameAs array', () => {
    expect(normalizeSameAsHashList([
      exampleEmail,
      `${exampleUrnMultibase},${exampleDid}`,
      exampleMultibase,
    ])).toEqual([
      exampleUrnMultibase,
      exampleDid,
    ]);
  });

  it('joins the normalized sameAs list back into the canonical CSV storage form', () => {
    expect(normalizeSameAsHashCsv([exampleEmail, exampleDid])).toBe(
      `${exampleUrnMultibase},${exampleDid}`,
    );
  });

  it('hashes public telephone continuity separately from sameAs', () => {
    const expectedPhoneUrn = `urn:multibase:${multibase58MultihashSha3_256('+34600111222')}`;
    expect(normalizeTelephoneHash(ExampleEmployeeTelephones.SharedProfessional)).toBe(expectedPhoneUrn);
  });
});
