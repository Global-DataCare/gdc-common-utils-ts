// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/models/did.ts

import { PublicJwk } from "../interfaces/Cryptography.types";
import { RecipientPublicKey } from "./crypto";
import { JwkSet } from "./jwk";
import type { ActorKind } from "./actor-session";
export type { ActorKind } from "./actor-session";

/**
 * The parameters required to construct a service endpoint selector.
 * This is the contract for a specific API method to define its endpoint.
 */
export interface ServiceEndpointSelector {
  /** When the organization has its own domain for the connector the apiVersion and sector do not appear in the path */
  apiVersion?: string;
  sector?: string;
  /** Corresponds to <sectionTypeOrCompartmentCodingSystem> */
  section: string; // entity, individual, ...
  /** Corresponds to <formatTypeOrCompartmentCodingValue> */
  format: string;
  resourceType: string;
  action: string;
}

/**
 * Extends the base selector with authorization information.
 * This is used for endpoints that are not public and require a SMART token.
 */
export interface SecureServiceEndpointSelector extends ServiceEndpointSelector {
  requiredScope: string; // The OAuth/SMART scope needed to call this endpoint
}

/**
 * Represents a service endpoint in a DID Document.
 * @see https://www.w3.org/TR/did-core/#service-endpoints
 */
export interface DidService {
    id: string;
    type: string;
    serviceEndpoint: string;
    [key: string]: any; // Allow for additional properties
}

/**
 * Represents a DID Document, compliant with the W3C DID Core specification.
 * It describes how to use a DID, including verification methods and service endpoints.
 * @see https://www.w3.org/TR/did-core/
 */
export interface DidDocument {
    /** The DID context, typically "https://www.w3.org/ns/did/v1". */
    '@context': string | string[];
    /** The DID URI itself. */
    id: string;
    /** Independent DID subjects authorized to control this DID. */
    controller?: string | string[];
    /** Public keys used for verifying digital signatures */
    verificationMethod?: VerificationMethod[];
    /** 
     * Specifies verification methods for making claims. Can be embedded or a string referencing a `verificationMethod`.
     * @see https://www.w3.org/TR/did-core/#assertion
     */
    assertionMethod?: (string | VerificationMethod)[]; 
    /** 
     * Specifies methods for authentication. Can be embedded or a string referencing a `verificationMethod`.
     * @see https://www.w3.org/TR/did-core/#authentication
     */
    authentication?: (string | VerificationMethod)[]; 
    /** 
     * Specifies methods for key agreement. Can be embedded or a string referencing a `verificationMethod`.
     * @see https://www.w3.org/TR/did-core/#key-agreement
     */
    keyAgreement?: (string | VerificationMethod)[];
    /** Service endpoints for interacting with the entity */    
    service?: DidService[];
    /** Other properties are allowed. */
    [key: string]: any;
}

// En src/models/did.ts (o donde esté RecipientPublicKey/VerificationMethod)
export interface VerificationMethod extends RecipientPublicKey {
  id: string; // e.g., did:web:example.com#key-1
  type: string; // e.g., JsonWebKey2020
  controller: string; // e.g., did:web:example.com
  publicKeyJwk: PublicJwk;
}

export interface ResolvedServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
  capability?: string;
  raw: DidService;
}

export interface ActorIdentity {
  did: string;
  kind?: ActorKind | 'unknown';
  sameAs?: string;
  didDocument?: DidDocument;
  jwks?: JwkSet;
  publicKeyJwk?: PublicJwk;
}

export interface TransportIdentity {
  did?: string;
  didDocument?: DidDocument;
  jwks?: JwkSet;
  signingKid?: string;
  encryptionKid?: string;
}

export interface DidResolutionResult {
  did: string;
  issuer?: string;
  didDocument?: DidDocument;
  didDocumentUrl?: string;
  jwksUri?: string;
  jwks?: JwkSet;
  smartTokenEndpoint?: string;
  serviceEndpoints: ResolvedServiceEndpoint[];
  metadata?: Record<string, unknown>;
}
