// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  ControllerBindingInput,
  DidcommPlaintextTransportMetadata,
  IdentityBootstrapValidationIssue,
  IdentityBootstrapValidationResult,
  OrganizationActivationRequest,
  OrganizationBindingInput,
} from '../models/identity-bootstrap';
import { IssueSeverity, type IssueSeverityAttentionCode } from '../models/issue';
import { JwkSet } from '../models/jwk';
import { JoseContentEncryptionAlgorithms } from '../constants/cryptography';

/**
 * Builder input for the canonical organization/service activation payload.
 */
export interface BuildOrganizationActivationRequestInput {
  /** Canonical VP JWT carrying the activation evidence. */
  vpToken: string;
  /** Explicit controller/person key binding for DID publication. */
  controller?: ControllerBindingInput;
  /** Optional organization/provider key binding for DID publication. */
  organization?: OrganizationBindingInput;
  /** Optional OIDC/OID4VP presentation submission descriptor. */
  presentationSubmission?: Record<string, unknown>;
  /** Auxiliary application-specific payload entries. */
  data?: Array<Record<string, unknown>>;
  /** @deprecated Legacy compatibility input. Canonical proof must be carried in `vpToken`. */
  organizationCredential?: unknown;
  /** @deprecated Legacy compatibility input. Canonical proof must be carried in `vpToken`. */
  representativeCredential?: unknown;
}

export interface BuildControllerBindingInputInput {
  /** Public DID to publish or bind for the controller/person. */
  did?: string;
  /**
   * Additional public alias for the controller/person.
   *
   * Canonical examples:
   * - `urn:multibase:z...` for an email-derived ICA/GW binding
   * - `tel:+34600111222` for a phone identifier
   * - `did:web:...` or another stable public identifier
   *
   * Do not use `mailto:` when the source value is an email for ICA/GW
   * interoperability. Start from the plain email and normalize it first with
   * `normalizeSameAsHash(...)`.
   */
  sameAs?: string;
  /** Primary controller signing key. */
  publicSignKey?: Record<string, unknown>;
  /** Optional additional public keys, typically DidComm encryption keys. */
  publicKeys?: JwkSet | { keys: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
}

export interface BuildOrganizationBindingInputInput {
  /** Public DID to publish or bind for the organization/provider. */
  did?: string;
  /** Public URL associated with the organization identity. */
  url?: string;
  /** Primary organization signing key. */
  publicSignKey?: Record<string, unknown>;
  /** Optional additional public keys. */
  publicKeys?: JwkSet | { keys: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
}

export interface BuildDidcommPlaintextTransportMetadataInput {
  /**
   * Explicit controller/person binding used by `_activate`.
   *
   * In demo/plaintext flows this is the preferred source for mirroring the
   * technical communication key metadata into `meta.jws.protected` /
   * `meta.jwe.header`.
   */
  controller?: ControllerBindingInput;
  /**
   * Optional explicit content type copied into the mirrored technical JWS
   * header.
   *
   * Defaults to `application/didcomm-plaintext+json`.
   */
  contentType?: string;
}

function pushIssue(
  issues: IdentityBootstrapValidationIssue[],
  severity: IssueSeverityAttentionCode,
  code: string,
  message: string,
  path?: string,
): void {
  issues.push({ severity, code, message, ...(path ? { path } : {}) });
}

function normalizeJwkSet(
  publicKeys?: JwkSet | { keys: Array<Record<string, unknown>> } | Array<Record<string, unknown>>,
): JwkSet | undefined {
  if (!publicKeys) {
    return undefined;
  }
  if (Array.isArray(publicKeys)) {
    return { keys: publicKeys };
  }
  return publicKeys;
}

function normalizeJwk(input: unknown): Record<string, unknown> | undefined {
  return input && typeof input === 'object'
    ? input as Record<string, unknown>
    : undefined;
}

function isEncryptionJwk(key: Record<string, unknown> | undefined): boolean {
  if (!key) {
    return false;
  }
  const purposes = Array.isArray(key.purposes) ? key.purposes.map((value) => String(value)) : [];
  const keyOps = Array.isArray(key.key_ops) ? key.key_ops.map((value) => String(value)) : [];
  return String(key.use || '').trim() === 'enc'
    || purposes.includes('didcomm-enc')
    || keyOps.includes('encrypt')
    || keyOps.includes('deriveKey');
}

/**
 * Builds the canonical controller/person binding from semantic variables.
 *
 * Use this when your integration starts from variables such as:
 * - `controllerDid`
 * - `controllerEmail` converted to `sameAs`
 * - `publicSignKey`
 * - `publicKeys`
 *
 * so the caller does not have to manually shape `controller.publicKeyJwk` and
 * `controller.jwks`.
 *
 * ICA/GW interoperability note:
 * - callers that start from a raw email should first normalize it with
 *   `normalizeSameAsHash(...)` before assigning `sameAs`
 * - keep the raw email separately in activation claims when GW still needs it
 *   for internal admin/bootstrap records
 * - do not send `mailto:` as the canonical controller alias when the binding
 *   source is an email address
 */
export function buildControllerBindingInput(
  input: BuildControllerBindingInputInput,
): ControllerBindingInput {
  const jwks = normalizeJwkSet(input.publicKeys);
  return {
    ...(input.did ? { did: input.did } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
    ...(input.publicSignKey ? { publicKeyJwk: input.publicSignKey } : {}),
    ...(jwks ? { jwks } : {}),
  };
}

/**
 * Builds the canonical organization/provider binding from semantic variables.
 */
export function buildOrganizationBindingInput(
  input: BuildOrganizationBindingInputInput,
): OrganizationBindingInput {
  const jwks = normalizeJwkSet(input.publicKeys);
  return {
    ...(input.did ? { did: input.did } : {}),
    ...(input.url ? { url: input.url } : {}),
    ...(input.publicSignKey ? { publicKeyJwk: input.publicSignKey } : {}),
    ...(jwks ? { jwks } : {}),
  };
}

/**
 * Builds the technical plaintext transport metadata expected by GW-compatible
 * demo flows.
 *
 * Transport rule:
 * - in secure JOSE transport, these values belong in the protected JWS/JWE
 *   headers of the real envelope
 * - in `application/didcomm-plaintext+json`, there is no signed outer
 *   envelope on the wire, so high-level SDK/BFF helpers may mirror the same
 *   technical key identifiers and public JWKs into `meta.jws.protected` and
 *   `meta.jwe.header`
 *
 * This is technical compatibility fallback only. The canonical activation
 * contract remains `controller.publicKeyJwk` / `controller.jwks`.
 */
export function buildDidcommPlaintextTransportMetadata(
  input: BuildDidcommPlaintextTransportMetadataInput,
): DidcommPlaintextTransportMetadata | undefined {
  const signingKey = normalizeJwk(input.controller?.publicKeyJwk);
  const encryptionKey = normalizeJwk(
    input.controller?.jwks?.keys?.find((candidate) => isEncryptionJwk(normalizeJwk(candidate))),
  );

  if (!signingKey && !encryptionKey) {
    return undefined;
  }

  return {
    ...(signingKey
      ? {
        jws: {
          protected: {
            alg: String(signingKey.alg || '').trim() || 'none',
            kid: String(signingKey.kid || '').trim() || 'none',
            cty: String(input.contentType || '').trim() || 'application/didcomm-plaintext+json',
            jwk: signingKey as any,
          },
        },
      }
      : {}),
    ...(encryptionKey
      ? {
        jwe: {
          header: {
            alg: String(encryptionKey.alg || encryptionKey.crv || '').trim() || 'none',
            enc: JoseContentEncryptionAlgorithms.Aes256Gcm,
            skid: String(encryptionKey.kid || '').trim() || 'none',
            jwk: encryptionKey as any,
          },
        },
      }
      : {}),
  };
}

/**
 * Builds the canonical `_activate` request payload shared by SDK and GW helpers.
 *
 * The resulting object intentionally preserves deprecated compatibility fields
 * when supplied, so callers can keep legacy flows alive while validators and
 * runtime layers flag that debt explicitly.
 *
 * Transport note:
 * - secure JOSE submission should place technical signing/encryption metadata
 *   in the protected headers of the real JWS/JWE envelope
 * - demo `application/didcomm-plaintext+json` flows may mirror those same
 *   values into plaintext `meta.jws.protected` / `meta.jwe.header` as a
 *   technical fallback expected by GW-compatible backends
 * - that plaintext transport metadata must not replace the canonical
 *   `controller.publicKeyJwk` / `controller.jwks` activation contract
 */
export function buildOrganizationActivationRequest(
  input: BuildOrganizationActivationRequestInput,
): OrganizationActivationRequest {
  return {
    vp_token: input.vpToken,
    ...(input.presentationSubmission ? { presentation_submission: input.presentationSubmission } : {}),
    ...(input.controller ? { controller: input.controller } : {}),
    ...(input.organization ? { organization: input.organization } : {}),
    ...(input.data ? { data: input.data } : {}),
    ...(input.organizationCredential !== undefined ? { organizationCredential: input.organizationCredential } : {}),
    ...(input.representativeCredential !== undefined ? { representativeCredential: input.representativeCredential } : {}),
  };
}

/**
 * Validates the canonical activation request contract.
 *
 * Priority rules:
 * 1. `vp_token` is mandatory as the canonical activation proof.
 * 2. `controller.*` is optional, but if a controller DID/alias is provided then
 *    matching public key material must also be present so a DID Document can be published.
 * 3. Legacy `organizationCredential` and `representativeCredential` are tolerated
 *    only as deprecated compatibility inputs and therefore produce warnings.
 */
export function validateOrganizationActivationRequest(
  request: OrganizationActivationRequest,
): IdentityBootstrapValidationResult {
  const issues: IdentityBootstrapValidationIssue[] = [];

  if (!String(request.vp_token || '').trim()) {
    pushIssue(issues, IssueSeverity.Error, 'missing-vp-token', 'Canonical activation proof must be carried in vp_token.', 'vp_token');
  }

  if (request.organizationCredential !== undefined) {
    pushIssue(
      issues,
      IssueSeverity.Warning,
      'deprecated-organization-credential',
      'organizationCredential is deprecated compatibility input. Canonical proof must be carried in vp_token.',
      'organizationCredential',
    );
  }

  if (request.representativeCredential !== undefined) {
    pushIssue(
      issues,
      IssueSeverity.Warning,
      'deprecated-representative-credential',
      'representativeCredential is deprecated compatibility input. Canonical proof must be carried in vp_token.',
      'representativeCredential',
    );
  }

  const controller = request.controller;
  if (controller) {
    const hasPublicKeyJwk = !!controller.publicKeyJwk;
    const hasJwks = !!controller.jwks?.keys?.length;
    if ((controller.did || controller.sameAs) && !(hasPublicKeyJwk || hasJwks)) {
      pushIssue(
        issues,
        IssueSeverity.Error,
        'incomplete-controller-binding',
        'controller.did/controller.sameAs requires controller.publicKeyJwk or controller.jwks for DID bootstrap.',
        'controller',
      );
    }
  }

  return {
    ok: !issues.some((issue) => issue.severity === IssueSeverity.Error),
    errors: issues.filter((issue) => issue.severity === IssueSeverity.Error),
    warnings: issues.filter((issue) => issue.severity === IssueSeverity.Warning),
  };
}
