/** Employee directory states exposed by organization lifecycle projections. */
export const EmployeeDirectoryStatuses = Object.freeze({
  Active: 'active',
  Inactive: 'inactive',
  Purged: 'purged',
  Unknown: 'unknown',
} as const);

export type EmployeeDirectoryStatus =
  typeof EmployeeDirectoryStatuses[keyof typeof EmployeeDirectoryStatuses];

/** Controller actions supported by the reusable employee lifecycle service. */
export const EmployeeLifecycleActions = Object.freeze({
  Disable: 'disable',
  Purge: 'purge',
  RevokeDevice: 'revoke_device',
} as const);

/** Read-only API actions kept separate from mutating employee lifecycle actions. */
export const EmployeeLifecycleQueryActions = Object.freeze({
  List: 'list',
} as const);

export type EmployeeLifecycleAction =
  typeof EmployeeLifecycleActions[keyof typeof EmployeeLifecycleActions];

/** Version tag for routing metadata stored outside the high-entropy GW credential. */
export const EmployeeActivationGrantVersions = Object.freeze({
  V1: 'employee-activation-grant-v1',
} as const);

/** Supported durable routing-grant schema versions. */
export type EmployeeActivationGrantVersion =
  typeof EmployeeActivationGrantVersions[keyof typeof EmployeeActivationGrantVersions];

/** Shared durable-storage layout for hashed employee activation routing grants. */
export const EmployeeActivationGrantStorage = Object.freeze({
  ScopedLayout: 'scoped-v2',
  CollectionSegment: 'employee-activation-grants',
  ScopeSeparator: '__',
  DefaultTtlMs: 365 * 24 * 60 * 60 * 1_000,
} as const);

/** JSON field names shared by employee lifecycle portal adapters. */
export const OrganizationEmployeeApiFields = Object.freeze({
  Action: 'action',
  ProfileId: 'profileId',
  Pin: 'pin',
  PasskeyAccessToken: 'passkeyAccessToken',
  ResourceId: 'resourceId',
  LicenseId: 'licenseId',
  ClientId: 'clientId',
  ActivationCode: 'activationCode',
  ClientInstanceId: 'clientInstanceId',
  Email: 'email',
  Role: 'role',
} as const);

/** Stable employee portal error identifiers. */
export const OrganizationEmployeePortalErrors = Object.freeze({
  InvitationFailed: 'invitation_failed',
  LifecycleFailed: 'employee_lifecycle_failed',
  ActivationFailed: 'employee_activation_failed',
} as const);
