// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  ClaimsOfferSchemaorg,
  ClaimsOrderSchemaorg,
} from '../src/constants/schemaorg.js';
import {
  EXAMPLE_LICENSE_INVOICE_ID,
  EXAMPLE_LICENSE_OFFER_ID,
  EXAMPLE_LICENSE_OFFER_LIST_RESPONSE_BODY,
  EXAMPLE_LICENSE_ORDER_LIST_RESPONSE_BODY,
  LicenseCommercialSearchEntryType,
  LicenseOfferSearchEditor,
  LicenseOrderSearchEditor,
  findLicenseOfferRecord,
  findLicenseOrderRecord,
  readLicenseOfferRecords,
  readLicenseOrderRecords,
} from '../src/index.js';

describe('101: license commercial search', () => {
  it('builds high-level offer/order search entries and reopens list rows for portal read-model screens', () => {
    const offerEntry = new LicenseOfferSearchEditor()
      .setOfferId(EXAMPLE_LICENSE_OFFER_ID)
      .buildSearchEntry();
    const orderEntry = new LicenseOrderSearchEditor()
      .setAcceptedOfferId(EXAMPLE_LICENSE_OFFER_ID)
      .setInvoiceId(EXAMPLE_LICENSE_INVOICE_ID)
      .buildSearchEntry();

    expect(offerEntry.type).toBe(LicenseCommercialSearchEntryType.Offer);
    expect(offerEntry.resource.meta.claims[ClaimsOfferSchemaorg.identifier]).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(offerEntry.meta.claims).toBeUndefined();
    expect(orderEntry.type).toBe(LicenseCommercialSearchEntryType.Order);
    expect(orderEntry.resource.meta.claims[ClaimsOrderSchemaorg.acceptedOfferIdentifier]).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(orderEntry.resource.meta.claims[ClaimsOrderSchemaorg.partOfInvoice]).toBe(EXAMPLE_LICENSE_INVOICE_ID);
    expect(orderEntry.meta.claims).toBeUndefined();

    const offerRecords = readLicenseOfferRecords(EXAMPLE_LICENSE_OFFER_LIST_RESPONSE_BODY);
    const orderRecords = readLicenseOrderRecords(EXAMPLE_LICENSE_ORDER_LIST_RESPONSE_BODY);

    expect(offerRecords).toHaveLength(1);
    expect(orderRecords).toHaveLength(1);
    expect(findLicenseOfferRecord(EXAMPLE_LICENSE_OFFER_LIST_RESPONSE_BODY, { offerId: EXAMPLE_LICENSE_OFFER_ID })?.offer.offerId).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(findLicenseOrderRecord(EXAMPLE_LICENSE_ORDER_LIST_RESPONSE_BODY, { acceptedOfferId: EXAMPLE_LICENSE_OFFER_ID })?.order.invoiceId).toBe(EXAMPLE_LICENSE_INVOICE_ID);

    expect(offerRecords[0].offer.offerId).toBe(EXAMPLE_LICENSE_OFFER_ID);
  });
});
