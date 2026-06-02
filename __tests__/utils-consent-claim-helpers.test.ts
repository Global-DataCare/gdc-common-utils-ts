import { describe, expect, it } from '@jest/globals';
import {
  addActorIdentifierList,
  addActorRoleList,
  addCategoryList,
  addContainedDocumentIdentifierList,
  addActors,
  addPurposeList,
  addPurposes,
  addRoles,
  addSections,
  getActorIdentifierList,
  getActorRoleList,
  getCategoryList,
  getContainedDocumentIdentifierList,
  getConsentDecision,
  getConsentDate,
  getConsentIdentifier,
  getConsentPeriodEnd,
  getConsentPeriodStart,
  getConsentSubject,
  getActors,
  getClaimValues,
  getPurposes,
  getRoles,
  getSections,
  getSectionList,
  getSectors,
  getPurposeList,
  removeActorIdentifierList,
  removeActorRoleList,
  removeCategoryList,
  removeContainedDocumentIdentifierList,
  removeActors,
  removeClaimValues,
  removePurposeList,
  removePurposes,
  removeRoles,
  removeSections,
  setActorIdentifierList,
  setActorRoleList,
  setCategoryList,
  setContainedDocumentIdentifierList,
  setConsentDecision,
  setConsentDate,
  setConsentIdentifier,
  setConsentPeriodEnd,
  setConsentPeriodStart,
  setConsentSubject,
  setPurposeList,
  setActors,
  setClaimValues,
  setPurposes,
  setRoles,
  setSections,
  setSectionList,
  setSectors,
  addSectionList,
  addSectors,
  removeSectionList,
  removeSectors,
} from '../src/utils/consent-claim-helpers.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../src/constants/healthcare.js';
import {
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
} from '../src/examples/shared.js';

describe('consent claim collection helpers', () => {
  it('list aliases return arrays and persist canonical CSV values', () => {
    let claims: Record<string, unknown> = {};

    claims = setActorIdentifierList(claims, ['did:web:hospital.example.org']);
    claims = addActorIdentifierList(claims, ['doctor@example.org']);

    claims = setActorRoleList(claims, [HealthcareActorRoles.Physician]);
    claims = addActorRoleList(claims, [HealthcareActorRoles.NursingProfessional]);

    claims = setPurposeList(claims, [HealthcareConsentPurposes.Treatment]);
    claims = addPurposeList(claims, [HealthcareConsentPurposes.CareManagement]);

    claims = setCategoryList(claims, ['LOINC|64292-6']);
    claims = addCategoryList(claims, ['LOINC|57016-8']);

    expect(getActorIdentifierList(claims)).toEqual([
      'did:web:hospital.example.org',
      'doctor@example.org',
    ]);
    expect(getActorRoleList(claims)).toEqual([
      HealthcareActorRoles.Physician,
      HealthcareActorRoles.NursingProfessional,
    ]);
    expect(getPurposeList(claims)).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.CareManagement,
    ]);
    expect(getCategoryList(claims)).toEqual([
      'LOINC|64292-6',
      'LOINC|57016-8',
    ]);

    expect(String(claims[ClaimConsent.actorIdentifier] || '')).toBe('did:web:hospital.example.org,doctor@example.org');
    expect(String(claims[ClaimConsent.actorRole] || '')).toBe(`${HealthcareActorRoles.Physician},${HealthcareActorRoles.NursingProfessional}`);
    expect(String(claims[ClaimConsent.purpose] || '')).toBe(`${HealthcareConsentPurposes.Treatment},${HealthcareConsentPurposes.CareManagement}`);
    expect(String(claims[ClaimConsent.category] || '')).toBe('LOINC|64292-6,LOINC|57016-8');
  });

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

    const removed = removeSections(added, [HealthcareBasicSections.Results.claim]);
    expect(getSections(removed)).toEqual([
      HealthcareBasicSections.ProblemList.claim,
      HealthcareBasicSections.PatientSummaryDocument.claim,
    ]);

    const removedGeneric = removeClaimValues(removed, ClaimConsent.action, [
      HealthcareBasicSections.ProblemList.claim,
    ]);
    expect(getSections(removedGeneric)).toEqual([
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

    claims = removeActors(claims, ['doctor@example.org']);
    claims = removeRoles(claims, [HealthcareActorRoles.NursingProfessional]);
    claims = removePurposes(claims, [HealthcareConsentPurposes.CareManagement]);
    claims = removeSections(claims, [HealthcareBasicSections.HistoryOfMedicationUse.claim]);

    expect(getActors(claims)).toEqual(['did:web:hospital.example.org']);
    expect(getRoles(claims)).toEqual([HealthcareActorRoles.Physician]);
    expect(getPurposes(claims)).toEqual([HealthcareConsentPurposes.Treatment]);
    expect(getSections(claims)).toEqual([HealthcareBasicSections.PatientSummaryDocument.claim]);
  });

  it('list aliases also support removing CSV tokens cleanly', () => {
    let claims: Record<string, unknown> = {};

    claims = setActorIdentifierList(claims, ['did:web:hospital.example.org', 'doctor@example.org']);
    claims = setActorRoleList(claims, [HealthcareActorRoles.Physician, HealthcareActorRoles.NursingProfessional]);
    claims = setPurposeList(claims, [HealthcareConsentPurposes.Treatment, HealthcareConsentPurposes.CareManagement]);
    claims = setCategoryList(claims, ['LOINC|64292-6', 'LOINC|57016-8']);

    claims = removeActorIdentifierList(claims, ['doctor@example.org']);
    claims = removeActorRoleList(claims, [HealthcareActorRoles.NursingProfessional]);
    claims = removePurposeList(claims, [HealthcareConsentPurposes.CareManagement]);
    claims = removeCategoryList(claims, ['LOINC|57016-8']);

    expect(getActorIdentifierList(claims)).toEqual(['did:web:hospital.example.org']);
    expect(getActorRoleList(claims)).toEqual([HealthcareActorRoles.Physician]);
    expect(getPurposeList(claims)).toEqual([HealthcareConsentPurposes.Treatment]);
    expect(getCategoryList(claims)).toEqual(['LOINC|64292-6']);
  });

  it('section list aliases behave like the canonical section helpers', () => {
    let claims: Record<string, unknown> = {};

    claims = setSectionList(claims, [HealthcareBasicSections.PatientSummaryDocument.attributeValue]);
    claims = addSectionList(claims, [HealthcareBasicSections.Results.attributeValue]);

    expect(getSectionList(claims)).toEqual([
      HealthcareBasicSections.PatientSummaryDocument.attributeValue,
      HealthcareBasicSections.Results.attributeValue,
    ]);

    claims = removeSectionList(claims, [HealthcareBasicSections.PatientSummaryDocument.attributeValue]);
    expect(getSectionList(claims)).toEqual([
      HealthcareBasicSections.Results.attributeValue,
    ]);
  });

  it('sector aliases map to the same canonical Consent.action claim', () => {
    let claims: Record<string, unknown> = {};

    claims = setSectors(claims, [HealthcareBasicSections.PatientSummaryDocument.attributeValue]);
    claims = addSectors(claims, [HealthcareBasicSections.Results.attributeValue]);

    expect(getSectors(claims)).toEqual([
      HealthcareBasicSections.PatientSummaryDocument.attributeValue,
      HealthcareBasicSections.Results.attributeValue,
    ]);
    expect(getSections(claims)).toEqual([
      HealthcareBasicSections.PatientSummaryDocument.attributeValue,
      HealthcareBasicSections.Results.attributeValue,
    ]);

    claims = removeSectors(claims, [HealthcareBasicSections.PatientSummaryDocument.attributeValue]);
    expect(getSectors(claims)).toEqual([
      HealthcareBasicSections.Results.attributeValue,
    ]);
  });

  it('updates resource.meta.claims incrementally (claims-first) with actor/purpose/date/sections', () => {
    const entry: {
      resource: {
        resourceType: string;
        meta: { claims: Record<string, unknown> };
      };
    } = {
      resource: {
        resourceType: 'Consent',
        meta: {
          claims: {
            '@context': 'org.hl7.fhir.api',
          },
        },
      },
    };

    let claims = entry.resource.meta.claims;
    claims = setConsentIdentifier(claims, 'consent-uuid-001');
    claims = setConsentSubject(claims, 'did:web:subject.example');
    claims = setConsentDecision(claims, 'permit');
    claims = setConsentDate(claims, '2026-06-01');
    claims = setConsentPeriodStart(claims, '2026-06-01T00:00:00Z');
    claims = setConsentPeriodEnd(claims, '2026-12-31T23:59:59Z');

    claims = addActors(claims, ['did:web:hospital.example.org', 'doctor@example.org']);
    claims = addRoles(claims, [HealthcareActorRoles.Physician]);
    claims = addPurposes(claims, [HealthcareConsentPurposes.Treatment]);
    claims = addSections(claims, [HealthcareBasicSections.AllergiesAndIntolerances.attributeValue]);

    // Incremental edit on same claim keys.
    claims = addPurposes(claims, [HealthcareConsentPurposes.CareManagement]);
    claims = addSections(claims, [HealthcareBasicSections.Results.attributeValue]);

    entry.resource.meta.claims = claims;

    expect(getConsentIdentifier(entry.resource.meta.claims)).toBe('consent-uuid-001');
    expect(getConsentSubject(entry.resource.meta.claims)).toBe('did:web:subject.example');
    expect(getConsentDecision(entry.resource.meta.claims)).toBe('permit');
    expect(getConsentDate(entry.resource.meta.claims)).toBe('2026-06-01');
    expect(getConsentPeriodStart(entry.resource.meta.claims)).toBe('2026-06-01T00:00:00Z');
    expect(getConsentPeriodEnd(entry.resource.meta.claims)).toBe('2026-12-31T23:59:59Z');

    expect(getActors(entry.resource.meta.claims)).toEqual([
      'did:web:hospital.example.org',
      'doctor@example.org',
    ]);
    expect(getPurposes(entry.resource.meta.claims)).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.CareManagement,
    ]);
    expect(getSections(entry.resource.meta.claims)).toEqual([
      HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
      HealthcareBasicSections.Results.attributeValue,
    ]);

    // Abstraction check: helpers write the canonical claim keys.
    expect(Object.keys(entry.resource.meta.claims)).toEqual(expect.arrayContaining([
      ClaimConsent.identifier,
      ClaimConsent.date,
      ClaimConsent.periodStart,
      ClaimConsent.periodEnd,
      ClaimConsent.actorIdentifier,
      ClaimConsent.actorRole,
      ClaimConsent.purpose,
      ClaimConsent.action,
    ]));
  });

  it('tracks linked document reference identifiers for consent', () => {
    let claims: Record<string, unknown> = {};

    claims = setContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    claims = addContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);
    expect(getContainedDocumentIdentifierList(claims)).toEqual([
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
    ]);

    claims = removeContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    expect(getContainedDocumentIdentifierList(claims)).toEqual([EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);
  });
});
