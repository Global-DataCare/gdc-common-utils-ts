// Flow contract: a professional requests permission by sending a Bundle of draft Consent resources inside one auditable Communication.
// Authorization invariant: `Consent.status=draft` never grants access; only the controller's later active Consent can authorize it.
// Persistence invariant: every requested rule remains a normal Consent entry with canonical FHIR-like claims in `resource.meta.claims`.

import { describe, expect, it } from '@jest/globals';
import {
  BundleEditableResourceTypes,
  BundleEditor,
  BundleOperations,
  BundleTypes,
  ClaimConsent,
  ConsentDecisions,
  ConsentStatuses,
  isConsentRuleActive,
} from '../src/index.js';
import {
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../src/constants/healthcare.js';
import { EXAMPLE_CONSENT_ACCESS_RULES } from '../src/examples/consent-access.js';

describe('draft Consent Bundle', () => {
  it('authors an ungranted permission request with the normal Consent editor', () => {
    const editor = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setBundleType(BundleTypes.batch)
      .setAllowedResourceType(BundleEditableResourceTypes.consent);

    editor.newEntryAs(BundleEditableResourceTypes.consent)
      .setIdentifier(EXAMPLE_CONSENT_IDENTIFIER)
      .setStatus(ConsentStatuses.Draft)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDecision(ConsentDecisions.Permit)
      .setActorIdentifierList([EXAMPLE_EMAIL_PROFESSIONAL])
      .setActorRoleList([HealthcareActorRoles.NursingProfessional])
      .setPurposeList([HealthcareConsentPurposes.Treatment])
      .setSectionList([HealthcareBasicSections.PatientSummaryDocument.attributeValue])
      .doneEntry();

    const bundle = editor.buildJsonApi();
    expect(bundle.data).toHaveLength(1);
    expect(bundle.data[0]?.resource?.meta?.claims).toEqual(expect.objectContaining({
      [ClaimConsent.status]: ConsentStatuses.Draft,
      [ClaimConsent.subject]: EXAMPLE_SUBJECT_DID,
      [ClaimConsent.actorIdentifier]: EXAMPLE_EMAIL_PROFESSIONAL,
    }));
  });

  it('keeps draft requests outside authorization while retaining status-less legacy rules', () => {
    const legacyRule = EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare;

    expect(isConsentRuleActive({
      ...legacyRule,
      [ClaimConsent.status]: ConsentStatuses.Draft,
    })).toBe(false);
    expect(isConsentRuleActive({
      ...legacyRule,
      [ClaimConsent.status]: ConsentStatuses.Active,
    })).toBe(true);
    expect(isConsentRuleActive(legacyRule)).toBe(true);
  });
});
