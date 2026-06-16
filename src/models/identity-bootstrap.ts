// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { PublicJwk } from '../interfaces/Cryptography.types';
import { type IssueSeverityAttentionCode } from './issue';
import { JwkSet } from './jwk';
import { DidCommDecodedMetadata } from './confidential-message';

/**
 * Public key binding for a human actor/controller identity.
 *
 * This contract is distinct from device/app transport identity.
 *
 * Use it when the bootstrap caller needs to tell GW/SDK which public keys
 * belong to the person/controller whose DID Document will be published.
 */
export interface ControllerBindingInput {
  /** Public DID to publish or bind for the controller/person. */
  did?: string;
  /** Additional public alias such as `mailto:` or alternate profile URI. */
  sameAs?: string;
  /** Primary signing key used to publish the controller DID Document. */
  publicKeyJwk?: PublicJwk | Record<string, unknown>;
  /** Optional extra key set to expose additional public verification methods. */
  jwks?: JwkSet;
}

/**
 * Public key binding for an organization/provider identity.
 *
 * This contract is distinct from controller/person identity.
 *
 * Use it when the bootstrap caller must publish or bind the provider-side
 * organization DID independently of any human controller keys.
 */
export interface OrganizationBindingInput {
  /** Public DID to publish or bind for the organization/provider. */
  did?: string;
  /** Public URL/issuer alias associated with the organization identity. */
  url?: string;
  /** Primary signing key used to publish the organization DID Document. */
  publicKeyJwk?: PublicJwk | Record<string, unknown>;
  /** Optional extra key set to expose additional organization keys. */
  jwks?: JwkSet;
}

/**
 * Canonical activation proof carrier.
 *
 * `vp_token` is the preferred contract. The other fields exist only so the
 * same model can represent intermediate OIDC/OID4VP style payloads.
 */
export interface ActivationProofInput {
  /** Canonical activation proof containing the verifiable presentation evidence. */
  vp_token?: string;
  /** Structured VP payload, when still handled before JWT compaction. */
  vp?: Record<string, unknown>;
  /** OIDC/OID4VP presentation-submission descriptor, when present. */
  presentation_submission?: Record<string, unknown>;
}

/**
 * Canonical `_activate` request shape used across SDK/GW bootstrap helpers.
 *
 * Priority:
 * 1. `vp_token`
 * 2. `controller.*`
 * 3. legacy credentials (deprecated compatibility only)
 *
 * `vp_token` proves the activation evidence. `controller.*` supplies the
 * public key material needed to publish or bind the resulting actor DID
 * Document. They serve different purposes and should not be conflated.
 */
export interface OrganizationActivationRequest extends ActivationProofInput {
  /** Explicit controller/person binding used for actor DID publication. */
  controller?: ControllerBindingInput;
  /** Explicit organization/provider binding used for provider DID publication. */
  organization?: OrganizationBindingInput;
  /** Auxiliary application-specific payload entries forwarded by some flows. */
  data?: Array<Record<string, unknown>>;
  /**
   * @deprecated Legacy compatibility field. Canonical proof must travel in `vp_token`.
   */
  organizationCredential?: unknown;
  /**
   * @deprecated Legacy compatibility field. Canonical proof must travel in `vp_token`.
   */
  representativeCredential?: unknown;
}

/**
 * Technical metadata mirrored into plaintext DIDComm payloads when no real
 * outer JWS/JWE envelope is present on the wire.
 *
 * This must be treated as transport compatibility metadata only. It does not
 * replace canonical activation fields such as `vp_token` or `controller.*`.
 */
export type DidcommPlaintextTransportMetadata = DidCommDecodedMetadata;

/**
 * Structured validation issue emitted by bootstrap validators.
 */
export type IdentityBootstrapValidationIssue = {
  /** Validation severity. Errors fail the contract, warnings flag compatibility debt. */
  severity: IssueSeverityAttentionCode;
  /** Stable machine-readable issue identifier. */
  code: string;
  /** Human-readable description of the problem or compatibility note. */
  message: string;
  /** Optional request path associated with the issue. */
  path?: string;
};

/**
 * Result returned by canonical bootstrap validation helpers.
 */
export type IdentityBootstrapValidationResult = {
  /** `true` when no validation errors were found. */
  ok: boolean;
  /** Fatal contract violations. */
  errors: IdentityBootstrapValidationIssue[];
  /** Non-fatal compatibility or completeness findings. */
  warnings: IdentityBootstrapValidationIssue[];
};
