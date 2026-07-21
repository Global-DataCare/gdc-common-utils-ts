// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical URN prefixes reused across bootstrap and proof examples.
 *
 * The JWK thumbprint URI prefix below follows RFC 9278 and is intended for
 * cases where a key identifier is represented as a normalized URI instead of
 * as a bare base64url thumbprint value.
 */
export const UrnPrefixes = Object.freeze({
  JwkThumbprintSha256KeyId: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:',
  Multibase: 'urn:multibase:',
} as const);

export type UrnPrefix = typeof UrnPrefixes[keyof typeof UrnPrefixes];
