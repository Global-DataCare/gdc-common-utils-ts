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
  createConsentAccessEditor,
} from '../src/utils/communication-attached-bundle-session.js';
import {
  buildConsentPermissionTemplateImportExportSessionExample,
  buildSeparateConsentPermissionBundleExample,
} from '../src/examples/communication-attached-bundle-session.js';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';

const CONSENT_COMMUNICATION_TOPIC = HealthcareKindOfDocumentSections['LP173394-0'].attributeValue;

describe('101: consent bundle editor', () => {
  it('creates or edits one Consent inside a Communication bundle step by step', () => {
    // Step 1.
    // Frontend/runtime already has the Communication wrapper or creates one.
    // The in-memory bundle editor is the canonical unit for editing the
    // permissions bundle carried in Communication.content-attachment-data.
    let communicationBaseClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };
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

    const bundleEditor = createConsentAccessEditor({
      communicationClaims: communicationBaseClaims,
    });

    // Step 2.
    // Create or upsert one Consent entry in the bundle. This is the consent the
    // user selected or the consent the UI is creating now.
    let consentBaseClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.api' };
    consentBaseClaims = setConsentDecision(consentBaseClaims, ConsentDecisions.Permit);
    consentBaseClaims = setConsentSubject(consentBaseClaims, EXAMPLE_SUBJECT_DID);
    consentBaseClaims = setConsentIdentifier(consentBaseClaims, EXAMPLE_CONSENT_IDENTIFIER);
    consentBaseClaims = setConsentDate(consentBaseClaims, EXAMPLE_CONSENT_DATE);
    consentBaseClaims = setConsentPeriodStart(consentBaseClaims, EXAMPLE_CONSENT_PERIOD_START);
    consentBaseClaims = setConsentPeriodEnd(consentBaseClaims, EXAMPLE_CONSENT_PERIOD_END);

    bundleEditor.upsertActiveConsentEntry({
      claims: consentBaseClaims,
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    // Step 3.
    // Read the currently selected Consent claims from the active bundle entry.
    const activeConsentClaims = {
      ...(bundleEditor.getActiveEntry()?.resource?.meta?.claims || {}),
    };

    // Step 4.
    // Edit the same Consent claim set that we just read from the active entry.
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
    // Patch the edited claims back into the active bundle entry and save.
    bundleEditor.patchActiveEntryClaims(editedConsentClaims);
    bundleEditor.saveAndReleaseActiveEntry();

    // Step 6.
    // Assertions: the edited Consent is now persisted inside the
    // Communication-attached bundle and ready to be sent or rendered again.
    const communicationClaims = bundleEditor.getCommunicationClaims();
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
    const bundleEditor = createConsentAccessEditor();

    bundleEditor.upsertActiveConsentEntry({
      claims: {
        '@context': 'org.hl7.fhir.api',
        [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
        [ClaimConsent.subject]: EXAMPLE_SUBJECT_DID,
      },
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    bundleEditor.setActiveEntryClaim(ClaimConsent.decision, ConsentDecisions.Permit);
    expect(bundleEditor.getActiveEntryClaim(ClaimConsent.decision)).toBe(ConsentDecisions.Permit);
    expect(bundleEditor.hasActiveEntryClaim(ClaimConsent.identifier)).toBe(true);

    bundleEditor.removeActiveEntryClaim(ClaimConsent.decision);
    expect(bundleEditor.hasActiveEntryClaim(ClaimConsent.decision)).toBe(false);
  });

  it('exports a permission-template-shaped draft into consent claims and imports it back through the active entry', () => {
    const bundleEditor = createConsentAccessEditor({
      communicationClaims: { '@context': 'org.hl7.fhir.r4' },
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

    let consentClaims: Record<string, unknown> = { '@context': 'org.hl7.fhir.api' };
    consentClaims = setConsentDecision(consentClaims, templateDraft.decision);
    consentClaims = setConsentIdentifier(consentClaims, EXAMPLE_CONSENT_IDENTIFIER);
    consentClaims = setConsentSubject(consentClaims, EXAMPLE_SUBJECT_DID);
    consentClaims = setConsentDate(consentClaims, EXAMPLE_CONSENT_DATE);
    consentClaims = setPurposeList(consentClaims, templateDraft.purposes);
    consentClaims = setActorIdentifierList(consentClaims, templateDraft.actorIdentifiers);
    consentClaims = setActorRoleList(consentClaims, templateDraft.actorRoles);
    consentClaims = setSectionList(consentClaims, templateDraft.sections);
    consentClaims = setClaimValues(consentClaims, ClaimConsent.resourceType, templateDraft.resourceTypes);

    bundleEditor.upsertActiveConsentEntry({
      claims: consentClaims,
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });
    bundleEditor.saveAndReleaseActiveEntry();

    const exportedBundle = JSON.parse(
      Buffer.from(
        String(bundleEditor.getCommunicationClaims()[CommunicationClaim.ContentAttachmentData]),
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
      communicationClaims: bundleEditor.getCommunicationClaims(),
    });
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
