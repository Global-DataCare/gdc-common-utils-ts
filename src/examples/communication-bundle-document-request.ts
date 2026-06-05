// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { DocumentTypeLoincOntology, HealthcareActorRoles, HealthcareBasicSections } from '../constants/healthcare';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import {
  BundleDocumentRequesterKinds,
  communication,
  buildBundleDocumentRequestCommunicationPayload,
  createSummaryOperationRequestParameters,
  createSummaryOperationRequestParametersResource,
  createSummaryOperationRequestReferencePath,
} from '../utils/communication-bundle-document-request';
import {
  EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_SUBJECT_DID,
} from './shared';

export function buildExampleIpsBundleDocumentRequestFromController() {
  const summaryOperationRequestParameters = createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID);
  const summaryOperationRequestReferencePath = createSummaryOperationRequestReferencePath(
    summaryOperationRequestParameters,
  );
  const claims = communication.newSearchWithReferencePath({
    subjectDid: EXAMPLE_SUBJECT_DID,
    sender: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
    requesterKind: BundleDocumentRequesterKinds.Controller,
    requesterIdentifier: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
    requesterRole: HealthcareActorRoles.Controller,
    documentType: DocumentTypeLoincOntology.IPS,
    summaryOperationRequestReferencePath,
  });

  return buildBundleDocumentRequestCommunicationPayload({
    subjectDid: EXAMPLE_SUBJECT_DID,
    sender: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
    requesterKind: BundleDocumentRequesterKinds.Controller,
    requesterIdentifier: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
    requesterRole: HealthcareActorRoles.Controller,
    documentType: DocumentTypeLoincOntology.IPS,
    text: String(claims[CommunicationClaim.Text] || ''),
    noteText: String(claims[CommunicationClaim.NoteText] || ''),
    summaryOperationRequestReferencePath: String(claims[CommunicationClaim.ContentReference] || ''),
  });
}

export function buildExampleIpsBundleDocumentRequestFromDoctor() {
  const sections = [
    HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
    HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
  ];
  const summaryOperationRequestParameters = createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID, sections);
  const summaryOperationRequestReferencePath = createSummaryOperationRequestReferencePath(
    summaryOperationRequestParameters,
  );
  const claims = communication.newSearchWithReferencePath({
    subjectDid: EXAMPLE_SUBJECT_DID,
    sender: EXAMPLE_EMAIL_PROFESSIONAL,
    requesterKind: BundleDocumentRequesterKinds.Employee,
    requesterIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
    requesterRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    documentType: DocumentTypeLoincOntology.IPS,
    sections,
    summaryOperationRequestReferencePath,
  });

  return buildBundleDocumentRequestCommunicationPayload({
    subjectDid: EXAMPLE_SUBJECT_DID,
    sender: EXAMPLE_EMAIL_PROFESSIONAL,
    requesterKind: BundleDocumentRequesterKinds.Employee,
    requesterIdentifier: EXAMPLE_EMAIL_PROFESSIONAL,
    requesterRole: HealthcareActorRoles.GeneralistMedicalPractitioner,
    documentType: DocumentTypeLoincOntology.IPS,
    sections,
    text: String(claims[CommunicationClaim.Text] || ''),
    noteText: String(claims[CommunicationClaim.NoteText] || ''),
    summaryOperationRequestReferencePath: String(claims[CommunicationClaim.ContentReference] || ''),
  });
}

export function buildExampleIpsSummaryOperationRequestFromController() {
  const claims = communication.setRequestSummaryOperation({
    subjectId: EXAMPLE_SUBJECT_DID,
    requesterId: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  });

  return {
    claims,
    parametersResource: createSummaryOperationRequestParametersResource(
      createSummaryOperationRequestParameters(EXAMPLE_SUBJECT_DID),
    ),
  };
}
