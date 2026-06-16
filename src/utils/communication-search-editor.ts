import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims.js';
import type { FhirParametersResource } from './fhir-search.js';
import {
  buildCommunicationParticipantSearchBundle,
  buildCommunicationParticipantSearchParameters,
  normalizeCommunicationParticipantTokenList,
  type CommunicationParticipantSearchInput,
} from './communication-participant-search.js';

export const CommunicationSearchEntryTypes = Object.freeze({
  Search: 'Communication-search-request-v1.0',
} as const);

export const CommunicationSearchOperationTypes = Object.freeze({
  Search: 'search',
} as const);

export type CommunicationSearchState = Readonly<{
  searchParams: Readonly<Record<string, string | number | boolean | readonly (string | number | boolean)[] | undefined>>;
  periodStart?: string;
  periodEnd?: string;
  page?: number;
  count?: number;
}>;

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function normalizeInteger(value: unknown): number | undefined {
  const numeric = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  return Number.isInteger(numeric) && numeric > 0 ? numeric : undefined;
}

function normalizeSearchParamValue(
  claimKey: string,
  value: unknown,
): string | number | boolean | readonly (string | number | boolean)[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    if (isParticipantClaimKey(claimKey)) {
      return normalizeCommunicationParticipantTokenList(value);
    }
    const normalized = value
      .map((item) => typeof item === 'string' ? item.trim() : item)
      .filter((item) => item !== '' && item !== undefined && item !== null);
    return normalized.length > 0 ? normalized : undefined;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  if (isParticipantClaimKey(claimKey)) {
    const normalized = normalizeCommunicationParticipantTokenList(value);
    return normalized.length > 0 ? normalized : undefined;
  }
  return normalizeText(value);
}

function cloneDraft(
  draft?: Partial<CommunicationSearchState>,
): CommunicationSearchState {
  const searchParams: Record<string, string | number | boolean | readonly (string | number | boolean)[] | undefined> = {};
  for (const [key, value] of Object.entries(draft?.searchParams || {})) {
    const normalizedKey = normalizeText(key);
    if (!normalizedKey) {
      continue;
    }
    const normalizedValue = normalizeSearchParamValue(normalizedKey, value);
    if (normalizedValue !== undefined) {
      searchParams[normalizedKey] = normalizedValue;
    }
  }
  return {
    searchParams,
    periodStart: normalizeText(draft?.periodStart),
    periodEnd: normalizeText(draft?.periodEnd),
    page: normalizeInteger(draft?.page),
    count: normalizeInteger(draft?.count),
  };
}

function isParticipantClaimKey(claimKey: string): boolean {
  return claimKey === CommunicationClaim.Subject
    || claimKey === CommunicationClaim.Sender
    || claimKey === CommunicationClaim.Recipient;
}

/**
 * High-level chainable editor for `Communication/_search`.
 *
 * Design goals:
 * - keep business filters near the caller instead of forcing ad-hoc `Parameters`
 * - reuse canonical `CommunicationClaim.*` keys for search params
 * - keep shared controls (`periodStart`, `periodEnd`, `page`, `count`) outside
 *   the claim bag because they are search controls, not resource claims
 */
export class CommunicationSearchEditor {
  private draft: CommunicationSearchState;

  constructor(initial?: Partial<CommunicationSearchState>) {
    this.draft = cloneDraft(initial);
  }

  setSearchParams(
    value: Readonly<Record<string, string | number | boolean | readonly (string | number | boolean)[] | undefined>>,
  ): this {
    this.draft = cloneDraft({ ...this.draft, searchParams: value });
    return this;
  }

  setSearchParam(
    claimKey: string,
    value: string | number | boolean | readonly (string | number | boolean)[] | undefined,
  ): this {
    this.draft = cloneDraft({
      ...this.draft,
      searchParams: {
        ...this.draft.searchParams,
        [claimKey]: value,
      },
    });
    return this;
  }

  setSearchParamSender(value: string | readonly string[]): this {
    return this.setSearchParam(CommunicationClaim.Sender, value);
  }

  setSearchParamRecipient(value: string | readonly string[]): this {
    return this.setSearchParam(CommunicationClaim.Recipient, value);
  }

  setSearchParamCategory(value: string | readonly string[]): this {
    return this.setSearchParam(CommunicationClaim.Category, value);
  }

  setSearchParamTopic(value: string): this {
    return this.setSearchParam(CommunicationClaim.Topic, value);
  }

  getSearchParams(): Readonly<Record<string, string | number | boolean | readonly (string | number | boolean)[] | undefined>> {
    return { ...this.draft.searchParams };
  }

  setPeriodStart(value: string): this {
    this.draft = cloneDraft({ ...this.draft, periodStart: value });
    return this;
  }

  setPeriodEnd(value: string): this {
    this.draft = cloneDraft({ ...this.draft, periodEnd: value });
    return this;
  }

  setPaginationCount(value: number): this {
    this.draft = cloneDraft({ ...this.draft, count: value });
    return this;
  }

  setPageNumber(value: number): this {
    this.draft = cloneDraft({ ...this.draft, page: value });
    return this;
  }

  getState(): CommunicationSearchState {
    return cloneDraft(this.draft);
  }

  toSearchInput(): CommunicationParticipantSearchInput {
    return {
      searchParams: this.draft.searchParams,
      periodStart: this.draft.periodStart,
      periodEnd: this.draft.periodEnd,
      page: this.draft.page,
      count: this.draft.count,
    };
  }

  buildRequest(): FhirParametersResource {
    return buildCommunicationParticipantSearchParameters(this.toSearchInput());
  }

  buildEntry(): {
    type: string;
    request: { method: 'POST'; url: string };
    resource: FhirParametersResource;
    meta: { operationType: string };
  } {
    const built = this.buildBundle().entry[0];

    return {
      type: CommunicationSearchEntryTypes.Search,
      request: {
        method: 'POST',
        url: built?.request.url || `${ResourceTypesFhirR4.Communication}/_search`,
      },
      resource: built?.resource || this.buildRequest(),
      meta: {
        operationType: CommunicationSearchOperationTypes.Search,
      },
    };
  }

  buildBundle(): ReturnType<typeof buildCommunicationParticipantSearchBundle> {
    return buildCommunicationParticipantSearchBundle(this.toSearchInput());
  }
}
