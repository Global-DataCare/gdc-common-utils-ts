// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Examples for frontend session/profile bootstrap flows.
 */

export const EXAMPLE_PROFILE_PROVIDER_DID = 'did:web:provider.example.org';

export const EXAMPLE_PROFILE_SESSION_INPUT = {
  profileId: ' profile-1 ',
  email: ' user@example.com ',
  role: ' controller ',
  providerDid: ' did:web:org.example ',
  appType: 'Family',
} as const;

export const EXAMPLE_PROFILE_REGISTRY_ENTRY = {
  id: 'profile-1',
  email: 'user@example.com',
  role: 'controller',
  providerDid: 'did:web:org.example',
} as const;
