import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import {
  ChargeItemClaim,
  ChargeItemClaims,
  ChargeItemClaimsContextualized,
  ChargeItemClaimsFhirApiExtended,
  InvoiceClaim,
  InvoiceClaims,
  InvoiceClaimsContextualized,
  InvoiceClaimsFhirApiExtended,
  contextualizeChargeItemClaims,
  contextualizeInvoiceClaims,
} from '../models/interoperable-claims/invoice-claims';
import type {
  FhirDocumentReferenceResource,
  FhirInvoiceResource,
} from '../models/fhir-documents';

export type InvoiceBundleDocument = Readonly<{
  documentId: string;
  contentType: string;
  title: string;
  description: string;
  language?: string;
  dataBase64?: string;
  url?: string;
  hash?: string;
  createdAt?: string;
}>;

export type InvoiceChargeItemDraft = Readonly<{
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
}>;

export type InvoiceBundleDraft = Readonly<{
  invoiceId?: string;
  subjectReference?: string;
  issuerReference?: string;
  issuerDisplay?: string;
  recipientReference?: string;
  issuedAt?: string;
  amount?: string;
  currency?: string;
  paymentMethod?: string;
  paymentUrl?: string;
  pdfDocument?: InvoiceBundleDocument;
  structuredDocument?: InvoiceBundleDocument;
  chargeItems?: readonly InvoiceChargeItemDraft[];
}>;

export type InvoiceBundleSummary = Readonly<{
  invoiceId?: string;
  amount?: string;
  currency?: string;
  paymentMethod?: string;
  paymentUrl?: string;
  pdfDocumentId?: string;
  structuredDocumentId?: string;
}>;

export interface InvoiceBundleEditor {
  setInvoiceId(value: string): InvoiceBundleEditor;
  setSubjectReference(value: string): InvoiceBundleEditor;
  setIssuerReference(value: string): InvoiceBundleEditor;
  setIssuerDisplay(value: string): InvoiceBundleEditor;
  setRecipientReference(value: string): InvoiceBundleEditor;
  setIssuedAt(value: string): InvoiceBundleEditor;
  setAmount(value: string): InvoiceBundleEditor;
  setCurrency(value: string): InvoiceBundleEditor;
  setPaymentMethod(value: string): InvoiceBundleEditor;
  setPaymentUrl(value: string): InvoiceBundleEditor;
  setPdfDocument(value: InvoiceBundleDocument): InvoiceBundleEditor;
  setStructuredDocument(value: InvoiceBundleDocument): InvoiceBundleEditor;
  setChargeItems(value: readonly InvoiceChargeItemDraft[]): InvoiceBundleEditor;
  addChargeItem(value: InvoiceChargeItemDraft): InvoiceBundleEditor;
  getDraft(): InvoiceBundleDraft;
  buildBundle(): Record<string, unknown>;
  buildInvoiceClaims(): InvoiceClaims;
  buildInvoiceClaimsContextualized(): InvoiceClaimsContextualized;
  buildChargeItemClaimRows(): Array<InvoiceClaims & ChargeItemClaims>;
  buildChargeItemClaimRowsContextualized(): ChargeItemClaimsContextualized[];
  getSummary(): InvoiceBundleSummary;
  readBundleFromResponseBody(body: unknown): Record<string, unknown> | undefined;
}

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function normalizeDocument(
  value: InvoiceBundleDocument | undefined,
): InvoiceBundleDocument | undefined {
  if (!value) return undefined;
  return {
    documentId: String(value.documentId || '').trim(),
    contentType: String(value.contentType || '').trim(),
    title: String(value.title || '').trim(),
    description: String(value.description || '').trim(),
    language: normalizeText(value.language),
    dataBase64: normalizeText(value.dataBase64),
    url: normalizeText(value.url),
    hash: normalizeText(value.hash),
    createdAt: normalizeText(value.createdAt),
  };
}

function cloneDraft(draft?: Partial<InvoiceBundleDraft>): InvoiceBundleDraft {
  return {
    invoiceId: normalizeText(draft?.invoiceId),
    subjectReference: normalizeText(draft?.subjectReference),
    issuerReference: normalizeText(draft?.issuerReference),
    issuerDisplay: normalizeText(draft?.issuerDisplay),
    recipientReference: normalizeText(draft?.recipientReference),
    issuedAt: normalizeText(draft?.issuedAt),
    amount: normalizeText(draft?.amount),
    currency: normalizeText(draft?.currency),
    paymentMethod: normalizeText(draft?.paymentMethod),
    paymentUrl: normalizeText(draft?.paymentUrl),
    pdfDocument: normalizeDocument(draft?.pdfDocument),
    structuredDocument: normalizeDocument(draft?.structuredDocument),
    chargeItems: Array.isArray(draft?.chargeItems)
      ? draft?.chargeItems.map((item) => ({
        identifier: normalizeText(item?.identifier),
        status: normalizeText(item?.status),
        partOf: normalizeText(item?.partOf),
        code: normalizeText(item?.code),
        codeText: normalizeText(item?.codeText),
        category: normalizeText(item?.category),
        supplierProductCode: normalizeText(item?.supplierProductCode),
        quantity: normalizeText(item?.quantity),
        quantityNumber: normalizeText(item?.quantityNumber),
        quantityUnit: normalizeText(item?.quantityUnit),
        itemsPerUnit: normalizeText(item?.itemsPerUnit),
        itemsQuantity: normalizeText(item?.itemsQuantity),
        itemsQuantityNumber: normalizeText(item?.itemsQuantityNumber),
        itemsQuantityUnit: normalizeText(item?.itemsQuantityUnit),
      }))
      : [],
  };
}

export function buildInvoiceFhirClaims(
  draftInput: Partial<InvoiceBundleDraft>,
): InvoiceClaims {
  const draft = cloneDraft(draftInput);
  return {
    ...(draft.invoiceId ? { [InvoiceClaim.Identifier]: draft.invoiceId } : {}),
    ...(draft.issuedAt ? { [InvoiceClaim.Date]: draft.issuedAt } : {}),
    [InvoiceClaim.Status]: 'issued',
    ...(draft.subjectReference ? { [InvoiceClaim.Subject]: draft.subjectReference } : {}),
    ...(draft.recipientReference ? { [InvoiceClaim.Recipient]: draft.recipientReference } : {}),
    ...(draft.issuerReference ? { [InvoiceClaim.Issuer]: draft.issuerReference } : {}),
    ...(draft.issuerDisplay ? { [InvoiceClaim.IssuerDisplay]: draft.issuerDisplay } : {}),
    ...(draft.paymentMethod ? { [InvoiceClaim.PaymentTerms]: draft.paymentMethod } : {}),
    ...(draft.paymentUrl ? { [InvoiceClaim.PaymentUrl]: draft.paymentUrl } : {}),
    ...(draft.amount ? { [InvoiceClaim.TotalNetValue]: draft.amount } : {}),
    ...(draft.currency ? { [InvoiceClaim.TotalNetCurrency]: draft.currency } : {}),
    ...(draft.amount ? { [InvoiceClaim.TotalGrossValue]: draft.amount } : {}),
    ...(draft.currency ? { [InvoiceClaim.TotalGrossCurrency]: draft.currency } : {}),
  };
}

export function buildInvoiceChargeItemClaimRows(
  draftInput: Partial<InvoiceBundleDraft>,
): Array<InvoiceClaims & ChargeItemClaims> {
  const draft = cloneDraft(draftInput);
  const invoiceClaims = buildInvoiceFhirClaims(draft);
  return (draft.chargeItems || []).map((item) => ({
    ...invoiceClaims,
    ...(item.identifier ? { [ChargeItemClaim.Identifier]: item.identifier } : {}),
    ...((item.status || 'billable') ? { [ChargeItemClaim.Status]: item.status || 'billable' } : {}),
    ...((item.partOf || draft.invoiceId) ? { [ChargeItemClaim.PartOf]: item.partOf || draft.invoiceId } : {}),
    ...(item.code ? { [ChargeItemClaim.Code]: item.code } : {}),
    ...(item.codeText ? { [ChargeItemClaim.CodeText]: item.codeText } : {}),
    ...(item.category ? { [ChargeItemClaim.Category]: item.category } : {}),
    ...(item.supplierProductCode ? { [ChargeItemClaim.SupplierProductCode]: item.supplierProductCode } : {}),
    ...(item.quantity ? { [ChargeItemClaim.Quantity]: item.quantity } : {}),
    ...(item.quantityNumber ? { [ChargeItemClaim.QuantityNumber]: item.quantityNumber } : {}),
    ...(item.quantityUnit ? { [ChargeItemClaim.QuantityUnit]: item.quantityUnit } : {}),
    ...(item.itemsPerUnit ? { [ChargeItemClaim.ItemsPerUnit]: item.itemsPerUnit } : {}),
    ...(item.itemsQuantity ? { [ChargeItemClaim.ItemsQuantity]: item.itemsQuantity } : {}),
    ...(item.itemsQuantityNumber ? { [ChargeItemClaim.ItemsQuantityNumber]: item.itemsQuantityNumber } : {}),
    ...(item.itemsQuantityUnit ? { [ChargeItemClaim.ItemsQuantityUnit]: item.itemsQuantityUnit } : {}),
  }));
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function buildDocumentReferenceResource(
  draft: InvoiceBundleDraft,
  document: InvoiceBundleDocument,
): FhirDocumentReferenceResource {
  return {
    resourceType: ResourceTypesFhirR4.DocumentReference,
    id: document.documentId,
    status: 'current',
    identifier: [{ value: document.documentId }],
    subject: draft.subjectReference ? { reference: draft.subjectReference } : undefined,
    date: document.createdAt || draft.issuedAt,
    description: document.description,
    content: [{
      attachment: {
        contentType: document.contentType,
        data: document.dataBase64,
        url: document.url,
        title: document.title,
        language: document.language,
        creation: document.createdAt || draft.issuedAt,
        hash: document.hash,
      },
    }],
  };
}

export function buildInvoiceBundle(draftInput: Partial<InvoiceBundleDraft>): Record<string, unknown> {
  const draft = cloneDraft(draftInput);
  const amountNumber = Number(draft.amount || '');
  const normalizedAmount = Number.isFinite(amountNumber) ? amountNumber : undefined;
  const invoiceResource: FhirInvoiceResource = {
    resourceType: ResourceTypesFhirR4.Invoice,
    id: draft.invoiceId,
    meta: { claims: buildInvoiceFhirClaims(draft) as Record<string, unknown> },
    status: 'issued',
    identifier: draft.invoiceId ? [{ value: draft.invoiceId }] : undefined,
    subject: draft.subjectReference ? { reference: draft.subjectReference } : undefined,
    recipient: draft.recipientReference ? { reference: draft.recipientReference } : undefined,
    issuer: draft.issuerReference || draft.issuerDisplay
      ? { reference: draft.issuerReference, display: draft.issuerDisplay }
      : undefined,
    date: draft.issuedAt,
    paymentTerms: draft.paymentMethod,
    note: draft.paymentUrl ? [{ text: draft.paymentUrl }] : undefined,
    totalNet: normalizedAmount !== undefined
      ? { value: normalizedAmount, currency: draft.currency }
      : undefined,
    totalGross: normalizedAmount !== undefined
      ? { value: normalizedAmount, currency: draft.currency }
      : undefined,
  };

  const entry: Array<{ resource: Record<string, unknown> }> = [{ resource: invoiceResource as unknown as Record<string, unknown> }];
  if (draft.pdfDocument) {
    entry.push({ resource: buildDocumentReferenceResource(draft, draft.pdfDocument) as unknown as Record<string, unknown> });
  }
  if (draft.structuredDocument) {
    entry.push({ resource: buildDocumentReferenceResource(draft, draft.structuredDocument) as unknown as Record<string, unknown> });
  }

  return {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'collection',
    entry,
  };
}

export function extractInvoiceBundleFromResponseBody(body: unknown): Record<string, unknown> | undefined {
  const root = asRecord(body) || {};
  const bodyNode = asRecord(root.body) || root;
  const data = Array.isArray(bodyNode.data) ? bodyNode.data : [];
  for (const candidate of data) {
    const entry = asRecord(candidate) || {};
    const resource = asRecord(entry.resource);
    if (!resource || resource.resourceType !== ResourceTypesFhirR4.Bundle) continue;
    const bundleEntries = Array.isArray(resource.entry) ? resource.entry : [];
    const hasInvoice = bundleEntries.some((bundleEntry) => {
      const nested = asRecord(bundleEntry);
      const nestedResource = asRecord(nested?.resource);
      return nestedResource?.resourceType === ResourceTypesFhirR4.Invoice;
    });
    if (hasInvoice) return resource;
  }
  return undefined;
}

export function readInvoiceBundleSummaryFromResponseBody(body: unknown): InvoiceBundleSummary {
  const bundle = extractInvoiceBundleFromResponseBody(body);
  const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
  const invoice = entries
    .map((entry) => asRecord(entry)?.resource)
    .map((resource) => asRecord(resource))
    .find((resource) => resource?.resourceType === ResourceTypesFhirR4.Invoice);
  const documents = entries
    .map((entry) => asRecord(entry)?.resource)
    .map((resource) => asRecord(resource))
    .filter((resource) => resource?.resourceType === ResourceTypesFhirR4.DocumentReference);
  const pdf = documents.find((resource) => {
    const content = Array.isArray(resource?.content) ? resource.content : [];
    const attachment = asRecord(asRecord(content[0])?.attachment);
    return String(attachment?.contentType || '').trim() === 'application/pdf';
  });
  const structured = documents.find((resource) => resource !== pdf);
  return {
    invoiceId: normalizeText(
      asRecord((Array.isArray(invoice?.identifier) ? invoice?.identifier[0] : undefined))?.value
      || invoice?.id,
    ),
    amount: normalizeText(asRecord(invoice?.totalGross)?.value),
    currency: normalizeText(asRecord(invoice?.totalGross)?.currency),
    paymentMethod: normalizeText(invoice?.paymentTerms),
    paymentUrl: normalizeText(asRecord(Array.isArray(invoice?.note) ? invoice.note[0] : undefined)?.text),
    pdfDocumentId: normalizeText(pdf?.id),
    structuredDocumentId: normalizeText(structured?.id),
  };
}

export function createInvoiceBundleEditor(
  initial?: Partial<InvoiceBundleDraft>,
): InvoiceBundleEditor {
  let draft = cloneDraft(initial);

  const editor: InvoiceBundleEditor = {
    setInvoiceId(value) { draft = cloneDraft({ ...draft, invoiceId: value }); return editor; },
    setSubjectReference(value) { draft = cloneDraft({ ...draft, subjectReference: value }); return editor; },
    setIssuerReference(value) { draft = cloneDraft({ ...draft, issuerReference: value }); return editor; },
    setIssuerDisplay(value) { draft = cloneDraft({ ...draft, issuerDisplay: value }); return editor; },
    setRecipientReference(value) { draft = cloneDraft({ ...draft, recipientReference: value }); return editor; },
    setIssuedAt(value) { draft = cloneDraft({ ...draft, issuedAt: value }); return editor; },
    setAmount(value) { draft = cloneDraft({ ...draft, amount: value }); return editor; },
    setCurrency(value) { draft = cloneDraft({ ...draft, currency: value }); return editor; },
    setPaymentMethod(value) { draft = cloneDraft({ ...draft, paymentMethod: value }); return editor; },
    setPaymentUrl(value) { draft = cloneDraft({ ...draft, paymentUrl: value }); return editor; },
    setPdfDocument(value) { draft = cloneDraft({ ...draft, pdfDocument: value }); return editor; },
    setStructuredDocument(value) { draft = cloneDraft({ ...draft, structuredDocument: value }); return editor; },
    setChargeItems(value) { draft = cloneDraft({ ...draft, chargeItems: value }); return editor; },
    addChargeItem(value) { draft = cloneDraft({ ...draft, chargeItems: [...(draft.chargeItems || []), value] }); return editor; },
    getDraft() { return cloneDraft(draft); },
    buildBundle() { return buildInvoiceBundle(draft); },
    buildInvoiceClaims() { return buildInvoiceFhirClaims(draft); },
    buildInvoiceClaimsContextualized() { return contextualizeInvoiceClaims(buildInvoiceFhirClaims(draft)); },
    buildChargeItemClaimRows() { return buildInvoiceChargeItemClaimRows(draft); },
    buildChargeItemClaimRowsContextualized() {
      return buildInvoiceChargeItemClaimRows(draft).map((row) => ({
        ...contextualizeInvoiceClaims(row),
        ...contextualizeChargeItemClaims(row),
      }));
    },
    getSummary() { return readInvoiceBundleSummaryFromResponseBody({ data: [{ resource: buildInvoiceBundle(draft) }] }); },
    readBundleFromResponseBody(body) { return extractInvoiceBundleFromResponseBody(body); },
  };

  return editor;
}
