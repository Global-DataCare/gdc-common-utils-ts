import { describe, expect, it } from '@jest/globals';

import {
  ChargeItemClaim,
  EXAMPLE_INVOICE_BUNDLE,
  EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A,
  EXAMPLE_INVOICE_CHARGEITEM_FHIR_CLAIMS_ROWS,
  EXAMPLE_INVOICE_FHIR_CLAIMS,
  InvoiceClaim,
  createInvoiceBundleEditor,
  getCode,
  getCodeText,
  getChargeItemList,
  getChargeItemPartOf,
  getChargeItemStatus,
  getInvoiceIdentifier,
  getQuantityNumber,
} from '../src';

describe('101: invoice claims', () => {
  it('builds contextualized Invoice.* claims from the high-level invoice bundle editor', () => {
    const editor = createInvoiceBundleEditor()
      .setInvoiceId(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Identifier] || '')
      .setIssuedAt(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Date] || '')
      .setSubjectReference(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Subject] || '')
      .setRecipientReference(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Recipient] || '')
      .setIssuerReference(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Issuer] || '')
      .setIssuerDisplay(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.IssuerDisplay] || '')
      .setAmount(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.TotalGrossValue] || '')
      .setCurrency(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.TotalGrossCurrency] || '')
      .setPaymentMethod(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.PaymentTerms] || '')
      .setPaymentUrl(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.PaymentUrl] || '');

    expect(editor.buildInvoiceClaims()).toEqual(EXAMPLE_INVOICE_FHIR_CLAIMS);
  });

  it('builds one repeated invoice + chargeitem claims row per business concept', () => {
    const rows = createInvoiceBundleEditor()
      .setInvoiceId(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Identifier] || '')
      .setIssuedAt(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Date] || '')
      .setSubjectReference(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Subject] || '')
      .setRecipientReference(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Recipient] || '')
      .setIssuerReference(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Issuer] || '')
      .setIssuerDisplay(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.IssuerDisplay] || '')
      .setAmount(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.TotalGrossValue] || '')
      .setCurrency(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.TotalGrossCurrency] || '')
      .setPaymentMethod(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.PaymentTerms] || '')
      .setPaymentUrl(EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.PaymentUrl] || '')
      .addChargeItem(EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A)
      .buildChargeItemClaimRows();

    expect(rows).toEqual([EXAMPLE_INVOICE_CHARGEITEM_FHIR_CLAIMS_ROWS[0]]);
    expect(rows[0][ChargeItemClaim.Identifier]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.identifier,
    );
    expect(rows[0][ChargeItemClaim.Status]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.status,
    );
    expect(rows[0][ChargeItemClaim.PartOf]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.partOf,
    );
    expect(rows[0][ChargeItemClaim.Code]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.code,
    );
    expect(rows[0][ChargeItemClaim.Quantity]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.quantity,
    );
    expect(rows[0][ChargeItemClaim.QuantityNumber]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.quantityNumber,
    );
    expect(rows[0][ChargeItemClaim.QuantityUnit]).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.quantityUnit,
    );
  });

  it('embeds invoice meta.claims in the generated FHIR Invoice resource', () => {
    const entry = Array.isArray((EXAMPLE_INVOICE_BUNDLE as any).entry) ? (EXAMPLE_INVOICE_BUNDLE as any).entry[0] : undefined;
    expect(entry?.resource?.resourceType).toBe('Invoice');
    expect(entry?.resource?.meta?.claims).toEqual(EXAMPLE_INVOICE_FHIR_CLAIMS);
  });

  it('exposes explicit helper getters for programming assistance on invoice and chargeitem claims', () => {
    const row = EXAMPLE_INVOICE_CHARGEITEM_FHIR_CLAIMS_ROWS[0];

    expect(getInvoiceIdentifier(EXAMPLE_INVOICE_FHIR_CLAIMS)).toBe(
      EXAMPLE_INVOICE_FHIR_CLAIMS[InvoiceClaim.Identifier],
    );
    expect(getChargeItemStatus(row)).toBe(EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.status);
    expect(getChargeItemPartOf(row)).toBe(EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.partOf);
    expect(getCode(row)).toBe(EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.code);
    expect(getCodeText(row)).toBe(EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.codeText);
    expect(getQuantityNumber(row)).toBe(
      EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.quantityNumber,
    );
  });

  it('builds a high-level charge item list view from repeated invoice claim rows', () => {
    expect(getChargeItemList(EXAMPLE_INVOICE_CHARGEITEM_FHIR_CLAIMS_ROWS)).toEqual([
      expect.objectContaining({
        identifier: EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.identifier,
        status: EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.status,
        partOf: EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.partOf,
        code: EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.code,
        codeText: EXAMPLE_INVOICE_CHARGE_ITEM_ROW_A.codeText,
      }),
    ]);
  });
});
