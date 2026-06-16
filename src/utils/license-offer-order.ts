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

export type LicenseOfferOrderState = Readonly<{
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
  createState(initial?: Partial<LicenseOfferOrderState>): LicenseOfferOrderState;
  setOfferId(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setAmount(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setCurrency(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setSeats(state: LicenseOfferOrderState, value: number): LicenseOfferOrderState;
  setPlanName(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setSku(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setPaymentMethod(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setCheckoutUrl(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setAcceptedOfferId(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setPaymentUrl(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setInvoiceId(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setActivationCode(state: LicenseOfferOrderState, value: string): LicenseOfferOrderState;
  setBaseClaims(state: LicenseOfferOrderState, claims: LicenseClaims): LicenseOfferOrderState;
  buildOfferClaims(state: LicenseOfferOrderState): LicenseClaims;
  buildOrderClaims(state: LicenseOfferOrderState): LicenseClaims;
  readOfferPreviewFromResponseBody(body: unknown): LicenseOfferPreview;
  readOrderSummaryFromResponseBody(body: unknown): LicenseOrderSummary;
  createEditor(initial?: Partial<LicenseOfferOrderState>): LicenseOfferOrderEditor;
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

function patchState(
  state: LicenseOfferOrderState,
  patch: Partial<LicenseOfferOrderState>,
): LicenseOfferOrderState {
  return {
    offer: patch.offer ? cloneOffer({ ...state.offer, ...patch.offer }) : state.offer,
    order: patch.order ? cloneOrder({ ...state.order, ...patch.order }) : state.order,
    baseClaims: patch.baseClaims ? cloneClaims(patch.baseClaims) : cloneClaims(state.baseClaims),
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
  initial?: Partial<LicenseOfferOrderState>,
): LicenseOfferOrderEditor {
  let state = facade.createState(initial);

  const editor: LicenseOfferOrderEditor = {
    setOfferId(value) {
      state = facade.setOfferId(state, value);
      return editor;
    },
    setAmount(value) {
      state = facade.setAmount(state, value);
      return editor;
    },
    setCurrency(value) {
      state = facade.setCurrency(state, value);
      return editor;
    },
    setSeats(value) {
      state = facade.setSeats(state, value);
      return editor;
    },
    setPlanName(value) {
      state = facade.setPlanName(state, value);
      return editor;
    },
    setSku(value) {
      state = facade.setSku(state, value);
      return editor;
    },
    setPaymentMethod(value) {
      state = facade.setPaymentMethod(state, value);
      return editor;
    },
    setCheckoutUrl(value) {
      state = facade.setCheckoutUrl(state, value);
      return editor;
    },
    setAcceptedOfferId(value) {
      state = facade.setAcceptedOfferId(state, value);
      return editor;
    },
    setPaymentUrl(value) {
      state = facade.setPaymentUrl(state, value);
      return editor;
    },
    setInvoiceId(value) {
      state = facade.setInvoiceId(state, value);
      return editor;
    },
    setActivationCode(value) {
      state = facade.setActivationCode(state, value);
      return editor;
    },
    setBaseClaims(claims) {
      state = facade.setBaseClaims(state, claims);
      return editor;
    },
    getOfferPreview() {
      return cloneOffer(state.offer);
    },
    getOrderSummary() {
      return cloneOrder(state.order);
    },
    buildOfferClaims() {
      return facade.buildOfferClaims(state);
    },
    buildOrderClaims() {
      return facade.buildOrderClaims(state);
    },
    readOfferPreviewFromResponseBody(body) {
      const preview = facade.readOfferPreviewFromResponseBody(body);
      state = patchState(state, { offer: preview });
      return preview;
    },
    readOrderSummaryFromResponseBody(body) {
      const summary = facade.readOrderSummaryFromResponseBody(body);
      state = patchState(state, { order: summary });
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
    createState(initial = {}) {
      return {
        offer: cloneOffer(initial.offer),
        order: cloneOrder(initial.order),
        baseClaims: cloneClaims(initial.baseClaims),
      };
    },
    setOfferId(state, value) { return patchState(state, { offer: { offerId: value } }); },
    setAmount(state, value) { return patchState(state, { offer: { amount: value }, order: { amount: value } }); },
    setCurrency(state, value) { return patchState(state, { offer: { currency: value }, order: { currency: value } }); },
    setSeats(state, value) { return patchState(state, { offer: { seats: value }, order: { seats: value } }); },
    setPlanName(state, value) { return patchState(state, { offer: { planName: value } }); },
    setSku(state, value) { return patchState(state, { offer: { sku: value } }); },
    setPaymentMethod(state, value) { return patchState(state, { offer: { paymentMethod: value }, order: { paymentMethod: value } }); },
    setCheckoutUrl(state, value) { return patchState(state, { offer: { checkoutUrl: value } }); },
    setAcceptedOfferId(state, value) { return patchState(state, { order: { acceptedOfferId: value } }); },
    setPaymentUrl(state, value) { return patchState(state, { order: { paymentUrl: value } }); },
    setInvoiceId(state, value) { return patchState(state, { order: { invoiceId: value } }); },
    setActivationCode(state, value) { return patchState(state, { order: { activationCode: value } }); },
    setBaseClaims(state, claims) { return patchState(state, { baseClaims: claims }); },
    buildOfferClaims(state) {
      const claims: LicenseClaims = {
        '@context': LicenseClaimContext.SchemaOrg,
        ...cloneClaims(state.baseClaims),
      };
      if (state.offer.offerId) claims[ClaimsOfferSchemaorg.identifier] = state.offer.offerId;
      if (state.offer.amount) claims[ClaimsOfferSchemaorg.price] = state.offer.amount;
      if (state.offer.currency) claims[ClaimsOfferSchemaorg.priceCurrency] = state.offer.currency;
      if (typeof state.offer.seats === 'number') claims[ClaimsOfferSchemaorg.eligibleQuantityValue] = state.offer.seats;
      if (state.offer.planName) claims[ClaimsOfferSchemaorg.itemOfferedName] = state.offer.planName;
      if (state.offer.sku) claims[ClaimsOfferSchemaorg.itemOfferedSku] = state.offer.sku;
      if (state.offer.paymentMethod) claims[ClaimsOfferSchemaorg.acceptedPaymentMethod] = state.offer.paymentMethod;
      if (state.offer.checkoutUrl) claims[ClaimsOfferSchemaorg.checkoutPageURLTemplate] = state.offer.checkoutUrl;
      return claims;
    },
    buildOrderClaims(state) {
      const claims = facade.buildOfferClaims(state);
      if (state.order.acceptedOfferId) claims[ClaimsOrderSchemaorg.acceptedOfferIdentifier] = state.order.acceptedOfferId;
      if (state.order.paymentUrl) claims[ClaimsOrderSchemaorg.paymentUrl] = state.order.paymentUrl;
      if (state.order.invoiceId) claims[ClaimsOrderSchemaorg.partOfInvoice] = state.order.invoiceId;
      if (state.order.paymentMethod) claims[ClaimsOrderSchemaorg.paymentMethod] = state.order.paymentMethod;
      if (state.order.activationCode) claims[ClaimsIndividualProductSchemaorg.serialNumber] = state.order.activationCode;
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
  initial?: Partial<LicenseOfferOrderState>,
): LicenseOfferOrderEditor {
  return createLicenseOfferOrderFacade().createEditor(initial);
}
