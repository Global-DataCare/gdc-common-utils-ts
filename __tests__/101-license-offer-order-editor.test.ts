/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  EXAMPLE_LICENSE_AMOUNT,
  EXAMPLE_LICENSE_CHECKOUT_URL,
  EXAMPLE_LICENSE_CURRENCY,
  EXAMPLE_LICENSE_INVOICE_ID,
  EXAMPLE_LICENSE_OFFER_ID,
  EXAMPLE_LICENSE_OFFER_PREVIEW,
  EXAMPLE_LICENSE_OFFER_RESPONSE_BODY,
  EXAMPLE_LICENSE_ORDER_RESPONSE_BODY,
  EXAMPLE_LICENSE_ORDER_SUMMARY,
  EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE,
  EXAMPLE_LICENSE_PAYMENT_URL,
  EXAMPLE_LICENSE_PLAN_NAME,
  EXAMPLE_LICENSE_SEAT_UUIDS,
  EXAMPLE_LICENSE_SKU,
  createLicenseOfferOrderEditor,
} from '../src';
import {
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsOrderSchemaorg,
} from '../src/constants/schemaorg.js';

describe('101: license offer order editor', () => {
  it('builds the canonical gwtemplate-ready offer/order claims with one chainable editor and reopens them from GW responses', () => {
    // Teaching goal:
    // - the app owns one in-memory draft for the commercial license lifecycle
    // - the app fills the offer/order fields through chainable setters
    // - the app emits canonical flat schema.org claims for GW/gwtemplate
    // - the app later reads the persisted GW response back into the same shape

    // Step 1.
    // Build one draft exactly like an app/backend helper would do before
    // wrapping the payload into DIDComm transport.
    const editor = createLicenseOfferOrderEditor()
      .setOfferId(EXAMPLE_LICENSE_OFFER_ID)
      .setAmount(EXAMPLE_LICENSE_AMOUNT)
      .setCurrency(EXAMPLE_LICENSE_CURRENCY)
      .setSeats(EXAMPLE_LICENSE_SEAT_UUIDS.length)
      .setPlanName(EXAMPLE_LICENSE_PLAN_NAME)
      .setSku(EXAMPLE_LICENSE_SKU)
      .setPaymentMethod(EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE)
      .setCheckoutUrl(EXAMPLE_LICENSE_CHECKOUT_URL)
      .setAcceptedOfferId(EXAMPLE_LICENSE_OFFER_ID)
      .setPaymentUrl(EXAMPLE_LICENSE_PAYMENT_URL)
      .setInvoiceId(EXAMPLE_LICENSE_INVOICE_ID)
      .setActivationCode(EXAMPLE_EMPLOYEE_ACTIVATION_CODE);

    // Step 2.
    // Emit the canonical flat claims that gwtemplate/GW already understands.
    const offerClaims = editor.buildOfferClaims();
    const orderClaims = editor.buildOrderClaims();

    expect(offerClaims[ClaimsOfferSchemaorg.identifier]).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(offerClaims[ClaimsOfferSchemaorg.itemOfferedName]).toBe(EXAMPLE_LICENSE_PLAN_NAME);
    expect(offerClaims[ClaimsOfferSchemaorg.checkoutPageURLTemplate]).toBe(EXAMPLE_LICENSE_CHECKOUT_URL);
    expect(orderClaims[ClaimsOrderSchemaorg.acceptedOfferIdentifier]).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(orderClaims[ClaimsOrderSchemaorg.paymentUrl]).toBe(EXAMPLE_LICENSE_PAYMENT_URL);
    expect(orderClaims[ClaimsOrderSchemaorg.partOfInvoice]).toBe(EXAMPLE_LICENSE_INVOICE_ID);
    expect(orderClaims[ClaimsIndividualProductSchemaorg.serialNumber]).toBe(EXAMPLE_EMPLOYEE_ACTIVATION_CODE);

    // Step 3.
    // Read the same business shape back from the GW poll payloads.
    const reloadedOffer = editor.readOfferPreviewFromResponseBody(EXAMPLE_LICENSE_OFFER_RESPONSE_BODY);
    const reloadedOrder = editor.readOrderSummaryFromResponseBody(EXAMPLE_LICENSE_ORDER_RESPONSE_BODY);

    // Final didactic proof:
    // the editor and the GW response reader converge on the same high-level
    // contract that frontends/backends can exchange safely.
    expect(editor.getOfferPreview()).toEqual(EXAMPLE_LICENSE_OFFER_PREVIEW);
    expect(reloadedOffer).toEqual(EXAMPLE_LICENSE_OFFER_PREVIEW);
    expect(editor.getOrderSummary()).toEqual(EXAMPLE_LICENSE_ORDER_SUMMARY);
    expect(reloadedOrder).toEqual(EXAMPLE_LICENSE_ORDER_SUMMARY);
  });
});
