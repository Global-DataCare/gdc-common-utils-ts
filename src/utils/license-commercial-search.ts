import {
  ClaimsOfferSchemaorg,
  ClaimsOrderSchemaorg,
} from '../constants/schemaorg';
import type { LicenseClaims } from './license';
import {
  extractPrimaryClaims,
  readLicenseOfferPreviewFromResponseBody,
  readLicenseOrderSummaryFromResponseBody,
  type LicenseOfferPreview,
  type LicenseOrderSummary,
} from './license-offer-order';

export const LicenseCommercialSearchEntryType = Object.freeze({
  Offer: 'Offer-search-request-v1.0',
  Order: 'Order-search-request-v1.0',
} as const);

export const LicenseCommercialSearchOperation = Object.freeze({
  Offer: 'Offer:Search',
  Order: 'Order:Search',
} as const);

export type LicenseOfferSearchDraft = Readonly<{
  offerId?: string;
  status?: string;
  category?: string;
  customerType?: string;
  additionalClaims: LicenseClaims;
}>;

export type LicenseOrderSearchDraft = Readonly<{
  acceptedOfferId?: string;
  invoiceId?: string;
  paymentMethod?: string;
  status?: string;
  additionalClaims: LicenseClaims;
}>;

export type LicenseOfferRecord = Readonly<{
  id?: string;
  status?: string;
  offer: LicenseOfferPreview;
  claims: Record<string, unknown>;
}>;

export type LicenseOrderRecord = Readonly<{
  id?: string;
  status?: string;
  order: LicenseOrderSummary;
  claims: Record<string, unknown>;
}>;

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function cloneClaims(claims?: LicenseClaims): LicenseClaims {
  return { ...(claims || {}) };
}

function cloneOfferSearchDraft(draft?: Partial<LicenseOfferSearchDraft>): LicenseOfferSearchDraft {
  return {
    offerId: normalizeText(draft?.offerId),
    status: normalizeText(draft?.status),
    category: normalizeText(draft?.category),
    customerType: normalizeText(draft?.customerType),
    additionalClaims: cloneClaims(draft?.additionalClaims),
  };
}

function cloneOrderSearchDraft(draft?: Partial<LicenseOrderSearchDraft>): LicenseOrderSearchDraft {
  return {
    acceptedOfferId: normalizeText(draft?.acceptedOfferId),
    invoiceId: normalizeText(draft?.invoiceId),
    paymentMethod: normalizeText(draft?.paymentMethod),
    status: normalizeText(draft?.status),
    additionalClaims: cloneClaims(draft?.additionalClaims),
  };
}

/**
 * Chainable high-level editor for portal/backend searches over commercial
 * license offers.
 *
 * This keeps table/list semantics near the app layer instead of forcing the
 * caller to handcraft flat `Offer.*` claims.
 */
export class LicenseOfferSearchEditor {
  private draft: LicenseOfferSearchDraft;

  constructor(initial?: Partial<LicenseOfferSearchDraft>) {
    this.draft = cloneOfferSearchDraft(initial);
  }

  setOfferId(value: string): this {
    this.draft = cloneOfferSearchDraft({ ...this.draft, offerId: value });
    return this;
  }

  setStatus(value: string): this {
    this.draft = cloneOfferSearchDraft({ ...this.draft, status: value });
    return this;
  }

  setCategory(value: string): this {
    this.draft = cloneOfferSearchDraft({ ...this.draft, category: value });
    return this;
  }

  setCustomerType(value: string): this {
    this.draft = cloneOfferSearchDraft({ ...this.draft, customerType: value });
    return this;
  }

  mergeClaims(claims: LicenseClaims): this {
    this.draft = cloneOfferSearchDraft({
      ...this.draft,
      additionalClaims: { ...this.draft.additionalClaims, ...cloneClaims(claims) },
    });
    return this;
  }

  getDraft(): LicenseOfferSearchDraft {
    return cloneOfferSearchDraft(this.draft);
  }

  buildSearchEntry(): {
    type: string;
    request: { method: 'POST' };
    meta: { claims: LicenseClaims; status?: string };
    resource: { meta: { claims: LicenseClaims } };
  } {
    const claims: LicenseClaims = {
      ...cloneClaims(this.draft.additionalClaims),
      ...(this.draft.offerId ? { [ClaimsOfferSchemaorg.identifier]: this.draft.offerId } : {}),
      ...(this.draft.category ? { [ClaimsOfferSchemaorg.category]: this.draft.category } : {}),
      ...(this.draft.customerType ? { [ClaimsOfferSchemaorg.eligibleCustomerType]: this.draft.customerType } : {}),
    };
    return {
      type: LicenseCommercialSearchEntryType.Offer,
      request: { method: 'POST' },
      meta: {
        claims: {
          ...claims,
          '@type': LicenseCommercialSearchOperation.Offer,
        },
        ...(this.draft.status ? { status: this.draft.status } : {}),
      },
      resource: {
        meta: {
          claims: {
            ...claims,
            '@type': LicenseCommercialSearchOperation.Offer,
          },
        },
      },
    };
  }
}

/**
 * Chainable high-level editor for portal/backend searches over commercial
 * license orders and payment materialization.
 */
export class LicenseOrderSearchEditor {
  private draft: LicenseOrderSearchDraft;

  constructor(initial?: Partial<LicenseOrderSearchDraft>) {
    this.draft = cloneOrderSearchDraft(initial);
  }

  setAcceptedOfferId(value: string): this {
    this.draft = cloneOrderSearchDraft({ ...this.draft, acceptedOfferId: value });
    return this;
  }

  setInvoiceId(value: string): this {
    this.draft = cloneOrderSearchDraft({ ...this.draft, invoiceId: value });
    return this;
  }

  setPaymentMethod(value: string): this {
    this.draft = cloneOrderSearchDraft({ ...this.draft, paymentMethod: value });
    return this;
  }

  setStatus(value: string): this {
    this.draft = cloneOrderSearchDraft({ ...this.draft, status: value });
    return this;
  }

  mergeClaims(claims: LicenseClaims): this {
    this.draft = cloneOrderSearchDraft({
      ...this.draft,
      additionalClaims: { ...this.draft.additionalClaims, ...cloneClaims(claims) },
    });
    return this;
  }

  getDraft(): LicenseOrderSearchDraft {
    return cloneOrderSearchDraft(this.draft);
  }

  buildSearchEntry(): {
    type: string;
    request: { method: 'POST' };
    meta: { claims: LicenseClaims; status?: string };
    resource: { meta: { claims: LicenseClaims } };
  } {
    const claims: LicenseClaims = {
      ...cloneClaims(this.draft.additionalClaims),
      ...(this.draft.acceptedOfferId ? { [ClaimsOrderSchemaorg.acceptedOfferIdentifier]: this.draft.acceptedOfferId } : {}),
      ...(this.draft.invoiceId ? { [ClaimsOrderSchemaorg.partOfInvoice]: this.draft.invoiceId } : {}),
      ...(this.draft.paymentMethod ? { [ClaimsOrderSchemaorg.paymentMethod]: this.draft.paymentMethod } : {}),
    };
    return {
      type: LicenseCommercialSearchEntryType.Order,
      request: { method: 'POST' },
      meta: {
        claims: {
          ...claims,
          '@type': LicenseCommercialSearchOperation.Order,
        },
        ...(this.draft.status ? { status: this.draft.status } : {}),
      },
      resource: {
        meta: {
          claims: {
            ...claims,
            '@type': LicenseCommercialSearchOperation.Order,
          },
        },
      },
    };
  }
}

function readSearchDataEntries(body: unknown): Record<string, unknown>[] {
  const root = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const bodyNode = root.body && typeof root.body === 'object' ? root.body as Record<string, unknown> : root;
  const data = Array.isArray(bodyNode.data) ? bodyNode.data : [];
  const first = (data[0] && typeof data[0] === 'object') ? data[0] as Record<string, unknown> : undefined;
  const resource = first?.resource && typeof first.resource === 'object' ? first.resource as Record<string, unknown> : undefined;
  const nested = Array.isArray(resource?.data) ? resource.data : data;
  return nested.filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'));
}

function extractClaims(entry: Record<string, unknown>): Record<string, unknown> {
  const meta = entry.meta && typeof entry.meta === 'object' ? entry.meta as Record<string, unknown> : {};
  const resource = entry.resource && typeof entry.resource === 'object' ? entry.resource as Record<string, unknown> : {};
  const resourceMeta = resource.meta && typeof resource.meta === 'object' ? resource.meta as Record<string, unknown> : {};
  const metaClaims = meta.claims && typeof meta.claims === 'object' ? meta.claims as Record<string, unknown> : undefined;
  const resourceClaims = resourceMeta.claims && typeof resourceMeta.claims === 'object' ? resourceMeta.claims as Record<string, unknown> : undefined;
  return { ...(resourceClaims || {}), ...(metaClaims || {}) };
}

/**
 * Reads normalized offer rows from one GW-style search/list response body.
 */
export function readLicenseOfferRecords(body: unknown): LicenseOfferRecord[] {
  return readSearchDataEntries(body).map((entry) => {
    const claims = extractClaims(entry);
    return {
      id: normalizeText(entry.id) || normalizeText(claims[ClaimsOfferSchemaorg.identifier]),
      status: normalizeText((entry.meta as Record<string, unknown> | undefined)?.status),
      offer: readLicenseOfferPreviewFromResponseBody({ data: [{ meta: { claims } }] }),
      claims,
    };
  });
}

/**
 * Reads normalized order/payment rows from one GW-style search/list response
 * body.
 */
export function readLicenseOrderRecords(body: unknown): LicenseOrderRecord[] {
  return readSearchDataEntries(body).map((entry) => {
    const claims = extractClaims(entry);
    return {
      id: normalizeText(entry.id) || normalizeText(claims[ClaimsOrderSchemaorg.acceptedOfferIdentifier]),
      status: normalizeText((entry.meta as Record<string, unknown> | undefined)?.status),
      order: readLicenseOrderSummaryFromResponseBody({ data: [{ meta: { claims } }] }),
      claims,
    };
  });
}

export function findLicenseOfferRecord(
  body: unknown,
  input: Readonly<{ offerId: string }>,
): LicenseOfferRecord | undefined {
  const offerId = normalizeText(input.offerId);
  if (!offerId) return undefined;
  return readLicenseOfferRecords(body).find((record) => record.offer.offerId === offerId);
}

export function findLicenseOrderRecord(
  body: unknown,
  input: Readonly<{ acceptedOfferId: string }>,
): LicenseOrderRecord | undefined {
  const acceptedOfferId = normalizeText(input.acceptedOfferId);
  if (!acceptedOfferId) return undefined;
  return readLicenseOrderRecords(body).find((record) => record.order.acceptedOfferId === acceptedOfferId);
}

export function summarizeLicenseOfferRecords(body: unknown): Readonly<{ total: number }> {
  return { total: readLicenseOfferRecords(body).length };
}

export function summarizeLicenseOrderRecords(body: unknown): Readonly<{ total: number }> {
  return { total: readLicenseOrderRecords(body).length };
}
