// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/hmac.ts

// Use explicit .js subpaths to satisfy package exports in Metro/Node ESM.
import { hmac } from '@noble/hashes/hmac.js';
import { sha3_256 } from '@noble/hashes/sha3.js';
import { Content } from './utils/content';

/**
 * Computes the SHA3-256 HMAC of a plaintext value.
 *
 * @param plaintext UTF-8 plaintext to authenticate.
 * @param hmacKeyBytes Raw HMAC key bytes.
 */
export async function computeHmacSha256(plaintext: string, hmacKeyBytes: Uint8Array): Promise<Uint8Array> {
    return await hmac(sha3_256, hmacKeyBytes, Content.stringToBytesUTF8(plaintext));
}

/**
 * Computes the SHA3-256 HMAC of a plaintext value and returns it as Base64URL.
 *
 * @param plaintext UTF-8 plaintext to authenticate.
 * @param hmacKeyBytes Raw HMAC key bytes.
 */
export async function computeHmacSha256Base64Url(plaintext: string, hmacKeyBytes: Uint8Array): Promise<string> {
    return  Content.bytesToRawBase64UrlSafe(await computeHmacSha256(plaintext, hmacKeyBytes));
}
