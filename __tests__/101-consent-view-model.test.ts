import { describe, expect, it } from '@jest/globals';

import {
  BundleEditor,
  EmployeeBundleOperations,
  exportConsentClaims,
  HealthcareBasicSections,
  HealthcareCanonicalSectionFamilies,
  HealthcareCoreSections,
  HealthcareDocumentTypes,
  importPermissionTemplate,
  resolvePermissionTemplate,
  ResourceTypesFhirR4,
  createConsentAccessEditor,
} from '../src';
import { DataspaceSectors } from '../src/constants/sectors.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';

describe('101: consent view model', () => {
  it('maps one Consent entry to ConsentViewModel and applies edited values back through ConsentAccessEditor', () => {
    // Teaching goal:
    // - the app already has one persisted Consent inside a bundle
    // - the UI loads that Consent into one frontend-facing view model
    // - the user edits the rendered values
    // - the app saves those edited values back into the same Consent entry
    // - the app reloads the saved Consent to prove the user sees persisted data

    // Step 1.
    // Build one draft bundle that will contain exactly one Consent entry.
    // This simulates the stored data source that the app will later read.
    const draftBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(ResourceTypesFhirR4.Consent)
      .newEntry(`${EXAMPLE_COMMUNICATION_IDENTIFIER}-consent-view-model`)
      .setFullUrl(`urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model`)
      .doneEntry()
      .buildJsonApi();

    // Step 2.
    // Create one initial decision as backend/persisted consent data.
    // This is what exists before the user opens the consent screen.
    const physicianTemplate = resolvePermissionTemplate({
      sector: DataspaceSectors.HealthCare,
      roleClaim: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
    });
    expect(physicianTemplate).toBeDefined();

    const initialDecision = importPermissionTemplate(
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

    // Step 3.
    // Persist that initial consent into the bundle exactly as the app would
    // receive it from storage or from a previous backend roundtrip.
    const bundleEditor = createConsentAccessEditor({
      initialBundle: draftBundle,
    });

    bundleEditor
      .selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model` })
      .patchActiveEntryClaims(exportConsentClaims(initialDecision, {
        identifier: `${EXAMPLE_CONSENT_IDENTIFIER}-view-model`,
        subject: EXAMPLE_SUBJECT_DID,
      }))
      .saveAndReleaseActiveEntry();

    // Step 4.
    // The app opens the consent screen, selects the stored Consent entry,
    // and projects it into one frontend-facing ConsentViewModel.
    const editor = createConsentAccessEditor({
      initialBundle: bundleEditor.getBundleInMemory(),
    });
    editor.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model` });

    const initialViewModel = editor.getConsentViewModel();

    // Step 5.
    // Assertions for the screen load:
    // the rendered view model must show the same persisted data the user is
    // supposed to see on first load.
    expect(initialViewModel.identifier).toBe(`${EXAMPLE_CONSENT_IDENTIFIER}-view-model`);
    expect(initialViewModel.subject).toBe(EXAMPLE_SUBJECT_DID);
    expect(initialViewModel.classifiedPurposes).toEqual([
      expect.objectContaining({
        code: EXAMPLE_CONSENT_PURPOSE_TREATMENT,
      }),
    ]);
    expect(initialViewModel.classifiedActors.users).toEqual([
      expect.objectContaining({
        email: EXAMPLE_EMAIL_PROFESSIONAL,
      }),
    ]);

    // Step 6.
    // Simulate what the user changes in the UI:
    // - change who receives access
    // - change the allowed purpose
    // - change the selected targets shown on screen
    const editedViewModel = {
      ...initialViewModel,
      classifiedActors: {
        jurisdictions: [],
        organizations: [{
          domain: EXAMPLE_PROVIDER_ORGANIZATION_DID.replace('did:web:', ''),
          departments: [],
          locations: [],
        }],
        users: [],
      },
      classifiedPurposes: [{
        code: EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
      }],
      classifiedTargets: [
        {
          target: {
            kind: 'section' as const,
            code: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
          },
          scopes: [{ code: 'r' as const }],
        },
        {
          target: {
            kind: 'section' as const,
            code: HealthcareDocumentTypes.IPS.attributeValue,
            sectionFamily: HealthcareCanonicalSectionFamilies.KindOfDocument,
          },
          scopes: [{ code: 'r' as const }],
        },
      ],
    };

    // Step 7.
    // Save the edited screen state back into the same Consent entry.
    // The app does not save the view model itself; it saves canonical Consent
    // claims through the editor.
    editor
      .applyConsentViewModel(editedViewModel)
      .saveAndReleaseActiveEntry();

    // Step 8.
    // Reopen the stored Consent exactly like the app would after save or on
    // the next screen load.
    const reloadedEditor = createConsentAccessEditor({
      initialBundle: editor.getBundleInMemory(),
    });
    reloadedEditor.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model` });

    const reloadedViewModel = reloadedEditor.getConsentViewModel();

    // Step 9.
    // Final didactic proof:
    // the user-facing view model now reflects persisted edited data, not just
    // an in-memory temporary object.
    expect(reloadedViewModel.classifiedPurposes).toEqual([
      expect.objectContaining({
        code: EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
      }),
    ]);
    expect(reloadedViewModel.classifiedTargets).toEqual(expect.arrayContaining([
      expect.objectContaining({
        target: expect.objectContaining({
          code: HealthcareBasicSections.PatientSummaryDocument.attributeValue,
        }),
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          code: HealthcareDocumentTypes.IPS.attributeValue,
          sectionFamily: HealthcareCanonicalSectionFamilies.KindOfDocument,
        }),
      }),
    ]));
    expect(reloadedViewModel.classifiedActors.organizations).toEqual([
      expect.objectContaining({
        domain: EXAMPLE_PROVIDER_ORGANIZATION_DID.replace('did:web:', ''),
      }),
    ]);
  });
});
