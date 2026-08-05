// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { LOINC_SYSTEM_URL } from '../models/clinical-sections';
import { type FhirValidationResult } from './fhir-validator';
import { validateFhirResource } from './fhir-validator';

export type CommunicationClaims = Record<string, unknown>;
export type CommunicationTransformMode = 'strict' | 'normalize';

export type TransformCommunicationClaimsToResourceFhirR4Options = {
  mode?: CommunicationTransformMode;
  defaultStatus?: string;
};

export type TransformCommunicationClaimsToResourceFhirR4Result = {
  resources: Array<Record<string, unknown>>;
  warnings: string[];
};

/**
 * Validates a FHIR R4 `Communication` resource through the configured validator pipeline.
 *
 * @param resource Candidate FHIR R4 `Communication` resource.
 */
export async function validateCommunicationResourceFhirR4(
  resource: Record<string, unknown>,
): Promise<FhirValidationResult> {
  return validateFhirResource(resource, 'r4');
}

/**
 * Transforms canonical communication claims into FHIR R4 `Communication` resources.
 *
 * @param communicationClaims Flat canonical claims rows to convert.
 * @param options.mode `strict` throws on ambiguous/invalid shapes, `normalize` keeps best-effort output.
 * @param options.defaultStatus Default FHIR status when none is provided.
 */
export function transformCommunicationClaimsToResourceFhirR4(
  communicationClaims: CommunicationClaims[],
  options: TransformCommunicationClaimsToResourceFhirR4Options = {},
): TransformCommunicationClaimsToResourceFhirR4Result {
  // Good practice note:
  // use `CommunicationClaim` for canonical claim keys whenever this helper
  // writes or reads reusable Communication claims. Keep string literals only
  // for explicit legacy-compatibility aliases such as `Communication.partOf`.
  const mode = options.mode ?? 'strict';
  const defaultStatus = options.defaultStatus ?? 'completed';
  const warnings: string[] = [];

  const resources = communicationClaims.map((claims, index) => {
    const payloadAttachmentData = toStringOrUndefined(claims[CommunicationClaim.ContentAttachmentData]);
    const payloadAttachmentType = toStringOrUndefined(claims[CommunicationClaim.ContentAttachmentType]);
    const payloadAttachmentTitle = toStringOrUndefined(claims[CommunicationClaim.ContentAttachmentTitle]);
    const payloadAttachmentUrl = toStringOrUndefined(claims[CommunicationClaim.ContentAttachmentUrl]);
    const payloadReference = toStringOrUndefined(claims[CommunicationClaim.ContentReference]);
    const payloadCodeRaw = toStringOrUndefined(claims[CommunicationClaim.ContentCode]);

    const hasAttachment = Boolean(payloadAttachmentData || payloadAttachmentType || payloadAttachmentTitle || payloadAttachmentUrl);
    const hasReference = Boolean(payloadReference);
    const hasCode = Boolean(payloadCodeRaw);
    const payloadKinds = [hasAttachment, hasReference, hasCode].filter(Boolean).length;
    const isOperationReferenceWithParameters =
      hasAttachment && hasReference && !hasCode;

    if (payloadKinds > 1 && !isOperationReferenceWithParameters) {
      const msg = `Communication[${index}] has more than one payload kind (attachment/reference/code).`;
      if (mode === 'strict') throw new Error(msg);
      warnings.push(`${msg} Keeping attachment > reference > code.`);
    }

    const noteValues = normalizeNoteValues(
      claims[CommunicationClaim.NoteText]
      ?? claims['Communication.note']
      ?? claims[CommunicationClaim.Text],
    );
    if (noteValues.length > 1) {
      const msg = `Communication[${index}] has more than one note.`;
      if (mode === 'strict') throw new Error(msg);
      warnings.push(`${msg} Keeping first note only.`);
    }

    const payload = buildPayloads({
      hasAttachment,
      hasReference: isOperationReferenceWithParameters || (!hasAttachment && hasReference),
      hasCode: !hasAttachment && !hasReference && hasCode,
      payloadAttachmentData,
      payloadAttachmentType,
      payloadAttachmentTitle,
      payloadAttachmentUrl,
      payloadReference,
      payloadCodeRaw,
    });

    const partOf = toStringOrUndefined(claims[CommunicationClaim.PartOf] ?? claims['Communication.partOf']);
    if (claims['Communication.partOf'] !== undefined) {
      const msg = `Communication[${index}] uses legacy key 'Communication.partOf'. Use 'Communication.part-of'.`;
      if (mode === 'strict') throw new Error(msg);
      warnings.push(msg);
    }

    const resource: Record<string, unknown> = {
      resourceType: 'Communication',
      status: toStringOrUndefined(claims[CommunicationClaim.Status]) || defaultStatus,
      meta: {
        claims: { ...claims },
      },
    };

    const identifier = toStringOrUndefined(claims[CommunicationClaim.Identifier]);
    if (identifier) resource['identifier'] = [{ value: identifier }];

    const sent = toStringOrUndefined(claims[CommunicationClaim.Sent]);
    if (sent) resource['sent'] = sent;

    const category = toStringOrUndefined(claims[CommunicationClaim.Category]);
    if (category) resource['category'] = [{ coding: [parseSystemCode(category)] }];

    const topic = toStringOrUndefined(claims[CommunicationClaim.Topic]);
    if (topic) resource['topic'] = { coding: [parseTopicCoding(topic)] };

    const subject = toStringOrUndefined(claims[CommunicationClaim.Subject]);
    if (subject) resource['subject'] = { reference: subject };

    const recipient = toStringOrUndefined(claims[CommunicationClaim.Recipient]);
    if (recipient) resource['recipient'] = [{ reference: recipient }];

    const sender = toStringOrUndefined(claims[CommunicationClaim.Sender]);
    if (sender) resource['sender'] = { reference: sender };

    if (partOf) resource['partOf'] = [{ reference: partOf }];
    if (payload.length) resource['payload'] = payload;
    if (noteValues.length) resource['note'] = [{ text: noteValues[0] }];

    return resource;
  });

  return { resources, warnings };
}

/**
 * Extracts canonical communication claims from a FHIR R4 `Communication` resource.
 *
 * @param resource FHIR R4 `Communication` resource.
 * @param options.preferMetaClaims When true, existing `resource.meta.claims` wins over structural extraction.
 */
export function extractCommunicationClaimsFromResourceFhirR4(
  resource: Record<string, unknown>,
  options: { preferMetaClaims?: boolean } = {},
): CommunicationClaims {
  const preferMetaClaims = options.preferMetaClaims !== false;
  const existingClaims = (resource?.meta as Record<string, unknown> | undefined)?.claims;
  if (preferMetaClaims && existingClaims && typeof existingClaims === 'object') {
    return { ...(existingClaims as Record<string, unknown>) };
  }

  const claims: CommunicationClaims = {};
  claims['@context'] = 'org.hl7.fhir.api';

  const identifierValue = (resource?.identifier as Array<{ value?: unknown }> | undefined)?.[0]?.value;
  const status = resource?.status;
  const sent = resource?.sent;
  const subjectRef = (resource?.subject as { reference?: unknown } | undefined)?.reference;
  const recipientRef = (resource?.recipient as Array<{ reference?: unknown }> | undefined)?.[0]?.reference;
  const senderRef = (resource?.sender as { reference?: unknown } | undefined)?.reference;
  const partOfRef = (resource?.partOf as Array<{ reference?: unknown }> | undefined)?.[0]?.reference;
  const noteText = (resource?.note as Array<{ text?: unknown }> | undefined)?.[0]?.text;

  const categoryCoding = (resource?.category as Array<{ coding?: Array<{ system?: unknown; code?: unknown }> }> | undefined)?.[0]?.coding?.[0];
  const topicCoding = (resource?.topic as { coding?: Array<{ system?: unknown; code?: unknown }> } | undefined)?.coding?.[0];
  const payloads = (resource?.payload as Array<Record<string, unknown>> | undefined) || [];
  const referencePayload = payloads.find((payload) => payload.contentReference !== undefined);
  const attachmentPayload = payloads.find((payload) => payload.contentAttachment !== undefined);
  const codePayload = payloads.find((payload) => payload.contentCodeableConcept !== undefined);
  const contentReference =
    (referencePayload?.contentReference as { reference?: unknown } | undefined)?.reference;
  const contentAttachment =
    attachmentPayload?.contentAttachment as Record<string, unknown> | undefined;
  const contentCodeableConcept =
    (codePayload?.contentCodeableConcept as { coding?: Array<{ system?: unknown; code?: unknown }> } | undefined)?.coding?.[0];

  setIf(claims, CommunicationClaim.Identifier, identifierValue);
  setIf(claims, CommunicationClaim.Status, status);
  setIf(claims, CommunicationClaim.Sent, sent);
  setIf(claims, CommunicationClaim.Subject, subjectRef);
  setIf(claims, CommunicationClaim.Recipient, recipientRef);
  setIf(claims, CommunicationClaim.Sender, senderRef);
  setIf(claims, CommunicationClaim.PartOf, partOfRef);
  setIf(claims, CommunicationClaim.NoteText, noteText);
  setIf(claims, CommunicationClaim.Text, noteText);

  if (categoryCoding) {
    const system = toStringOrUndefined(categoryCoding.system);
    const code = toStringOrUndefined(categoryCoding.code);
    if (system && code) claims[CommunicationClaim.Category] = `${system}|${code}`;
    else if (code) claims[CommunicationClaim.Category] = code;
  }
  if (topicCoding) {
    const system = toStringOrUndefined(topicCoding.system);
    const code = toStringOrUndefined(topicCoding.code);
    if (system && code) claims[CommunicationClaim.Topic] = formatTopicClaim(system, code);
    else if (code) claims[CommunicationClaim.Topic] = code;
  }

  setIf(claims, CommunicationClaim.ContentReference, contentReference);
  if (contentAttachment) {
    setIf(claims, CommunicationClaim.ContentAttachmentData, contentAttachment.data);
    setIf(claims, CommunicationClaim.ContentAttachmentType, contentAttachment.contentType);
    setIf(claims, CommunicationClaim.ContentAttachmentTitle, contentAttachment.title);
    setIf(claims, CommunicationClaim.ContentAttachmentUrl, contentAttachment.url);
  }
  if (contentCodeableConcept) {
    const system = toStringOrUndefined(contentCodeableConcept.system);
    const code = toStringOrUndefined(contentCodeableConcept.code);
    if (system && code) claims[CommunicationClaim.ContentCode] = `${system}|${code}`;
    else if (code) claims[CommunicationClaim.ContentCode] = code;
  }

  return claims;
}

function setIf(claims: CommunicationClaims, key: string, value: unknown): void {
  const text = toStringOrUndefined(value);
  if (text) claims[key] = text;
}

function normalizeNoteValues(raw: unknown): string[] {
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()];
  if (Array.isArray(raw)) {
    return raw.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  }
  return [];
}

function buildPayloads(input: {
  hasAttachment: boolean;
  hasReference: boolean;
  hasCode: boolean;
  payloadAttachmentData?: string;
  payloadAttachmentType?: string;
  payloadAttachmentTitle?: string;
  payloadAttachmentUrl?: string;
  payloadReference?: string;
  payloadCodeRaw?: string;
}): Record<string, unknown>[] {
  const {
    hasAttachment,
    hasReference,
    hasCode,
    payloadAttachmentData,
    payloadAttachmentType,
    payloadAttachmentTitle,
    payloadAttachmentUrl,
    payloadReference,
    payloadCodeRaw,
  } = input;

  const payloads: Record<string, unknown>[] = [];
  if (hasReference) {
    payloads.push({ contentReference: { reference: payloadReference } });
  }
  if (hasAttachment) {
    const value: Record<string, unknown> = {};
    if (payloadAttachmentData) value['data'] = payloadAttachmentData;
    if (payloadAttachmentType) value['contentType'] = payloadAttachmentType;
    if (payloadAttachmentTitle) value['title'] = payloadAttachmentTitle;
    if (payloadAttachmentUrl) value['url'] = payloadAttachmentUrl;
    payloads.push({ contentAttachment: value });
  }
  if (hasCode && payloadCodeRaw) {
    payloads.push({ contentCodeableConcept: { coding: [parseSystemCode(payloadCodeRaw)] } });
  }
  return payloads;
}

function parseSystemCode(value: string): { system?: string; code: string } {
  const trimmed = String(value || '').trim();
  const separatorIndex = trimmed.indexOf('|');
  if (separatorIndex > 0) {
    const system = trimmed.slice(0, separatorIndex).trim();
    const code = trimmed.slice(separatorIndex + 1).trim();
    return { system, code };
  }
  return { code: trimmed };
}

function parseTopicCoding(value: string): { system?: string; code: string } {
  const coding = parseSystemCode(value);
  if (coding.system?.toUpperCase() === 'LOINC') {
    return { ...coding, system: LOINC_SYSTEM_URL };
  }
  return coding;
}

function formatTopicClaim(system: string, code: string): string {
  const normalizedSystem = system.trim().toLowerCase();
  if (
    normalizedSystem === LOINC_SYSTEM_URL
    || normalizedSystem === 'https://loinc.org'
    || normalizedSystem === 'urn:oid:2.16.840.1.113883.6.1'
  ) {
    return `LOINC|${code.trim()}`;
  }
  return `${system.trim()}|${code.trim()}`;
}

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
}
