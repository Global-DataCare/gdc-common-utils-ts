/** Canonical identity/auth route actions shared by gateways, SDKs and portals. */
export const IdentityAuthActions = Object.freeze({
  Exchange: '_exchange',
  ExchangeResponse: '_exchange-response',
  Dcr: '_dcr',
  DcrResponse: '_dcr-response',
  Issue: '_issue',
  IssueResponse: '_issue-response',
  Revoke: '_revoke',
  RevokeResponse: '_revoke-response',
  Search: '_search',
  SearchResponse: '_search-response',
} as const);

/** Canonical identity/auth route segments shared by all products. */
export const IdentityAuthRouteSegments = Object.freeze({
  Host: 'host',
  Version: 'v1',
  Section: 'identity',
  Format: 'auth',
} as const);

/** Resource discriminators used by identity/auth routes after DCR. */
export const IdentityAuthResourceTypes = Object.freeze({
  Smart: 'smart',
} as const);

/**
 * SMART post-DCR actions.
 *
 * `TokenResponse` is the canonical polling action. `LegacyBatchResponse` is
 * accepted temporarily for installed clients; `_token` is intentionally not
 * part of the contract.
 */
export const SmartPostDcrActions = Object.freeze({
  Token: 'token',
  TokenResponse: 'token-response',
  LegacyBatchResponse: '_batch-response',
} as const);

/** Client authentication methods accepted by the SMART token endpoint. */
export const SmartClientAssertionTypes = Object.freeze({
  PrivateKeyJwt: 'private_key_jwt',
} as const);

/** OIDC4VP ACR values used by SMART authorization profiles. */
export const SmartOpenIdAcrValues = Object.freeze({
  Individual: 'urn:antifraud:acr:openid4vp:individual',
} as const);

/** Wire-level request keys used by identity/auth operations. */
export const IdentityAuthRequestFields = Object.freeze({
  SubjectToken: 'subject_token',
  ClientInstanceId: 'client_instance_id',
  LicenseId: 'license_id',
  ClientId: 'client_id',
  Code: 'code',
} as const);

/** Response keys accepted from token exchange during the compatibility window. */
export const IdentityAuthResponseFields = Object.freeze({
  InitialAccessToken: 'initial_access_token',
  AccessToken: 'access_token',
} as const);

/** DCR metadata keys used to derive and register one installation identity. */
export const IdentityDcrMetadataFields = Object.freeze({
  ExtendedDeviceInfo: 'ext_device_info',
  RedirectUris: 'redirect_uris',
  Jwks: 'jwks',
  SoftwareId: 'software_id',
  ApplicationType: 'application_type',
  ClientName: 'client_name',
  ActorDid: 'actor_did',
  ProfileDid: 'profile_did',
  ClinicalCreatorBinding: 'clinical_creator_binding',
} as const);

/** Device metadata keys nested below `ext_device_info`. */
export const IdentityDeviceInfoFields = Object.freeze({
  DeviceId: 'device_id',
} as const);

/** Stable entry type emitted by license issuance responses. */
export const IdentityAuthResponseEntryTypes = Object.freeze({
  LicenseIssued: 'License:Issued',
  DeviceRevoked: 'Device:Revoked',
} as const);

/** DIDComm response type values emitted by identity/auth managers. */
export const IdentityAuthResponseTypes = Object.freeze({
  DeviceRevoke: 'device-revoke-response',
} as const);
