import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_SUBJECT_DID,
  buildExampleLiveMedicationCases,
  buildExampleMedicationIpsDocumentBundle,
} from '../src/examples/shared.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';

describe('buildExampleMedicationIpsDocumentBundle', () => {
  it('creates one IPS bundle with one medication in section 10160-0', () => {
    const medication = buildExampleLiveMedicationCases(123456789)[0];
    expect(medication).toBeDefined();

    const bundle = buildExampleMedicationIpsDocumentBundle({
      subjectDid: EXAMPLE_SUBJECT_DID,
      medication: medication!,
    });
    const compositionResource = bundle.entry?.[0]?.resource as any;
    const medicationResource = bundle.entry?.find((entry) => entry.resource?.resourceType === 'MedicationStatement')?.resource as any;

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('document');
    expect(compositionResource?.resourceType).toBe('Composition');
    expect(compositionResource?.type?.coding?.[0]?.code).toBe('60591-5');
    expect(compositionResource?.section?.[0]?.code?.coding?.[0]?.code).toBe('10160-0');
    expect(medicationResource).toBeDefined();
    expect(medicationResource?.meta?.claims?.[MedicationStatementClaim.Identifier]).toBe(medication!.identifier);
    expect(medicationResource?.meta?.claims?.[MedicationStatementClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
    expect(medicationResource?.meta?.claims?.[MedicationStatementClaim.CodeText]).toBe(medication!.text);
    expect(medicationResource?.meta?.claims?.[MedicationStatementClaim.Note]).toBe(medication!.note);
  });
});
