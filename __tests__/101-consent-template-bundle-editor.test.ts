import { describe, expect, it } from '@jest/globals';

import {
  BundleEditor,
  BundleReader,
  createConsentAccessEditor,
  EmployeeBundleOperations,
  exportConsentClaims,
  HealthcareActorRoleCodes,
  HealthcareBasicSections,
  HealthcareCanonicalSectionFamilies,
  HealthcareCoreSections,
  HealthcareDocumentTypes,
  importPermissionTemplate,
  ISCO08_CODING_SYSTEM,
  resolvePermissionTemplate,
  ResourceTypesFhirR4,
} from '../src';
import { DataspaceSectors } from '../src/constants/sectors.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
  EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';

describe('101: consent template bundle editor', () => {
  it('builds one consent bundle at high level and edits each consent entry from templates before backend delivery', () => {
    // Teaching goal:
    // - the app starts from an empty bundle that will carry several consents
    // - the app prepares template-driven decisions for several user-visible rules
    // - the app saves each decision into its matching Consent entry
    // - the app reopens the saved bundle to prove the user would later see the same data
    // - the final output is one bundle ready for backend delivery

    // Frontend side:
    // - Vite can assemble this bundle and send it to its backend wrapper for GW CORE
    // - Expo confidential app can assemble the same bundle before its transport layer

    // Step 1.
    // Build the empty bundle skeleton with three Consent slots that the app
    // will later fill.
    const bundleEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(ResourceTypesFhirR4.Consent)
      .newEntry(`${EXAMPLE_COMMUNICATION_IDENTIFIER}-consent-1`)
      .setFullUrl(`urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-1`)
      .doneEntry()
      .newEntry(`${EXAMPLE_COMMUNICATION_IDENTIFIER}-consent-2`)
      .setFullUrl(`urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-2`)
      .doneEntry()
      .newEntry(`${EXAMPLE_COMMUNICATION_IDENTIFIER}-consent-3`)
      .setFullUrl(`urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-3`)
      .doneEntry();

    const draftBundle = bundleEditor.buildJsonApi();
    expect(new BundleReader(bundleEditor.build()).getTotalOperations()).toBe(3);

    // Step 2.
    // Build three high-level template decisions representing what the user has
    // chosen in the app.
    const physicianTemplate = resolvePermissionTemplate({
      sector: DataspaceSectors.HealthCare,
      roleClaim: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
    });
    expect(physicianTemplate).toBeDefined();

    const ipsReadDecision = importPermissionTemplate(
      physicianTemplate as NonNullable<typeof physicianTemplate>,
      {
        actorIdentifiers: [EXAMPLE_EMAIL_PROFESSIONAL],
        purposes: [EXAMPLE_CONSENT_PURPOSE_TREATMENT],
        roles: [EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER],
        targets: Array.from(new Set(
          Object.values(HealthcareCoreSections).map((section) => section.attributeValue),
        )).map((code) => ({
          kind: 'section',
          code,
          sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
          scopes: ['r'],
        })),
      },
    );

    const organizationEmergencyDecision = importPermissionTemplate(
      physicianTemplate as NonNullable<typeof physicianTemplate>,
      {
        actorIdentifiers: [EXAMPLE_PROVIDER_ORGANIZATION_DID],
        purposes: [EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT],
        roles: [EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER],
        targets: [
          {
            kind: 'section',
            code: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
            sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
            scopes: ['r'],
          },
          {
            kind: 'section',
            code: HealthcareDocumentTypes.IPS.attributeValue,
            sectionFamily: HealthcareCanonicalSectionFamilies.KindOfDocument,
            scopes: ['r'],
          },
          {
            kind: 'resource-type',
            code: ResourceTypesFhirR4.DocumentReference,
            scopes: ['r'],
          },
        ],
      },
    );

    const jurisdictionEmergencyDecision = importPermissionTemplate(
      physicianTemplate as NonNullable<typeof physicianTemplate>,
      {
        actorIdentifiers: [
          EXAMPLE_HEALTHCARE_JURISDICTION,
          EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION,
        ],
        purposes: [EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT],
        roles: [EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER],
        targets: [
          {
            kind: 'section',
            code: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
            sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
            scopes: ['r'],
          },
        ],
      },
    );

    // Step 3.
    // Open each Consent slot and save one template-derived decision into it.
    const consentBundleEditor = createConsentAccessEditor({
      initialBundle: draftBundle,
    });

    consentBundleEditor
      .selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-1` })
      .patchActiveEntryClaims(exportConsentClaims(ipsReadDecision, {
        identifier: `${EXAMPLE_CONSENT_IDENTIFIER}-1`,
        subject: EXAMPLE_SUBJECT_DID,
      }))
      .saveAndReleaseActiveEntry();

    consentBundleEditor
      .selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-2` })
      .patchActiveEntryClaims(exportConsentClaims(organizationEmergencyDecision, {
        identifier: `${EXAMPLE_CONSENT_IDENTIFIER}-2`,
        subject: EXAMPLE_SUBJECT_DID,
      }))
      .saveAndReleaseActiveEntry();

    consentBundleEditor
      .selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-3` })
      .patchActiveEntryClaims(exportConsentClaims(jurisdictionEmergencyDecision, {
        identifier: `${EXAMPLE_CONSENT_IDENTIFIER}-3`,
        subject: EXAMPLE_SUBJECT_DID,
      }))
      .saveAndReleaseActiveEntry();

    // Step 4.
    // The bundle is now ready to send, but before transport the app can still
    // reopen it and show the saved data again.
    const readyToSendBundle = consentBundleEditor.getBundleInMemory();
    expect(readyToSendBundle.data).toHaveLength(3);

    const reader = createConsentAccessEditor({
      initialBundle: readyToSendBundle,
    });

    // Step 5.
    // Reopen each persisted consent and verify the classified values the UI
    // would render to the user.
    reader.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-1` });
    expect(reader.getSelectedPurposes()).toEqual([EXAMPLE_CONSENT_PURPOSE_TREATMENT]);
    expect(reader.getActorsClassified().users).toEqual([
      expect.objectContaining({
        email: EXAMPLE_EMAIL_PROFESSIONAL,
        role: expect.objectContaining({
          codingSystem: ISCO08_CODING_SYSTEM,
          code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
        }),
      }),
    ]);

    reader.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-2` });
    expect(reader.getSelectedPurposes()).toEqual([EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT]);
    expect(reader.getActorsClassified().organizations).toEqual([
      expect.objectContaining({
        domain: EXAMPLE_PROVIDER_ORGANIZATION_DID.replace('did:web:', ''),
      }),
    ]);

    reader.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-3` });
    expect(reader.getSelectedPurposes()).toEqual([EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT]);
    expect(reader.getActorsClassified().jurisdictions).toEqual([
      expect.objectContaining({ code: EXAMPLE_HEALTHCARE_JURISDICTION }),
      expect.objectContaining({ code: EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION }),
    ]);
  });
});
