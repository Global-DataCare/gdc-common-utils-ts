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

export async function validateCommunicationResourceFhirR4(
  resource: Record<string, unknown>,
): Promise<{ ok: boolean; issues: Array<{ severity: 'error' | 'warning'; code: string; diagnostics: string; expression?: string }> }> {
  return validateFhirResource(resource, 'r4');
}

export function transformCommunicationClaimsToResourceFhirR4(
  communicationClaims: CommunicationClaims[],
  options: TransformCommunicationClaimsToResourceFhirR4Options = {},
): TransformCommunicationClaimsToResourceFhirR4Result {
  const mode = options.mode ?? 'strict';
  const defaultStatus = options.defaultStatus ?? 'completed';
  const warnings: string[] = [];

  const resources = communicationClaims.map((claims, index) => {
    const payloadAttachmentData = toStringOrUndefined(claims['Communication.content-attachment-data']);
    const payloadAttachmentType = toStringOrUndefined(claims['Communication.content-attachment-type']);
    const payloadAttachmentTitle = toStringOrUndefined(claims['Communication.content-attachment-title']);
    const payloadAttachmentUrl = toStringOrUndefined(claims['Communication.content-attachment-url']);
    const payloadReference = toStringOrUndefined(claims['Communication.content-reference']);
    const payloadCodeRaw = toStringOrUndefined(claims['Communication.content-code']);

    const hasAttachment = Boolean(payloadAttachmentData || payloadAttachmentType || payloadAttachmentTitle || payloadAttachmentUrl);
    const hasReference = Boolean(payloadReference);
    const hasCode = Boolean(payloadCodeRaw);
    const payloadKinds = [hasAttachment, hasReference, hasCode].filter(Boolean).length;

    if (payloadKinds > 1) {
      const msg = `Communication[${index}] has more than one payload kind (attachment/reference/code).`;
      if (mode === 'strict') throw new Error(msg);
      warnings.push(`${msg} Keeping attachment > reference > code.`);
    }

    const noteValues = normalizeNoteValues(claims['Communication.note'] ?? claims['Communication.text']);
    if (noteValues.length > 1) {
      const msg = `Communication[${index}] has more than one note.`;
      if (mode === 'strict') throw new Error(msg);
      warnings.push(`${msg} Keeping first note only.`);
    }

    const payload = buildPayload({
      hasAttachment,
      hasReference,
      hasCode,
      payloadAttachmentData,
      payloadAttachmentType,
      payloadAttachmentTitle,
      payloadAttachmentUrl,
      payloadReference,
      payloadCodeRaw,
    });

    const partOf = toStringOrUndefined(claims['Communication.part-of'] ?? claims['Communication.partOf']);
    if (claims['Communication.partOf'] !== undefined) {
      const msg = `Communication[${index}] uses legacy key 'Communication.partOf'. Use 'Communication.part-of'.`;
      if (mode === 'strict') throw new Error(msg);
      warnings.push(msg);
    }

    const resource: Record<string, unknown> = {
      resourceType: 'Communication',
      status: toStringOrUndefined(claims['Communication.status']) || defaultStatus,
      meta: {
        claims: { ...claims },
      },
    };

    const identifier = toStringOrUndefined(claims['Communication.identifier']);
    if (identifier) resource['identifier'] = [{ value: identifier }];

    const sent = toStringOrUndefined(claims['Communication.sent']);
    if (sent) resource['sent'] = sent;

    const category = toStringOrUndefined(claims['Communication.category']);
    if (category) resource['category'] = [{ coding: [parseSystemCode(category)] }];

    const subject = toStringOrUndefined(claims['Communication.subject']);
    if (subject) resource['subject'] = { reference: subject };

    const recipient = toStringOrUndefined(claims['Communication.recipient']);
    if (recipient) resource['recipient'] = [{ reference: recipient }];

    const sender = toStringOrUndefined(claims['Communication.sender']);
    if (sender) resource['sender'] = { reference: sender };

    if (partOf) resource['partOf'] = [{ reference: partOf }];
    if (payload) resource['payload'] = [payload];
    if (noteValues.length) resource['note'] = [{ text: noteValues[0] }];

    return resource;
  });

  return { resources, warnings };
}

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
  claims['@context'] = 'org.hl7.fhir.r4';

  const identifierValue = (resource?.identifier as Array<{ value?: unknown }> | undefined)?.[0]?.value;
  const status = resource?.status;
  const sent = resource?.sent;
  const subjectRef = (resource?.subject as { reference?: unknown } | undefined)?.reference;
  const recipientRef = (resource?.recipient as Array<{ reference?: unknown }> | undefined)?.[0]?.reference;
  const senderRef = (resource?.sender as { reference?: unknown } | undefined)?.reference;
  const partOfRef = (resource?.partOf as Array<{ reference?: unknown }> | undefined)?.[0]?.reference;
  const noteText = (resource?.note as Array<{ text?: unknown }> | undefined)?.[0]?.text;

  const categoryCoding = (resource?.category as Array<{ coding?: Array<{ system?: unknown; code?: unknown }> }> | undefined)?.[0]?.coding?.[0];
  const payload = (resource?.payload as Array<Record<string, unknown>> | undefined)?.[0];
  const contentReference = (payload?.contentReference as { reference?: unknown } | undefined)?.reference;
  const contentAttachment = payload?.contentAttachment as Record<string, unknown> | undefined;
  const contentCodeableConcept = (payload?.contentCodeableConcept as { coding?: Array<{ system?: unknown; code?: unknown }> } | undefined)?.coding?.[0];

  setIf(claims, 'Communication.identifier', identifierValue);
  setIf(claims, 'Communication.status', status);
  setIf(claims, 'Communication.sent', sent);
  setIf(claims, 'Communication.subject', subjectRef);
  setIf(claims, 'Communication.recipient', recipientRef);
  setIf(claims, 'Communication.sender', senderRef);
  setIf(claims, 'Communication.part-of', partOfRef);
  setIf(claims, 'Communication.text', noteText);
  setIf(claims, 'Communication.note', noteText);

  if (categoryCoding) {
    const system = toStringOrUndefined(categoryCoding.system);
    const code = toStringOrUndefined(categoryCoding.code);
    if (system && code) claims['Communication.category'] = `${system}|${code}`;
    else if (code) claims['Communication.category'] = code;
  }

  setIf(claims, 'Communication.content-reference', contentReference);
  if (contentAttachment) {
    setIf(claims, 'Communication.content-attachment-data', contentAttachment.data);
    setIf(claims, 'Communication.content-attachment-type', contentAttachment.contentType);
    setIf(claims, 'Communication.content-attachment-title', contentAttachment.title);
    setIf(claims, 'Communication.content-attachment-url', contentAttachment.url);
  }
  if (contentCodeableConcept) {
    const system = toStringOrUndefined(contentCodeableConcept.system);
    const code = toStringOrUndefined(contentCodeableConcept.code);
    if (system && code) claims['Communication.content-code'] = `${system}|${code}`;
    else if (code) claims['Communication.content-code'] = code;
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

function buildPayload(input: {
  hasAttachment: boolean;
  hasReference: boolean;
  hasCode: boolean;
  payloadAttachmentData?: string;
  payloadAttachmentType?: string;
  payloadAttachmentTitle?: string;
  payloadAttachmentUrl?: string;
  payloadReference?: string;
  payloadCodeRaw?: string;
}): Record<string, unknown> | undefined {
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

  if (hasAttachment) {
    const value: Record<string, unknown> = {};
    if (payloadAttachmentData) value['data'] = payloadAttachmentData;
    if (payloadAttachmentType) value['contentType'] = payloadAttachmentType;
    if (payloadAttachmentTitle) value['title'] = payloadAttachmentTitle;
    if (payloadAttachmentUrl) value['url'] = payloadAttachmentUrl;
    return { contentAttachment: value };
  }
  if (hasReference) return { contentReference: { reference: payloadReference } };
  if (hasCode && payloadCodeRaw) return { contentCodeableConcept: { coding: [parseSystemCode(payloadCodeRaw)] } };
  return undefined;
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

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text || undefined;
}
