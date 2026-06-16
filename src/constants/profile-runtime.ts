// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical logical application families used by shared SDK profile/session
 * contracts.
 */
export const ProfileAppTypes = Object.freeze({
  Organization: 'Organization',
  Family: 'Family',
} as const);

export type ProfileAppType = typeof ProfileAppTypes[keyof typeof ProfileAppTypes];

/**
 * Canonical runtime classes for actor-aware profile loading.
 */
export const ActorRuntimeClasses = Object.freeze({
  Frontend: 'frontend',
  Server: 'server',
} as const);

export type ActorRuntimeClass = typeof ActorRuntimeClasses[keyof typeof ActorRuntimeClasses];

/**
 * Canonical key access strategies for profile loading/unlocking.
 */
export const KeyAccessModes = Object.freeze({
  DeriveFromSeed: 'derive-from-seed',
  UnlockEncryptedKeys: 'unlock-encrypted-keys',
} as const);

export type KeyAccessMode = typeof KeyAccessModes[keyof typeof KeyAccessModes];

/**
 * Canonical secret kinds for subject/index relationship connection.
 */
export const ConnectionSecretKinds = Object.freeze({
  PinPassword: 'pin-password',
  OtpCode: 'otp-code',
} as const);

export type ConnectionSecretKind =
  typeof ConnectionSecretKinds[keyof typeof ConnectionSecretKinds];
