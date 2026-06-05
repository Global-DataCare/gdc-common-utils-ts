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
    const draftBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(ResourceTypesFhirR4.Consent)
      .newEntry(`${EXAMPLE_COMMUNICATION_IDENTIFIER}-consent-view-model`)
      .setFullUrl(`urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model`)
      .doneEntry()
      .buildJsonApi();

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

    const editor = createConsentAccessEditor({
      initialBundle: bundleEditor.getBundleInMemory(),
    });
    editor.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model` });

    const initialViewModel = editor.getConsentViewModel();
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

    editor
      .applyConsentViewModel(editedViewModel)
      .saveAndReleaseActiveEntry();

    const reloadedEditor = createConsentAccessEditor({
      initialBundle: editor.getBundleInMemory(),
    });
    reloadedEditor.selectActiveEntry({ fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}-view-model` });

    const reloadedViewModel = reloadedEditor.getConsentViewModel();
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
