/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  HealthcareBasicSections,
  HealthcareActorRoleCodes,
  HealthcareCanonicalSectionFamilies,
  HealthcareCoreSections,
  ISCO08_CODING_SYSTEM,
} from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { DataspaceSectors } from '../src/constants/sectors.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
  EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import {
  CommunicationClaimsContext,
  ConsentEditorTargetKinds,
} from '../src/utils/communication-attached-bundle-session.js';
import { createConsentAccessEditor } from '../src/utils/communication-consent-access-editor.js';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
  setCommunicationText,
} from '../src/claims/claims-helpers-communication.js';
import {
  exportConsentEntry,
  importPermissionTemplate,
  PermissionTemplateOperationCodes,
  PermissionTemplateTargetKinds,
  resolvePermissionTemplate,
} from '../src/utils/permission-templates.js';

describe('101: consent permission bundle read/write', () => {
  it('creates three separate consents and reads them back as professional, organization, and jurisdiction permissions', () => {
    // Teaching goal:
    // - the app prepares one Communication that carries several Consent entries
    // - each Consent represents a different permission rule the user will later inspect
    // - the app saves those Consent entries into the bundle
    // - the app reopens each Consent and reads classified values ready for rendering

    // Step 1.
    // Create the Communication wrapper that will carry the permission bundle.
    let communicationClaims: Record<string, unknown> = { '@context': CommunicationClaimsContext };
    communicationClaims = setCommunicationIdentifier(
      communicationClaims,
      EXAMPLE_COMMUNICATION_IDENTIFIER,
    );
    communicationClaims = setCommunicationSubject(
      communicationClaims,
      EXAMPLE_SUBJECT_DID,
    );
    communicationClaims = setCommunicationCategory(
      communicationClaims,
      CommunicationCategoryCodes.Notification.attributeValue,
    );
    communicationClaims = setCommunicationText(
      communicationClaims,
      EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
    );

    const physicianTemplate = resolvePermissionTemplate({
      sector: DataspaceSectors.HealthCare,
      roleClaim: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
    });

    expect(physicianTemplate).toBeDefined();

    // Step 2.
    // Build three different permission decisions that simulate what the app
    // wants to show later as three separate persisted consents.
    const ipsCoreTargets = Array.from(new Set(
      Object.values(HealthcareCoreSections).map((section) => section.attributeValue),
    )).map((code) => ({
      kind: PermissionTemplateTargetKinds.Section,
      code,
      sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
      scopes: [PermissionTemplateOperationCodes.Read],
    }));

    const professionalDecision = importPermissionTemplate(
      physicianTemplate as NonNullable<typeof physicianTemplate>,
      {
        actorIdentifiers: [EXAMPLE_EMAIL_PROFESSIONAL],
        purposes: [EXAMPLE_CONSENT_PURPOSE_TREATMENT],
        roles: [EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER],
        targets: [
          ...ipsCoreTargets,
          {
            kind: PermissionTemplateTargetKinds.ResourceType,
            code: ResourceTypesFhirR4.DocumentReference,
            scopes: [PermissionTemplateOperationCodes.Read],
          },
        ],
      },
    );

    const organizationDecision = importPermissionTemplate(
      physicianTemplate as NonNullable<typeof physicianTemplate>,
      {
        actorIdentifiers: [EXAMPLE_PROVIDER_ORGANIZATION_DID],
        purposes: [EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT],
        roles: [EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER],
        targets: [
          {
            kind: PermissionTemplateTargetKinds.Section,
            code: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
            sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
            scopes: [PermissionTemplateOperationCodes.Read],
          },
          {
            kind: PermissionTemplateTargetKinds.ResourceType,
            code: ResourceTypesFhirR4.DocumentReference,
            scopes: [PermissionTemplateOperationCodes.Read],
          },
        ],
      },
    );

    const jurisdictionDecision = importPermissionTemplate(
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
            kind: PermissionTemplateTargetKinds.Section,
            code: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
            sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
            scopes: [PermissionTemplateOperationCodes.Read],
          },
          {
            kind: PermissionTemplateTargetKinds.ResourceType,
            code: ResourceTypesFhirR4.DocumentReference,
            scopes: [PermissionTemplateOperationCodes.Read],
          },
        ],
      },
    );

    // Step 3.
    // Save those three consent decisions into one bundle.
    const consentBundleEditor = createConsentAccessEditor({
      communicationClaims,
    });

    const decisions = [
      professionalDecision,
      organizationDecision,
      jurisdictionDecision,
    ] as const;

    decisions.forEach((decision, index) => {
      const consentEntry = exportConsentEntry(decision, {
        identifier: `${EXAMPLE_CONSENT_IDENTIFIER}-${index + 1}`,
        subject: EXAMPLE_SUBJECT_DID,
        fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-${index + 1}`,
      });
      consentBundleEditor.upsertActiveConsentEntry({
        claims: {
          ...(consentEntry.resource?.meta?.claims || {}),
        },
        fullUrl: consentEntry.fullUrl,
        type: consentEntry.type,
      });
    });
    consentBundleEditor.saveAndReleaseActiveEntry();

    const bundleInMemory = consentBundleEditor.getBundleInMemory();

    // Step 4.
    // Prove that the bundle now contains the three persisted consents that the
    // app can later list and open.
    expect(decisions).toHaveLength(3);
    expect(bundleInMemory.data).toHaveLength(3);

    // Step 5.
    // Reopen the saved Communication bundle as a reader would do on a later
    // screen load.
    const reader = createConsentAccessEditor({
      communicationClaims: consentBundleEditor.getCommunicationClaims(),
    });

    // Step 6.
    // Open the first consent and verify the classified data the UI would render
    // for a professional/user permission.
    reader.selectActiveEntry({ fullUrl: bundleInMemory.data[0].fullUrl });
    expect(reader.getSelectedPurposes()).toEqual([EXAMPLE_CONSENT_PURPOSE_TREATMENT]);
    expect(reader.getSelectedRoles()).toEqual([
      EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
    ]);
    expect(reader.getActorsClassified().users).toEqual([
      expect.objectContaining({
        email: EXAMPLE_EMAIL_PROFESSIONAL,
        role: expect.objectContaining({
          codingSystem: ISCO08_CODING_SYSTEM,
          code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
        }),
      }),
    ]);
    expect(reader.getSelectedCoreSections()).toEqual(
      Array.from(new Set(Object.values(HealthcareCoreSections).map((section) => section.attributeValue))),
    );
    expect(reader.getTargetsClassified()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        target: expect.objectContaining({
          sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
        }),
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.ResourceType,
          code: ResourceTypesFhirR4.DocumentReference,
        }),
      }),
    ]));

    // Step 7.
    // Open the second consent and verify the organization-shaped data that the
    // app would show for an organization permission.
    reader.selectActiveEntry({ fullUrl: bundleInMemory.data[1].fullUrl });
    expect(reader.getSelectedPurposes()).toEqual([
      EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
    ]);
    expect(reader.getActorsClassified().organizations).toEqual([
      expect.objectContaining({
        domain: EXAMPLE_PROVIDER_ORGANIZATION_DID.replace('did:web:', ''),
      }),
    ]);
    expect(reader.getRolesClassified().professional).toEqual([
      expect.objectContaining({
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
      }),
    ]);

    // Step 8.
    // Open the third consent and verify the jurisdiction-shaped data that the
    // app would show for a jurisdiction permission.
    reader.selectActiveEntry({ fullUrl: bundleInMemory.data[2].fullUrl });
    expect(reader.getSelectedPurposes()).toEqual([
      EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
    ]);
    expect(reader.getActorsClassified().jurisdictions).toEqual([
      expect.objectContaining({ code: EXAMPLE_HEALTHCARE_JURISDICTION }),
      expect.objectContaining({ code: EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION }),
    ]);
  });
});
