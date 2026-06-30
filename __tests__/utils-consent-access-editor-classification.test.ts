import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import {
  HealthcareCanonicalSectionFamilies,
  HealthcareActorRoleCodes,
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareDocumentTypes,
  HealthcareProfessionalRolesBySector,
  HealthcareRolesByFamily,
  HealthcareRoleFamilies,
  HealthcareSubjectMatterDomainSections,
  HealthcareTypeOfServiceSections,
  HealthcareConsentPurposes,
  ISCO08_CODING_SYSTEM,
} from '../src/constants/healthcare.js';
import { DataspaceSectors } from '../src/constants/sectors.js';
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
} from '../src/utils/communication-attached-bundle-session.js';
import { createConsentAccessEditor } from '../src/utils/communication-consent-access-editor.js';

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
          sectionFamily: HealthcareCanonicalSectionFamilies.KindOfDocument,
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

    expect(bundleEditor.getPurposesClassified()).toEqual([
      expect.objectContaining({ code: HealthcareConsentPurposes.Treatment }),
    ]);
    expect(bundleEditor.getRolesClassified().professional).toEqual([
      expect.objectContaining({
        codingSystem: ISCO08_CODING_SYSTEM,
        code: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
      }),
    ]);
    expect(bundleEditor.getAvailableProfessionalRolesBySector(DataspaceSectors.HealthCare)).toEqual(
      HealthcareProfessionalRolesBySector[DataspaceSectors.HealthCare],
    );
    const oneSelfRole = HealthcareRolesByFamily[HealthcareRoleFamilies.PersonalRelationshipHl7].ONESELF;
    expect(bundleEditor.getAvailableRelationshipRoles()).toEqual(
      expect.objectContaining({
        [oneSelfRole.code]: expect.objectContaining({
          family: HealthcareRoleFamilies.PersonalRelationshipHl7,
        }),
      }),
    );
    expect(bundleEditor.getResourceTypeCatalog()).not.toContain(ResourceTypesFhirR4.Bundle);
  });

  it('edits targets by family plus purposes and roles without exposing raw consent claim keys', () => {
    const bundleEditor = createConsentAccessEditor();
    const typeOfServiceCode = HealthcareTypeOfServiceSections['LP438240-6'].attributeValue;
    const alternateTypeOfServiceCode = Object.values(HealthcareTypeOfServiceSections)
      .find((section) => section.code !== 'LP438240-6')?.attributeValue as string;
    const subjectMatterCode = HealthcareSubjectMatterDomainSections['LP172918-7'].attributeValue;

    bundleEditor.upsertActiveConsentEntry({
      claims: {
        '@context': 'org.hl7.fhir.api',
        [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
        [ClaimConsent.decision]: ConsentDecisions.Permit,
        [ClaimConsent.action]: [
          HealthcareBasicSections.Results.attributeValue,
          typeOfServiceCode,
          subjectMatterCode,
        ].join(','),
        [ClaimConsent.category]: HealthcareDocumentTypes.IPS.attributeValue,
        [ClaimConsent.purpose]: HealthcareConsentPurposes.Treatment,
        [ClaimConsent.actorRole]: HealthcareActorRoles.Controller,
        [ClaimConsent.resourceType]: ResourceTypesFhirR4.DocumentReference,
      },
      fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
    });

    bundleEditor
      .setSelectedCoreSections([HealthcareBasicSections.HistoryOfMedicationUse.attributeValue])
      .addTypeOfServices([alternateTypeOfServiceCode])
      .removeTypeOfServices([typeOfServiceCode])
      .addSubjectMatterDomains([HealthcareSubjectMatterDomainSections['LP172919-5'].attributeValue])
      .setSelectedKindOfDocuments([HealthcareDocumentTypes.IPS.attributeValue])
      .setSelectedResourceTypes([ResourceTypesFhirR4.DocumentReference, ResourceTypesFhirR4.Observation])
      .setSelectedPurposes([HealthcareConsentPurposes.Treatment])
      .addPurposes([HealthcareConsentPurposes.Operations])
      .setSelectedRoles([HealthcareActorRoles.Controller])
      .addRoles([HealthcareActorRoles.GeneralistMedicalPractitioner])
      .removeRoles([HealthcareActorRoles.Controller]);

    expect(bundleEditor.getSelectedCoreSections()).toEqual([
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
    expect(bundleEditor.getSelectedKindOfDocuments()).toEqual([
      HealthcareDocumentTypes.IPS.attributeValue,
    ]);
    expect(bundleEditor.getSelectedTypeOfServices()).toEqual([
      alternateTypeOfServiceCode,
    ]);
    expect(bundleEditor.getSelectedSubjectMatterDomains()).toEqual([
      subjectMatterCode,
      HealthcareSubjectMatterDomainSections['LP172919-5'].attributeValue,
    ]);
    expect(bundleEditor.getSelectedResourceTypes()).toEqual([
      ResourceTypesFhirR4.DocumentReference,
      ResourceTypesFhirR4.Observation,
    ]);
    expect(bundleEditor.getSelectedPurposes()).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.Operations,
    ]);
    expect(bundleEditor.getSelectedRoles()).toEqual([
      HealthcareActorRoles.GeneralistMedicalPractitioner,
    ]);
    expect(bundleEditor.getCoreSectionOptions()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        target: expect.objectContaining({
          code: HealthcareBasicSections.Results.attributeValue,
          sectionFamily: HealthcareCanonicalSectionFamilies.CoreSection,
        }),
      }),
    ]));
    expect(bundleEditor.getKindOfDocumentOptions()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        target: expect.objectContaining({
          sectionFamily: HealthcareCanonicalSectionFamilies.KindOfDocument,
        }),
      }),
    ]));
    expect(bundleEditor.getCoreSectionCatalog()).toEqual(expect.objectContaining({
      [HealthcareBasicSections.Results.code]: expect.objectContaining({
        attributeValue: HealthcareBasicSections.Results.attributeValue,
      }),
    }));
  });
});
