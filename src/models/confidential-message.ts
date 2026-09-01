// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/models/confidential-message.ts
// Description: Defines the core communication and data structures based on DIDComm and FHIR.

import { ProtectedHeadersJWE } from "./jwe";
import { JwsHeader } from "./jws";

export type { DataEntry } from "./comm";

/**
 * Defines the structure of the cryptographic metadata associated with a job request.
 */
export interface DidCommDecodedMetadata {
  jws?: {
    protected?: JwsHeader;
    /** Detached signature of the request JWS (when available). */
    signature?: string;
  };
  jwe?: {
    header?: ProtectedHeadersJWE;
  };
  bearer?: {
    compact?: string,
    jwt: {
      header?: JwsHeader;
      payload?: Record<string, any>;
    };
  };
}

/**
 * Represents the standard payload of a DIDComm v2 message.
 * @see https://identity.foundation/didcomm-messaging/spec/v2.0/#plaintext-message-structure
 */
/**
 * Represents the plaintext of a decoded DIDComm message.
 * This is the core business-level "input" for a job.
 * For FAPI compliance, this entire object is typically the payload of a signed JWS.
 *
 * Layering rule:
 * - `type` is the outer envelope/protocol type
 * - `body` carries the business payload
 * - that `body` is often a batch container such as `BundleJsonApi`
 * - resources inside that batch may be FHIR-like resources with
 *   `resource.meta.claims`
 *
 * This object is not itself a FHIR resource.
 */
export interface IDecodedDidcommPayload {

  /** Relevant information available through the decryption and verification process */
  meta?: DidCommDecodedMetadata;

  // --- FAPI & JWT Core Claims ---
  
  /**
   * (Issuer) DID of the entity that issued and signed the message.
   * REQUIRED for FAPI. It MUST be bound to the signer of the enclosing JWS.
   * The signing key is identified separately by `meta.jws.protected.kid`;
   * `iss` is never the key id. For a DCR-bound client this is normally the
   * client/device DID, while a SMART human actor remains in `body.sub`.
   */
  iss: string;

  /**
   * (Audience) The URL of the backend endpoint that will process this message.
   * REQUIRED for FAPI. The backend MUST validate that this value matches its own URL.
   */
  aud: string;

  /** (Expiration Time) Timestamp after which the message is considered invalid. REQUIRED for FAPI (instead of expires_time). */
  exp?: number;

  /** (Not Before) Timestamp before which the message must not be processed. REQUIRED for FAPI (instead of created_time). */
  nbf?: number;

  /** (Issued At) Timestamp when the message was issued. REQUIRED for FAPI. */
  iat?: number;
  
  /**
   * (JWT ID) A unique identifier for this message/token. Can be used to prevent replay attacks.
   * In our architecture, this can also serve as the version hash of the data content.
   */
  jti: string;

  // --- DIDComm Core Fields ---

  /** Optional. The `jti` identifies both the message and job for processing */
  id?: string;
  
  /** The Transaction ID / Thread ID for message correlation across an interaction. */
  thid: string;

  /**  Parent Thread ID */
  pthid?: string; 

  /** The DID of the intended recipient. Used for P2P messaging, informational in client-server requests. */
  to?: string[];
  
  /**
   * DIDComm sender DID. In a direct signed request this normally equals `iss`.
   * It is never a raw email, telephone, card id or `urn:multibase` alias. When
   * a DCR client acts for a human, `from`/`iss` identify the client and SMART
   * `body.sub` identifies the human actor. `iss` remains authoritative for
   * the FAPI signature boundary.
   */
  from?: string;

  /**
   * The Message Type URI, identifying the type of data in the body or protocol used.
   *
   * Examples:
   * - DIDComm/business envelope type
   * - transport protocol hint
   *
   * This is not:
   * - a FHIR `resourceType`
   * - a GW batch-entry business type
  */
  type: string;

  /**
   * The main business payload of the message.
   *
   * In GW/SDK flows this is often:
   * - a hybrid batch container (`BundleJsonApi`)
   * - carrying entries
   * - carrying FHIR-like resources
   */
  body: any;
}

/**
 * Represents a data entry in the `body` of a CommMsgExtended,
 * following a hybrid JSON:API and FHIR structure.
 */
export interface CommDataEntry {
  id: string;
  type: 'Annotation' | 'Reference' | 'Attachment' | 'CodeableConcept' | string;
  resource: { [key: string]: any };
  meta?: {
    claims: any;
  }
}

/**
 * The canonical, internal representation of a secure message, extending
 * the standard DIDComm payload with FHIR-specific, flattened metadata.
 *
 * Internal model note:
 * - this is a gateway/runtime representation
 * - it is not the main payload shape that new SDK/frontend/backend integrators
 *   should author directly
 */
export interface ICommPayloadExtended extends IDecodedDidcommPayload {
  // Overriding body for a more specific structure
  body: {
    data: CommDataEntry[];
  };

  // FHIR Communication resource fields, flattened for use as metadata or search parameters.
  // These are derived from the source FHIR resource during conversion.
  
  // 'status'?: string; // e.g., 'completed', 'in-progress'
  // 'statusReason'?: string; // Flattened from CodeableConcept
  // 'partOf'?: string; // Comma-separated list of URNs/URLs
  // 'basedOn'?: string; // Comma-separated list of URNs/URLs
  // 'inResponseTo'?: string; // Comma-separated list of URNs/URLs
  // 'priority'?: string; // e.g., 'routine', 'urgent'
  // 'topic'?: string; // Flattened from CodeableConcept
  // 'medium'?: string; // Flattened from CodeableConcept
  // 'about'?: string; // Comma-separated list of URNs/URLs
  // 'encounter'?: string; // URN or URL
}
