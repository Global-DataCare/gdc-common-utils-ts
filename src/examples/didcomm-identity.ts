import { DidcommMessageTypes } from '../constants/didcomm';
import type { IDecodedDidcommPayload } from '../models/confidential-message';
import { buildSmartCompositionReadScope } from '../utils/smart-scope';
import {
  EXAMPLE_DEVICE_CLIENT_ID,
  EXAMPLE_HOSTING_OPERATOR_DID,
  EXAMPLE_PROFESSIONAL_DID,
  EXAMPLE_SUBJECT_DID,
  buildExampleCommunicationIngestionPayload,
} from './shared';

/** Signing verification method controlled by the direct actor DID. */
export const EXAMPLE_DIRECT_ACTOR_SIGNING_KEY_ID =
  `${EXAMPLE_PROFESSIONAL_DID}#communication-signing` as const;

/** Signing verification method registered for the DCR client/device. */
export const EXAMPLE_DCR_DEVICE_SIGNING_KEY_ID =
  `${EXAMPLE_DEVICE_CLIENT_ID}#dcr-signing` as const;

/**
 * Canonical direct DIDComm/FAPI message.
 *
 * `from` and `iss` identify the same direct sender. `kid` identifies the
 * concrete signing key and therefore remains in the signed JWS header. The
 * FHIR-like Communication stays inside `body`; transport identity never
 * becomes a FHIR field.
 */
export const EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE: IDecodedDidcommPayload = {
  meta: {
    jws: {
      protected: {
        alg: 'ES384',
        kid: EXAMPLE_DIRECT_ACTOR_SIGNING_KEY_ID,
        typ: 'JWT',
        cty: 'application/didcomm-signed+json',
      },
    },
  },
  iss: EXAMPLE_PROFESSIONAL_DID,
  from: EXAMPLE_PROFESSIONAL_DID,
  aud: EXAMPLE_HOSTING_OPERATOR_DID,
  jti: 'urn:uuid:didcomm-direct-example',
  thid: 'didcomm-direct-example',
  type: DidcommMessageTypes.CommunicationAttachedBundle,
  body: buildExampleCommunicationIngestionPayload().body,
};

/**
 * Canonical device-bound SMART request.
 *
 * The DCR client/device is the DIDComm/FAPI sender and issuer because it signs
 * the request. Its registered `kid` selects the proof key. SMART `sub`
 * separately identifies the professional actor and `scope` separately limits
 * the subject data requested by that actor.
 */
export const EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE: IDecodedDidcommPayload = {
  meta: {
    jws: {
      protected: {
        alg: 'ES384',
        kid: EXAMPLE_DCR_DEVICE_SIGNING_KEY_ID,
        typ: 'JWT',
        cty: 'application/didcomm-signed+json',
      },
    },
  },
  iss: EXAMPLE_DEVICE_CLIENT_ID,
  from: EXAMPLE_DEVICE_CLIENT_ID,
  aud: EXAMPLE_HOSTING_OPERATOR_DID,
  jti: 'urn:uuid:didcomm-smart-example',
  thid: 'didcomm-smart-example',
  type: DidcommMessageTypes.SmartTokenRequest,
  body: {
    client_id: EXAMPLE_DEVICE_CLIENT_ID,
    sub: EXAMPLE_PROFESSIONAL_DID,
    scope: buildSmartCompositionReadScope({ subjectDid: EXAMPLE_SUBJECT_DID }),
  },
};
