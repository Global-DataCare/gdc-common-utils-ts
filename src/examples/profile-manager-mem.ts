// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import {
  EXAMPLE_WALLET_ENTITY_ID_RECIPIENT,
  EXAMPLE_WALLET_ENTITY_ID_SENDER,
  EXAMPLE_WALLET_MESSAGE_PAYLOAD,
  EXAMPLE_WALLET_PRIORITY_EMERGENCY,
  EXAMPLE_WALLET_PRIORITY_NORMAL,
  EXAMPLE_WALLET_THREAD_ID,
} from './wallet-mem';

/**
 * Shared synthetic fixtures for low-level profile/message-manager tests.
 */
export const EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID = EXAMPLE_WALLET_ENTITY_ID_SENDER;
export const EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID = EXAMPLE_WALLET_ENTITY_ID_RECIPIENT;
export const EXAMPLE_PROFILE_MANAGER_MEM_DID = 'did:web:portal.example.org' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID = 'did:web:gw.example.org' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME = 'Portal BFF Profile' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DISPLAY_NAME = 'GW Proxy Profile' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_TYPE = 'Communication-response-v1.0' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_NOTE = 'Gateway acknowledged the queued communication.' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_PORTAL_REPLY_AUD = 'https://portal.example.org/reply' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_PORTAL_INBOX_AUD = 'https://portal.example.org/inbox' as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL = EXAMPLE_WALLET_PRIORITY_NORMAL;
export const EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY = EXAMPLE_WALLET_PRIORITY_EMERGENCY;
export const EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD = {
  iss: EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
  aud: EXAMPLE_PROFILE_MANAGER_MEM_PORTAL_INBOX_AUD,
  jti: 'gateway-response-jti-001',
  thid: EXAMPLE_WALLET_THREAD_ID,
  type: EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_TYPE,
  body: {
    ok: true,
    note: EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_NOTE,
  },
} as const;
export const EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD = EXAMPLE_WALLET_MESSAGE_PAYLOAD;
