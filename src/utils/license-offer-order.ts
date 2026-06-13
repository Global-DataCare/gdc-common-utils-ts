import {
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsOrderSchemaorg,
} from '../constants/schemaorg';
import { LicenseClaimContext, type LicenseClaims } from './license';

export type LicenseOfferPreview = Readonly<{
  offerId?: string;
  amount?: string;
  currency?: string;
  seats?: number;
  planName?: string;
  sku?: string;
  paymentMethod?: string;
  checkoutUrl?: string;
}>;

export type LicenseOrderSummary = Readonly<{
  acceptedOfferId?: string;
  paymentUrl?: string;
  invoiceId?: string;
  paymentMethod?: string;
  activationCode?: string;
  amount?: string;
  currency?: string;
  seats?: number;
}>;

export type LicenseOfferOrderDraft = Readonly<{
  offer: LicenseOfferPreview;
  order: LicenseOrderSummary;
  baseClaims: LicenseClaims;
}>;

/**
 * Stateless helper API for the current GW/gwtemplate Offer -> Order license
 * claim family.
 *
 * Use this surface when the caller wants immutable get/set helpers and claim
 * serialization without keeping mutable editor state.
 */
export interface LicenseOfferOrderFacade {
  createDraft(initial?: Partial<LicenseOfferOrderDraft>): LicenseOfferOrderDraft;
  setOfferId(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setAmount(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setCurrency(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setSeats(draft: LicenseOfferOrderDraft, value: number): LicenseOfferOrderDraft;
  setPlanName(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setSku(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setPaymentMethod(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setCheckoutUrl(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setAcceptedOfferId(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setPaymentUrl(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setInvoiceId(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setActivationCode(draft: LicenseOfferOrderDraft, value: string): LicenseOfferOrderDraft;
  setBaseClaims(draft: LicenseOfferOrderDraft, claims: LicenseClaims): LicenseOfferOrderDraft;
  buildOfferClaims(draft: LicenseOfferOrderDraft): LicenseClaims;
  buildOrderClaims(draft: LicenseOfferOrderDraft): LicenseClaims;
  readOfferPreviewFromResponseBody(body: unknown): LicenseOfferPreview;
  readOrderSummaryFromResponseBody(body: unknown): LicenseOrderSummary;
  createEditor(initial?: Partial<LicenseOfferOrderDraft>): LicenseOfferOrderEditor;
}

/**
 * Chainable editor mirroring the didactic `get/set/build/read` style used by
 * the shared bundle and consent editors.
 */
export interface LicenseOfferOrderEditor {
  setOfferId(value: string): LicenseOfferOrderEditor;
  setAmount(value: string): LicenseOfferOrderEditor;
  setCurrency(value: string): LicenseOfferOrderEditor;
  setSeats(value: number): LicenseOfferOrderEditor;
  setPlanName(value: string): LicenseOfferOrderEditor;
  setSku(value: string): LicenseOfferOrderEditor;
  setPaymentMethod(value: string): LicenseOfferOrderEditor;
  setCheckoutUrl(value: string): LicenseOfferOrderEditor;
  setAcceptedOfferId(value: string): LicenseOfferOrderEditor;
  setPaymentUrl(value: string): LicenseOfferOrderEditor;
  setInvoiceId(value: string): LicenseOfferOrderEditor;
  setActivationCode(value: string): LicenseOfferOrderEditor;
  setBaseClaims(claims: LicenseClaims): LicenseOfferOrderEditor;
  getOfferPreview(): LicenseOfferPreview;
  getOrderSummary(): LicenseOrderSummary;
  buildOfferClaims(): LicenseClaims;
  buildOrderClaims(): LicenseClaims;
  readOfferPreviewFromResponseBody(body: unknown): LicenseOfferPreview;
  readOrderSummaryFromResponseBody(body: unknown): LicenseOrderSummary;
}

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function normalizeNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = Number(String(value ?? '').trim());
  return Number.isFinite(normalized) ? normalized : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function cloneClaims(claims?: LicenseClaims): LicenseClaims {
  return { ...(claims || {}) };
}

function cloneOffer(offer?: Partial<LicenseOfferPreview>): LicenseOfferPreview {
  return {
    offerId: normalizeText(offer?.offerId),
    amount: normalizeText(offer?.amount),
    currency: normalizeText(offer?.currency),
    seats: normalizeNumber(offer?.seats),
    planName: normalizeText(offer?.planName),
    sku: normalizeText(offer?.sku),
    paymentMethod: normalizeText(offer?.paymentMethod),
    checkoutUrl: normalizeText(offer?.checkoutUrl),
  };
}

function cloneOrder(order?: Partial<LicenseOrderSummary>): LicenseOrderSummary {
  return {
    acceptedOfferId: normalizeText(order?.acceptedOfferId),
    paymentUrl: normalizeText(order?.paymentUrl),
    invoiceId: normalizeText(order?.invoiceId),
    paymentMethod: normalizeText(order?.paymentMethod),
    activationCode: normalizeText(order?.activationCode),
    amount: normalizeText(order?.amount),
    currency: normalizeText(order?.currency),
    seats: normalizeNumber(order?.seats),
  };
}

function patchDraft(
  draft: LicenseOfferOrderDraft,
  patch: Partial<LicenseOfferOrderDraft>,
): LicenseOfferOrderDraft {
  return {
    offer: patch.offer ? cloneOffer({ ...draft.offer, ...patch.offer }) : draft.offer,
    order: patch.order ? cloneOrder({ ...draft.order, ...patch.order }) : draft.order,
    baseClaims: patch.baseClaims ? cloneClaims(patch.baseClaims) : cloneClaims(draft.baseClaims),
  };
}

/**
 * Extracts the primary flat claim block from the typical GW poll payload shape.
 *
 * Accepted shapes:
 * - `{ data: [{ meta.claims }] }`
 * - `{ body: { data: [{ meta.claims }] } }`
 * - `{ body: { data: [{ resource.meta.claims }] } }`
 */
export function extractPrimaryClaims(body: unknown): Record<string, unknown> {
  const root = asRecord(body) || {};
  const bodyNode = asRecord(root.body) || root;
  const data = Array.isArray(bodyNode.data) ? bodyNode.data : [];
  const first = asRecord(data[0]) || {};
  const firstMeta = asRecord(first.meta) || {};
  const resource = asRecord(first.resource) || {};
  const resourceMeta = asRecord(resource.meta) || {};
  return asRecord(firstMeta.claims) || asRecord(resourceMeta.claims) || {};
}

/**
 * Reads the current public/persisted `Offer.*` claim family from one GW poll
 * payload.
 */
export function readLicenseOfferPreviewFromResponseBody(body: unknown): LicenseOfferPreview {
  const claims = extractPrimaryClaims(body);
  return {
    offerId: normalizeText(claims[ClaimsOfferSchemaorg.identifier]),
    amount: normalizeText(claims[ClaimsOfferSchemaorg.price]),
    currency: normalizeText(claims[ClaimsOfferSchemaorg.priceCurrency]),
    seats: normalizeNumber(claims[ClaimsOfferSchemaorg.eligibleQuantityValue]),
    planName: normalizeText(claims[ClaimsOfferSchemaorg.itemOfferedName]),
    sku: normalizeText(claims[ClaimsOfferSchemaorg.itemOfferedSku]),
    paymentMethod: normalizeText(claims[ClaimsOfferSchemaorg.acceptedPaymentMethod]),
    checkoutUrl: normalizeText(claims[ClaimsOfferSchemaorg.checkoutPageURLTemplate]),
  };
}

/**
 * Reads the current public/persisted `Order.*` claim family from one GW poll
 * payload.
 */
export function readLicenseOrderSummaryFromResponseBody(body: unknown): LicenseOrderSummary {
  const claims = extractPrimaryClaims(body);
  return {
    acceptedOfferId: normalizeText(claims[ClaimsOrderSchemaorg.acceptedOfferIdentifier]),
    paymentUrl: normalizeText(claims[ClaimsOrderSchemaorg.paymentUrl]),
    invoiceId: normalizeText(claims[ClaimsOrderSchemaorg.partOfInvoice]),
    paymentMethod: normalizeText(claims[ClaimsOrderSchemaorg.paymentMethod]),
    activationCode: normalizeText(claims[ClaimsIndividualProductSchemaorg.serialNumber]),
    amount: normalizeText(claims[ClaimsOfferSchemaorg.price]),
    currency: normalizeText(claims[ClaimsOfferSchemaorg.priceCurrency]),
    seats: normalizeNumber(claims[ClaimsOfferSchemaorg.eligibleQuantityValue]),
  };
}

function createEditorFromFacade(
  facade: Omit<LicenseOfferOrderFacade, 'createEditor'>,
  initial?: Partial<LicenseOfferOrderDraft>,
): LicenseOfferOrderEditor {
  let draft = facade.createDraft(initial);

  const editor: LicenseOfferOrderEditor = {
    setOfferId(value) {
      draft = facade.setOfferId(draft, value);
      return editor;
    },
    setAmount(value) {
      draft = facade.setAmount(draft, value);
      return editor;
    },
    setCurrency(value) {
      draft = facade.setCurrency(draft, value);
      return editor;
    },
    setSeats(value) {
      draft = facade.setSeats(draft, value);
      return editor;
    },
    setPlanName(value) {
      draft = facade.setPlanName(draft, value);
      return editor;
    },
    setSku(value) {
      draft = facade.setSku(draft, value);
      return editor;
    },
    setPaymentMethod(value) {
      draft = facade.setPaymentMethod(draft, value);
      return editor;
    },
    setCheckoutUrl(value) {
      draft = facade.setCheckoutUrl(draft, value);
      return editor;
    },
    setAcceptedOfferId(value) {
      draft = facade.setAcceptedOfferId(draft, value);
      return editor;
    },
    setPaymentUrl(value) {
      draft = facade.setPaymentUrl(draft, value);
      return editor;
    },
    setInvoiceId(value) {
      draft = facade.setInvoiceId(draft, value);
      return editor;
    },
    setActivationCode(value) {
      draft = facade.setActivationCode(draft, value);
      return editor;
    },
    setBaseClaims(claims) {
      draft = facade.setBaseClaims(draft, claims);
      return editor;
    },
    getOfferPreview() {
      return cloneOffer(draft.offer);
    },
    getOrderSummary() {
      return cloneOrder(draft.order);
    },
    buildOfferClaims() {
      return facade.buildOfferClaims(draft);
    },
    buildOrderClaims() {
      return facade.buildOrderClaims(draft);
    },
    readOfferPreviewFromResponseBody(body) {
      const preview = facade.readOfferPreviewFromResponseBody(body);
      draft = patchDraft(draft, { offer: preview });
      return preview;
    },
    readOrderSummaryFromResponseBody(body) {
      const summary = facade.readOrderSummaryFromResponseBody(body);
      draft = patchDraft(draft, { order: summary });
      return summary;
    },
  };

  return editor;
}

/**
 * Creates the canonical helper facade for GW/gwtemplate license Offer/Order
 * claims.
 */
export function createLicenseOfferOrderFacade(): LicenseOfferOrderFacade {
  const facade: Omit<LicenseOfferOrderFacade, 'createEditor'> = {
    createDraft(initial = {}) {
      return {
        offer: cloneOffer(initial.offer),
        order: cloneOrder(initial.order),
        baseClaims: cloneClaims(initial.baseClaims),
      };
    },
    setOfferId(draft, value) { return patchDraft(draft, { offer: { offerId: value } }); },
    setAmount(draft, value) { return patchDraft(draft, { offer: { amount: value }, order: { amount: value } }); },
    setCurrency(draft, value) { return patchDraft(draft, { offer: { currency: value }, order: { currency: value } }); },
    setSeats(draft, value) { return patchDraft(draft, { offer: { seats: value }, order: { seats: value } }); },
    setPlanName(draft, value) { return patchDraft(draft, { offer: { planName: value } }); },
    setSku(draft, value) { return patchDraft(draft, { offer: { sku: value } }); },
    setPaymentMethod(draft, value) { return patchDraft(draft, { offer: { paymentMethod: value }, order: { paymentMethod: value } }); },
    setCheckoutUrl(draft, value) { return patchDraft(draft, { offer: { checkoutUrl: value } }); },
    setAcceptedOfferId(draft, value) { return patchDraft(draft, { order: { acceptedOfferId: value } }); },
    setPaymentUrl(draft, value) { return patchDraft(draft, { order: { paymentUrl: value } }); },
    setInvoiceId(draft, value) { return patchDraft(draft, { order: { invoiceId: value } }); },
    setActivationCode(draft, value) { return patchDraft(draft, { order: { activationCode: value } }); },
    setBaseClaims(draft, claims) { return patchDraft(draft, { baseClaims: claims }); },
    buildOfferClaims(draft) {
      const claims: LicenseClaims = {
        '@context': LicenseClaimContext.SchemaOrg,
        ...cloneClaims(draft.baseClaims),
      };
      if (draft.offer.offerId) claims[ClaimsOfferSchemaorg.identifier] = draft.offer.offerId;
      if (draft.offer.amount) claims[ClaimsOfferSchemaorg.price] = draft.offer.amount;
      if (draft.offer.currency) claims[ClaimsOfferSchemaorg.priceCurrency] = draft.offer.currency;
      if (typeof draft.offer.seats === 'number') claims[ClaimsOfferSchemaorg.eligibleQuantityValue] = draft.offer.seats;
      if (draft.offer.planName) claims[ClaimsOfferSchemaorg.itemOfferedName] = draft.offer.planName;
      if (draft.offer.sku) claims[ClaimsOfferSchemaorg.itemOfferedSku] = draft.offer.sku;
      if (draft.offer.paymentMethod) claims[ClaimsOfferSchemaorg.acceptedPaymentMethod] = draft.offer.paymentMethod;
      if (draft.offer.checkoutUrl) claims[ClaimsOfferSchemaorg.checkoutPageURLTemplate] = draft.offer.checkoutUrl;
      return claims;
    },
    buildOrderClaims(draft) {
      const claims = facade.buildOfferClaims(draft);
      if (draft.order.acceptedOfferId) claims[ClaimsOrderSchemaorg.acceptedOfferIdentifier] = draft.order.acceptedOfferId;
      if (draft.order.paymentUrl) claims[ClaimsOrderSchemaorg.paymentUrl] = draft.order.paymentUrl;
      if (draft.order.invoiceId) claims[ClaimsOrderSchemaorg.partOfInvoice] = draft.order.invoiceId;
      if (draft.order.paymentMethod) claims[ClaimsOrderSchemaorg.paymentMethod] = draft.order.paymentMethod;
      if (draft.order.activationCode) claims[ClaimsIndividualProductSchemaorg.serialNumber] = draft.order.activationCode;
      return claims;
    },
    readOfferPreviewFromResponseBody(body) { return readLicenseOfferPreviewFromResponseBody(body); },
    readOrderSummaryFromResponseBody(body) { return readLicenseOrderSummaryFromResponseBody(body); },
  };

  return {
    ...facade,
    createEditor(initial = {}) {
      return createEditorFromFacade(facade, initial);
    },
  };
}

/**
 * Creates the chainable editor shown in the 101 tests.
 */
export function createLicenseOfferOrderEditor(
  initial?: Partial<LicenseOfferOrderDraft>,
): LicenseOfferOrderEditor {
  return createLicenseOfferOrderFacade().createEditor(initial);
}
