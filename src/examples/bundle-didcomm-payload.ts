// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import {
  EXAMPLE_GATEWAY_PUBLIC_ORIGIN,
} from './shared';

/**
 * Shared synthetic DIDComm fixtures for direct Bundle payload tests.
 */
export const EXAMPLE_DIDCOMM_BUNDLE_ISS = 'did:web:portal.example.org' as const;
export const EXAMPLE_DIDCOMM_BUNDLE_AUD = `${EXAMPLE_GATEWAY_PUBLIC_ORIGIN}/bundle` as const;
export const EXAMPLE_DIDCOMM_BUNDLE_JTI = 'didcomm-bundle-jti-001' as const;
export const EXAMPLE_DIDCOMM_BUNDLE_THID = 'didcomm-bundle-thread-001' as const;
export const EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE = 'Bundle-batch-request-v1.0' as const;
export const EXAMPLE_DIDCOMM_BUNDLE_REPLY_AUD = `${EXAMPLE_GATEWAY_PUBLIC_ORIGIN}/bundle-reply` as const;
export const EXAMPLE_DIDCOMM_BUNDLE_REPLY_JTI = 'didcomm-bundle-reply-jti-001' as const;
export const EXAMPLE_DIDCOMM_BUNDLE_ACK_TYPE = 'Bundle-ack-v1.0' as const;
