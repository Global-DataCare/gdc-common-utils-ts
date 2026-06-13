import { DeviceAppTypes, DeviceUserClasses } from '../constants/device';
import {
  ClaimsOrderSchemaorg,
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsPersonSchemaorg,
} from '../constants/schemaorg';
import {
  buildLicenseIssueClaims,
  buildLicensePurchaseClaims,
  LicenseCategories,
  LicenseStatuses,
} from '../utils/license';
import { createLicenseOfferOrderEditor } from '../utils/license-offer-order';
import {
  EXAMPLE_LICENSE_ACCEPTED_OFFER_ID,
  EXAMPLE_LICENSE_AMOUNT,
  EXAMPLE_LICENSE_CHECKOUT_URL,
  EXAMPLE_LICENSE_CURRENCY,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_LICENSE_INVOICE_ID,
  EXAMPLE_LICENSE_OFFER_ID,
  EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE,
  EXAMPLE_LICENSE_PAYMENT_URL,
  EXAMPLE_LICENSE_PLAN_NAME,
  EXAMPLE_LICENSE_SKU,
} from './shared';

export const EXAMPLE_LICENSE_SEAT_UUIDS = Object.freeze([
  '8a8a5e1b-0d8e-4a7c-8c39-3b8034440001',
  '8a8a5e1b-0d8e-4a7c-8c39-3b8034440002',
] as const);

export const EXAMPLE_LICENSE_ISSUE_INPUT = Object.freeze({
  email: EXAMPLE_EMAIL_CONTROLLER_ORG,
  role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  userClass: DeviceUserClasses.Employee,
  type: DeviceAppTypes.Mobile,
} as const);

export const EXAMPLE_LICENSE_PURCHASE_INPUT = Object.freeze({
  quantity: EXAMPLE_LICENSE_SEAT_UUIDS.length,
  userClass: DeviceUserClasses.Employee,
  type: DeviceAppTypes.Web,
  serialNumbers: EXAMPLE_LICENSE_SEAT_UUIDS,
} as const);

export const EXAMPLE_LICENSE_ACTIVE_RECORD = Object.freeze({
  id: EXAMPLE_LICENSE_SEAT_UUIDS[0],
  status: LicenseStatuses.Active,
  activationCode: EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  subjectId: 'urn:uuid:employee-controller-active-001',
  claims: {
    '@context': 'org.schema',
    [ClaimsIndividualProductSchemaorg.serialNumber]: EXAMPLE_LICENSE_SEAT_UUIDS[0],
    [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
    [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Mobile,
    [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  },
} as const);

export function buildExampleLicenseIssueClaims(): Readonly<Record<string, unknown>> {
  return Object.freeze(buildLicenseIssueClaims(EXAMPLE_LICENSE_ISSUE_INPUT));
}

export function buildExampleLicensePurchaseClaims(): Readonly<Record<string, unknown>> {
  return Object.freeze(buildLicensePurchaseClaims(EXAMPLE_LICENSE_PURCHASE_INPUT));
}

export const EXAMPLE_LICENSE_PURCHASE_CLAIMS = buildExampleLicensePurchaseClaims();
export const EXAMPLE_LICENSE_ISSUE_CLAIMS = buildExampleLicenseIssueClaims();

export const EXAMPLE_LICENSE_PURCHASE_EXPECTED_SERIAL_NUMBER =
  EXAMPLE_LICENSE_PURCHASE_CLAIMS[ClaimsOfferSchemaorg.serialNumber] as string;

/**
 * Shared high-level preview used by SDK/runtime tests when an onboarding start
 * flow returns an `Offer`.
 */
export const EXAMPLE_LICENSE_OFFER_PREVIEW = Object.freeze(
  createLicenseOfferOrderEditor()
    .setOfferId(EXAMPLE_LICENSE_OFFER_ID)
    .setAmount(EXAMPLE_LICENSE_AMOUNT)
    .setCurrency(EXAMPLE_LICENSE_CURRENCY)
    .setSeats(EXAMPLE_LICENSE_SEAT_UUIDS.length)
    .setPlanName(EXAMPLE_LICENSE_PLAN_NAME)
    .setSku(EXAMPLE_LICENSE_SKU)
    .setPaymentMethod(EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE)
    .setCheckoutUrl(EXAMPLE_LICENSE_CHECKOUT_URL)
    .getOfferPreview(),
);

/**
 * Shared high-level summary used by SDK/runtime tests when an order is
 * confirmed and GW returns payment/activation fields.
 */
export const EXAMPLE_LICENSE_ORDER_SUMMARY = Object.freeze(
  createLicenseOfferOrderEditor()
    .setAcceptedOfferId(EXAMPLE_LICENSE_ACCEPTED_OFFER_ID)
    .setAmount(EXAMPLE_LICENSE_AMOUNT)
    .setCurrency(EXAMPLE_LICENSE_CURRENCY)
    .setSeats(EXAMPLE_LICENSE_SEAT_UUIDS.length + 1)
    .setPaymentMethod(EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE)
    .setPaymentUrl(EXAMPLE_LICENSE_PAYMENT_URL)
    .setInvoiceId(EXAMPLE_LICENSE_INVOICE_ID)
    .setActivationCode(EXAMPLE_EMPLOYEE_ACTIVATION_CODE)
    .getOrderSummary(),
);

export const EXAMPLE_LICENSE_OFFER_RESPONSE_BODY = Object.freeze({
  data: [{
    meta: {
      claims: {
        [ClaimsOfferSchemaorg.identifier]: EXAMPLE_LICENSE_OFFER_ID,
        [ClaimsOfferSchemaorg.price]: EXAMPLE_LICENSE_AMOUNT,
        [ClaimsOfferSchemaorg.priceCurrency]: EXAMPLE_LICENSE_CURRENCY,
        [ClaimsOfferSchemaorg.eligibleQuantityValue]: EXAMPLE_LICENSE_SEAT_UUIDS.length,
        [ClaimsOfferSchemaorg.itemOfferedName]: EXAMPLE_LICENSE_PLAN_NAME,
        [ClaimsOfferSchemaorg.itemOfferedSku]: EXAMPLE_LICENSE_SKU,
        [ClaimsOfferSchemaorg.acceptedPaymentMethod]: EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE,
        [ClaimsOfferSchemaorg.checkoutPageURLTemplate]: EXAMPLE_LICENSE_CHECKOUT_URL,
      },
    },
  }],
} as const);

export const EXAMPLE_LICENSE_ORDER_RESPONSE_BODY = Object.freeze({
  body: {
    data: [{
      resource: {
        meta: {
          claims: {
            [ClaimsOrderSchemaorg.acceptedOfferIdentifier]: EXAMPLE_LICENSE_ACCEPTED_OFFER_ID,
            [ClaimsOrderSchemaorg.paymentUrl]: EXAMPLE_LICENSE_PAYMENT_URL,
            [ClaimsOrderSchemaorg.partOfInvoice]: EXAMPLE_LICENSE_INVOICE_ID,
            [ClaimsOrderSchemaorg.paymentMethod]: EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE,
            [ClaimsOfferSchemaorg.price]: EXAMPLE_LICENSE_AMOUNT,
            [ClaimsOfferSchemaorg.priceCurrency]: EXAMPLE_LICENSE_CURRENCY,
            [ClaimsOfferSchemaorg.eligibleQuantityValue]: String(EXAMPLE_LICENSE_SEAT_UUIDS.length + 1),
            [ClaimsIndividualProductSchemaorg.serialNumber]: EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
          },
        },
      },
    }],
  },
} as const);
