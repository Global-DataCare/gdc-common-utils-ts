import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import {
  HealthcareCanonicalSectionFamilies,
  HealthcareActorRoleCodes,
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareDocumentTypes,
  ISCO08_CODING_SYSTEM,
} from '../src/constants/healthcare.js';
import {
  EXAMPLE_CONSENT_ACCESS_RULES,
} from '../src/examples/consent-access.js';
import {
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
} from '../src/examples/shared.js';
import { ClaimConsent, ConsentDecisions } from '../src/models/consent-rule.js';
import {
  ConsentEditorScopeCodes,
  ConsentEditorTargetKinds,
  createConsentAccessEditor,
} from '../src/utils/communication-attached-bundle-session.js';

describe('ConsentAccessEditor classification helpers', () => {
  it('classifies permit, targets, and actors from the current consent claim contract', () => {
    const bundleEditor = createConsentAccessEditor();
    const actorIdentifiers = [
      EXAMPLE_EMAIL_PROFESSIONAL,
      EXAMPLE_PROVIDER_ORGANIZATION_DID,
      EXAMPLE_HEALTHCARE_JURISDICTION,
    ].join(',');

    bundleEditor.upsertActiveConsentEntry({
      claims: {
        ...EXAMPLE_CONSENT_ACCESS_RULES.physicianByOrganizationContinuousCare,
        [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
        [ClaimConsent.decision]: ConsentDecisions.Permit,
        [ClaimConsent.actorIdentifier]: actorIdentifiers,
        [ClaimConsent.actorRole]: HealthcareActorRoles.GeneralistMedicalPractitioner,
        [ClaimConsent.action]: HealthcareBasicSections.Results.attributeValue,
        [ClaimConsent.category]: HealthcareDocumentTypes.IPS.attributeValue,
        [ClaimConsent.resourceType]: [
          ResourceTypesFhirR4.DocumentReference,
          ResourceTypesFhirR4.MedicationStatement,
        ].join(','),
      },
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    expect(bundleEditor.getDecision()).toBe(ConsentDecisions.Permit);

    const classifiedTargets = bundleEditor.getTargetsClassified();
    expect(classifiedTargets).toEqual(expect.arrayContaining([
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.Section,
          code: HealthcareBasicSections.Results.attributeValue,
          sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
        }),
        scopes: [expect.objectContaining({ code: ConsentEditorScopeCodes.Read })],
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.Section,
          code: HealthcareDocumentTypes.IPS.attributeValue,
          sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
        }),
        scopes: [expect.objectContaining({ code: ConsentEditorScopeCodes.Read })],
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          kind: ConsentEditorTargetKinds.ResourceType,
          code: ResourceTypesFhirR4.DocumentReference,
        }),
        scopes: [expect.objectContaining({ code: ConsentEditorScopeCodes.Read })],
      }),
    ]));

    const classifiedActors = bundleEditor.getActorsClassified();
    expect(classifiedActors.jurisdictions).toEqual([
      expect.objectContaining({ code: EXAMPLE_HEALTHCARE_JURISDICTION }),
    ]);
    expect(classifiedActors.organizations).toEqual([
      expect.objectContaining({
        domain: EXAMPLE_PROVIDER_ORGANIZATION_DID.replace('did:web:', ''),
      }),
    ]);
    expect(classifiedActors.users).toEqual([
      expect.objectContaining({
        email: EXAMPLE_EMAIL_PROFESSIONAL,
        role: expect.objectContaining({
          codingSystem: ISCO08_CODING_SYSTEM,
          code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
        }),
      }),
    ]);
  });
});
