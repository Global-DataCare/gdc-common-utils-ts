import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims.js';
import {
  buildSearchBundle,
  buildFhirParametersResourceFromSearchParams,
  type FhirParametersResource,
  type SearchParameterPrimitive,
  SearchBundleTypes,
} from './fhir-search.js';

/**
 * Canonical participant-token prefixes used by communication search helpers.
 */
export const CommunicationParticipantPrefixes = Object.freeze({
  Did: 'did:',
  Email: 'email:',
  Mailto: 'mailto:',
  Tel: 'tel:',
  Phone: 'phone:',
  Wildcard: '*',
} as const);

/**
 * Canonical parameter names supported by `Communication/_search`.
 */
export const CommunicationParticipantSearchParameterNames = Object.freeze({
  Subject: 'subject',
  Actor: 'actor',
  Sender: 'sender',
  Recipient: 'recipient',
  User: 'user',
  Target: 'target',
  PeriodStart: 'period-start',
  PeriodEnd: 'period-end',
  Page: 'page',
  Count: 'count',
} as const);

/**
 * Backward-compatible aliases still accepted while callers migrate to the
 * canonical control names.
 */
export const CommunicationParticipantSearchParameterAliases = Object.freeze({
  SentFrom: 'sent-from',
  SentTo: 'sent-to',
} as const);

/**
 * Indexed-attribute names used by communication projections.
 */
export const CommunicationParticipantIndexNames = Object.freeze({
  Subject: CommunicationClaim.Subject,
  Participant: 'Communication.participant-token',
  Sender: 'Communication.sender-token',
  Recipient: 'Communication.recipient-token',
} as const);

export type CommunicationParticipantTokenInput =
  | string
  | readonly string[]
  | undefined
  | null;

export type CommunicationParticipantSearchInput = {
  /**
   * Canonical claims-like search parameters keyed by reusable claim constants
   * such as `CommunicationClaim.Sender`, `CommunicationClaim.Recipient`,
   * `CommunicationClaim.Category`, or `CommunicationClaim.Topic`.
   */
  searchParams?: Readonly<Record<string, SearchParameterPrimitive | undefined>>;
  subject?: CommunicationParticipantTokenInput;
  actorId?: CommunicationParticipantTokenInput;
  senderActorId?: CommunicationParticipantTokenInput;
  recipientActorId?: CommunicationParticipantTokenInput;
  userActorId?: CommunicationParticipantTokenInput;
  targetActorId?: CommunicationParticipantTokenInput;
  periodStart?: string;
  periodEnd?: string;
  sentFrom?: string;
  sentTo?: string;
  page?: number;
  count?: number;
};

export type CommunicationParticipantSearchCriteria = {
  subjectActorIds: string[];
  anySubject: boolean;
  actorIds: string[];
  anyActor: boolean;
  senderActorIds: string[];
  anySender: boolean;
  recipientActorIds: string[];
  anyRecipient: boolean;
  userActorIds: string[];
  anyUser: boolean;
  targetActorIds: string[];
  anyTarget: boolean;
  claimSearchParams: Readonly<Record<string, string[]>>;
  periodStart?: string;
  periodEnd?: string;
  page: number;
  count?: number;
};

export type CommunicationParticipantProjection = {
  subject?: unknown;
  sender?: unknown;
  recipients?: unknown;
  from?: unknown;
  to?: unknown;
  sent?: unknown;
  category?: unknown;
  topic?: unknown;
};

export type CommunicationParticipantIndexedAttribute = {
  name: string;
  value: string;
  unique?: boolean;
};

const COMMUNICATION_PARTICIPANT_INDEX_ATTRIBUTE_UNIQUE = Object.freeze({
  subject: true,
  participant: false,
  sender: false,
  recipient: false,
} as const);

const COMMUNICATION_PARTICIPANT_SEARCH_KEYS = Object.freeze([
  CommunicationParticipantSearchParameterNames.Subject,
  CommunicationParticipantSearchParameterNames.Actor,
  CommunicationParticipantSearchParameterNames.Sender,
  CommunicationParticipantSearchParameterNames.Recipient,
  CommunicationParticipantSearchParameterNames.User,
  CommunicationParticipantSearchParameterNames.Target,
  CommunicationParticipantSearchParameterNames.PeriodStart,
  CommunicationParticipantSearchParameterNames.PeriodEnd,
  CommunicationParticipantSearchParameterNames.Page,
  CommunicationParticipantSearchParameterNames.Count,
  CommunicationParticipantSearchParameterAliases.SentFrom,
  CommunicationParticipantSearchParameterAliases.SentTo,
] as const);

export function normalizeCommunicationParticipantToken(value: unknown): string {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (trimmed === CommunicationParticipantPrefixes.Wildcard) {
    return CommunicationParticipantPrefixes.Wildcard;
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith(CommunicationParticipantPrefixes.Did)) {
    return `${CommunicationParticipantPrefixes.Did}${trimmed.slice(CommunicationParticipantPrefixes.Did.length)}`;
  }
  if (lower.startsWith(CommunicationParticipantPrefixes.Mailto)) {
    const email = trimmed.slice(CommunicationParticipantPrefixes.Mailto.length).trim().toLowerCase();
    return email ? `${CommunicationParticipantPrefixes.Email}${email}` : '';
  }
  if (lower.startsWith(CommunicationParticipantPrefixes.Email)) {
    const email = trimmed.slice(CommunicationParticipantPrefixes.Email.length).trim().toLowerCase();
    return email ? `${CommunicationParticipantPrefixes.Email}${email}` : '';
  }
  if (looksLikeEmailIdentifier(trimmed)) {
    return `${CommunicationParticipantPrefixes.Email}${trimmed.toLowerCase()}`;
  }
  if (lower.startsWith(CommunicationParticipantPrefixes.Phone)) {
    return normalizeTelephoneParticipantToken(trimmed.slice(CommunicationParticipantPrefixes.Phone.length));
  }
  if (lower.startsWith(CommunicationParticipantPrefixes.Tel)) {
    return normalizeTelephoneParticipantToken(trimmed.slice(CommunicationParticipantPrefixes.Tel.length));
  }
  if (looksLikePhoneIdentifier(trimmed)) {
    return normalizeTelephoneParticipantToken(trimmed);
  }

  return trimmed;
}

export function normalizeCommunicationParticipantTokenList(value: unknown): string[] {
  const values = toFlatStringList(value)
    .map((item) => normalizeCommunicationParticipantToken(item))
    .filter(Boolean);
  return Array.from(new Set(values));
}

export function isCommunicationParticipantWildcardToken(value: unknown): boolean {
  return normalizeCommunicationParticipantToken(value) === CommunicationParticipantPrefixes.Wildcard;
}

export function buildCommunicationParticipantSearchParameters(
  input: CommunicationParticipantSearchInput,
): FhirParametersResource {
  return buildFhirParametersResourceFromSearchParams(
    communicationParticipantSearchInputToSearchParams(input),
  );
}

export function buildCommunicationParticipantSearchBundle(
  input: CommunicationParticipantSearchInput,
): ReturnType<typeof buildSearchBundle> {
  return buildSearchBundle({
    resourceType: ResourceTypesFhirR4.Communication,
    encoding: 'post-parameters',
    bundleType: SearchBundleTypes.Search,
    searchParams: communicationParticipantSearchInputToSearchParams(input),
  });
}

export function parseCommunicationParticipantSearchCriteria(
  input: Record<string, unknown> | FhirParametersResource | undefined,
): CommunicationParticipantSearchCriteria {
  const flat = extractFlatCommunicationParticipantSearchMap(input);
  return {
    subjectActorIds: withoutWildcard(flat[CommunicationParticipantSearchParameterNames.Subject]),
    anySubject: hasWildcard(flat[CommunicationParticipantSearchParameterNames.Subject]),
    actorIds: withoutWildcard(flat[CommunicationParticipantSearchParameterNames.Actor]),
    anyActor: hasWildcard(flat[CommunicationParticipantSearchParameterNames.Actor]),
    senderActorIds: withoutWildcard(flat[CommunicationParticipantSearchParameterNames.Sender]),
    anySender: hasWildcard(flat[CommunicationParticipantSearchParameterNames.Sender]),
    recipientActorIds: withoutWildcard(flat[CommunicationParticipantSearchParameterNames.Recipient]),
    anyRecipient: hasWildcard(flat[CommunicationParticipantSearchParameterNames.Recipient]),
    userActorIds: withoutWildcard(flat[CommunicationParticipantSearchParameterNames.User]),
    anyUser: hasWildcard(flat[CommunicationParticipantSearchParameterNames.User]),
    targetActorIds: withoutWildcard(flat[CommunicationParticipantSearchParameterNames.Target]),
    anyTarget: hasWildcard(flat[CommunicationParticipantSearchParameterNames.Target]),
    claimSearchParams: buildClaimSearchParams(flat),
    periodStart: firstDefinedDateValue(
      flat[CommunicationParticipantSearchParameterNames.PeriodStart][0],
      flat[CommunicationParticipantSearchParameterAliases.SentFrom][0],
    ),
    periodEnd: firstDefinedDateValue(
      flat[CommunicationParticipantSearchParameterNames.PeriodEnd][0],
      flat[CommunicationParticipantSearchParameterAliases.SentTo][0],
    ),
    page: normalizePageValue(flat[CommunicationParticipantSearchParameterNames.Page][0]),
    count: normalizePositiveInteger(flat[CommunicationParticipantSearchParameterNames.Count][0]),
  };
}

export function buildCommunicationParticipantIndexAttributes(
  projection: CommunicationParticipantProjection,
): CommunicationParticipantIndexedAttribute[] {
  const subjectTokens = normalizeCommunicationParticipantTokenList(projection.subject);
  const senderTokens = normalizeCommunicationParticipantTokenList(projection.sender ?? projection.from);
  const recipientTokens = normalizeCommunicationParticipantTokenList(projection.recipients ?? projection.to);
  const participantTokens = Array.from(new Set([...senderTokens, ...recipientTokens]));
  const attributes: CommunicationParticipantIndexedAttribute[] = [];

  for (const subjectToken of subjectTokens) {
    attributes.push({
      name: CommunicationParticipantIndexNames.Subject,
      value: subjectToken,
      unique: COMMUNICATION_PARTICIPANT_INDEX_ATTRIBUTE_UNIQUE.subject,
    });
  }
  for (const senderToken of senderTokens) {
    attributes.push({
      name: CommunicationParticipantIndexNames.Sender,
      value: senderToken,
      unique: COMMUNICATION_PARTICIPANT_INDEX_ATTRIBUTE_UNIQUE.sender,
    });
  }
  for (const recipientToken of recipientTokens) {
    attributes.push({
      name: CommunicationParticipantIndexNames.Recipient,
      value: recipientToken,
      unique: COMMUNICATION_PARTICIPANT_INDEX_ATTRIBUTE_UNIQUE.recipient,
    });
  }
  for (const participantToken of participantTokens) {
    attributes.push({
      name: CommunicationParticipantIndexNames.Participant,
      value: participantToken,
      unique: COMMUNICATION_PARTICIPANT_INDEX_ATTRIBUTE_UNIQUE.participant,
    });
  }

  return dedupeIndexedAttributes(attributes);
}

export function matchesCommunicationParticipantSearch(
  projection: CommunicationParticipantProjection,
  criteria: CommunicationParticipantSearchCriteria,
): boolean {
  const subjectTokens = normalizeCommunicationParticipantTokenList(projection.subject);
  const senderTokens = normalizeCommunicationParticipantTokenList(projection.sender ?? projection.from);
  const recipientTokens = normalizeCommunicationParticipantTokenList(projection.recipients ?? projection.to);
  const participantTokens = Array.from(new Set([...senderTokens, ...recipientTokens]));
  const sent = normalizeDateParameter(projection.sent);
  const categoryTokens = normalizeScalarClaimTokenList(projection.category);
  const topicTokens = normalizeScalarClaimTokenList(projection.topic);

  return matchesOperand(subjectTokens, criteria.subjectActorIds, criteria.anySubject)
    && matchesOperand(participantTokens, criteria.actorIds, criteria.anyActor)
    && matchesOperand(senderTokens, criteria.senderActorIds, criteria.anySender)
    && matchesOperand(recipientTokens, criteria.recipientActorIds, criteria.anyRecipient)
    && matchesOperand(participantTokens, criteria.userActorIds, criteria.anyUser)
    && matchesOperand(participantTokens, criteria.targetActorIds, criteria.anyTarget)
    && matchesClaimSearchParams(criteria.claimSearchParams, {
      [CommunicationClaim.Subject]: subjectTokens,
      [CommunicationClaim.Sender]: senderTokens,
      [CommunicationClaim.Recipient]: recipientTokens,
      [CommunicationClaim.Category]: categoryTokens,
      [CommunicationClaim.Topic]: topicTokens,
    })
    && matchesDateRange(sent, criteria.periodStart, criteria.periodEnd);
}

export function paginateCommunicationParticipantMatches<T>(
  records: readonly T[],
  criteria: Pick<CommunicationParticipantSearchCriteria, 'page' | 'count'>,
): T[] {
  const page = normalizePageValue(criteria.page);
  const count = normalizePositiveInteger(criteria.count);
  if (!count) {
    return [...records];
  }
  const offset = (page - 1) * count;
  return records.slice(offset, offset + count);
}

function dedupeIndexedAttributes(
  attributes: readonly CommunicationParticipantIndexedAttribute[],
): CommunicationParticipantIndexedAttribute[] {
  const seen = new Set<string>();
  const result: CommunicationParticipantIndexedAttribute[] = [];
  for (const attribute of attributes) {
    const key = `${attribute.name}\u0000${attribute.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(attribute);
  }
  return result;
}

function matchesOperand(actualTokens: readonly string[], expectedTokens: readonly string[], anyExpected: boolean): boolean {
  if (anyExpected || expectedTokens.length === 0) return true;
  if (actualTokens.length === 0) return false;
  return expectedTokens.some((expectedToken) => actualTokens.includes(expectedToken));
}

function matchesDateRange(sent: string | undefined, sentFrom?: string, sentTo?: string): boolean {
  if (!sentFrom && !sentTo) return true;
  if (!sent) return false;
  if (sentFrom && sent < sentFrom) return false;
  if (sentTo && sent > sentTo) return false;
  return true;
}

function hasWildcard(values: readonly string[]): boolean {
  return values.includes(CommunicationParticipantPrefixes.Wildcard);
}

function withoutWildcard(values: readonly string[]): string[] {
  return values.filter((value) => value !== CommunicationParticipantPrefixes.Wildcard);
}

function extractFlatCommunicationParticipantSearchMap(
  input: Record<string, unknown> | FhirParametersResource | undefined,
): Record<string, string[]> {
  const result: Record<string, string[]> = Object.fromEntries(
    COMMUNICATION_PARTICIPANT_SEARCH_KEYS.map((key) => [key, []]),
  );

  if (!input || typeof input !== 'object') {
    return result;
  }

  if ((input as FhirParametersResource).resourceType === 'Parameters' && Array.isArray((input as FhirParametersResource).parameter)) {
    for (const parameter of (input as FhirParametersResource).parameter) {
      const name = String(parameter?.name || '').trim();
      if (!name) {
        continue;
      }
      const rawValue = parameter.valueString
        ?? parameter.valueUri
        ?? parameter.valueCode
        ?? parameter.valueReference?.reference
        ?? parameter.valueCoding?.code
        ?? parameter.valueInteger
        ?? parameter.valueDecimal;
      if (!result[name]) {
        result[name] = [];
      }
      result[name].push(...normalizeSearchValueList(name, rawValue));
    }
    return normalizeFlatSearchMap(result);
  }

  for (const key of COMMUNICATION_PARTICIPANT_SEARCH_KEYS) {
    result[key] = normalizeSearchValueList(key, (input as Record<string, unknown>)[key]);
  }

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (COMMUNICATION_PARTICIPANT_SEARCH_KEYS.includes(key as any)) {
      continue;
    }
    result[key] = normalizeSearchValueList(key, value);
  }
  return normalizeFlatSearchMap(result);
}

function normalizeFlatSearchMap(
  result: Record<string, string[]>,
): Record<string, string[]> {
  for (const key of COMMUNICATION_PARTICIPANT_SEARCH_KEYS) {
    result[key] = Array.from(new Set(result[key].filter(Boolean)));
  }
  return result;
}

function communicationParticipantSearchInputToSearchParams(
  input: CommunicationParticipantSearchInput,
): Record<string, SearchParameterPrimitive | undefined> {
  const normalizedSearchParams = normalizeClaimSearchParams(input.searchParams);
  return {
    ...normalizedSearchParams,
    [CommunicationParticipantSearchParameterNames.Subject]: normalizeCommunicationParticipantTokenList(input.subject),
    [CommunicationParticipantSearchParameterNames.Actor]: normalizeCommunicationParticipantTokenList(input.actorId),
    [CommunicationParticipantSearchParameterNames.Sender]: normalizeCommunicationParticipantTokenList(input.senderActorId),
    [CommunicationParticipantSearchParameterNames.Recipient]: normalizeCommunicationParticipantTokenList(input.recipientActorId),
    [CommunicationParticipantSearchParameterNames.User]: normalizeCommunicationParticipantTokenList(input.userActorId),
    [CommunicationParticipantSearchParameterNames.Target]: normalizeCommunicationParticipantTokenList(input.targetActorId),
    [CommunicationParticipantSearchParameterNames.PeriodStart]: firstDefinedDateValue(input.periodStart, input.sentFrom),
    [CommunicationParticipantSearchParameterNames.PeriodEnd]: firstDefinedDateValue(input.periodEnd, input.sentTo),
    [CommunicationParticipantSearchParameterNames.Page]: normalizePositiveInteger(input.page),
    [CommunicationParticipantSearchParameterNames.Count]: normalizePositiveInteger(input.count),
  };
}

function normalizeClaimSearchParams(
  searchParams: Readonly<Record<string, SearchParameterPrimitive | undefined>> | undefined,
): Record<string, SearchParameterPrimitive | undefined> {
  const result: Record<string, SearchParameterPrimitive | undefined> = {};
  for (const [key, value] of Object.entries(searchParams || {})) {
    const normalizedKey = String(key || '').trim();
    if (!normalizedKey) {
      continue;
    }
    if (isParticipantClaimKey(normalizedKey)) {
      result[normalizedKey] = normalizeCommunicationParticipantTokenList(value);
      continue;
    }
    result[normalizedKey] = normalizeScalarSearchValue(value);
  }
  return result;
}

function buildClaimSearchParams(
  flat: Record<string, string[]>,
): Readonly<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(flat)) {
    if (COMMUNICATION_PARTICIPANT_SEARCH_KEYS.includes(key as any)) {
      continue;
    }
    if (values.length === 0) {
      continue;
    }
    result[key] = Array.from(new Set(values));
  }
  return result;
}

function matchesClaimSearchParams(
  expectedSearchParams: Readonly<Record<string, string[]>>,
  projectionIndex: Readonly<Record<string, string[]>>,
): boolean {
  for (const [claimKey, expectedValues] of Object.entries(expectedSearchParams)) {
    const actualValues = projectionIndex[claimKey] || [];
    if (!matchesOperand(actualValues, withoutWildcard(expectedValues), hasWildcard(expectedValues))) {
      return false;
    }
  }
  return true;
}

function normalizeSearchValueList(key: string, value: unknown): string[] {
  return isParticipantKey(key)
    ? normalizeCommunicationParticipantTokenList(value)
    : normalizeScalarClaimTokenList(value);
}

function normalizeScalarClaimTokenList(value: unknown): string[] {
  return Array.from(new Set(toFlatStringList(value)));
}

function normalizeScalarSearchValue(
  value: SearchParameterPrimitive | undefined,
): SearchParameterPrimitive | undefined {
  if (Array.isArray(value)) {
    const normalized = value.map((item) => String(item).trim()).filter(Boolean);
    return normalized.length > 0 ? normalized : undefined;
  }
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  return normalized || undefined;
}

function isParticipantKey(key: string): boolean {
  return isParticipantControlKey(key) || isParticipantClaimKey(key);
}

function isParticipantControlKey(key: string): boolean {
  return key === CommunicationParticipantSearchParameterNames.Subject
    || key === CommunicationParticipantSearchParameterNames.Actor
    || key === CommunicationParticipantSearchParameterNames.Sender
    || key === CommunicationParticipantSearchParameterNames.Recipient
    || key === CommunicationParticipantSearchParameterNames.User
    || key === CommunicationParticipantSearchParameterNames.Target;
}

function isParticipantClaimKey(key: string): boolean {
  return key === CommunicationClaim.Subject
    || key === CommunicationClaim.Sender
    || key === CommunicationClaim.Recipient;
}

function firstDefinedDateValue(...values: unknown[]): string | undefined {
  for (const value of values) {
    const normalized = normalizeDateParameter(value);
    if (normalized) {
      return normalized;
    }
  }
  return undefined;
}

function toFlatStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => toFlatStringList(item));
  }
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return [];
  }
  return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
}

function looksLikeEmailIdentifier(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value || '').trim());
}

function looksLikePhoneIdentifier(value: string): boolean {
  const normalized = String(value || '').trim();
  return /^[+()0-9.\-\s]{6,}$/.test(normalized);
}

function normalizeTelephoneParticipantToken(value: unknown): string {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const hasExplicitPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `${CommunicationParticipantPrefixes.Tel}${hasExplicitPlus ? '+' : ''}${digits}`;
}

function normalizeDateParameter(value: unknown): string | undefined {
  const trimmed = String(value || '').trim();
  return trimmed || undefined;
}

function normalizePositiveInteger(value: unknown): number | undefined {
  const numeric = typeof value === 'number' ? value : Number(String(value || '').trim());
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return undefined;
  }
  return numeric;
}

function normalizePageValue(value: unknown): number {
  return normalizePositiveInteger(value) || 1;
}
