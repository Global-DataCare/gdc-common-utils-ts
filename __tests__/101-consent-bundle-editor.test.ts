/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import {
  HealthcareActorRoles,
  HealthcareActorRoleCodes,
  HealthcareBasicSections,
  HealthcareCanonicalSectionFamilies,
  HealthcareConsentPurposes,
  HealthcareKindOfDocumentSections,
  ISCO08_CODING_SYSTEM,
} from '../src/constants/healthcare.js';
import { ClaimConsent, ConsentDecisions } from '../src/models/consent-rule.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import {
  BundleEntryClaimsContext,
  CommunicationClaimsContext,
} from '../src/models/communication-attached-bundle-session.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_DATE,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PERIOD_END,
  EXAMPLE_CONSENT_PERIOD_START,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
} from '../src/examples/shared.js';
import { setClaimValues } from '../src/claims/claim-list-helpers.js';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
  setCommunicationTopic,
} from '../src/utils/claims-helpers-communication.js';
import {
  addSectionList,
  getActorIdentifierList,
  getActorRoleList,
  getPurposeList,
  getSectionList,
  setActorIdentifierList,
  setConsentDate,
  setConsentDecision,
  setConsentIdentifier,
  setConsentPeriodEnd,
  setConsentPeriodStart,
  setConsentSubject,
  setPurposeList,
  setActorRoleList,
  setSectionList,
} from '../src/utils/claims-helpers-consent.js';
import {
  ConsentEditorTargetKinds,
} from '../src/utils/communication-attached-bundle-session.js';
import { createConsentAccessEditor } from '../src/utils/communication-consent-access-editor.js';
import {
  buildConsentPermissionTemplateImportExportSessionExample,
  buildSeparateConsentPermissionBundleExample,
} from '../src/examples/communication-attached-bundle-session.js';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';

const CONSENT_COMMUNICATION_TOPIC = HealthcareKindOfDocumentSections['LP173394-0'].attributeValue;

describe('101: consent bundle editor', () => {
  it('creates or edits one Consent inside a Communication bundle step by step', () => {
    // Teaching goal:
    // - the app owns one Communication that carries a consent bundle
    // - the user opens one Consent from that bundle
    // - the app edits the selected Consent
    // - the app saves the same Consent back into the bundle
    // - the saved bundle is ready to be shown again or transported

    // Step 1.
    // Frontend/runtime already has the Communication wrapper or creates one.
    // The in-memory bundle editor is the canonical unit for editing the
    // permissions bundle carried in Communication.content-attachment-data.
    let communicationBaseClaims: Record<string, unknown> = { '@context': CommunicationClaimsContext };
    communicationBaseClaims = setCommunicationIdentifier(
      communicationBaseClaims,
      EXAMPLE_COMMUNICATION_IDENTIFIER,
    );
    communicationBaseClaims = setCommunicationSubject(
      communicationBaseClaims,
      EXAMPLE_SUBJECT_DID,
    );
    communicationBaseClaims = setCommunicationCategory(
      communicationBaseClaims,
      CommunicationCategoryCodes.Notification.attributeValue,
    );
    communicationBaseClaims = setCommunicationTopic(
      communicationBaseClaims,
      CONSENT_COMMUNICATION_TOPIC,
    );

    const consentBundleEditor = createConsentAccessEditor({
      communicationClaims: communicationBaseClaims,
    });

    // Step 2.
    // Add one Consent entry to the bundle. This is the consent the
    // user selected or the consent the UI is creating now.
    let consentBaseClaims: Record<string, unknown> = { '@context': BundleEntryClaimsContext };
    consentBaseClaims = setConsentDecision(consentBaseClaims, ConsentDecisions.Permit);
    consentBaseClaims = setConsentSubject(consentBaseClaims, EXAMPLE_SUBJECT_DID);
    consentBaseClaims = setConsentIdentifier(consentBaseClaims, EXAMPLE_CONSENT_IDENTIFIER);
    consentBaseClaims = setConsentDate(consentBaseClaims, EXAMPLE_CONSENT_DATE);
    consentBaseClaims = setConsentPeriodStart(consentBaseClaims, EXAMPLE_CONSENT_PERIOD_START);
    consentBaseClaims = setConsentPeriodEnd(consentBaseClaims, EXAMPLE_CONSENT_PERIOD_END);

    consentBundleEditor.addConsent({
      claims: consentBaseClaims,
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    // Step 3.
    // Read the currently selected Consent claims from the active bundle entry
    // so the app can populate the current screen state.
    const activeConsentClaims = {
      ...(consentBundleEditor.getActiveEntry()?.resource?.meta?.claims || {}),
    };

    // Step 4.
    // Simulate the user editing that same Consent on screen.
    // This is not a second Consent. It is the updated version of the same one.
    let editedConsentClaims = setPurposeList(activeConsentClaims, [HealthcareConsentPurposes.Treatment]);
    editedConsentClaims = setActorRoleList(editedConsentClaims, [HealthcareActorRoles.GeneralistMedicalPractitioner]);
    editedConsentClaims = setSectionList(editedConsentClaims, [
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
    editedConsentClaims = addSectionList(editedConsentClaims, [
      HealthcareBasicSections.Results.attributeValue,
    ]);

    // Step 5.
    // Save the edited values back into the selected Consent entry.
    consentBundleEditor.patchActiveEntryClaims(editedConsentClaims);
    consentBundleEditor.saveAndReleaseActiveEntry();

    // Step 6.
    // Final didactic proof:
    // the edited Consent is now persisted inside the Communication-attached
    // bundle and ready to be rendered again or sent to backend transport.
    const communicationClaims = consentBundleEditor.getCommunicationClaims();
    expect(communicationClaims[CommunicationClaim.Topic]).toBe(CONSENT_COMMUNICATION_TOPIC);
    const decodedBundle = JSON.parse(
      Buffer.from(String(communicationClaims[CommunicationClaim.ContentAttachmentData]), 'base64').toString('utf8'),
    );
    const savedConsentClaims = decodedBundle.data[0].resource.meta.claims;

    expect(getPurposeList(savedConsentClaims)).toEqual([HealthcareConsentPurposes.Treatment]);
    expect(getActorRoleList(savedConsentClaims)).toEqual([HealthcareActorRoles.GeneralistMedicalPractitioner]);
    expect(getSectionList(savedConsentClaims)).toEqual([
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
      HealthcareBasicSections.Results.attributeValue,
    ]);
    expect(savedConsentClaims[ClaimConsent.identifier]).toBe(EXAMPLE_CONSENT_IDENTIFIER);
  });

  it('supports direct claim-level control on the active Consent entry when lower-level editing is needed', () => {
    // Teaching goal:
    // this is the low-level escape hatch. It is useful for internal plumbing
    // or advanced cases, but it is intentionally not the main 101 UI path.
    const consentBundleEditor = createConsentAccessEditor();

    consentBundleEditor.addConsent({
      claims: {
        '@context': BundleEntryClaimsContext,
        [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
        [ClaimConsent.subject]: EXAMPLE_SUBJECT_DID,
      },
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    consentBundleEditor.setActiveEntryClaim(ClaimConsent.decision, ConsentDecisions.Permit);
    expect(consentBundleEditor.getActiveEntryClaim(ClaimConsent.decision)).toBe(ConsentDecisions.Permit);
    expect(consentBundleEditor.hasActiveEntryClaim(ClaimConsent.identifier)).toBe(true);

    consentBundleEditor.removeActiveEntryClaim(ClaimConsent.decision);
    expect(consentBundleEditor.hasActiveEntryClaim(ClaimConsent.decision)).toBe(false);
  });

  it('exposes duplicate atomic-rule conflicts for the frontend after saving entries', () => {
    const consentBundleEditor = createConsentAccessEditor({
      communicationClaims: { '@context': CommunicationClaimsContext },
    });

    let firstConsentClaims: Record<string, unknown> = { '@context': BundleEntryClaimsContext };
    firstConsentClaims = setConsentDecision(firstConsentClaims, ConsentDecisions.Permit);
    firstConsentClaims = setConsentIdentifier(firstConsentClaims, 'urn:uuid:consent-1');
    firstConsentClaims = setConsentSubject(firstConsentClaims, EXAMPLE_SUBJECT_DID);
    firstConsentClaims = setPurposeList(firstConsentClaims, [HealthcareConsentPurposes.Treatment]);
    firstConsentClaims = setActorIdentifierList(firstConsentClaims, [EXAMPLE_EMAIL_PROFESSIONAL]);
    firstConsentClaims = setActorRoleList(firstConsentClaims, [HealthcareActorRoles.GeneralistMedicalPractitioner]);
    firstConsentClaims = setSectionList(firstConsentClaims, [
      HealthcareBasicSections.Results.attributeValue,
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);

    consentBundleEditor.addConsent({
      claims: firstConsentClaims,
      fullUrl: 'urn:uuid:consent-1',
    });
    consentBundleEditor.saveAndReleaseActiveEntry();

    let secondConsentClaims: Record<string, unknown> = { '@context': BundleEntryClaimsContext };
    secondConsentClaims = setConsentDecision(secondConsentClaims, ConsentDecisions.Permit);
    secondConsentClaims = setConsentIdentifier(secondConsentClaims, 'urn:uuid:consent-2');
    secondConsentClaims = setConsentSubject(secondConsentClaims, EXAMPLE_SUBJECT_DID);
    secondConsentClaims = setPurposeList(secondConsentClaims, [HealthcareConsentPurposes.Treatment]);
    secondConsentClaims = setActorIdentifierList(secondConsentClaims, [EXAMPLE_EMAIL_PROFESSIONAL]);
    secondConsentClaims = setActorRoleList(secondConsentClaims, [HealthcareActorRoles.GeneralistMedicalPractitioner]);
    secondConsentClaims = setSectionList(secondConsentClaims, [
      HealthcareBasicSections.Results.attributeValue,
    ]);

    consentBundleEditor.addConsent({
      claims: secondConsentClaims,
      fullUrl: 'urn:uuid:consent-2',
    });

    const activeConflicts = consentBundleEditor.getActiveConsentRuleDuplicateConflicts();
    const allConflicts = consentBundleEditor.getConsentRuleDuplicateConflicts();

    expect(activeConflicts).toHaveLength(1);
    expect(allConflicts).toHaveLength(1);
    expect(activeConflicts[0].actorIdentifier).toBe(EXAMPLE_EMAIL_PROFESSIONAL);
    expect(activeConflicts[0].purpose).toBe(HealthcareConsentPurposes.Treatment);
    expect(activeConflicts[0].effectiveTargets.sections).toEqual([
      HealthcareBasicSections.Results.attributeValue,
    ]);
    expect(activeConflicts[0].affectedEntries.map((entry) => entry.fullUrl)).toEqual([
      'urn:uuid:consent-1',
      'urn:uuid:consent-2',
    ]);
  });

  it('exports a permission-template-shaped draft into consent claims and imports it back through the active entry', () => {
    // Teaching goal:
    // - the app starts from one draft object shaped like a permission template
    // - the app converts that draft into canonical Consent claims
    // - the app saves the result into the bundle
    // - the app later reads the persisted Consent back
    const consentBundleEditor = createConsentAccessEditor({
      communicationClaims: { '@context': CommunicationClaimsContext },
    });

    const templateDraft = {
      decision: ConsentDecisions.Permit,
      purposes: [
        HealthcareConsentPurposes.Treatment,
        HealthcareConsentPurposes.EmergencyTreatment,
        HealthcareConsentPurposes.Treatment,
      ],
      actorIdentifiers: [
        EXAMPLE_EMAIL_PROFESSIONAL,
        EXAMPLE_PROVIDER_ORGANIZATION_DID,
        EXAMPLE_HEALTHCARE_JURISDICTION,
        EXAMPLE_EMAIL_PROFESSIONAL,
      ],
      actorRoles: [
        HealthcareActorRoles.GeneralistMedicalPractitioner,
        HealthcareActorRoles.GeneralistMedicalPractitioner,
      ],
      sections: [
        HealthcareBasicSections.Results.attributeValue,
        HealthcareBasicSections.Results.attributeValue,
        HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
      ],
      resourceTypes: [
        ResourceTypesFhirR4.DocumentReference,
        ResourceTypesFhirR4.MedicationStatement,
        ResourceTypesFhirR4.DocumentReference,
      ],
    } as const;

    let consentClaims: Record<string, unknown> = { '@context': BundleEntryClaimsContext };
    consentClaims = setConsentDecision(consentClaims, templateDraft.decision);
    consentClaims = setConsentIdentifier(consentClaims, EXAMPLE_CONSENT_IDENTIFIER);
    consentClaims = setConsentSubject(consentClaims, EXAMPLE_SUBJECT_DID);
    consentClaims = setConsentDate(consentClaims, EXAMPLE_CONSENT_DATE);
    consentClaims = setPurposeList(consentClaims, templateDraft.purposes);
    consentClaims = setActorIdentifierList(consentClaims, templateDraft.actorIdentifiers);
    consentClaims = setActorRoleList(consentClaims, templateDraft.actorRoles);
    consentClaims = setSectionList(consentClaims, templateDraft.sections);
    consentClaims = setClaimValues(consentClaims, ClaimConsent.resourceType, templateDraft.resourceTypes);

    consentBundleEditor.addConsent({
      claims: consentClaims,
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    // Save the draft-derived Consent exactly as storage/transport would see it.
    consentBundleEditor.saveAndReleaseActiveEntry();

    // Re-read the serialized bundle payload and prove that persisted data still
    // matches the user's selected template values.
    const exportedBundle = JSON.parse(
      Buffer.from(
        String(consentBundleEditor.getCommunicationClaims()[CommunicationClaim.ContentAttachmentData]),
        'base64',
      ).toString('utf8'),
    );
    const exportedClaims = exportedBundle.data[0].resource.meta.claims;

    expect(exportedBundle.data).toHaveLength(1);
    expect(exportedBundle.data[0].resource.resourceType).toBe(ResourceTypesFhirR4.Consent);
    expect(getPurposeList(exportedClaims)).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.EmergencyTreatment,
    ]);
    expect(getActorIdentifierList(exportedClaims)).toEqual([
      EXAMPLE_EMAIL_PROFESSIONAL,
      EXAMPLE_PROVIDER_ORGANIZATION_DID,
      EXAMPLE_HEALTHCARE_JURISDICTION,
    ]);
    expect(getActorRoleList(exportedClaims)).toEqual([
      HealthcareActorRoles.GeneralistMedicalPractitioner,
    ]);
    expect(getSectionList(exportedClaims)).toEqual([
      HealthcareBasicSections.Results.attributeValue,
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
    expect(exportedClaims[ClaimConsent.resourceType]).toBe(
      [
        ResourceTypesFhirR4.DocumentReference,
        ResourceTypesFhirR4.MedicationStatement,
      ].join(','),
    );

    const reloadedEditor = createConsentAccessEditor({
      communicationClaims: consentBundleEditor.getCommunicationClaims(),
    });

    // Open the saved Consent again exactly like the app would do on reload.
    reloadedEditor.selectActiveEntry({
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    expect(reloadedEditor.getDecision()).toBe(ConsentDecisions.Permit);
    expect(reloadedEditor.getActiveEntry()?.resource?.meta?.claims).toEqual(exportedClaims);
    expect(reloadedEditor.getTargetsClassified()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.Section,
          code: HealthcareBasicSections.Results.attributeValue,
          sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
        }),
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.Section,
          code: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
        }),
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.ResourceType,
          code: ResourceTypesFhirR4.DocumentReference,
        }),
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.ResourceType,
          code: ResourceTypesFhirR4.MedicationStatement,
        }),
      }),
    ]));
    expect(reloadedEditor.getActorsClassified()).toEqual(expect.objectContaining({
      jurisdictions: [expect.objectContaining({ code: EXAMPLE_HEALTHCARE_JURISDICTION })],
      organizations: [expect.objectContaining({ domain: EXAMPLE_PROVIDER_ORGANIZATION_DID.replace('did:web:', '') })],
      users: [expect.objectContaining({
        email: EXAMPLE_EMAIL_PROFESSIONAL,
        role: expect.objectContaining({
          codingSystem: ISCO08_CODING_SYSTEM,
          code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
        }),
      })],
    }));
  });

  it('keeps the published permission-template import/export example deterministic', () => {
    // Teaching goal:
    // the published example must stay executable and readable as tutorial
    // material, not drift into undocumented helper behavior.
    const {
      templateDraft,
      consentClaims,
      importedConsentClaims,
      bundleInMemory,
    } = buildConsentPermissionTemplateImportExportSessionExample();

    expect(templateDraft.purposes).toHaveLength(3);
    expect(getPurposeList(consentClaims)).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.EmergencyTreatment,
    ]);
    expect(getActorIdentifierList(consentClaims)).toEqual([
      EXAMPLE_EMAIL_PROFESSIONAL,
      EXAMPLE_PROVIDER_ORGANIZATION_DID,
      EXAMPLE_HEALTHCARE_JURISDICTION,
    ]);
    expect(getSectionList(consentClaims)).toEqual([
      HealthcareBasicSections.Results.attributeValue,
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
    expect(consentClaims[ClaimConsent.resourceType]).toBe(
      [
        ResourceTypesFhirR4.DocumentReference,
        ResourceTypesFhirR4.MedicationStatement,
      ].join(','),
    );
    expect(importedConsentClaims).toEqual(consentClaims);
    expect(bundleInMemory.data).toHaveLength(1);
    expect(bundleInMemory.data[0].resource?.resourceType).toBe(ResourceTypesFhirR4.Consent);
  });

  it('wraps one already-built consent bundle into Communication as the final complementary transport step', () => {
    // Teaching goal:
    // after the app finishes editing the bundle, the final user-visible result
    // is still a Communication wrapper ready for transport.
    const {
      bundleInMemory,
      communicationClaims,
    } = buildSeparateConsentPermissionBundleExample();

    const wrappedSession = createConsentAccessEditor({
      initialBundle: bundleInMemory,
      communicationClaims,
    });

    const wrappedCommunicationClaims = wrappedSession.getCommunicationClaims();
    expect(wrappedCommunicationClaims[CommunicationClaim.Topic]).toBe(CONSENT_COMMUNICATION_TOPIC);
    const decodedWrappedBundle = JSON.parse(
      Buffer.from(
        String(wrappedCommunicationClaims[CommunicationClaim.ContentAttachmentData]),
        'base64',
      ).toString('utf8'),
    );

    expect(wrappedCommunicationClaims[CommunicationClaim.ContentAttachmentType]).toBe('application/fhir+json');
    expect(decodedWrappedBundle).toEqual(bundleInMemory);
    expect(decodedWrappedBundle.data).toHaveLength(3);
  });
});
