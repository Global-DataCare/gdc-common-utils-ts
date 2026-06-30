// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { DidcommMessageTypes } from '../constants/didcomm';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { WalletMessagePriorities } from '../models/wallet';

/**
 * Reusable synthetic wallet fixtures for docs and tests.
 *
 * Rule:
 * - wallet-related tests must import these values instead of re-hardcoding
 *   queue ids, entity ids, thread ids, or payload strings inline
 */
export const EXAMPLE_WALLET_ENTITY_ID_SENDER = 'wallet-entity-sender-001' as const;
export const EXAMPLE_WALLET_ENTITY_ID_RECIPIENT = 'wallet-entity-recipient-001' as const;
export const EXAMPLE_WALLET_MESSAGE_ID_EMERGENCY = 'wallet-message-emergency-001' as const;
export const EXAMPLE_WALLET_MESSAGE_ID_NORMAL = 'wallet-message-normal-001' as const;
export const EXAMPLE_WALLET_THREAD_ID = 'wallet-thread-001' as const;
export const EXAMPLE_WALLET_PAYLOAD_TYPE = DidcommMessageTypes.CommunicationBundleSubmit;
export const EXAMPLE_WALLET_CREATED_AT = '2026-06-30T10:00:00.000Z' as const;
export const EXAMPLE_WALLET_CONTENT_NOTE = 'Medication bundle ready for DIDComm transport.' as const;
export const EXAMPLE_WALLET_FAILURE_MESSAGE = 'Gateway temporary failure.' as const;
export const EXAMPLE_WALLET_PROTECTED_DOC_ID = 'wallet-doc-001' as const;
export const EXAMPLE_WALLET_PRIORITY_EMERGENCY = WalletMessagePriorities.Emergency;
export const EXAMPLE_WALLET_PRIORITY_NORMAL = WalletMessagePriorities.Normal;

export const EXAMPLE_WALLET_MESSAGE_PAYLOAD = {
  iss: 'did:web:sender.example.org',
  aud: 'https://gw.example.org/submit',
  jti: 'wallet-jti-001',
  thid: EXAMPLE_WALLET_THREAD_ID,
  type: EXAMPLE_WALLET_PAYLOAD_TYPE,
  body: {
    data: [
      {
        id: 'wallet-entry-001',
        type: EXAMPLE_WALLET_PAYLOAD_TYPE,
        resource: {
          resourceType: ResourceTypesFhirR4.Communication,
          note: [{ text: EXAMPLE_WALLET_CONTENT_NOTE }],
        },
      },
    ],
  },
} as const;
