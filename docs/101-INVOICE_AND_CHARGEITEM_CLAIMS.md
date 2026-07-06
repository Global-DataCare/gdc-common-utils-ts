# Invoice And ChargeItem Claims 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This is the shared-guide for invoice and charge-item claims used by frontend,
portal, and backend-facing SDK layers.

Use this when you need to understand:

- which business fields are modeled as canonical flat claims
- which parts align directly with HL7 FHIR `Invoice` and `ChargeItem`
- which parts are operational helpers added for UI/search/readback
- how to build or read invoice rows without starting from raw claim strings

Read in this order:

1. [101-LICENSE_OFFERS_ORDERS_AND_LISTS.md](./101-LICENSE_OFFERS_ORDERS_AND_LISTS.md)
2. this file
3. the executable tests linked below

## Model

This layer is claims-first.

That means:

- canonical business data lives in flat claims
- FHIR `Invoice` is one downstream projection
- repeated `ChargeItem` rows can later be compacted into one FHIR `Invoice`
  with several line items

The current pattern is:

- one invoice-level claim object
- zero or more charge-item rows
- each charge-item row repeats the invoice context needed for search/readback

## Standard Vs Operational Fields

The shared shape separates two concerns:

- FHIR-aligned fields
  - `Invoice.identifier`
  - `Invoice.date`
  - `Invoice.status`
  - `Invoice.subject`
  - `Invoice.recipient`
  - `Invoice.issuer`
  - `ChargeItem.identifier`
  - `ChargeItem.status`
  - `ChargeItem.part-of`
  - `ChargeItem.code`
  - `ChargeItem.quantity`
- operational/UI/readback helpers
  - `Invoice.issuer-display`
  - `Invoice.payment-terms`
  - `Invoice.payment-url`
  - `Invoice.totalnet-value`
  - `Invoice.totalnet-currency`
  - `Invoice.totalgross-value`
  - `Invoice.totalgross-currency`
  - `ChargeItem.code-text`
  - `ChargeItem.category`
  - `ChargeItem.supplier-productcode`
  - `ChargeItem.quantity-number`
  - `ChargeItem.quantity-unit`
  - `ChargeItem.items-per-unit`
  - `ChargeItem.items-quantity`
  - `ChargeItem.items-quantity-number`
  - `ChargeItem.items-quantity-unit`

The rule is:

- if HL7 FHIR already gives a useful semantic parameter, keep that name
- if UI/search needs scalarized fields, expose them next to the canonical field

## ChargeItem Search Shape

Charge items should be treated similarly to `Observation.component` in the
sense that the searchable facts often live at line level, not only at the
invoice parent level.

Typical search/filter entry points are:

- `ChargeItem.code`
- `ChargeItem.code-text`
- `ChargeItem.status`
- `ChargeItem.quantity`
- `ChargeItem.quantity-number`
- `ChargeItem.quantity-unit`
- `ChargeItem.items-quantity`
- `ChargeItem.items-quantity-number`
- `ChargeItem.items-quantity-unit`

After matching a charge item, the caller can recover its parent invoice through:

- `ChargeItem.part-of`

In the current shared editor, `ChargeItem.part-of` defaults to the current
`Invoice.identifier` unless a custom parent identifier is set explicitly.

## High-Level Helpers

Use:

- `createInvoiceBundleEditor()`

to build invoice-level and charge-item-level business data.

For programming help and autocomplete, prefer the explicit getters instead of
only the generic claim accessor:

- `getInvoiceIdentifier()`
- `getInvoiceDate()`
- `getInvoiceStatus()`
- `getInvoiceSubject()`
- `getInvoiceRecipient()`
- `getInvoiceIssuer()`
- `getInvoiceIssuerDisplay()`
- `getInvoicePaymentTerms()`
- `getInvoicePaymentUrl()`
- `getInvoiceTotalNetValue()`
- `getInvoiceTotalNetCurrency()`
- `getInvoiceTotalGrossValue()`
- `getInvoiceTotalGrossCurrency()`
- `getChargeItemIdentifier()`
- `getChargeItemStatus()`
- `getChargeItemPartOf()`
- `getCode()`
- `getCodeText()`
- `getCategory()`
- `getSupplierProductCode()`
- `getQuantity()`
- `getQuantityNumber()`
- `getQuantityUnit()`
- `getItemsPerUnit()`
- `getItemsQuantity()`
- `getItemsQuantityNumber()`
- `getItemsQuantityUnit()`

For generic low-level access, the following still exist:

- `getInvoiceClaim(...)`
- `getChargeItemClaim(...)`

## Read Models

Use:

- `getChargeItemView(...)`
- `getChargeItemList(...)`

These helpers exist so UI code can paint charge-item rows without repeating
claim-key lookups everywhere.

The intent is:

- search/filter against charge-item claims
- materialize a list view
- navigate to the parent invoice with `part-of`

## FHIR Projection Boundary

The shared contract is not “FHIR only”.

The current boundary is:

- canonical business data = short claims without transport/version prefix
- optional contextualized claims = `org.hl7.fhir.api.*`
- FHIR resources = one projection target

This keeps the contract reusable for:

- healthcare/FHIR
- portal/BFF search materialization
- future non-FHIR sectors that still want the same business semantics

## Where To See It Working

Executable teaching reference:

- [__tests__/101-invoice-claims.test.ts](../__tests__/101-invoice-claims.test.ts)

Shared examples:

- [src/examples/invoice.ts](../src/examples/invoice.ts)

Shared helpers:

- [src/models/interoperable-claims/invoice-claims.ts](../src/models/interoperable-claims/invoice-claims.ts)
- [src/utils/invoice-bundle.ts](../src/utils/invoice-bundle.ts)
