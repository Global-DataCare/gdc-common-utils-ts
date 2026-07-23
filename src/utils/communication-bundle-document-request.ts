// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { CommunicationCategoryCodes } from '../constants/communication';
import { DocumentTypeLoincOntology, HealthcareDocumentTypes } from '../constants/healthcare';
import type { ParameterData, TokenSearchParameter } from '../models/params';
import { parseActorFromSub } from './actor';
import { getBaseUrlFromDidWeb } from './did';
import { buildFhirParametersResourceFromParameterData, FhirParametersResource } from './fhir-search';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { transformCommunicationClaimsToResourceFhirR4 } from './communication-fhir-r4';

export const BundleDocumentRequesterKinds = Object.freeze({
  Controller: 'controller',
  Employee: 'employee',
  RelatedPerson: 'related-person',
} as const);

export type BundleDocumentRequesterKind =
  typeof BundleDocumentRequesterKinds[keyof typeof BundleDocumentRequesterKinds];

export const BundleDocumentRequestMessageTypes = Object.freeze({
  CommunicationRequestSearchWithReferenceUrl: 'Communication-request-search-with-reference-url-v1.0',
} as const);

export type BundleDocumentTypeKey = keyof typeof HealthcareDocumentTypes;

export type BuildBundleDocumentRequestCommunicationInput = Readonly<{
  subjectDid: string;
  sender: string;
  requesterKind: BundleDocumentRequesterKind;
  requesterIdentifier?: string;
  requesterRole?: string;
  recipient?: string | string[];
  communicationIdentifier?: string;
  thid?: string;
  sent?: string;
  status?: string;
  documentType?: BundleDocumentTypeKey;
  sections?: string[];
  summaryOperationRequestReferencePath?: string;
  text?: string;
  noteText?: string;
}>;

export type BundleDocumentRequestCommunicationPayload = Readonly<{
  thid?: string;
  body: Readonly<{
    data: ReadonlyArray<{
      type: string;
      meta: {
        claims: Record<string, unknown>;
      };
      resource: Record<string, unknown>;
    }>;
  }>;
}>;

export const IpsSummaryParameterNames = Object.freeze({
  Subject: 'subject',
  DocumentType: 'document-type',
  Section: 'section',
} as const);

export type CreateSummaryOperationParametersInput = Readonly<{
  subjectId: string;
  filterSections?: string[];
  documentType?: BundleDocumentTypeKey;
}>;

export type CreateSummaryOperationRequestReferenceUrlInput = Readonly<{
  providerSectorDidWeb: string;
  summaryOperationRequestReferencePath: string;
}>;

export type CreateDidcommSearchWithReferenceUrlInput = Readonly<{
  subjectId: string;
  requesterId: string;
  providerSectorDidWeb?: string;
  filterSections?: string[];
  documentType?: BundleDocumentTypeKey;
  communicationIdentifier?: string;
  recipient?: string | string[];
  thid?: string;
  sent?: string;
  status?: string;
  text?: string;
  noteText?: string;
}>;

export type CreateIpsSummarySearchCommunicationInput = Readonly<{
  subjectId: string;
  requesterId: string;
  communicationIdentifier?: string;
  recipient?: string | string[];
  thid?: string;
  sent?: string;
  status?: string;
  text?: string;
  noteText?: string;
  filterSections?: string[];
}>;

export type CreateSummaryOperationCommunicationInput = Readonly<{
  subjectId: string;
  requesterId: string;
  communicationIdentifier?: string;
  recipient?: string | string[];
  thid?: string;
  sent?: string;
  status?: string;
  text?: string;
  noteText?: string;
  filterSections?: string[];
  documentType?: BundleDocumentTypeKey;
  operationPath?: string;
}>;

export const SummaryOperationCommunicationDefaults = Object.freeze({
  AttachmentType: 'application/fhir+json',
  AttachmentTitle: 'summary-operation-parameters.json',
  OperationPath: 'individual/org.hl7.fhir.api/Subject/$summary',
} as const);

/**
 * Builds canonical flat claims for a `Communication` that requests a bundle
 * search by reference URL.
 *
 * Policy note:
 * - this helper does not create or infer consent records
 * - controller self-access should be handled by runtime/business policy, not
 *   by auto-creating a synthetic default consent
 * - employee or related-person access should rely on explicit consent or an
 *   equivalent membership policy outside this low-level helper
 */
export function buildBundleDocumentRequestCommunicationClaims(
  input: BuildBundleDocumentRequestCommunicationInput,
): Record<string, unknown> {
  const subjectDid = String(input.subjectDid || '').trim();
  const sender = String(input.sender || '').trim();
  const requesterKind = String(input.requesterKind || '').trim() as BundleDocumentRequesterKind;
  const documentType = input.documentType || 'IPS';
  const sections = normalizeStringArray(input.sections);
  const ipsSummaryParameters = createSummaryOperationParameters({
    subjectId: subjectDid,
    filterSections: sections,
    documentType,
  });
  const summaryOperationRequestReferencePath = String(
    input.summaryOperationRequestReferencePath || createSummaryOperationRequestReferencePath(ipsSummaryParameters),
  ).trim();
  const recipient = normalizeRecipient(input.recipient);
  const sent = String(input.sent || new Date().toISOString()).trim();
  const communicationIdentifier = String(input.communicationIdentifier || `urn:uuid:${runtimeUuid('bundle-document-request')}`).trim();

  if (!subjectDid) {
    throw new Error('buildBundleDocumentRequestCommunicationClaims requires subjectDid.');
  }
  if (!sender) {
    throw new Error('buildBundleDocumentRequestCommunicationClaims requires sender.');
  }
  if (!requesterKind || !Object.values(BundleDocumentRequesterKinds).includes(requesterKind)) {
    throw new Error(`buildBundleDocumentRequestCommunicationClaims requires a valid requesterKind. Allowed: ${Object.values(BundleDocumentRequesterKinds).join(', ')}`);
  }
  const documentTypeDescriptor = HealthcareDocumentTypes[documentType];

  const includeAllSections = sections.length === 0;
  const text = String(
    input.text
    || (
      includeAllSections
        ? `Request ${documentTypeDescriptor.id} Bundle search`
        : `Request ${documentTypeDescriptor.id} Bundle search with sections: ${sections.join(', ')}`
    ),
  ).trim();
  const noteText = String(input.noteText || text).trim();

  const claims: Record<string, unknown> = {
    '@context': 'org.hl7.fhir.r4',
    [CommunicationClaim.Identifier]: communicationIdentifier,
    [CommunicationClaim.Status]: String(input.status || 'completed').trim(),
    [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
    [CommunicationClaim.Subject]: subjectDid,
    [CommunicationClaim.Sender]: sender,
    [CommunicationClaim.Sent]: sent,
    [CommunicationClaim.Text]: text,
    [CommunicationClaim.NoteText]: noteText,
    [CommunicationClaim.ContentReference]: summaryOperationRequestReferencePath,
  };

  if (recipient) {
    claims[CommunicationClaim.Recipient] = recipient;
  }
  return claims;
}

/**
 * Builds a FHIR R4 `Communication` resource carrying the bundle-document
 * search request claims in `resource.meta.claims`.
 */
export function buildBundleDocumentRequestCommunicationResourceFhirR4(
  input: BuildBundleDocumentRequestCommunicationInput,
): Record<string, unknown> {
  const claims = buildBundleDocumentRequestCommunicationClaims(input);
  const result = transformCommunicationClaimsToResourceFhirR4(
    [claims],
    {
      mode: 'strict',
      defaultStatus: String(input.status || 'completed').trim(),
    },
  );
  return result.resources[0] || {};
}

/**
 * Builds the canonical `body.data[]` payload wrapper used by frontend/backend
 * callers that submit a request `Communication` through gateway runtime flows.
 */
export function buildBundleDocumentRequestCommunicationPayload(
  input: BuildBundleDocumentRequestCommunicationInput,
): BundleDocumentRequestCommunicationPayload {
  const claims = buildBundleDocumentRequestCommunicationClaims(input);
  const resource = buildBundleDocumentRequestCommunicationResourceFhirR4(input);

  return {
    thid: input.thid,
    body: {
      data: [
        {
          type: BundleDocumentRequestMessageTypes.CommunicationRequestSearchWithReferenceUrl,
          meta: { claims },
          resource,
        },
      ],
    },
  };
}

/**
 * Creates a DIDComm-ready payload whose `Communication.content-reference`
 * already contains the relative search path for the requested document type.
 *
 * This is the short-path helper for app/backend developers who already know the
 * requester DID and only need a `Communication` ready to travel inside the
 * current DIDComm submission flow.
 */
export function createDidcommSearchWithReferenceUrlMessage(
  input: CreateDidcommSearchWithReferenceUrlInput,
): BundleDocumentRequestCommunicationPayload {
  const requesterId = String(input.requesterId || '').trim();
  const parsedActor = parseActorFromSub(requesterId);
  const requesterKind = inferRequesterKindFromActorSub(requesterId);
  const summaryOperationRequestParameters = createSummaryOperationRequestParameters({
    subjectId: input.subjectId,
    filterSections: input.filterSections,
    documentType: input.documentType || DocumentTypeLoincOntology.IPS,
  });
  const summaryOperationRequestReferencePath = createSummaryOperationRequestReferencePath(
    summaryOperationRequestParameters,
  );

  return buildBundleDocumentRequestCommunicationPayload({
    subjectDid: String(input.subjectId || '').trim(),
    sender: requesterId,
    requesterKind,
    requesterIdentifier: parsedActor.identifier || requesterId,
    requesterRole: parsedActor.role,
    recipient: input.recipient,
    communicationIdentifier: input.communicationIdentifier,
    thid: input.thid,
    sent: input.sent,
    status: input.status,
    documentType: input.documentType || DocumentTypeLoincOntology.IPS,
    sections: input.filterSections,
    summaryOperationRequestReferencePath,
    text: input.text,
    noteText: input.noteText,
  });
}

/**
 * Creates the IPS-summary search `Communication` claims that frontend code can
 * send today. The caller provides the already-built
 * `summaryOperationRequestReferencePath`, and the helper fills the canonical
 * FHIR `Communication.*` claims around it.
 */
export function createIpsSummarySearchCommunicationClaims(
  input: CreateIpsSummarySearchCommunicationInput,
): Record<string, unknown> {
  const requesterId = String(input.requesterId || '').trim();
  const parsedActor = parseActorFromSub(requesterId);
  const summaryOperationRequestParameters = createSummaryOperationRequestParameters({
    subjectId: String(input.subjectId || '').trim(),
    filterSections: input.filterSections,
    documentType: DocumentTypeLoincOntology.IPS,
  });
  const summaryOperationRequestReferencePath = createSummaryOperationRequestReferencePath(
    summaryOperationRequestParameters,
  );
  return buildBundleDocumentRequestCommunicationClaims({
    subjectDid: String(input.subjectId || '').trim(),
    sender: requesterId,
    requesterKind: inferRequesterKindFromActorSub(requesterId),
    requesterIdentifier: parsedActor.identifier || requesterId,
    requesterRole: parsedActor.role,
    recipient: input.recipient,
    communicationIdentifier: input.communicationIdentifier,
    thid: input.thid,
    sent: input.sent,
    status: input.status,
    documentType: DocumentTypeLoincOntology.IPS,
    sections: input.filterSections,
    summaryOperationRequestReferencePath,
    text: input.text,
    noteText: input.noteText,
  });
}

/**
 * Creates the DIDComm-ready message that wraps an IPS-summary search
 * `Communication` for the current gateway flow.
 */
export function createIpsSummarySearchDidcommMessage(
  input: CreateIpsSummarySearchCommunicationInput,
): BundleDocumentRequestCommunicationPayload {
  const claims = createIpsSummarySearchCommunicationClaims(input);
  const resource = transformCommunicationClaimsToResourceFhirR4(
    [claims],
    {
      mode: 'strict',
      defaultStatus: String(input.status || 'completed').trim(),
    },
  ).resources[0] || {};

  return {
    thid: input.thid,
    body: {
      data: [
        {
          type: BundleDocumentRequestMessageTypes.CommunicationRequestSearchWithReferenceUrl,
          meta: { claims },
          resource,
        },
      ],
    },
  };
}

export function buildBundleSearchReferenceUrl(input: Readonly<{
  subjectDid: string;
  documentTypeAttributeValue: string;
  sections?: string[];
}>): string {
  return createSummaryOperationRequestReferencePath([
    buildSubjectParameter(input.subjectDid),
    buildDocumentTypeParameterFromAttributeValue(input.documentTypeAttributeValue),
    ...buildSectionParameters(input.sections),
  ]);
}

/**
 * Creates the canonical semantic parameters for an IPS summary-style request.
 *
 * These parameters are the source of truth. The canonical `$summary` read
 * attaches them as one FHIR `Parameters` resource to an auditable
 * `Communication`. Flattening them into a `Bundle/_search` reference is a
 * compatibility path and must not be taught as the primary 101 read flow.
 */
export function createSummaryOperationRequestParameters(
  subjectIdOrInput: string | CreateSummaryOperationParametersInput,
  filterSections?: string[],
): ReadonlyArray<ParameterData> {
  const input = typeof subjectIdOrInput === 'string'
    ? { subjectId: subjectIdOrInput, filterSections }
    : subjectIdOrInput;
  const subjectDid = String(input.subjectId || '').trim();
  const documentType = input.documentType || 'IPS';
  const documentTypeDescriptor = HealthcareDocumentTypes[documentType];
  if (!subjectDid) {
    throw new Error('createSummaryOperationRequestParameters requires subjectId.');
  }
  if (!documentTypeDescriptor) {
    throw new Error(`Unsupported documentType: ${String(documentType)}`);
  }
  const sections = normalizeStringArray(input.filterSections);
  if (sections.includes('*')) {
    throw new Error(
      'Omit filterSections to request all available sections; "*" is reserved for SMART permission scopes.',
    );
  }

  return [
    buildSubjectParameter(subjectDid),
    buildDocumentTypeParameter(documentTypeDescriptor.id, documentTypeDescriptor.attributeValue),
    ...buildSectionParameters(sections),
  ];
}

/**
 * Flattens semantic summary-operation parameters to the relative `Bundle/_search`
 * path currently stored in `Communication.content-reference`.
 */
export function createSummaryOperationRequestReferencePath(
  parameters: ReadonlyArray<ParameterData>,
): string {
  const params = ['type=document'];
  for (const parameter of parameters) {
    const name = String(parameter?.name || '').trim();
    if (!name) {
      continue;
    }
    if (name === IpsSummaryParameterNames.Subject) {
      params.push(`composition.subject=${String(parameter.value || '').trim()}`);
      continue;
    }
    if (name === IpsSummaryParameterNames.DocumentType) {
      const tokenValue = flattenTokenParameter(parameter);
      params.push(`composition.type=${tokenValue}`);
      continue;
    }
    if (name === IpsSummaryParameterNames.Section) {
      params.push(`composition.section=${String(parameter.value || '').trim()}`);
    }
  }
  return `individual/org.hl7.fhir.r4/Bundle/_search?${params.filter(Boolean).join('&')}`;
}

/**
 * Builds the canonical FHIR `Parameters` body attached to a `$summary`
 * request `Communication`.
 */
export function createSummaryOperationRequestParametersResource(
  parameters: ReadonlyArray<ParameterData>,
): FhirParametersResource {
  return buildFhirParametersResourceFromParameterData(parameters);
}

function encodeJsonAttachmentData(payload: unknown): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
}

export function buildCommunicationRequestOperationWithAttachedParametersClaims(
  input: CreateSummaryOperationCommunicationInput,
): Record<string, unknown> {
  const requesterId = String(input.requesterId || '').trim();
  const parsedActor = parseActorFromSub(requesterId);
  const requesterKind = inferRequesterKindFromActorSub(requesterId);
  const summaryOperationRequestParameters = createSummaryOperationRequestParameters({
    subjectId: String(input.subjectId || '').trim(),
    filterSections: input.filterSections,
    documentType: input.documentType || DocumentTypeLoincOntology.IPS,
  });
  const attachmentResource =
    createSummaryOperationRequestParametersResource(summaryOperationRequestParameters);
  const operationPath = String(
    input.operationPath || SummaryOperationCommunicationDefaults.OperationPath,
  ).trim();

  const claims = buildBundleDocumentRequestCommunicationClaims({
    subjectDid: String(input.subjectId || '').trim(),
    sender: requesterId,
    requesterKind,
    requesterIdentifier: parsedActor.identifier || requesterId,
    requesterRole: parsedActor.role,
    recipient: input.recipient,
    communicationIdentifier: input.communicationIdentifier,
    thid: input.thid,
    sent: input.sent,
    status: input.status,
    documentType: input.documentType || DocumentTypeLoincOntology.IPS,
    sections: input.filterSections,
    summaryOperationRequestReferencePath: operationPath,
    text: input.text,
    noteText: input.noteText,
  });

  claims[CommunicationClaim.ContentAttachmentType] =
    SummaryOperationCommunicationDefaults.AttachmentType;
  claims[CommunicationClaim.ContentAttachmentTitle] =
    SummaryOperationCommunicationDefaults.AttachmentTitle;
  claims[CommunicationClaim.ContentAttachmentData] =
    encodeJsonAttachmentData(attachmentResource);

  return claims;
}

/**
 * Resolves the full runtime URL to call GW CORE from the provider sector DID
 * and the generated relative search path.
 */
export function createSummaryOperationRequestReferenceUrl(
  input: CreateSummaryOperationRequestReferenceUrlInput,
): string {
  const baseUrl = getBaseUrlFromDidWeb(String(input.providerSectorDidWeb || '').trim()).replace(/\/+$/, '');
  const path = String(input.summaryOperationRequestReferencePath || '').trim().replace(/^\/+/, '');
  if (!baseUrl) {
    throw new Error('createSummaryOperationRequestReferenceUrl requires providerSectorDidWeb.');
  }
  if (!path) {
    throw new Error('createSummaryOperationRequestReferenceUrl requires summaryOperationRequestReferencePath.');
  }
  return `${baseUrl}/${path}`;
}

/** @deprecated Use `createSummaryOperationParameters(...)`. */
export function buildIpsSummaryParameters(
  input: Readonly<{
    subjectDid: string;
    sections?: string[];
    documentType?: BundleDocumentTypeKey;
  }>,
): ReadonlyArray<ParameterData> {
  return createSummaryOperationRequestParameters({
    subjectId: input.subjectDid,
    filterSections: input.sections,
    documentType: input.documentType,
  });
}

/** @deprecated Use `createSummaryOperationRequestReferencePath(...)`. */
export function flattenIpsSummaryParametersToBundleSearchReference(
  parameters: ReadonlyArray<ParameterData>,
): string {
  return createSummaryOperationRequestReferencePath(parameters);
}

/** @deprecated Use `createSummaryOperationRequestParameters(...)`. */
export const createSummaryOperationParameters = createSummaryOperationRequestParameters;

/** @deprecated Use `createSummaryOperationRequestReferencePath(...)`. */
export const flattenParametersToSearchReference = createSummaryOperationRequestReferencePath;

/**
 * Preferred high-level developer-facing helpers for auditable search requests
 * carried inside `Communication`.
 *
 * Current split:
 * - `setRequestSummaryOperation(...)` is the canonical 101 read contract where
 *   `content-reference` points to the operation path and
 *   `content-attachment-data` carries the serialized FHIR `Parameters`
 * - `newSearchWithReferencePath(...)` keeps the older flattened `_search`
 *   compatibility contract
 */
export const communication = Object.freeze({
  /**
   * Creates the canonical auditable `Communication` claims for an individual
   * search request whose relative search path is already known.
   */
  newSearchWithReferencePath: buildBundleDocumentRequestCommunicationClaims,
  /**
   * Preferred developer-facing alias. The generated value still lives in
   * `Communication.content-reference`, but callers can think in terms of the
   * final reference-url contract they submit in DIDComm flows.
   */
  newSearchWithReferenceUrl: buildBundleDocumentRequestCommunicationClaims,
  /**
   * Frontend-facing IPS helper: creates the `Communication` claims to request
   * an IPS summary/search using an already-generated reference path.
   */
  newIpsSummarySearchCommunication: createIpsSummarySearchCommunicationClaims,
  /**
   * Compatibility helper for current DIDComm transport flows.
   *
   * Prefer `newIpsSummarySearchCommunication(...)` in `common-utils` 101 docs.
   * DIDComm/outbox orchestration belongs to the next SDK layer.
   */
  newIpsSummarySearchDidcommMessage: createIpsSummarySearchDidcommMessage,
  /**
   * Short-path helper that returns a DIDComm-ready `body.data[]` payload for
   * the current search-with-reference flow.
   */
  newDidcommSearchWithReferenceUrlMessage: createDidcommSearchWithReferenceUrlMessage,
  /** @deprecated Use `newSearchWithReferencePath(...)`. */
  setRequestBundleIPS: buildBundleDocumentRequestCommunicationClaims,
  setRequestSummaryOperation: buildCommunicationRequestOperationWithAttachedParametersClaims,
});

function buildSubjectParameter(subjectDid: string): ParameterData {
  return {
    name: IpsSummaryParameterNames.Subject,
    type: 'string',
    value: subjectDid,
  };
}

function buildDocumentTypeParameter(
  id: string,
  attributeValue: string,
): TokenSearchParameter {
  const [system, code] = splitToken(attributeValue);
  return {
    name: IpsSummaryParameterNames.DocumentType,
    type: 'token',
    system,
    value: code || id,
  };
}

function buildDocumentTypeParameterFromAttributeValue(attributeValue: string): TokenSearchParameter {
  const [system, code] = splitToken(attributeValue);
  return {
    name: IpsSummaryParameterNames.DocumentType,
    type: 'token',
    system,
    value: code,
  };
}

function buildSectionParameters(sections: string[] | undefined): ParameterData[] {
  return normalizeStringArray(sections).map((section) => ({
    name: IpsSummaryParameterNames.Section,
    type: 'string',
    value: section,
  }));
}

function flattenTokenParameter(parameter: ParameterData): string {
  const system = String(parameter.system || '').trim();
  const value = String(parameter.value || '').trim();
  return system ? `${system}|${value}` : value;
}

function splitToken(token: string): [string, string] {
  const text = String(token || '').trim();
  const separator = text.indexOf('|');
  if (separator < 0) {
    return ['', text];
  }
  return [text.slice(0, separator), text.slice(separator + 1)];
}

function normalizeStringArray(values: string[] | undefined): string[] {
  return Array.isArray(values)
    ? values.map((value) => String(value || '').trim()).filter(Boolean)
    : [];
}

function normalizeRecipient(recipient: string | string[] | undefined): string | undefined {
  if (Array.isArray(recipient)) {
    const normalized = recipient.map((value) => String(value || '').trim()).filter(Boolean);
    return normalized.length ? normalized.join(',') : undefined;
  }
  const text = String(recipient || '').trim();
  return text || undefined;
}

function runtimeUuid(prefix: string): string {
  const generated = globalThis.crypto?.randomUUID?.();
  return generated ? `${prefix}-${generated}` : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function inferRequesterKindFromActorSub(sub: string): BundleDocumentRequesterKind {
  const normalized = String(sub || '').trim().toLowerCase();
  if (normalized.includes(':family:') || normalized.includes(':related-person:') || normalized.includes(':relatedperson:')) {
    return BundleDocumentRequesterKinds.RelatedPerson;
  }
  if (normalized.includes(':employee:')) {
    return BundleDocumentRequesterKinds.Employee;
  }
  return BundleDocumentRequesterKinds.Controller;
}
