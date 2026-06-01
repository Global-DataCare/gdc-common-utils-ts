import { describe, expect, it } from '@jest/globals';
import {
  addActors,
  addPurposes,
  addRoles,
  addSections,
  getActors,
  getClaimValues,
  getPurposes,
  getRoles,
  getSections,
  setActors,
  setClaimValues,
  setPurposes,
  setRoles,
  setSections,
} from '../src/utils/consent-claim-helpers.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../src/constants/healthcare.js';

describe('consent claim collection helpers', () => {
  it('set/get/add generic claim values keeps csv values normalized and unique', () => {
    const base = {
      [ClaimConsent.action]: `${HealthcareBasicSections.PatientSummaryDocument.claim},${HealthcareBasicSections.Results.claim}`,
    } as Record<string, unknown>;

    const set = setClaimValues(base, ClaimConsent.action, [
      HealthcareBasicSections.Results.claim,
      HealthcareBasicSections.ProblemList.claim,
      HealthcareBasicSections.Results.claim,
    ]);

    expect(getClaimValues(set, ClaimConsent.action)).toEqual([
      HealthcareBasicSections.Results.claim,
      HealthcareBasicSections.ProblemList.claim,
    ]);

    const added = addSections(set, [HealthcareBasicSections.PatientSummaryDocument.claim]);
    expect(getSections(added)).toEqual([
      HealthcareBasicSections.Results.claim,
      HealthcareBasicSections.ProblemList.claim,
      HealthcareBasicSections.PatientSummaryDocument.claim,
    ]);
  });

  it('actors/roles/purposes helpers operate over canonical consent claim keys', () => {
    let claims: Record<string, unknown> = {};

    claims = setActors(claims, ['did:web:hospital.example.org']);
    claims = addActors(claims, ['doctor@example.org']);

    claims = setRoles(claims, [HealthcareActorRoles.Physician]);
    claims = addRoles(claims, [HealthcareActorRoles.NursingProfessional]);

    claims = setPurposes(claims, [HealthcareConsentPurposes.Treatment]);
    claims = addPurposes(claims, [HealthcareConsentPurposes.CareManagement]);

    claims = setSections(claims, [HealthcareBasicSections.PatientSummaryDocument.claim]);
    claims = addSections(claims, [HealthcareBasicSections.HistoryOfMedicationUse.claim]);

    expect(getActors(claims)).toEqual(['did:web:hospital.example.org', 'doctor@example.org']);
    expect(getRoles(claims)).toEqual([
      HealthcareActorRoles.Physician,
      HealthcareActorRoles.NursingProfessional,
    ]);
    expect(getPurposes(claims)).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.CareManagement,
    ]);
    expect(getSections(claims)).toEqual([
      HealthcareBasicSections.PatientSummaryDocument.claim,
      HealthcareBasicSections.HistoryOfMedicationUse.claim,
    ]);
  });
});
