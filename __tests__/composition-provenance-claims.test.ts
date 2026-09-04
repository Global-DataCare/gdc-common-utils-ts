// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import fs from 'node:fs';
import path from 'node:path';
import {
  CompositionClaim,
  compositionFhirR4ToFlat,
  compositionFlatToFhirR4,
} from '../src';

describe('Composition provenance claims', () => {
  const bundle = JSON.parse(fs.readFileSync(
    path.resolve(process.cwd(), 'fixtures/fhir-ips-bundle-all-sections.json'),
    'utf8',
  ));
  const composition = bundle.entry.find(
    (entry: any) => entry.resource?.resourceType === 'Composition',
  ).resource;

  it('preserves author organization, custodian, and aligned attester fields from the shared IPS', () => {
    const claims = compositionFhirR4ToFlat(composition);

    expect(claims[CompositionClaim.Author]).toBe(
      composition.author.map((author: any) => author.reference).join(','),
    );
    expect(claims[CompositionClaim.Custodian]).toBe(composition.custodian.reference);
    expect(claims[CompositionClaim.Attester]).toBe(
      composition.attester.map((attester: any) => attester.party.reference).join(','),
    );
    expect(claims[CompositionClaim.AttesterMode]).toBe(
      composition.attester.map((attester: any) => attester.mode).join(','),
    );
    expect(claims[CompositionClaim.AttesterTime]).toBe(
      composition.attester.map((attester: any) => attester.time).join(','),
    );

    expect(compositionFlatToFhirR4(claims)).toMatchObject({
      author: composition.author,
      custodian: composition.custodian,
      attester: composition.attester,
    });
  });

  it('does not invent optional custodian or attester data for legacy flat claims', () => {
    const fhir = compositionFlatToFhirR4({
      [CompositionClaim.Author]: composition.author[0].reference,
    });

    expect(fhir.custodian).toBeUndefined();
    expect(fhir.attester).toBeUndefined();
  });

  it('rejects attester parties without the required aligned R4 attestation mode', () => {
    expect(() => compositionFlatToFhirR4({
      [CompositionClaim.Attester]: composition.attester[0].party.reference,
    })).toThrow(`Missing required claim: ${CompositionClaim.AttesterMode}`);
  });

  it('keeps optional party and time positions aligned across multiple attesters', () => {
    const firstAttester = composition.attester[0];
    const resource = {
      ...composition,
      attester: [firstAttester, { mode: firstAttester.mode }],
    };

    const claims = compositionFhirR4ToFlat(resource);
    expect(claims[CompositionClaim.Attester]).toBe(`${firstAttester.party.reference},`);
    expect(claims[CompositionClaim.AttesterMode]).toBe(`${firstAttester.mode},${firstAttester.mode}`);
    expect(claims[CompositionClaim.AttesterTime]).toBe(`${firstAttester.time},`);
    expect(compositionFlatToFhirR4(claims).attester).toEqual(resource.attester);
  });
});
