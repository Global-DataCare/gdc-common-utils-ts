import { describe, expect, it } from '@jest/globals';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
} from '../src/examples/shared.js';
import {
  addMedicationCategoryList,
  addMedicationCodeList,
  addMedicationContainedDocumentIdentifierList,
  addMedicationPartOfList,
  addMedicationSourceList,
  getMedicationDosageAsNeeded,
  getMedicationDoseQuantityUnit,
  getMedicationDoseQuantityValue,
  getMedicationCategoryList,
  getMedicationClaimList,
  getMedicationCodeList,
  getMedicationContainedDocumentIdentifierList,
  getMedicationEffective,
  getMedicationIdentifier,
  getMedicationPartOfList,
  getMedicationSourceList,
  getMedicationStatus,
  getMedicationSubject,
  getMedicationSubjectList,
  getMedicationText,
  getMedicationTimingFrequency,
  getMedicationTimingPeriod,
  getMedicationTimingPeriodUnit,
  removeMedicationCategoryList,
  removeMedicationClaimList,
  removeMedicationCodeList,
  removeMedicationContainedDocumentIdentifierList,
  removeMedicationPartOfList,
  removeMedicationSourceList,
  removeMedicationSubjectList,
  setMedicationCategoryList,
  setMedicationClaimList,
  setMedicationCodeList,
  setMedicationContainedDocumentIdentifierList,
  setMedicationDosageAsNeeded,
  setMedicationDoseQuantityUnit,
  setMedicationDoseQuantityValue,
  setMedicationEffective,
  setMedicationIdentifier,
  setMedicationPartOfList,
  setMedicationSourceList,
  setMedicationStatus,
  setMedicationSubject,
  setMedicationSubjectList,
  setMedicationText,
  setMedicationTimingFrequency,
  setMedicationTimingPeriod,
  setMedicationTimingPeriodUnit,
} from '../src/utils/medication-claim-helpers.js';
import { MedicationStatementClaimsFhirApiExtended } from '../src/models/interoperable-claims/medication-statement-claims.js';

describe('medication claim list helpers', () => {
  it('returns arrays for preview and persists canonical csv for category/code/part-of/source', () => {
    let claims: Record<string, unknown> = {};

    claims = setMedicationCategoryList(claims, ['community', 'inpatient']);
    claims = addMedicationCategoryList(claims, ['urgent']);

    claims = setMedicationCodeList(claims, ['http://www.nlm.nih.gov/research/umls/rxnorm|313782']);
    claims = addMedicationCodeList(claims, ['http://www.nlm.nih.gov/research/umls/rxnorm|83367']);

    claims = setMedicationPartOfList(claims, ['urn:uuid:thread-1']);
    claims = addMedicationPartOfList(claims, ['urn:uuid:thread-2']);

    claims = setMedicationSourceList(claims, ['did:web:hospital.example.org']);
    claims = addMedicationSourceList(claims, ['did:web:pharmacy.example.org']);

    expect(getMedicationCategoryList(claims)).toEqual(['community', 'inpatient', 'urgent']);
    expect(getMedicationCodeList(claims)).toEqual([
      'http://www.nlm.nih.gov/research/umls/rxnorm|313782',
      'http://www.nlm.nih.gov/research/umls/rxnorm|83367',
    ]);
    expect(getMedicationPartOfList(claims)).toEqual(['urn:uuid:thread-1', 'urn:uuid:thread-2']);
    expect(getMedicationSourceList(claims)).toEqual([
      'did:web:hospital.example.org',
      'did:web:pharmacy.example.org',
    ]);

    expect(String(claims[MedicationStatementClaim.Category] || '')).toBe('community,inpatient,urgent');
    expect(String(claims[MedicationStatementClaim.Code] || '')).toBe('http://www.nlm.nih.gov/research/umls/rxnorm|313782,http://www.nlm.nih.gov/research/umls/rxnorm|83367');
    expect(String(claims[MedicationStatementClaim.PartOf] || '')).toBe('urn:uuid:thread-1,urn:uuid:thread-2');
    expect(String(claims[MedicationStatementClaim.Source] || '')).toBe('did:web:hospital.example.org,did:web:pharmacy.example.org');
  });

  it('supports removing category/code/part-of/source/subject values', () => {
    let claims: Record<string, unknown> = {};

    claims = setMedicationCategoryList(claims, ['community', 'inpatient']);
    claims = setMedicationCodeList(claims, [
      'http://www.nlm.nih.gov/research/umls/rxnorm|313782',
      'http://www.nlm.nih.gov/research/umls/rxnorm|83367',
    ]);
    claims = setMedicationPartOfList(claims, ['urn:uuid:thread-1', 'urn:uuid:thread-2']);
    claims = setMedicationSourceList(claims, ['did:web:hospital.example.org', 'did:web:pharmacy.example.org']);
    claims = setMedicationSubjectList(claims, ['did:web:patient.example.org', 'urn:uuid:patient-2']);

    claims = removeMedicationCategoryList(claims, ['inpatient']);
    claims = removeMedicationCodeList(claims, ['http://www.nlm.nih.gov/research/umls/rxnorm|83367']);
    claims = removeMedicationPartOfList(claims, ['urn:uuid:thread-2']);
    claims = removeMedicationSourceList(claims, ['did:web:pharmacy.example.org']);
    claims = removeMedicationSubjectList(claims, ['urn:uuid:patient-2']);

    expect(getMedicationCategoryList(claims)).toEqual(['community']);
    expect(getMedicationCodeList(claims)).toEqual(['http://www.nlm.nih.gov/research/umls/rxnorm|313782']);
    expect(getMedicationPartOfList(claims)).toEqual(['urn:uuid:thread-1']);
    expect(getMedicationSourceList(claims)).toEqual(['did:web:hospital.example.org']);
    expect(getMedicationSubjectList(claims)).toEqual(['did:web:patient.example.org']);
  });

  it('supports generic set/get/add/remove operations for medication claim lists', () => {
    let claims: Record<string, unknown> = {};

    claims = setMedicationClaimList(claims, MedicationStatementClaim.Subject, [
      'did:web:patient.example.org',
      'urn:uuid:patient-2',
    ]);

    expect(getMedicationClaimList(claims, MedicationStatementClaim.Subject)).toEqual([
      'did:web:patient.example.org',
      'urn:uuid:patient-2',
    ]);

    claims = removeMedicationClaimList(claims, MedicationStatementClaim.Subject, ['urn:uuid:patient-2']);
    expect(getMedicationClaimList(claims, MedicationStatementClaim.Subject)).toEqual([
      'did:web:patient.example.org',
    ]);
  });

  it('tracks linked document reference identifiers for medication statements', () => {
    let claims: Record<string, unknown> = {};

    claims = setMedicationContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    claims = addMedicationContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);
    expect(getMedicationContainedDocumentIdentifierList(claims)).toEqual([
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
    ]);

    claims = removeMedicationContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    expect(getMedicationContainedDocumentIdentifierList(claims)).toEqual([EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);
  });

  it('supports scalar get/set helpers for core medication statement fields', () => {
    let claims: Record<string, unknown> = {};

    claims = setMedicationIdentifier(claims, 'med-001');
    claims = setMedicationSubject(claims, 'did:web:patient.example.org');
    claims = setMedicationStatus(claims, 'active');
    claims = setMedicationEffective(claims, '2026-06-01');
    claims = setMedicationText(claims, 'Ibuprofen 400mg');

    expect(getMedicationIdentifier(claims)).toBe('med-001');
    expect(getMedicationSubject(claims)).toBe('did:web:patient.example.org');
    expect(getMedicationStatus(claims)).toBe('active');
    expect(getMedicationEffective(claims)).toBe('2026-06-01');
    expect(getMedicationText(claims)).toBe('Ibuprofen 400mg');

    expect(claims[MedicationStatementClaim.Identifier]).toBe('med-001');
    expect(claims[MedicationStatementClaim.Subject]).toBe('did:web:patient.example.org');
    expect(claims[MedicationStatementClaim.Status]).toBe('active');
    expect(claims[MedicationStatementClaim.Effective]).toBe('2026-06-01');
    expect(claims[MedicationStatementClaim.MedicationText]).toBe('Ibuprofen 400mg');
  });

  it('supports scalar get/set helpers for dose, timing, and PRN medication fields', () => {
    let claims: Record<string, unknown> = {};

    claims = setMedicationDoseQuantityValue(claims, 400);
    claims = setMedicationDoseQuantityUnit(claims, 'mg');
    claims = setMedicationTimingFrequency(claims, 1);
    claims = setMedicationTimingPeriod(claims, 8);
    claims = setMedicationTimingPeriodUnit(claims, 'h');
    claims = setMedicationDosageAsNeeded(claims, true);

    expect(getMedicationDoseQuantityValue(claims)).toBe(400);
    expect(getMedicationDoseQuantityUnit(claims)).toBe('mg');
    expect(getMedicationTimingFrequency(claims)).toBe(1);
    expect(getMedicationTimingPeriod(claims)).toBe(8);
    expect(getMedicationTimingPeriodUnit(claims)).toBe('h');
    expect(getMedicationDosageAsNeeded(claims)).toBe(true);

    expect(claims[MedicationStatementClaimsFhirApiExtended.DoseQuantityValue]).toBe(400);
    expect(claims[MedicationStatementClaimsFhirApiExtended.DoseQuantityUnit]).toBe('mg');
    expect(claims[MedicationStatementClaimsFhirApiExtended.TimingFrequency]).toBe(1);
    expect(claims[MedicationStatementClaimsFhirApiExtended.TimingPeriod]).toBe(8);
    expect(claims[MedicationStatementClaimsFhirApiExtended.TimingPeriodUnit]).toBe('h');
    expect(claims[MedicationStatementClaimsFhirApiExtended.DosageAsNeeded]).toBe(true);
  });
});
