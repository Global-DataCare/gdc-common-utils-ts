// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  ActorRuntimeClasses,
  ConnectionSecretKinds,
  KeyAccessModes,
  ProfileAppTypes,
} from '../constants/profile-runtime';

/**
 * Shared fixtures for profile-runtime tests and 101 examples.
 *
 * Keep runtime-class, key-access, secret-kind, app-type, and local secret
 * placeholders here so SDK packages do not re-inline them in their own tests.
 */
export const EXAMPLE_PROFILE_APP_TYPE_FAMILY = ProfileAppTypes.Family;
export const EXAMPLE_PROFILE_RUNTIME_CLASS_SERVER = ActorRuntimeClasses.Server;
export const EXAMPLE_PROFILE_RUNTIME_CLASS_FRONTEND = ActorRuntimeClasses.Frontend;
export const EXAMPLE_PROFILE_KEY_ACCESS_MODE_SERVER =
  KeyAccessModes.UnlockEncryptedKeys;
export const EXAMPLE_PROFILE_KEY_ACCESS_MODE_FRONTEND =
  KeyAccessModes.DeriveFromSeed;
export const EXAMPLE_PROFILE_CONNECTION_SECRET_KIND_PIN_PASSWORD =
  ConnectionSecretKinds.PinPassword;
export const EXAMPLE_PROFILE_LOCAL_PIN_PASSWORD_BACKEND = 'local-backend-pin' as const;
export const EXAMPLE_PROFILE_LOCAL_PIN_PASSWORD_FRONTEND = 'local-frontend-pin' as const;
export const EXAMPLE_PROFILE_CONNECTION_PIN_PASSWORD = 'subject-channel-pin' as const;
export const EXAMPLE_PROFILE_RUNTIME_JOB_ID = 'job-id' as const;
