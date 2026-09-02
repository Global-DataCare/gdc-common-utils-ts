import { DeviceAppType, DeviceAppTypes, DeviceBindingStatuses, DeviceUserClass, DeviceUserClasses } from '../constants/device';
import {
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsPersonSchemaorg,
} from '../constants/schemaorg';
import type { DeviceBinding, DeviceInfo, DeviceLicense } from '../models/device-license';

/** Default simultaneous installation allowance for one professional/member seat. */
export const DEFAULT_LICENSE_DEVICE_ALLOWANCE = 2;

/** Resolves an explicit positive allowance or the backwards-compatible default. */
export function resolveLicenseDeviceAllowance(license: unknown): number {
  const value = Number((license as { maxDevices?: number } | undefined)?.maxDevices);
  return Number.isInteger(value) && value > 0 ? value : DEFAULT_LICENSE_DEVICE_ALLOWANCE;
}

/**
 * Reads active bindings while projecting the old singular `deviceId` shape as
 * one binding. This permits a rolling migration without invalidating seats.
 */
export function listActiveLicenseDeviceBindings(
  license: Pick<DeviceLicense, 'deviceBindings' | 'deviceId' | 'deviceInfo' | 'activatedAt'>,
): DeviceBinding[] {
  if (Array.isArray(license.deviceBindings)) {
    return license.deviceBindings.filter((binding) => binding.status === DeviceBindingStatuses.Active);
  }
  const clientId = String(license.deviceId || '').trim();
  if (!clientId) return [];
  const deviceInfo: DeviceInfo = license.deviceInfo || { clientInstanceId: clientId };
  return [{
    clientId,
    clientInstanceId: deviceInfo.clientInstanceId || clientId,
    status: DeviceBindingStatuses.Active,
    deviceInfo,
    activatedAt: Number(license.activatedAt || 0),
  }];
}

/** True for an idempotent installation or while the seat still has capacity. */
export function canRegisterLicenseDevice(
  license: Pick<DeviceLicense, 'maxDevices' | 'deviceBindings' | 'deviceId' | 'deviceInfo' | 'activatedAt'>,
  clientInstanceId: string,
): boolean {
  const installationId = String(clientInstanceId || '').trim();
  const active = listActiveLicenseDeviceBindings(license);
  if (installationId && active.some((binding) => binding.clientInstanceId === installationId)) return true;
  return active.length < resolveLicenseDeviceAllowance(license);
}

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
 * Canonical route fragments used by runtime/search wrappers for license flows.
 */
export const LicenseRoutes = Object.freeze({
  Search: 'License/_search',
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

/**
 * Role families that decide which organization owns the actor's license.
 *
 * This classification is deliberately independent from Consent. A person may
 * receive permissions in either case, but only a FHIR v3 relationship role is
 * a member of the individual's organization and consumes its seat pool.
 */
export const LicenseRoleKinds = Object.freeze({
  IndividualMember: 'individual-member',
  Professional: 'professional',
  Unsupported: 'unsupported',
} as const);

export type LicenseRoleKind = typeof LicenseRoleKinds[keyof typeof LicenseRoleKinds];

/**
 * Classifies one canonical or compatibility role token for license ownership.
 *
 * Rules:
 * - FHIR/HL7 v3 `RoleCode` actors are non-employee members of the individual
 *   organization and consume one of its licenses.
 * - ISCO/ISCO-08 actors are professionals. Their employer/organization owns
 *   their professional license, so a patient's individual pool is untouched.
 * - Unknown role systems are not silently charged to either pool.
 */
export function classifyLicenseRole(role: string): LicenseRoleKind {
  const normalized = String(role || '').trim().toLowerCase();
  if (!normalized) return LicenseRoleKinds.Unsupported;
  const system = normalized.includes('|') ? normalized.split('|', 1)[0] : normalized;
  if (
    system === 'isco'
    || system === 'isco-08'
    || system === 'org.ilo.isco'
    || system === 'org.ilo.isco-08'
    || system.endsWith('/isco-08')
  ) {
    return LicenseRoleKinds.Professional;
  }
  if (
    system === 'v3-rolecode'
    || system === 'org.hl7.v3.rolecode'
    || system.endsWith('/v3-rolecode')
  ) {
    return LicenseRoleKinds.IndividualMember;
  }
  return LicenseRoleKinds.Unsupported;
}

export type LicenseIssueInput = Readonly<{
  email?: string;
  telephone?: string;
  role: string;
  userClass?: DeviceUserClass;
  type?: DeviceAppType;
  /** Individual/legal organization that owns the seat pool. */
  ownerOrganizationId?: string;
  /** Card/individual DID granted by the invitation after acceptance. */
  subjectDid?: string;
  /** Technical resource id of the employee/member that consumes the seat. */
  subjectId?: string;
  /** Existing RelatedPerson/contact selected before the invitation. */
  relatedPersonId?: string;
  /** Stable invitation workflow identifier; not the license id or code. */
  invitationId?: string;
  additionalClaims?: LicenseClaims;
}>;

export type LicensePurchaseInput = Readonly<{
  quantity: number;
  userClass?: DeviceUserClass;
  type?: DeviceAppType;
  serialNumbers?: readonly string[];
  price?: number;
  priceCurrency?: string;
  /** Organization whose pool receives the newly materialized seats. */
  ownerOrganizationId?: string;
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
  ownerOrganizationId?: string;
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
  const email = String(input.email || '').trim();
  const telephone = String(input.telephone || '').trim();
  if (!email && !telephone) {
    throw new Error('License issue requires an email or telephone recipient.');
  }
  if (telephone && !/^\+[1-9]\d{6,14}$/.test(telephone)) {
    throw new Error('License issue telephone must use an international ITU format beginning with +.');
  }
  const userClass = input.userClass || DeviceUserClasses.Employee;
  if (userClass === DeviceUserClasses.Individual) {
    const roleKind = classifyLicenseRole(input.role);
    if (roleKind === LicenseRoleKinds.Professional) {
      throw new Error('ISCO professional roles do not consume individual-member licenses.');
    }
    if (roleKind !== LicenseRoleKinds.IndividualMember) {
      throw new Error('Individual-member licenses require a FHIR v3-RoleCode role.');
    }
  }
  const claims: LicenseClaims = {
    '@context': LicenseClaimContext.SchemaOrg,
    ...cloneClaims(input.additionalClaims),
    ...(email ? { [ClaimsPersonSchemaorg.email]: email } : {}),
    ...(telephone ? { [ClaimsPersonSchemaorg.telephone]: telephone } : {}),
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: input.role.trim(),
    [ClaimsIndividualProductSchemaorg.category]: mapLicenseCategoryFromUserClass(
      userClass,
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
  meta: {
    claims: LicenseClaims;
    ownerOrganizationId?: string;
    subjectDid?: string;
    subjectId?: string;
    relatedPersonId?: string;
    invitationId?: string;
  };
} {
  return {
    type: LicenseEntryTypes.Issue,
    request: { method: LicenseRequestMethods.Post },
    meta: {
      claims: {
        ...buildLicenseIssueClaims(input),
        '@type': LicenseEntryOperations.Issue,
      },
      ...(String(input.ownerOrganizationId || '').trim()
        ? { ownerOrganizationId: String(input.ownerOrganizationId).trim() }
        : {}),
      ...(String(input.subjectDid || '').trim()
        ? { subjectDid: String(input.subjectDid).trim() }
        : {}),
      ...(String(input.subjectId || '').trim()
        ? { subjectId: String(input.subjectId).trim() }
        : {}),
      ...(String(input.relatedPersonId || '').trim()
        ? { relatedPersonId: String(input.relatedPersonId).trim() }
        : {}),
      ...(String(input.invitationId || '').trim()
        ? { invitationId: String(input.invitationId).trim() }
        : {}),
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
  if (typeof input.price === 'number' && Number.isFinite(input.price) && input.price >= 0) {
    claims[ClaimsOfferSchemaorg.price] = input.price;
  }
  if (typeof input.priceCurrency === 'string' && input.priceCurrency.trim()) {
    claims[ClaimsOfferSchemaorg.priceCurrency] = input.priceCurrency.trim().toUpperCase();
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
  meta: { claims: LicenseClaims; ownerOrganizationId?: string };
} {
  return {
    type: LicenseEntryTypes.Purchase,
    request: { method: LicenseRequestMethods.Post },
    meta: {
      claims: {
        ...buildLicensePurchaseClaims(input),
        '@type': LicenseEntryOperations.Purchase,
      },
      ...(String(input.ownerOrganizationId || '').trim()
        ? { ownerOrganizationId: String(input.ownerOrganizationId).trim() }
        : {}),
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
    ownerOrganizationId?: string;
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
      ...(typeof input.ownerOrganizationId === 'string' && input.ownerOrganizationId.trim()
        ? { ownerOrganizationId: input.ownerOrganizationId.trim() }
        : {}),
    },
  };
}
