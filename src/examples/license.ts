import { DeviceAppTypes, DeviceUserClasses } from '../constants/device';
import {
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
import {
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
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
