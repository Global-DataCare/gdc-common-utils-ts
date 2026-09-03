import { DeviceAppTypes, DeviceBindingStatuses, DeviceUserClasses } from '../constants/device';
import { OrganizationEmployeeSearchResponseEntryTypes } from '../constants/employee-lifecycle';
import {
  ClaimsOrderSchemaorg,
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsPersonSchemaorg,
} from '../constants/schemaorg';
import {
  buildLicenseIssueClaims,
  buildLicensePurchaseClaims,
  LicenseClaimContext,
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
  EXAMPLE_EMPLOYEE_DEVICE_CLIENT_ID_PRIMARY,
  EXAMPLE_EMPLOYEE_DEVICE_CLIENT_ID_SECONDARY,
  EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_PRIMARY,
  EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_SECONDARY,
  EXAMPLE_EMPLOYEE_DEVICE_MODEL_PRIMARY,
  EXAMPLE_BUNDLE_RESOURCE_TYPE,
  EXAMPLE_BUNDLE_TYPE_BATCH_RESPONSE,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_LICENSE_INVOICE_ID,
  EXAMPLE_LICENSE_OFFER_ID,
  EXAMPLE_LICENSE_PLAN_DEFAULT,
  EXAMPLE_LICENSE_PAYMENT_METHOD_INVOICE,
  EXAMPLE_LICENSE_PAYMENT_URL,
  EXAMPLE_LICENSE_RENEWAL_CYCLE_YEARLY,
  EXAMPLE_LICENSE_PLAN_NAME,
  EXAMPLE_LICENSE_SEAT_UUID_ACTIVE,
  EXAMPLE_LICENSE_SEAT_UUID_AVAILABLE,
  EXAMPLE_LICENSE_SEAT_UUID_SECONDARY,
  EXAMPLE_LICENSE_SKU,
  EXAMPLE_LICENSE_SUBJECT_ID_ACTIVE,
  EXAMPLE_LICENSE_SUBJECT_ID_AVAILABLE,
  EXAMPLE_TENANT_IDENTIFIER,
  ExampleHttpStatusText,
} from './shared';
import { DEFAULT_LICENSE_DEVICE_ALLOWANCE } from '../utils/license';
import { EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE } from './employee';

export const EXAMPLE_EMPLOYEE_DEVICE_BINDINGS = Object.freeze([
  Object.freeze({
    clientId: EXAMPLE_EMPLOYEE_DEVICE_CLIENT_ID_PRIMARY,
    clientInstanceId: EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_PRIMARY,
    status: DeviceBindingStatuses.Active,
    deviceInfo: Object.freeze({
      clientInstanceId: EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_PRIMARY,
      model: EXAMPLE_EMPLOYEE_DEVICE_MODEL_PRIMARY,
    }),
    activatedAt: 1_786_570_800,
  }),
  Object.freeze({
    clientId: EXAMPLE_EMPLOYEE_DEVICE_CLIENT_ID_SECONDARY,
    clientInstanceId: EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_SECONDARY,
    status: DeviceBindingStatuses.Revoked,
    deviceInfo: Object.freeze({ clientInstanceId: EXAMPLE_EMPLOYEE_DEVICE_INSTANCE_ID_SECONDARY }),
    activatedAt: 1_786_570_900,
    revokedAt: 1_786_571_000,
  }),
] as const);

/** Two simultaneously active installations used to test the default allowance. */
export const EXAMPLE_EMPLOYEE_ACTIVE_DEVICE_BINDINGS = Object.freeze(
  EXAMPLE_EMPLOYEE_DEVICE_BINDINGS.map((binding) => Object.freeze({
    ...binding,
    status: DeviceBindingStatuses.Active,
    revokedAt: undefined,
  })),
);

export const EXAMPLE_LICENSE_SEAT_UUIDS = Object.freeze([
  EXAMPLE_LICENSE_SEAT_UUID_ACTIVE,
  EXAMPLE_LICENSE_SEAT_UUID_SECONDARY,
] as const);

export const EXAMPLE_LICENSE_ISSUE_INPUT = Object.freeze({
  email: EXAMPLE_EMAIL_CONTROLLER_ORG,
  role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  userClass: DeviceUserClasses.Employee,
  type: DeviceAppTypes.Mobile,
  subjectId: EXAMPLE_LICENSE_SUBJECT_ID_ACTIVE,
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
  subjectId: EXAMPLE_LICENSE_SUBJECT_ID_ACTIVE,
  claims: {
    '@context': LicenseClaimContext.SchemaOrg,
    [ClaimsIndividualProductSchemaorg.serialNumber]: EXAMPLE_LICENSE_SEAT_UUIDS[0],
    [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
    [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Mobile,
    [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  },
} as const);

export const EXAMPLE_LICENSE_AVAILABLE_RECORD = Object.freeze({
  id: EXAMPLE_LICENSE_SEAT_UUID_AVAILABLE,
  status: LicenseStatuses.Available,
  subjectId: EXAMPLE_LICENSE_SUBJECT_ID_AVAILABLE,
  claims: {
    ...EXAMPLE_LICENSE_ACTIVE_RECORD.claims,
    [ClaimsIndividualProductSchemaorg.serialNumber]: EXAMPLE_LICENSE_SEAT_UUID_AVAILABLE,
  },
} as const);

/** Complete stored device-license fixture for manager and repository tests. */
export const EXAMPLE_DEVICE_LICENSE_AVAILABLE = Object.freeze({
  id: EXAMPLE_LICENSE_SEAT_UUID_AVAILABLE,
  tenantId: EXAMPLE_TENANT_IDENTIFIER,
  orderId: EXAMPLE_LICENSE_INVOICE_ID,
  userClass: DeviceUserClasses.Employee,
  userCategory: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  type: DeviceAppTypes.Mobile,
  status: LicenseStatuses.Available,
  plan: EXAMPLE_LICENSE_PLAN_DEFAULT,
  renewalCycle: EXAMPLE_LICENSE_RENEWAL_CYCLE_YEARLY,
  reactivationEnabled: false,
  exp: 1_893_456_000,
} as const);

export const EXAMPLE_LICENSE_LIST_RESPONSE_BODY = Object.freeze({
  data: [
    {
      resource: { meta: {
        status: EXAMPLE_LICENSE_ACTIVE_RECORD.status,
        subjectId: EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId,
        claims: EXAMPLE_LICENSE_ACTIVE_RECORD.claims,
      } },
    },
    {
      resource: { meta: {
        status: EXAMPLE_LICENSE_AVAILABLE_RECORD.status,
        subjectId: EXAMPLE_LICENSE_AVAILABLE_RECORD.subjectId,
        claims: EXAMPLE_LICENSE_AVAILABLE_RECORD.claims,
      } },
    },
  ],
} as const);

/** Shared async GW response for a controller-issued employee activation credential. */
export const EXAMPLE_LICENSE_ISSUE_RESPONSE_BODY = Object.freeze({
  body: {
    data: [{
      resource: {
        data: [{
          type: 'License:Issued',
          id: EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
          resource: {
            meta: {
              claims: {
                [ClaimsIndividualProductSchemaorg.serialNumber]: EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
              },
            },
          },
        }],
      },
    }],
  },
} as const);

/** Shared license search response containing the default two-installation state. */
export const EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES = Object.freeze({
  body: {
    resourceType: EXAMPLE_BUNDLE_RESOURCE_TYPE,
    type: EXAMPLE_BUNDLE_TYPE_BATCH_RESPONSE,
    total: 1,
    data: [{
      type: OrganizationEmployeeSearchResponseEntryTypes.License,
      resource: {
        id: EXAMPLE_LICENSE_ACTIVE_RECORD.id,
        meta: {
          status: EXAMPLE_LICENSE_ACTIVE_RECORD.status,
          subjectId: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.resourceId,
          maxDevices: DEFAULT_LICENSE_DEVICE_ALLOWANCE,
          deviceBindings: EXAMPLE_EMPLOYEE_DEVICE_BINDINGS,
        },
      },
      response: { status: ExampleHttpStatusText.Ok },
    }],
  },
} as const);

/** @deprecated Read-only fixture for GW versions that nested search rows. */
export const EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES_LEGACY = Object.freeze({
  body: {
    resource: {
      data: EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES.body.data.map(entry => entry.resource),
    },
  },
} as const);

/** Canonical controller-facing employee projection reused across SDK and portal tests. */
export const EXAMPLE_EMPLOYEE_LIFECYCLE_RECORD = Object.freeze({
  resourceId: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.resourceId,
  email: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.email,
  roleCode: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.role,
  employeeDid: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.identifier,
  status: EXAMPLE_EMPLOYEE_CONTROLLER_ACTIVE.status,
  license: Object.freeze({
    id: EXAMPLE_LICENSE_ACTIVE_RECORD.id,
    status: EXAMPLE_LICENSE_ACTIVE_RECORD.status,
    maxDevices: DEFAULT_LICENSE_DEVICE_ALLOWANCE,
    activeDevices: EXAMPLE_EMPLOYEE_DEVICE_BINDINGS.filter(
      (binding) => binding.status === DeviceBindingStatuses.Active,
    ).length,
    devices: Object.freeze(EXAMPLE_EMPLOYEE_DEVICE_BINDINGS.map((binding) => Object.freeze({
      clientId: binding.clientId,
      name: ('model' in binding.deviceInfo ? binding.deviceInfo.model : undefined)
        || binding.deviceInfo.clientInstanceId
        || binding.clientId,
      status: binding.status,
    }))),
  }),
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

/**
 * Shared operational defaults reused by runtime tests that need stored
 * `DeviceLicense` examples instead of higher-level Offer/Order claims.
 */
export const EXAMPLE_LICENSE_RUNTIME_DEFAULTS = Object.freeze({
  plan: EXAMPLE_LICENSE_PLAN_DEFAULT,
  renewalCycle: EXAMPLE_LICENSE_RENEWAL_CYCLE_YEARLY,
  reactivationEnabled: true,
} as const);

export const EXAMPLE_LICENSE_OFFER_RESPONSE_BODY = Object.freeze({
  data: [{
    resource: {
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

export const EXAMPLE_LICENSE_OFFER_LIST_RESPONSE_BODY = Object.freeze({
  data: [{
    resource: {
      id: EXAMPLE_LICENSE_OFFER_ID,
      meta: {
        status: 'active',
        claims: EXAMPLE_LICENSE_OFFER_RESPONSE_BODY.data[0].resource.meta.claims,
      },
    },
  }],
} as const);

export const EXAMPLE_LICENSE_ORDER_LIST_RESPONSE_BODY = Object.freeze({
  data: [{
    resource: {
      id: EXAMPLE_LICENSE_ACCEPTED_OFFER_ID,
      meta: {
        status: 'active',
        claims: EXAMPLE_LICENSE_ORDER_RESPONSE_BODY.body.data[0].resource.meta.claims,
      },
    },
  }],
} as const);
