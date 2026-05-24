// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { DidDocument, DidResolutionResult } from '../models/did';
import { JwkSet } from '../models/jwk';
import { getDidDocumentEndpoint, getJwksServiceEndpoint, getSmartTokenEndpoint, toDidResolutionResult } from './did-resolution';

/**
 * Canonical runtime-neutral discovery result used by SDK and GW code after
 * normalizing metadata from ICA, node operators, or provider catalogs.
 */
export type NormalizedDiscoveryMetadata = DidResolutionResult & {
  /** Origin of the normalized metadata payload. */
  source: 'ica' | 'node-operator' | 'service-provider';
};

function ensureDidDocument(metadata: Record<string, unknown>, fallbackDid?: string): DidDocument {
  const didDocument = metadata.didDocument as DidDocument | undefined;
  if (didDocument?.id) {
    return didDocument;
  }
  return {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: String(metadata.did || metadata.issuer || metadata.providerDid || fallbackDid || '').trim(),
    service: [],
  };
}

function attachMetadata(result: DidResolutionResult, metadata: Record<string, unknown>): DidResolutionResult {
  return {
    ...result,
    issuer: typeof metadata.issuer === 'string' ? metadata.issuer : result.issuer,
    jwksUri: typeof metadata.jwks_uri === 'string' ? metadata.jwks_uri : result.jwksUri,
    metadata,
  };
}

/**
 * Normalizes ICA discovery metadata into the shared DID/discovery result shape.
 *
 * The input can be partial. When no DID Document is supplied, a minimal synthetic
 * one is created from `did`/`issuer` so downstream code still has a stable carrier.
 */
export function normalizeIcaDiscoveryMetadata(metadata: Record<string, unknown>): NormalizedDiscoveryMetadata {
  const didDocument = ensureDidDocument(metadata, metadata.issuer as string | undefined);
  return {
    ...attachMetadata(toDidResolutionResult(didDocument), metadata),
    source: 'ica',
  };
}

/**
 * Normalizes node-operator discovery metadata into the shared DID/discovery result shape.
 */
export function normalizeNodeOperatorDiscoveryMetadata(metadata: Record<string, unknown>): NormalizedDiscoveryMetadata {
  const didDocument = ensureDidDocument(metadata, metadata.operatorDid as string | undefined);
  return {
    ...attachMetadata(toDidResolutionResult(didDocument), metadata),
    source: 'node-operator',
  };
}

/**
 * Normalizes a service-provider or DCAT-style entry into the shared DID/discovery result shape.
 *
 * This helper extracts well-known operational URLs such as the DID Document URL,
 * JWKS URL, and SMART token endpoint from `service[]` instead of rebuilding them
 * from public aliases or assumed base URLs.
 */
export function normalizeServiceProviderEntry(entry: Record<string, unknown>): NormalizedDiscoveryMetadata {
  const didDocument = ensureDidDocument(entry, entry.providerDid as string | undefined);
  const result = attachMetadata(toDidResolutionResult(didDocument), entry);
  const jwks = entry.jwks as JwkSet | undefined;
  return {
    ...result,
    jwks,
    didDocumentUrl: getDidDocumentEndpoint(didDocument),
    jwksUri: result.jwksUri || getJwksServiceEndpoint(didDocument),
    smartTokenEndpoint: getSmartTokenEndpoint(didDocument),
    source: 'service-provider',
  };
}
