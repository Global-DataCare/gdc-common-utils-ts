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
    expect(offerEntry.meta.claims[ClaimsOfferSchemaorg.identifier]).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(orderEntry.type).toBe(LicenseCommercialSearchEntryType.Order);
    expect(orderEntry.meta.claims[ClaimsOrderSchemaorg.acceptedOfferIdentifier]).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(orderEntry.meta.claims[ClaimsOrderSchemaorg.partOfInvoice]).toBe(EXAMPLE_LICENSE_INVOICE_ID);

    const offerRecords = readLicenseOfferRecords(EXAMPLE_LICENSE_OFFER_LIST_RESPONSE_BODY);
    const orderRecords = readLicenseOrderRecords(EXAMPLE_LICENSE_ORDER_LIST_RESPONSE_BODY);

    expect(offerRecords).toHaveLength(1);
    expect(orderRecords).toHaveLength(1);
    expect(findLicenseOfferRecord(EXAMPLE_LICENSE_OFFER_LIST_RESPONSE_BODY, { offerId: EXAMPLE_LICENSE_OFFER_ID })?.offer.offerId).toBe(EXAMPLE_LICENSE_OFFER_ID);
    expect(findLicenseOrderRecord(EXAMPLE_LICENSE_ORDER_LIST_RESPONSE_BODY, { acceptedOfferId: EXAMPLE_LICENSE_OFFER_ID })?.order.invoiceId).toBe(EXAMPLE_LICENSE_INVOICE_ID);

    expect(offerRecords[0].offer.offerId).toBe(EXAMPLE_LICENSE_OFFER_ID);
  });
});
