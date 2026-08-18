// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { HealthcareBasicSections } from '../constants/healthcare';
import { CommunicationCategoryCodes } from '../constants/communication';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { AllergyIntoleranceClaim } from '../models/interoperable-claims/allergy-intolerance-claims';
import { BundleEntry, BundleJsonApi } from '../models/bundle';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims';
import {
  BundleEntryClaimsContext,
  CommunicationClaimsContext,
} from '../models/communication-attached-bundle-session';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DATE,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
  EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_SUBJECT_DID,
} from './shared';
import {
  toClinicalResourceCardViews,
  toClinicalResourceCommonViews,
} from '../utils/clinical-resource-view';
import { CommunicationAttachedBundleSession } from '../utils/communication-attached-bundle-session';

export type IpsClinicalHistoryBundleExample = Readonly<{
  communicationClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
}>;

export type IpsBundleFrontCardsExample = Readonly<{
  communicationClaims: Record<string, unknown>;
  bundleInMemory: BundleJsonApi<BundleEntry>;
  medicationEntryIds: string[];
  allergyEntryIds: string[];
  conditionEntryIds: string[];
  cardViews: ReturnType<typeof toClinicalResourceCardViews>;
  commonViews: ReturnType<typeof toClinicalResourceCommonViews>;
}>;

/**
 * Builds a minimal IPS-like history bundle with common clinical resource types
 * authored as `resource.meta.claims`.
 */
export function buildIpsClinicalHistoryBundleExample(): IpsClinicalHistoryBundleExample {
  const clinicalBundleEditor = new CommunicationAttachedBundleSession({
    communicationClaims: {
      '@context': CommunicationClaimsContext,
      [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
      [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      [CommunicationClaim.Text]: EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
    },
  });

  clinicalBundleEditor.upsertActiveAllergyIntoleranceEntry({
    claims: {
      '@context': BundleEntryClaimsContext,
      [AllergyIntoleranceClaim.Identifier]: 'allergy-1',
      [AllergyIntoleranceClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|227493005',
      [AllergyIntoleranceClaim.Category]: HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
      [AllergyIntoleranceClaim.ClinicalStatus]: 'active',
      [AllergyIntoleranceClaim.VerificationStatus]: 'confirmed',
      [AllergyIntoleranceClaim.OnsetDateTime]: '2026-05-01T08:30:00Z',
      [AllergyIntoleranceClaim.Recorder]: 'did:web:clinic.example.org:member:allergist-1',
    },
    fullUrl: 'urn:uuid:allergy-1',
  });

  clinicalBundleEditor.upsertActiveConditionEntry({
    claims: {
      '@context': BundleEntryClaimsContext,
      [ConditionClaim.Identifier]: 'condition-1',
      [ConditionClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [ConditionClaim.Code]: 'http://snomed.info/sct|44054006',
      [ConditionClaim.Category]: HealthcareBasicSections.ProblemList.attributeValue,
      [ConditionClaim.ClinicalStatus]: 'active',
      [ConditionClaim.VerificationStatus]: 'confirmed',
      [ConditionClaim.OnsetDateTime]: '2026-05-03T09:00:00Z',
      [ConditionClaim.Recorder]: 'did:web:clinic.example.org:member:physician-1',
    },
    fullUrl: 'urn:uuid:condition-1',
  });

  clinicalBundleEditor.upsertActiveMedicationStatementEntry({
    claims: {
      '@context': BundleEntryClaimsContext,
      [MedicationStatementClaim.Identifier]: EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Category]: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
      [MedicationStatementClaim.Status]: EXAMPLE_MEDICATION_STATEMENT_STATUS,
      [MedicationStatementClaim.CodeText]: EXAMPLE_MEDICATION_STATEMENT_TEXT,
      [MedicationStatementClaim.Effective]: '2026-05-05',
    },
    fullUrl: `urn:uuid:${EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER}`,
  });

  clinicalBundleEditor.addContainedDocumentToActiveEntry({
    identifier: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
    attachmentContentType: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
    attachmentUrl: EXAMPLE_DOCUMENT_REFERENCE_URL,
    description: EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
    date: EXAMPLE_DOCUMENT_REFERENCE_DATE,
  });

  clinicalBundleEditor.saveAndReleaseActiveEntry();

  return {
    communicationClaims: clinicalBundleEditor.getCommunicationClaims(),
    bundleInMemory: clinicalBundleEditor.getBundleInMemory(),
  };
}

/**
 * Builds the bundle plus section-level ids and UI-friendly card/common views
 * for frontend resource cards.
 */
export function buildIpsBundleFrontCardsExample(): IpsBundleFrontCardsExample {
  const { communicationClaims, bundleInMemory } = buildIpsClinicalHistoryBundleExample();
  const clinicalBundleEditor = new CommunicationAttachedBundleSession({
    communicationClaims,
    initialBundle: bundleInMemory,
  });

  return {
    communicationClaims,
    bundleInMemory,
    medicationEntryIds: clinicalBundleEditor.getResourceIds({
      sections: [HealthcareBasicSections.HistoryOfMedicationUse.attributeValue],
      resourceTypes: [ResourceTypesFhirR4.MedicationStatement],
    }),
    allergyEntryIds: clinicalBundleEditor.getResourceIds({
      sections: [HealthcareBasicSections.AllergiesAndIntolerances.attributeValue],
      resourceTypes: [ResourceTypesFhirR4.AllergyIntolerance],
    }),
    conditionEntryIds: clinicalBundleEditor.getResourceIds({
      sections: [HealthcareBasicSections.ProblemList.attributeValue],
      resourceTypes: [ResourceTypesFhirR4.Condition],
    }),
    cardViews: toClinicalResourceCardViews(bundleInMemory),
    commonViews: toClinicalResourceCommonViews(bundleInMemory),
  };
}
