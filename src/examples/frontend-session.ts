// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Examples for frontend session/profile bootstrap flows.
 *
 * Note:
 *
 * - profile/provider identifiers in this file are synthetic fixtures imported
 *   from `./shared`
 * - do not inline DID/email/profile literals directly in frontend examples
 */

import {
  EXAMPLE_PROFILE_EMAIL,
  EXAMPLE_PROFILE_ID,
  EXAMPLE_PROFILE_ORGANIZATION_DID,
  EXAMPLE_PROFILE_PROVIDER_DID,
} from './shared';

export const EXAMPLE_PROFILE_SESSION_INPUT = {
  profileId: ` ${EXAMPLE_PROFILE_ID} `,
  email: ` ${EXAMPLE_PROFILE_EMAIL} `,
  role: ' controller ',
  providerDid: ` ${EXAMPLE_PROFILE_ORGANIZATION_DID} `,
  appType: 'Family',
} as const;

export const EXAMPLE_PROFILE_REGISTRY_ENTRY = {
  id: EXAMPLE_PROFILE_ID,
  email: EXAMPLE_PROFILE_EMAIL,
  role: 'controller',
  providerDid: EXAMPLE_PROFILE_ORGANIZATION_DID,
} as const;
