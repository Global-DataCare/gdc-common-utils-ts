// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/invoice-claims.ts

import type { ClaimSpec } from './types';

/**
 * Canonical flat claim keys for invoice-level business data.
 *
 * These claims are the claims-first source of truth. FHIR `Invoice` is one
 * downstream projection built from them.
 */
export const InvoiceClaim = {
  /** Stable business invoice identifier. Example: `invoice-001`. */
  Identifier: 'Invoice.identifier',
  /** Invoice issue date/time. Example: `2026-06-11T10:00:00Z`. */
  Date: 'Invoice.date',
  /** Invoice lifecycle status. Example: `issued`. */
  Status: 'Invoice.status',
  /** Subject or tenant context reference. Example: `did:web:host.example.com:health-care;organization:taxid:VATES-B00112233:individual:multibase:zExampleIndividualId`. */
  Subject: 'Invoice.subject',
  /** Billed recipient reference. Example: `did:web:portal.example.org:billing`. */
  Recipient: 'Invoice.recipient',
  /** Invoice issuer reference. Example: `did:web:api.acme.org`. */
  Issuer: 'Invoice.issuer',
  /** Human-readable issuer label. Example: `Gateway Host Services`. */
  IssuerDisplay: 'Invoice.issuer-display',
  /** Commercial payment method/terms. Example: `invoice`. */
  PaymentTerms: 'Invoice.payment-terms',
  /** Payment or settlement URL when available. Example: `https://pay.example/invoice-001`. */
  PaymentUrl: 'Invoice.payment-url',
  /** Net amount numeric value serialized as string. Example: `9.99`. */
  TotalNetValue: 'Invoice.totalnet-value',
  /** Net amount ISO currency. Example: `EUR`. */
  TotalNetCurrency: 'Invoice.totalnet-currency',
  /** Gross amount numeric value serialized as string. Example: `9.99`. */
  TotalGrossValue: 'Invoice.totalgross-value',
  /** Gross amount ISO currency. Example: `EUR`. */
  TotalGrossCurrency: 'Invoice.totalgross-currency',
} as const;

export type InvoiceClaimKey = typeof InvoiceClaim[keyof typeof InvoiceClaim];
export interface InvoiceClaims {
  [InvoiceClaim.Identifier]?: string;
  [InvoiceClaim.Date]?: string;
  [InvoiceClaim.Status]?: string;
  [InvoiceClaim.Subject]?: string;
  [InvoiceClaim.Recipient]?: string;
  [InvoiceClaim.Issuer]?: string;
  [InvoiceClaim.IssuerDisplay]?: string;
  [InvoiceClaim.PaymentTerms]?: string;
  [InvoiceClaim.PaymentUrl]?: string;
  [InvoiceClaim.TotalNetValue]?: string;
  [InvoiceClaim.TotalNetCurrency]?: string;
  [InvoiceClaim.TotalGrossValue]?: string;
  [InvoiceClaim.TotalGrossCurrency]?: string;
}

/**
 * Contextualized FHIR-API-like invoice claims.
 *
 * Convention:
 * - `org.hl7.fhir.api.Invoice.<concrete-parameter>`
 * - scalar/string-friendly values only
 * - invoice totals/payment URL remain extension-style operational claims
 *   because not every business field maps to one native FHIR search parameter
 */
export enum InvoiceClaimsFhirApiExtended {
  Identifier = 'org.hl7.fhir.api.Invoice.identifier',
  Date = 'org.hl7.fhir.api.Invoice.date',
  Status = 'org.hl7.fhir.api.Invoice.status',
  Subject = 'org.hl7.fhir.api.Invoice.subject',
  Recipient = 'org.hl7.fhir.api.Invoice.recipient',
  Issuer = 'org.hl7.fhir.api.Invoice.issuer',
  IssuerDisplay = 'org.hl7.fhir.api.Invoice.issuer-display',
  PaymentTerms = 'org.hl7.fhir.api.Invoice.payment-terms',
  PaymentUrl = 'org.hl7.fhir.api.Invoice.payment-url',
  TotalNetValue = 'org.hl7.fhir.api.Invoice.totalnet-value',
  TotalNetCurrency = 'org.hl7.fhir.api.Invoice.totalnet-currency',
  TotalGrossValue = 'org.hl7.fhir.api.Invoice.totalgross-value',
  TotalGrossCurrency = 'org.hl7.fhir.api.Invoice.totalgross-currency',
}

/**
 * Canonical non-contextualized parameter names for query builders and readers.
 */
export const InvoiceSearchParamNames = {
  Identifier: 'identifier',
  Date: 'date',
  Status: 'status',
  Subject: 'subject',
  Recipient: 'recipient',
  Issuer: 'issuer',
  IssuerDisplay: 'issuer-display',
  PaymentTerms: 'payment-terms',
  PaymentUrl: 'payment-url',
  TotalNetValue: 'totalnet-value',
  TotalNetCurrency: 'totalnet-currency',
  TotalGrossValue: 'totalgross-value',
  TotalGrossCurrency: 'totalgross-currency',
} as const;

/**
 * Charge-item-level claims used when one business invoice line is represented
 * as one claims row. The future FHIR export can compact multiple rows sharing
 * one invoice identifier into a single `Invoice` with multiple items.
 *
 * Note:
 * - FHIR `Invoice` does not expose all these details as search parameters.
 * - `ChargeItem` is therefore modeled here as claims-first operational data.
 */
export const ChargeItemClaim = {
  /** Stable invoice line identifier. Example: `chargeitem-001`. */
  Identifier: 'ChargeItem.identifier',
  /** Charge item lifecycle status from FHIR ChargeItemStatus. Example: `billable`. */
  Status: 'ChargeItem.status',
  /** Parent business aggregate identifier. Example: `invoice-001`. */
  PartOf: 'ChargeItem.part-of',
  /** Public code such as GTIN/UDI/barcode. Example: `08412345678903`. */
  Code: 'ChargeItem.code',
  /** Local-language UI/help label for the coded product. Example: `Sterile saline bottle 500 mL`. */
  CodeText: 'ChargeItem.code-text',
  /** Normalized aggregate reporting category. Example: `medical-supplies`. */
  Category: 'ChargeItem.category',
  /** Supplier or import product code. Example: `IMP-SAL-500`. */
  SupplierProductCode: 'ChargeItem.supplier-productcode',
  /** Compact FHIR-style quantity token for search/readback. Example: `3|bottle`. */
  Quantity: 'ChargeItem.quantity',
  /** Main quantity numeric scalar serialized as string. Example: `3`. */
  QuantityNumber: 'ChargeItem.quantity-number',
  /** Main quantity unit code or label. Example: `bottle`. */
  QuantityUnit: 'ChargeItem.quantity-unit',
  /** Contained items per main unit. Example: `24`. */
  ItemsPerUnit: 'ChargeItem.items-per-unit',
  /** Compact contained-item quantity token for search/readback. Example: `500|mL`. */
  ItemsQuantity: 'ChargeItem.items-quantity',
  /** Contained item numeric quantity serialized as string. Example: `500`. */
  ItemsQuantityNumber: 'ChargeItem.items-quantity-number',
  /** Contained item UCUM-like unit. Example: `mL`. */
  ItemsQuantityUnit: 'ChargeItem.items-quantity-unit',
} as const;

export type ChargeItemClaimKey = typeof ChargeItemClaim[keyof typeof ChargeItemClaim];
export interface ChargeItemClaims {
  [ChargeItemClaim.Identifier]?: string;
  [ChargeItemClaim.Status]?: string;
  [ChargeItemClaim.PartOf]?: string;
  [ChargeItemClaim.Code]?: string;
  [ChargeItemClaim.CodeText]?: string;
  [ChargeItemClaim.Category]?: string;
  [ChargeItemClaim.SupplierProductCode]?: string;
  [ChargeItemClaim.Quantity]?: string;
  [ChargeItemClaim.QuantityNumber]?: string;
  [ChargeItemClaim.QuantityUnit]?: string;
  [ChargeItemClaim.ItemsPerUnit]?: string;
  [ChargeItemClaim.ItemsQuantity]?: string;
  [ChargeItemClaim.ItemsQuantityNumber]?: string;
  [ChargeItemClaim.ItemsQuantityUnit]?: string;
}

export enum ChargeItemClaimsFhirApiExtended {
  Identifier = 'org.hl7.fhir.api.ChargeItem.identifier',
  Status = 'org.hl7.fhir.api.ChargeItem.status',
  PartOf = 'org.hl7.fhir.api.ChargeItem.part-of',
  Code = 'org.hl7.fhir.api.ChargeItem.code',
  CodeText = 'org.hl7.fhir.api.ChargeItem.code-text',
  Category = 'org.hl7.fhir.api.ChargeItem.category',
  SupplierProductCode = 'org.hl7.fhir.api.ChargeItem.supplier-productcode',
  Quantity = 'org.hl7.fhir.api.ChargeItem.quantity',
  QuantityNumber = 'org.hl7.fhir.api.ChargeItem.quantity-number',
  QuantityUnit = 'org.hl7.fhir.api.ChargeItem.quantity-unit',
  ItemsPerUnit = 'org.hl7.fhir.api.ChargeItem.items-per-unit',
  ItemsQuantity = 'org.hl7.fhir.api.ChargeItem.items-quantity',
  ItemsQuantityNumber = 'org.hl7.fhir.api.ChargeItem.items-quantity-number',
  ItemsQuantityUnit = 'org.hl7.fhir.api.ChargeItem.items-quantity-unit',
}

export const ChargeItemSearchParamNames = {
  Identifier: 'identifier',
  Status: 'status',
  PartOf: 'part-of',
  Code: 'code',
  CodeText: 'code-text',
  Category: 'category',
  SupplierProductCode: 'supplier-productcode',
  Quantity: 'quantity',
  QuantityNumber: 'quantity-number',
  QuantityUnit: 'quantity-unit',
  ItemsPerUnit: 'items-per-unit',
  ItemsQuantity: 'items-quantity',
  ItemsQuantityNumber: 'items-quantity-number',
  ItemsQuantityUnit: 'items-quantity-unit',
} as const;

export interface InvoiceClaimsContextualized {
  [InvoiceClaimsFhirApiExtended.Identifier]?: string;
  [InvoiceClaimsFhirApiExtended.Date]?: string;
  [InvoiceClaimsFhirApiExtended.Status]?: string;
  [InvoiceClaimsFhirApiExtended.Subject]?: string;
  [InvoiceClaimsFhirApiExtended.Recipient]?: string;
  [InvoiceClaimsFhirApiExtended.Issuer]?: string;
  [InvoiceClaimsFhirApiExtended.IssuerDisplay]?: string;
  [InvoiceClaimsFhirApiExtended.PaymentTerms]?: string;
  [InvoiceClaimsFhirApiExtended.PaymentUrl]?: string;
  [InvoiceClaimsFhirApiExtended.TotalNetValue]?: string;
  [InvoiceClaimsFhirApiExtended.TotalNetCurrency]?: string;
  [InvoiceClaimsFhirApiExtended.TotalGrossValue]?: string;
  [InvoiceClaimsFhirApiExtended.TotalGrossCurrency]?: string;
}

export interface ChargeItemClaimsContextualized {
  [ChargeItemClaimsFhirApiExtended.Identifier]?: string;
  [ChargeItemClaimsFhirApiExtended.Status]?: string;
  [ChargeItemClaimsFhirApiExtended.PartOf]?: string;
  [ChargeItemClaimsFhirApiExtended.Code]?: string;
  [ChargeItemClaimsFhirApiExtended.CodeText]?: string;
  [ChargeItemClaimsFhirApiExtended.Category]?: string;
  [ChargeItemClaimsFhirApiExtended.SupplierProductCode]?: string;
  [ChargeItemClaimsFhirApiExtended.Quantity]?: string;
  [ChargeItemClaimsFhirApiExtended.QuantityNumber]?: string;
  [ChargeItemClaimsFhirApiExtended.QuantityUnit]?: string;
  [ChargeItemClaimsFhirApiExtended.ItemsPerUnit]?: string;
  [ChargeItemClaimsFhirApiExtended.ItemsQuantity]?: string;
  [ChargeItemClaimsFhirApiExtended.ItemsQuantityNumber]?: string;
  [ChargeItemClaimsFhirApiExtended.ItemsQuantityUnit]?: string;
}

export const InvoiceClaimSpecs: ClaimSpec[] = [
  { key: InvoiceClaim.Identifier, meaning: 'Stable business invoice identifier.', example: 'invoice-001' },
  { key: InvoiceClaim.Date, meaning: 'Invoice issue date/time.', example: '2026-06-11T10:00:00Z' },
  { key: InvoiceClaim.Status, meaning: 'Invoice lifecycle status.', example: 'issued' },
  {
    key: InvoiceClaim.Subject,
    meaning: 'Subject or tenant context reference.',
    example: 'did:web:host.example.com:health-care;organization:taxid:VATES-B00112233:individual:multibase:zExampleIndividualId',
  },
  { key: InvoiceClaim.Recipient, meaning: 'Billed recipient reference.', example: 'did:web:portal.example.org:billing' },
  { key: InvoiceClaim.Issuer, meaning: 'Invoice issuer reference.', example: 'did:web:api.acme.org' },
  { key: InvoiceClaim.IssuerDisplay, meaning: 'Human-readable issuer label.', example: 'Gateway Host Services' },
  { key: InvoiceClaim.PaymentTerms, meaning: 'Commercial payment method/terms.', example: 'invoice' },
  { key: InvoiceClaim.PaymentUrl, meaning: 'Payment or settlement URL when available.', example: 'https://pay.example/invoice-001' },
  { key: InvoiceClaim.TotalNetValue, meaning: 'Net amount numeric value serialized as string.', example: '9.99' },
  { key: InvoiceClaim.TotalNetCurrency, meaning: 'Net amount ISO currency.', example: 'EUR' },
  { key: InvoiceClaim.TotalGrossValue, meaning: 'Gross amount numeric value serialized as string.', example: '9.99' },
  { key: InvoiceClaim.TotalGrossCurrency, meaning: 'Gross amount ISO currency.', example: 'EUR' },
];

export const ChargeItemClaimSpecs: ClaimSpec[] = [
  { key: ChargeItemClaim.Identifier, meaning: 'Stable invoice line identifier.', example: 'chargeitem-001' },
  { key: ChargeItemClaim.Status, meaning: 'Charge item lifecycle status from FHIR ChargeItemStatus.', example: 'billable' },
  { key: ChargeItemClaim.PartOf, meaning: 'Parent business aggregate identifier.', example: 'invoice-001' },
  { key: ChargeItemClaim.Code, meaning: 'Public code such as GTIN/UDI/barcode.', example: '08412345678903' },
  { key: ChargeItemClaim.CodeText, meaning: 'Local-language UI/help label for the coded product.', example: 'Botella de suero salino estéril 500 mL' },
  { key: ChargeItemClaim.Category, meaning: 'Normalized aggregate reporting category.', example: 'medical-supplies' },
  { key: ChargeItemClaim.SupplierProductCode, meaning: 'Supplier or import product code.', example: 'IMP-SAL-500' },
  { key: ChargeItemClaim.Quantity, meaning: 'Compact FHIR-style quantity token for search/readback.', example: '3|bottle' },
  { key: ChargeItemClaim.QuantityNumber, meaning: 'Main quantity numeric scalar serialized as string.', example: '3' },
  { key: ChargeItemClaim.QuantityUnit, meaning: 'Main quantity unit code or label.', example: 'bottle' },
  { key: ChargeItemClaim.ItemsPerUnit, meaning: 'Contained items per main unit.', example: '24' },
  { key: ChargeItemClaim.ItemsQuantity, meaning: 'Compact contained-item quantity token for search/readback.', example: '500|mL' },
  { key: ChargeItemClaim.ItemsQuantityNumber, meaning: 'Contained item numeric quantity serialized as string.', example: '500' },
  { key: ChargeItemClaim.ItemsQuantityUnit, meaning: 'Contained item UCUM-like unit.', example: 'mL' },
];

export const InvoiceClaimToFhirPath: Record<string, string | string[]> = {
  [InvoiceClaim.Identifier]: 'Invoice.identifier.value',
  [InvoiceClaim.Date]: 'Invoice.date',
  [InvoiceClaim.Status]: 'Invoice.status',
  [InvoiceClaim.Subject]: 'Invoice.subject.reference',
  [InvoiceClaim.Recipient]: 'Invoice.recipient.reference',
  [InvoiceClaim.Issuer]: 'Invoice.issuer.reference',
  [InvoiceClaim.IssuerDisplay]: 'Invoice.issuer.display',
  [InvoiceClaim.PaymentTerms]: 'Invoice.paymentTerms',
  [InvoiceClaim.PaymentUrl]: 'Invoice.note.text',
  [InvoiceClaim.TotalNetValue]: 'Invoice.totalNet.value',
  [InvoiceClaim.TotalNetCurrency]: 'Invoice.totalNet.currency',
  [InvoiceClaim.TotalGrossValue]: 'Invoice.totalGross.value',
  [InvoiceClaim.TotalGrossCurrency]: 'Invoice.totalGross.currency',
};

export function contextualizeInvoiceClaims(
  claims: InvoiceClaims,
): InvoiceClaimsContextualized {
  return {
    ...(claims[InvoiceClaim.Identifier] ? { [InvoiceClaimsFhirApiExtended.Identifier]: claims[InvoiceClaim.Identifier] } : {}),
    ...(claims[InvoiceClaim.Date] ? { [InvoiceClaimsFhirApiExtended.Date]: claims[InvoiceClaim.Date] } : {}),
    ...(claims[InvoiceClaim.Status] ? { [InvoiceClaimsFhirApiExtended.Status]: claims[InvoiceClaim.Status] } : {}),
    ...(claims[InvoiceClaim.Subject] ? { [InvoiceClaimsFhirApiExtended.Subject]: claims[InvoiceClaim.Subject] } : {}),
    ...(claims[InvoiceClaim.Recipient] ? { [InvoiceClaimsFhirApiExtended.Recipient]: claims[InvoiceClaim.Recipient] } : {}),
    ...(claims[InvoiceClaim.Issuer] ? { [InvoiceClaimsFhirApiExtended.Issuer]: claims[InvoiceClaim.Issuer] } : {}),
    ...(claims[InvoiceClaim.IssuerDisplay] ? { [InvoiceClaimsFhirApiExtended.IssuerDisplay]: claims[InvoiceClaim.IssuerDisplay] } : {}),
    ...(claims[InvoiceClaim.PaymentTerms] ? { [InvoiceClaimsFhirApiExtended.PaymentTerms]: claims[InvoiceClaim.PaymentTerms] } : {}),
    ...(claims[InvoiceClaim.PaymentUrl] ? { [InvoiceClaimsFhirApiExtended.PaymentUrl]: claims[InvoiceClaim.PaymentUrl] } : {}),
    ...(claims[InvoiceClaim.TotalNetValue] ? { [InvoiceClaimsFhirApiExtended.TotalNetValue]: claims[InvoiceClaim.TotalNetValue] } : {}),
    ...(claims[InvoiceClaim.TotalNetCurrency] ? { [InvoiceClaimsFhirApiExtended.TotalNetCurrency]: claims[InvoiceClaim.TotalNetCurrency] } : {}),
    ...(claims[InvoiceClaim.TotalGrossValue] ? { [InvoiceClaimsFhirApiExtended.TotalGrossValue]: claims[InvoiceClaim.TotalGrossValue] } : {}),
    ...(claims[InvoiceClaim.TotalGrossCurrency] ? { [InvoiceClaimsFhirApiExtended.TotalGrossCurrency]: claims[InvoiceClaim.TotalGrossCurrency] } : {}),
  };
}

export function contextualizeChargeItemClaims(
  claims: ChargeItemClaims,
): ChargeItemClaimsContextualized {
  return {
    ...(claims[ChargeItemClaim.Identifier] ? { [ChargeItemClaimsFhirApiExtended.Identifier]: claims[ChargeItemClaim.Identifier] } : {}),
    ...(claims[ChargeItemClaim.Status] ? { [ChargeItemClaimsFhirApiExtended.Status]: claims[ChargeItemClaim.Status] } : {}),
    ...(claims[ChargeItemClaim.PartOf] ? { [ChargeItemClaimsFhirApiExtended.PartOf]: claims[ChargeItemClaim.PartOf] } : {}),
    ...(claims[ChargeItemClaim.Code] ? { [ChargeItemClaimsFhirApiExtended.Code]: claims[ChargeItemClaim.Code] } : {}),
    ...(claims[ChargeItemClaim.CodeText] ? { [ChargeItemClaimsFhirApiExtended.CodeText]: claims[ChargeItemClaim.CodeText] } : {}),
    ...(claims[ChargeItemClaim.Category] ? { [ChargeItemClaimsFhirApiExtended.Category]: claims[ChargeItemClaim.Category] } : {}),
    ...(claims[ChargeItemClaim.SupplierProductCode] ? { [ChargeItemClaimsFhirApiExtended.SupplierProductCode]: claims[ChargeItemClaim.SupplierProductCode] } : {}),
    ...(claims[ChargeItemClaim.Quantity] ? { [ChargeItemClaimsFhirApiExtended.Quantity]: claims[ChargeItemClaim.Quantity] } : {}),
    ...(claims[ChargeItemClaim.QuantityNumber] ? { [ChargeItemClaimsFhirApiExtended.QuantityNumber]: claims[ChargeItemClaim.QuantityNumber] } : {}),
    ...(claims[ChargeItemClaim.QuantityUnit] ? { [ChargeItemClaimsFhirApiExtended.QuantityUnit]: claims[ChargeItemClaim.QuantityUnit] } : {}),
    ...(claims[ChargeItemClaim.ItemsPerUnit] ? { [ChargeItemClaimsFhirApiExtended.ItemsPerUnit]: claims[ChargeItemClaim.ItemsPerUnit] } : {}),
    ...(claims[ChargeItemClaim.ItemsQuantity] ? { [ChargeItemClaimsFhirApiExtended.ItemsQuantity]: claims[ChargeItemClaim.ItemsQuantity] } : {}),
    ...(claims[ChargeItemClaim.ItemsQuantityNumber] ? { [ChargeItemClaimsFhirApiExtended.ItemsQuantityNumber]: claims[ChargeItemClaim.ItemsQuantityNumber] } : {}),
    ...(claims[ChargeItemClaim.ItemsQuantityUnit] ? { [ChargeItemClaimsFhirApiExtended.ItemsQuantityUnit]: claims[ChargeItemClaim.ItemsQuantityUnit] } : {}),
  };
}

/**
 * Generic low-level invoice claim accessor.
 *
 * Prefer the explicit `getInvoice*` helpers below from application code when
 * you want stronger autocomplete and clearer intent at the call site.
 */
export function getInvoiceClaim(
  claims: InvoiceClaims | undefined,
  key: InvoiceClaimKey,
): string | undefined {
  return claims?.[key];
}

/**
 * Generic low-level charge item claim accessor.
 *
 * Prefer the explicit `getCode()`, `getCodeText()`, `getQuantityNumber()`,
 * etc. helpers below from application code when you want stronger
 * autocomplete and clearer intent at the call site.
 */
export function getChargeItemClaim(
  claims: ChargeItemClaims | undefined,
  key: ChargeItemClaimKey,
): string | undefined {
  return claims?.[key];
}

export function getInvoiceIdentifier(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.Identifier);
}

export function getInvoiceDate(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.Date);
}

export function getInvoiceStatus(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.Status);
}

export function getInvoiceSubject(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.Subject);
}

export function getInvoiceRecipient(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.Recipient);
}

export function getInvoiceIssuer(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.Issuer);
}

export function getInvoiceIssuerDisplay(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.IssuerDisplay);
}

export function getInvoicePaymentTerms(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.PaymentTerms);
}

export function getInvoicePaymentUrl(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.PaymentUrl);
}

export function getInvoiceTotalNetValue(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.TotalNetValue);
}

export function getInvoiceTotalNetCurrency(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.TotalNetCurrency);
}

export function getInvoiceTotalGrossValue(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.TotalGrossValue);
}

export function getInvoiceTotalGrossCurrency(claims: InvoiceClaims | undefined): string | undefined {
  return getInvoiceClaim(claims, InvoiceClaim.TotalGrossCurrency);
}

export function getChargeItemIdentifier(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.Identifier);
}

export function getChargeItemStatus(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.Status);
}

export function getChargeItemPartOf(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.PartOf);
}

export function getCode(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.Code);
}

export function getCodeText(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.CodeText);
}

export function getCategory(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.Category);
}

export function getSupplierProductCode(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.SupplierProductCode);
}

export function getQuantity(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.Quantity);
}

export function getQuantityNumber(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.QuantityNumber);
}

export function getQuantityUnit(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.QuantityUnit);
}

export function getItemsPerUnit(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.ItemsPerUnit);
}

export function getItemsQuantity(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.ItemsQuantity);
}

export function getItemsQuantityNumber(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.ItemsQuantityNumber);
}

export function getItemsQuantityUnit(claims: ChargeItemClaims | undefined): string | undefined {
  return getChargeItemClaim(claims, ChargeItemClaim.ItemsQuantityUnit);
}

export interface ChargeItemView {
  identifier?: string;
  status?: string;
  partOf?: string;
  code?: string;
  codeText?: string;
  category?: string;
  supplierProductCode?: string;
  quantity?: string;
  quantityNumber?: string;
  quantityUnit?: string;
  itemsPerUnit?: string;
  itemsQuantity?: string;
  itemsQuantityNumber?: string;
  itemsQuantityUnit?: string;
}

export function getChargeItemView(claims: ChargeItemClaims | undefined): ChargeItemView {
  return {
    identifier: getChargeItemIdentifier(claims),
    status: getChargeItemStatus(claims),
    partOf: getChargeItemPartOf(claims),
    code: getCode(claims),
    codeText: getCodeText(claims),
    category: getCategory(claims),
    supplierProductCode: getSupplierProductCode(claims),
    quantity: getQuantity(claims),
    quantityNumber: getQuantityNumber(claims),
    quantityUnit: getQuantityUnit(claims),
    itemsPerUnit: getItemsPerUnit(claims),
    itemsQuantity: getItemsQuantity(claims),
    itemsQuantityNumber: getItemsQuantityNumber(claims),
    itemsQuantityUnit: getItemsQuantityUnit(claims),
  };
}

export function getChargeItemList(
  rows: ReadonlyArray<ChargeItemClaims | (InvoiceClaims & ChargeItemClaims)> | undefined,
): ChargeItemView[] {
  return Array.isArray(rows) ? rows.map((row) => getChargeItemView(row)) : [];
}
