// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import {
  HealthcareBasicSections,
  HealthcareCanonicalSectionFamilies,
  HealthcareConsentPurposes,
  HealthcareCoreSections,
  HealthcareKindOfDocumentSections,
} from '../constants/healthcare';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { CommunicationCategoryCodes } from '../constants/communication';
import { DataspaceSectors } from '../constants/sectors';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import { BundleEntry, BundleJsonApi } from '../models/bundle';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_DATE,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_PERIOD_END,
  EXAMPLE_CONSENT_PERIOD_START,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_CONSENT_PURPOSE_EMERGENCY_TREATMENT,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
  EXAMPLE_SECONDARY_HEALTHCARE_JURISDICTION,
  EXAMPLE_SUBJECT_DID,
} from './shared';
import {
  CommunicationAttachedBundleSession,
  CommunicationClaimsContext,
  BundleEntryClaimsContext,
} from '../utils/communication-attached-bundle-session';
import {
  createConsentAccessEditor,
} from '../utils/communication-consent-access-editor';
import {
  setCommunicationCategory,
  setCommunicationIdentifier,
  setCommunicationSubject,
  setCommunicationText,
  setCommunicationTopic,
} from '../claims/claims-helpers-communication';
import {
  setActorIdentifierList,
  setActorRoleList,
  setConsentDate,
  setConsentDecision,
  setConsentIdentifier,
  setConsentPeriodEnd,
  setConsentPeriodStart,
  setConsentSubject,
  setPurposeList,
  setSectionList,
} from '../claims/claims-helpers-consent';
import { setClaimValues } from '../claims/claim-list-helpers';
import { ClaimConsent, ConsentDecisions } from '../models/consent-rule';
import {
  exportConsentEntry,
  importPermissionTemplate,
  PermissionTemplateOperationCodes,
  PermissionTemplateTargetKinds,
  type PermissionGrantDecision,
  type PermissionTemplateTarget,
  resolvePermissionTemplate,
} from '../utils/permission-templates';

const CONSENT_BUNDLE_COMMUNICATION_TOPIC =
  HealthcareKindOfDocumentSections['LP173394-0'].attributeValue;

/**
 * First developer use case:
 * - edit a Consent entry inside a Communication-attached Bundle
 * - keep active entry in memory
 * - serialize full Bundle to Communication.content-attachment-data on save
 * - release active entry memory when finished
 */
export function buildConsentEditingCommunicationSessionExample(): {
  communicationClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
} {
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
  communicationClaims = setCommunicationTopic(
    communicationClaims,
    CONSENT_BUNDLE_COMMUNICATION_TOPIC,
  );
  communicationClaims = setCommunicationText(
    communicationClaims,
    EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  );

  const consentBundleEditor = new CommunicationAttachedBundleSession({
    communicationClaims,
  });

  let consentClaims: Record<string, unknown> = { '@context': BundleEntryClaimsContext };
  consentClaims = setConsentDecision(consentClaims, ConsentDecisions.Permit);
  consentClaims = setConsentSubject(consentClaims, EXAMPLE_SUBJECT_DID);
  consentClaims = setConsentIdentifier(consentClaims, EXAMPLE_CONSENT_IDENTIFIER);
  consentClaims = setConsentDate(consentClaims, EXAMPLE_CONSENT_DATE);
  consentClaims = setConsentPeriodStart(consentClaims, EXAMPLE_CONSENT_PERIOD_START);
  consentClaims = setConsentPeriodEnd(consentClaims, EXAMPLE_CONSENT_PERIOD_END);
  consentClaims = setPurposeList(consentClaims, [EXAMPLE_CONSENT_PURPOSE_TREATMENT]);
  consentClaims = setSectionList(consentClaims, [
    HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
  ]);
  consentClaims = setActorIdentifierList(consentClaims, [EXAMPLE_EMAIL_PROFESSIONAL]);
  consentClaims = setActorRoleList(consentClaims, [EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN]);

  consentBundleEditor.upsertActiveConsentEntry({
    claims: consentClaims,
    fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
  });

  consentBundleEditor.saveAndReleaseActiveEntry();

  return {
    communicationClaims: consentBundleEditor.getCommunicationClaims(),
    bundleInMemory: consentBundleEditor.getBundleInMemory(),
  };
}

/**
 * Second developer use case:
 * - edit MedicationStatement claims to drive a health view
 * - keep bundle attached to Communication as base64 payload
 * - apply save/release lifecycle consistently
 */
export function buildMedicationEditingCommunicationSessionExample(): {
  communicationClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
} {
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
    CommunicationCategoryCodes.Reminder.attributeValue,
  );
  communicationClaims = setCommunicationText(
    communicationClaims,
    EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  );

  const clinicalBundleEditor = new CommunicationAttachedBundleSession({
    communicationClaims,
  });

  clinicalBundleEditor.upsertActiveMedicationStatementEntry({
    claims: {
      '@context': BundleEntryClaimsContext,
      [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
      [MedicationStatementClaim.CodeText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
    },
    fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
  });

  clinicalBundleEditor.saveAndReleaseActiveEntry();

  return {
    communicationClaims: clinicalBundleEditor.getCommunicationClaims(),
    bundleInMemory: clinicalBundleEditor.getBundleInMemory(),
  };
}

/**
 * Template-shaped import/export example for consent permission editing.
 *
 * The flow starts from a reusable permission draft, exports the draft into
 * canonical consent claims, stores one active Consent entry in the
 * Communication-attached bundle, and then reloads the saved bundle to prove
 * the roundtrip keeps the same claims.
 */
export function buildConsentPermissionTemplateImportExportSessionExample(): {
  templateDraft: Readonly<{
    decision: string;
    purposes: readonly string[];
    actorIdentifiers: readonly string[];
    actorRoles: readonly string[];
    sections: readonly string[];
    resourceTypes: readonly string[];
  }>;
  consentClaims: Record<string, unknown>;
  importedConsentClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
} {
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
  communicationClaims = setCommunicationTopic(
    communicationClaims,
    CONSENT_BUNDLE_COMMUNICATION_TOPIC,
  );
  communicationClaims = setCommunicationText(
    communicationClaims,
    EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  );

  const templateDraft = {
    decision: ConsentDecisions.Permit,
    purposes: [
      EXAMPLE_CONSENT_PURPOSE_TREATMENT,
      HealthcareConsentPurposes.EmergencyTreatment,
      EXAMPLE_CONSENT_PURPOSE_TREATMENT,
    ],
    actorIdentifiers: [
      EXAMPLE_EMAIL_PROFESSIONAL,
      EXAMPLE_PROVIDER_ORGANIZATION_DID,
      EXAMPLE_HEALTHCARE_JURISDICTION,
      EXAMPLE_EMAIL_PROFESSIONAL,
    ],
    actorRoles: [
      EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
      EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
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
  consentClaims = setConsentSubject(consentClaims, EXAMPLE_SUBJECT_DID);
  consentClaims = setConsentIdentifier(consentClaims, EXAMPLE_CONSENT_IDENTIFIER);
  consentClaims = setConsentDate(consentClaims, EXAMPLE_CONSENT_DATE);
  consentClaims = setConsentPeriodStart(consentClaims, EXAMPLE_CONSENT_PERIOD_START);
  consentClaims = setConsentPeriodEnd(consentClaims, EXAMPLE_CONSENT_PERIOD_END);
  consentClaims = setPurposeList(consentClaims, templateDraft.purposes);
  consentClaims = setActorIdentifierList(consentClaims, templateDraft.actorIdentifiers);
  consentClaims = setActorRoleList(consentClaims, templateDraft.actorRoles);
  consentClaims = setSectionList(consentClaims, templateDraft.sections);
  consentClaims = setClaimValues(consentClaims, ClaimConsent.resourceType, templateDraft.resourceTypes);

  const consentBundleEditor = createConsentAccessEditor({
    communicationClaims,
  });

  consentBundleEditor.upsertActiveConsentEntry({
    claims: consentClaims,
    fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
  });
  consentBundleEditor.saveAndReleaseActiveEntry();

  const reloadedEditor = createConsentAccessEditor({
    communicationClaims: consentBundleEditor.getCommunicationClaims(),
  });
  reloadedEditor.selectActiveEntry({
    fullUrl: `urn:uuid:${EXAMPLE_CONSENT_IDENTIFIER}`,
  });

  return {
    templateDraft,
    consentClaims,
    importedConsentClaims: {
      ...(reloadedEditor.getActiveEntry()?.resource?.meta?.claims || {}),
    },
    bundleInMemory: reloadedEditor.getBundleInMemory(),
  };
}

/**
 * Complementary helper for tests/examples that need one already-assembled
 * three-consent permission bundle.
 *
 * This helper is intentionally not the 101 teaching path. The 101 path should
 * exercise the public APIs step by step. This helper exists for complementary
 * deterministic coverage and reusable fixtures.
 */
export function buildSeparateConsentPermissionBundleExample(): {
  decisions: readonly PermissionGrantDecision[];
  bundleInMemory: BundleJsonApi<BundleEntry>;
  communicationClaims: Record<string, unknown>;
} {
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
  communicationClaims = setCommunicationTopic(
    communicationClaims,
    CONSENT_BUNDLE_COMMUNICATION_TOPIC,
  );
  communicationClaims = setCommunicationText(
    communicationClaims,
    EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  );

  const physicianTemplate = resolvePermissionTemplate({
    sector: DataspaceSectors.HealthCare,
    roleClaim: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  });

  const ipsCoreTargets: PermissionTemplateTarget[] = Array.from(new Set(
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

  return {
    decisions,
    communicationClaims: consentBundleEditor.getCommunicationClaims(),
    bundleInMemory: consentBundleEditor.getBundleInMemory(),
  };
}
