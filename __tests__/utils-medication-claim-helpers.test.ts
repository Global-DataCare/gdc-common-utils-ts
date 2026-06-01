import { describe, expect, it } from '@jest/globals';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  addMedicationCategoryList,
  addMedicationCodeList,
  addMedicationPartOfList,
  addMedicationSourceList,
  getMedicationCategoryList,
  getMedicationCodeList,
  getMedicationPartOfList,
  getMedicationSourceList,
  setMedicationCategoryList,
  setMedicationCodeList,
  setMedicationPartOfList,
  setMedicationSourceList,
} from '../src/utils/medication-claim-helpers.js';

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
});
