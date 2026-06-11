import { DeviceAppType, DeviceAppTypes, DeviceUserClass, DeviceUserClasses } from '../constants/device';
import {
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsPersonSchemaorg,
} from '../constants/schemaorg';

export type LicenseClaims = Record<string, unknown>;

export const LicenseClaimContext = Object.freeze({
  SchemaOrg: 'org.schema',
} as const);

/**
 * Canonical business categories currently used by GW licensing flows.
 *
 * Mapping:
 * - employee -> professional
 * - individual -> individual
 */
export const LicenseCategories = Object.freeze({
  Professional: 'professional',
  Individual: 'individual',
} as const);

export type LicenseCategory = typeof LicenseCategories[keyof typeof LicenseCategories];

/**
 * Stable helper-level request type ids for license-oriented batch entries.
 *
 * These are request metadata strings emitted by SDK/common-utils helpers so
 * callers do not handcraft type labels inline.
 */
export const LicenseEntryTypes = Object.freeze({
  Issue: 'License-issue-request-v1.0',
  Purchase: 'License-purchase-request-v1.0',
  Search: 'License-search-request-v1.0',
} as const);

export const LicenseEntryOperations = Object.freeze({
  Issue: 'IndividualProduct:Issue',
  Purchase: 'IndividualProduct:Purchase',
  Search: 'IndividualProduct:Search',
} as const);

export const LicenseRequestMethods = Object.freeze({
  Post: 'POST',
} as const);

/**
 * Runtime-facing lifecycle values commonly used when searching stored
 * `DeviceLicense` documents.
 *
 * These are not schema.org claims. They are operational filters that runtime
 * layers may attach alongside the canonical schema.org claims.
 */
export const LicenseStatuses = Object.freeze({
  Available: 'available',
  Issued: 'issued',
  Active: 'active',
  Inactive: 'inactive',
} as const);

export type LicenseStatus = typeof LicenseStatuses[keyof typeof LicenseStatuses];

export type LicenseIssueInput = Readonly<{
  email: string;
  role: string;
  userClass?: DeviceUserClass;
  type?: DeviceAppType;
  additionalClaims?: LicenseClaims;
}>;

export type LicensePurchaseInput = Readonly<{
  quantity: number;
  userClass?: DeviceUserClass;
  type?: DeviceAppType;
  serialNumbers?: readonly string[];
  additionalClaims?: LicenseClaims;
}>;

export type LicenseSearchInput = Readonly<{
  serialNumbers?: readonly string[];
  userClass?: DeviceUserClass;
  type?: DeviceAppType;
  email?: string;
  role?: string;
  status?: LicenseStatus;
  subjectId?: string;
  additionalClaims?: LicenseClaims;
}>;

function cloneClaims(claims?: LicenseClaims): LicenseClaims {
  return { ...(claims || {}) };
}

/**
 * Maps one canonical runtime user class to the schema.org-compatible
 * `IndividualProduct.category` value used by current GW flows.
 */
export function mapLicenseCategoryFromUserClass(userClass: DeviceUserClass = DeviceUserClasses.Employee): LicenseCategory {
  return userClass === DeviceUserClasses.Individual
    ? LicenseCategories.Individual
    : LicenseCategories.Professional;
}

/**
 * Converts a list of seat ids / serial numbers into the compact string form
 * currently stored in `org.schema.Offer.serialNumber`.
 */
export function serializeLicenseSerialNumbers(serialNumbers?: readonly string[]): string | undefined {
  const normalized = (serialNumbers || [])
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  return normalized.length > 0 ? normalized.join(',') : undefined;
}

/**
 * Builds canonical `org.schema.*` claims for `License/_issue`.
 *
 * The resulting payload keeps current GW semantics:
 * - recipient identity/role comes from `Person.*`
 * - seat/app semantics come from `IndividualProduct.*`
 */
export function buildLicenseIssueClaims(input: LicenseIssueInput): LicenseClaims {
  const claims: LicenseClaims = {
    '@context': LicenseClaimContext.SchemaOrg,
    ...cloneClaims(input.additionalClaims),
    [ClaimsPersonSchemaorg.email]: input.email.trim(),
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: input.role.trim(),
    [ClaimsIndividualProductSchemaorg.category]: mapLicenseCategoryFromUserClass(
      input.userClass || DeviceUserClasses.Employee,
    ),
    [ClaimsIndividualProductSchemaorg.additionalType]: input.type || DeviceAppTypes.Mobile,
  };
  return claims;
}

/**
 * Builds the canonical batch entry for `License/_issue`.
 */
export function buildLicenseIssueEntry(input: LicenseIssueInput): {
  type: string;
  request: { method: 'POST' };
  meta: { claims: LicenseClaims };
} {
  return {
    type: LicenseEntryTypes.Issue,
    request: { method: LicenseRequestMethods.Post },
    meta: {
      claims: {
        ...buildLicenseIssueClaims(input),
        '@type': LicenseEntryOperations.Issue,
      },
    },
  };
}

/**
 * Builds canonical schema.org claims for a license purchase / seat-creation
 * request.
 *
 * Current business semantics:
 * - `Offer.eligibleQuantity.value` requests how many seats must exist
 * - `Offer.serialNumber` can optionally carry the explicit seat ids when they
 *   are already known or preallocated
 * - `IndividualProduct.*` classifies the target seat family/form factor
 */
export function buildLicensePurchaseClaims(input: LicensePurchaseInput): LicenseClaims {
  const claims: LicenseClaims = {
    '@context': LicenseClaimContext.SchemaOrg,
    ...cloneClaims(input.additionalClaims),
    [ClaimsIndividualProductSchemaorg.category]: mapLicenseCategoryFromUserClass(
      input.userClass || DeviceUserClasses.Employee,
    ),
    [ClaimsIndividualProductSchemaorg.additionalType]: input.type || DeviceAppTypes.Mobile,
    [ClaimsOfferSchemaorg.eligibleQuantityValue]: input.quantity,
  };
  const serializedSerialNumbers = serializeLicenseSerialNumbers(input.serialNumbers);
  if (serializedSerialNumbers) {
    claims[ClaimsOfferSchemaorg.serialNumber] = serializedSerialNumbers;
  }
  return claims;
}

/**
 * Builds the canonical batch entry for a purchase/order-oriented license
 * request.
 */
export function buildLicensePurchaseEntry(input: LicensePurchaseInput): {
  type: string;
  request: { method: 'POST' };
  meta: { claims: LicenseClaims };
} {
  return {
    type: LicenseEntryTypes.Purchase,
    request: { method: LicenseRequestMethods.Post },
    meta: {
      claims: {
        ...buildLicensePurchaseClaims(input),
        '@type': LicenseEntryOperations.Purchase,
      },
    },
  };
}

/**
 * Builds the canonical search envelope for license listing.
 *
 * Split of concerns:
 * - schema.org-compatible selectors stay in `meta.claims`
 * - document lifecycle stays in `meta.status`, mirroring the current
 *   `ConfidentialStorageDoc.status` usage
 * - `subjectId` remains an explicit side-field until a canonical indexed claim
 *   is introduced for that lookup
 */
export function buildLicenseSearchEntry(input: LicenseSearchInput): {
  type: string;
  request: { method: 'POST' };
  meta: {
    claims: LicenseClaims;
    status?: LicenseStatus;
    subjectId?: string;
  };
} {
  const claims: LicenseClaims = {
    '@context': LicenseClaimContext.SchemaOrg,
    ...cloneClaims(input.additionalClaims),
  };

  if (input.serialNumbers && input.serialNumbers.length > 0) {
    claims[ClaimsOfferSchemaorg.serialNumber] = serializeLicenseSerialNumbers(input.serialNumbers);
  }
  if (input.userClass) {
    claims[ClaimsIndividualProductSchemaorg.category] = mapLicenseCategoryFromUserClass(input.userClass);
  }
  if (input.type) {
    claims[ClaimsIndividualProductSchemaorg.additionalType] = input.type;
  }
  if (typeof input.email === 'string' && input.email.trim()) {
    claims[ClaimsPersonSchemaorg.email] = input.email.trim();
  }
  if (typeof input.role === 'string' && input.role.trim()) {
    claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue] = input.role.trim();
  }

  return {
    type: LicenseEntryTypes.Search,
    request: { method: LicenseRequestMethods.Post },
    meta: {
      claims: {
        ...claims,
        '@type': LicenseEntryOperations.Search,
      },
      ...(input.status ? { status: input.status } : {}),
      ...(typeof input.subjectId === 'string' && input.subjectId.trim()
        ? { subjectId: input.subjectId.trim() }
        : {}),
    },
  };
}
