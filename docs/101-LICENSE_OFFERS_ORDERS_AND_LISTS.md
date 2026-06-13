# License Offers, Orders, And Lists 101

This is the frontend/integrator guide for the commercial/license-facing shared
helpers.

Use this when you need to understand:

- how to build or read license offer/order data at a high level
- how to think about license list/search filters without starting from raw
  claims
- which parts are already shared semantics and which parts still depend on a
  portal/backend orchestration layer

Read in this order:

1. [101-LIFECYCLE.md](./101-LIFECYCLE.md)
2. this file
3. [101-INVOICE_AND_CHARGEITEM_CLAIMS.md](./101-INVOICE_AND_CHARGEITEM_CLAIMS.md)
4. the executable tests linked below

## What This Layer Is For

For frontend and portal integration, this shared layer should answer questions
such as:

- what offer is the user looking at
- what order is being confirmed
- how many seats are involved
- which payment/invoice fields should be shown
- how to prepare or read license list/search filters

This layer should hide low-level details such as:

- raw flat claim keys
- route-specific GW plumbing
- submit/poll transport envelopes

## The Shared High-Level Editor

Use:

- `createLicenseOfferOrderEditor()`

This is the chainable high-level editor for:

- offer preview fields
- order/payment fields
- later reading those same fields back from GW poll payloads

Typical chainable setters:

- `setOfferId(...)`
- `setAmount(...)`
- `setCurrency(...)`
- `setSeats(...)`
- `setPlanName(...)`
- `setSku(...)`
- `setPaymentMethod(...)`
- `setCheckoutUrl(...)`
- `setAcceptedOfferId(...)`
- `setPaymentUrl(...)`
- `setInvoiceId(...)`
- `setActivationCode(...)`

## Recommended Frontend Flow

Read the commercial flow in this order:

1. one app/backend helper builds the offer/order draft locally
2. that helper emits the canonical shared claim shape
3. a lower SDK/runtime/backend layer encapsulates or submits it
4. the app later reads the returned GW response back into the same high-level
   summary shape

Example:

```ts
import {
  EXAMPLE_LICENSE_AMOUNT,
  EXAMPLE_LICENSE_CURRENCY,
  EXAMPLE_LICENSE_OFFER_ID,
  EXAMPLE_LICENSE_PLAN_NAME,
  EXAMPLE_LICENSE_SKU,
  createLicenseOfferOrderEditor,
} from 'gdc-common-utils-ts';

const editor = createLicenseOfferOrderEditor()
  .setOfferId(EXAMPLE_LICENSE_OFFER_ID)
  .setAmount(EXAMPLE_LICENSE_AMOUNT)
  .setCurrency(EXAMPLE_LICENSE_CURRENCY)
  .setPlanName(EXAMPLE_LICENSE_PLAN_NAME)
  .setSku(EXAMPLE_LICENSE_SKU);

const offerClaims = editor.buildOfferClaims();
```

The important thing for frontend work is not the raw claim names.
The important thing is that the editor gives one stable semantic API for:

- building the data
- later reading it back

## Reading Offer/Order Responses

Use the same editor to reopen the response shape:

- `readOfferPreviewFromResponseBody(...)`
- `readOrderSummaryFromResponseBody(...)`

That lets the UI work with stable high-level summaries such as:

- `offerId`
- `amount`
- `currency`
- `seats`
- `planName`
- `paymentUrl`
- `invoiceId`
- `activationCode`

instead of parsing raw GW payloads directly in the UI.

## License Lists And Filters

Shared helpers already model part of the list/search domain, for example:

- `buildLicenseSearchEntry(...)`

The current shared model already treats these as high-level filters:

- serial number
- user class
- app type
- email
- role
- status
- subject id

What is still not fully converged yet is the full public list/search facade for:

- `active`
- `unused`
- `assigned`
- `period`
- actor-specific list views

So for frontend teams, the practical rule is:

- use the shared helpers for the filters that already exist
- do not assume the final portal/backend list API is fully stabilized yet

## Where To See It Working

Executable teaching references:

- [__tests__/101-license-offer-order-editor.test.ts](../__tests__/101-license-offer-order-editor.test.ts)
  - chainable editor + response reader for offer/order
- [__tests__/101-license-examples.test.ts](../__tests__/101-license-examples.test.ts)
  - issue/purchase/search helpers and their current high-level selectors
- [__tests__/101-license-list-search.test.ts](../__tests__/101-license-list-search.test.ts)
  - high-level search/list draft plus frontend-friendly list reader

Shared examples:

- [src/examples/license.ts](../src/examples/license.ts)
- [src/examples/invoice.ts](../src/examples/invoice.ts)

Shared helpers:

- [src/utils/license-offer-order.ts](../src/utils/license-offer-order.ts)
- [src/utils/license.ts](../src/utils/license.ts)
- [src/utils/license-list-search.ts](../src/utils/license-list-search.ts)
- [src/utils/invoice-bundle.ts](../src/utils/invoice-bundle.ts)

## Boundary Reminder

Do not confuse these two things:

- shared license semantics
  - offer/order summaries
  - search filters
  - list/read helpers
- portal/backend orchestration
  - payment confirmation
  - commercial history materialization
  - final API routes exposed to the browser

The first belongs here.
The second still depends on the backend you build on top.
