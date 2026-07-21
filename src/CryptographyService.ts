// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/CryptographyService.ts

// Use `import * as pako` to ensure compatibility with CommonJS/ESM module resolution.
// This resolves a stubborn TypeScript error (`esModuleInterop`) during testing.

import { ICryptoHelper } from './interfaces/ICryptoHelper';
import * as pako from 'pako';
import * as jwtUtils from './utils/jwt';
import { ICryptography } from './interfaces/ICryptography';
import { AesManager } from './AesManager';
import { DataCompactJWT, JwtCompactParts } from './models/jwt';
import { JweObject, ProtectedHeadersJWE, RecipientDataJWE } from './models/jwe';
import { MlkemPublicJwk, MldsaPublicJwk, PublicJwk, MlkemPrivateJwk, MldsaAlg, MlkemCurve, BaseJwk, EcBaseJwk } from './interfaces/Cryptography.types';
import { ProtectedDataAES } from './models/aes';
import { Content } from './utils/content';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import type { MlKemWrappedCekV1 } from './models/jwe';


/**
 * Implements the ICryptography interface, providing a complete suite of low-level,
 * stateless cryptographic functions. This service is the "engine" of the security layer,
 * orchestrating Post-Quantum and AES primitives.
 */
export class CryptographyService implements ICryptography {
  private aesManager: AesManager;
  private cryptoHelper: ICryptoHelper;
  private mlDsaModule: any | null = null;
  private mlKemModule: any | null = null;

  // Constants for seed sizes, as per @noble library requirements.
  private readonly ML_KEM_SEED_SIZE = 64;
  private readonly ML_DSA_SEED_SIZE = 32;

  constructor(cryptoHelper: ICryptoHelper) {
    this.aesManager = new AesManager();
    this.cryptoHelper = cryptoHelper;
  }

  private async loadMlDsa(): Promise<any> {
    if (this.mlDsaModule) return this.mlDsaModule;
    try {
      // Use explicit .js subpath to satisfy package exports in Metro/Node ESM.
      const module = await import('@noble/post-quantum/ml-dsa.js');
      this.mlDsaModule = module;
      return module;
    } catch (error) {
      throw new Error(
        '[CryptographyService] Missing dependency "@noble/post-quantum/ml-dsa.js". Install it for ML-DSA operations.',
      );
    }
  }

  private async loadMlKem(): Promise<any> {
    if (this.mlKemModule) return this.mlKemModule;
    try {
      // Use explicit .js subpath to satisfy package exports in Metro/Node ESM.
      const module = await import('@noble/post-quantum/ml-kem.js');
      this.mlKemModule = module;
      return module;
    } catch (error) {
      throw new Error(
        '[CryptographyService] Missing dependency "@noble/post-quantum/ml-kem.js". Install it for ML-KEM operations.',
      );
    }
  }
  
  digestString(data: string, algorithm: string): Promise<string> {
    return this.cryptoHelper.digestString(data, algorithm);
  }

  // --- Key Generation ---

  async generateKeyPairMlKem(seedBytes?: Uint8Array, crv: MlkemCurve = 'ML-KEM-768'): Promise<{ publicJWKey: MlkemPublicJwk & { kid: string }; secretKeyBytes: Uint8Array }> {
    const mlKem = await this.loadMlKem();
    let seed: Uint8Array;
    if (seedBytes && seedBytes.length === this.ML_KEM_SEED_SIZE) {
      seed = seedBytes;
    } else {
      seed = await this.cryptoHelper.getRandomBytes(this.ML_KEM_SEED_SIZE);
    }
    
    let keygenFn: (seed: Uint8Array) => { publicKey: Uint8Array; secretKey: Uint8Array; };
    switch (crv) {
      case 'ML-KEM-512': keygenFn = mlKem.ml_kem512.keygen; break;
      case 'ML-KEM-1024': keygenFn = mlKem.ml_kem1024.keygen; break;
      case 'ML-KEM-768':
      default:
        keygenFn = mlKem.ml_kem768.keygen; break;
    }

    const { secretKey, publicKey: publicKeyBytes } = keygenFn(seed);
    const pubJwkWithoutKid: MlkemPublicJwk = {
      kty: 'OKP', crv: crv, x: Content.bytesToRawBase64UrlSafe(publicKeyBytes),
    };
    const kid = await this._computeJwkThumbprint(pubJwkWithoutKid);
    const publicKey = { ...pubJwkWithoutKid, kid };
    return { publicJWKey: publicKey, secretKeyBytes: secretKey };
  }

  async generateKeyPairMlDsa(seedBytes?: Uint8Array, alg: MldsaAlg = 'ML-DSA-44'): Promise<{ publicJWKey: MldsaPublicJwk & { kid: string }; secretKeyBytes: Uint8Array }> {
    const mlDsa = await this.loadMlDsa();
    let seed: Uint8Array;
    if (seedBytes && seedBytes.length === this.ML_DSA_SEED_SIZE) {
      seed = seedBytes;
    } else {
      seed = await this.cryptoHelper.getRandomBytes(this.ML_DSA_SEED_SIZE);
    }

    let keygenFn: (seed: Uint8Array) => { publicKey: Uint8Array; secretKey: Uint8Array; };
    switch (alg) {
      case 'ML-DSA-65': keygenFn = mlDsa.ml_dsa65.keygen; break;
      case 'ML-DSA-87': keygenFn = mlDsa.ml_dsa87.keygen; break;
      case 'ML-DSA-44':
      default:
        keygenFn = mlDsa.ml_dsa44.keygen; break;
    }

    const { secretKey, publicKey: publicKeyBytes } = keygenFn(seed);
    const pubJwkWithoutKid: MldsaPublicJwk = {
      kty: 'AKP', alg: alg, pub: Content.bytesToRawBase64UrlSafe(publicKeyBytes),
    };
    const kid = await this._computeJwkThumbprint(pubJwkWithoutKid);
    const publicKey = { ...pubJwkWithoutKid, kid };
    return { publicJWKey: publicKey, secretKeyBytes: secretKey };
  }


  // --- High-Level Workflows ---

  async encryptJwe(payload: object, protectedHeader: object, secretJWKey: MlkemPrivateJwk, recipientsJWKeys: MlkemPublicJwk[]): Promise<JweObject> {
    // v1 deliberately exposes one recipient while using a distinct random CEK.
    // The recipient wrap is already compatible with a future General JWE profile.
    if (recipientsJWKeys.length !== 1) {
      // Temporarily throw until the architecture is fixed for multi-recipient.
      throw new Error("CryptographyService.encryptJwe currently only supports a single recipient.");
    }
    const recipient = recipientsJWKeys[0];
    const publicKeyBytes = Content.base64ToBytes(recipient.x);

    const cekBytes = await this.cryptoHelper.getRandomBytes(32);
    const kemSeedBytes = await this.cryptoHelper.getRandomBytes(32);
    const { derivedCekBytes: sharedSecret, encapsulatedCekBytes } = await this.encapsulate(kemSeedBytes, secretJWKey.dBytes, publicKeyBytes);

    // 2. Now, use the *derived* CEK to encrypt the payload with AES.
    const protectedHeaderB64Url = Content.objectToRawBase64UrlSafe(protectedHeader);
    let payloadBytes = Content.objectToBytes(payload);
    let payloadString: string;
    if ((protectedHeader as ProtectedHeadersJWE).zip === 'DEF') {
      payloadBytes = pako.deflate(payloadBytes);
      payloadString = Content.bytesToRawBase64UrlSafe(payloadBytes);
    } else {
      payloadString = Content.bytesToStringUTF8(payloadBytes);
    }
    const encrypted = await this.encrypt(payloadString, cekBytes, protectedHeaderB64Url);

    const wrappedCek = await this.wrapCekForRecipient(cekBytes, sharedSecret, encapsulatedCekBytes, protectedHeaderB64Url, recipient.kid!);
    const recipientData: RecipientDataJWE[] = [{
      header: { alg: 'ML-KEM-768+HKDF-SHA256+A256GCMKW', kid: recipient.kid! },
      encrypted_key: Content.objectToRawBase64UrlSafe(wrappedCek),
    }];

    return {
      protected: protectedHeaderB64Url,
      recipients: recipientData,
      iv: encrypted.iv,
      ciphertext: encrypted.ciphertext,
      tag: encrypted.tag,
    };
  }

  async encryptJweToCompact(payload: object | string, protectedHeader: object, secretJWKey: MlkemPrivateJwk, recipientJWKey: MlkemPublicJwk): Promise<string> {
    // 1. Construct the complete, final protected header by merging the main and recipient headers.
    const recipientHeader = { alg: 'ML-KEM-768+HKDF-SHA256+A256GCMKW', kid: recipientJWKey.kid! };
    const finalProtectedHeader = { ...protectedHeader, ...recipientHeader };
    const protectedHeaderB64Url = Content.objectToRawBase64UrlSafe(finalProtectedHeader);

    // 2. Generate a fresh content key, then protect it for the ML-KEM recipient.
    const publicKeyBytes = Content.base64ToBytes(recipientJWKey.x);
    const cekBytes = await this.cryptoHelper.getRandomBytes(32);
    const kemSeedBytes = await this.cryptoHelper.getRandomBytes(32);
    const { derivedCekBytes: sharedSecret, encapsulatedCekBytes } = await this.encapsulate(kemSeedBytes, secretJWKey.dBytes, publicKeyBytes);
    const wrappedCek = await this.wrapCekForRecipient(cekBytes, sharedSecret, encapsulatedCekBytes, protectedHeaderB64Url, recipientJWKey.kid!);
    const encryptedKeyB64Url = Content.objectToRawBase64UrlSafe(wrappedCek);

    // 3. Encrypt the payload using the derived CEK and the *final* protected header as AAD.
    const payloadBytes = typeof payload === 'string'
      ? Content.stringToBytesUTF8(payload)
      : Content.objectToBytes(payload);

    if ((finalProtectedHeader as ProtectedHeadersJWE).zip === 'DEF') {
      // Note: Compressing a compact JWS string is often inefficient, but supported.
      const compressedPayload = pako.deflate(payloadBytes);
      const payloadString = Content.bytesToRawBase64UrlSafe(compressedPayload);
      const encrypted = await this.encrypt(payloadString, cekBytes, protectedHeaderB64Url);
      return `${protectedHeaderB64Url}.${encryptedKeyB64Url}.${encrypted.iv}.${encrypted.ciphertext}.${encrypted.tag}`;
    }

    const payloadString = Content.bytesToStringUTF8(payloadBytes);
    const encrypted = await this.encrypt(payloadString, cekBytes, protectedHeaderB64Url);

    // 4. Assemble the 5 parts of the compact JWE.
    return `${protectedHeaderB64Url}.${encryptedKeyB64Url}.${encrypted.iv}.${encrypted.ciphertext}.${encrypted.tag}`;
  }  

  async decryptJwe(
    jwe: JweObject | string,
    secretKeyJwk: MlkemPrivateJwk
  ): Promise<{ decryptedBytes: Uint8Array, protectedHeader: object }> {
    const jweObject = typeof jwe === 'string' ? this.parseCompactJwe(jwe) : jwe;

    const recipient = jweObject.recipients.find(r => r.header?.kid === secretKeyJwk.kid);
    if (!recipient || !recipient.encrypted_key) {
      throw new Error(`JWE does not contain a recipient with kid=${secretKeyJwk.kid}`);
    }

    const cekBytes = await this.unwrapRecipientCek(recipient.encrypted_key, secretKeyJwk, jweObject.protected);

    // Decrypt the payload
    const encryptedData = { ciphertext: jweObject.ciphertext, iv: jweObject.iv, tag: jweObject.tag };
    const decryptedPayloadString = await this.decrypt(encryptedData, cekBytes, jweObject.protected);

    // Handle decompression
    const protectedHeader = Content.base64UrlSafeToJSON(jweObject.protected) as ProtectedHeadersJWE;
    let decryptedBytes: Uint8Array;
    if (protectedHeader.zip === 'DEF') {
      const compressedBytes = Content.base64ToBytes(decryptedPayloadString);
      decryptedBytes = pako.inflate(compressedBytes);
    } else {
      decryptedBytes = Content.stringToBytesUTF8(decryptedPayloadString);
    }

    return { decryptedBytes, protectedHeader };
  }

  getRecipientKidsFromJwe(jwe: JweObject | string): string[] {
    const jweObject = typeof jwe === 'string' ? this.parseCompactJwe(jwe) : jwe;

    if (!jweObject.recipients) {
      return [];
    }

    return jweObject.recipients
      .map(recipient => recipient.header?.kid)
      .filter((kid): kid is string => !!kid);
  }  

  async signDataJws(payload: object, protectedHeader: object, secretKeyBytes: Uint8Array): Promise<JwtCompactParts> {
    const protectedHeaderB64Url = Content.objectToRawBase64UrlSafe(protectedHeader);
    const payloadB64Url = await jwtUtils.encodePayload(payload);
    const signingInput = `${protectedHeaderB64Url}.${payloadB64Url}`;
    const signingInputBytes = Content.stringToBytesUTF8(signingInput);
    
    // Infer algorithm from protected header
    const alg = (protectedHeader as any).alg as MldsaAlg;
    if (!alg) throw new Error("Protected header must contain 'alg' property for signing.");
    
    const signatureBytes = await this.signBytes(signingInputBytes, secretKeyBytes, alg);
    
    const jwsParts: JwtCompactParts = {
        protected: protectedHeaderB64Url,
        payload: payloadB64Url,
        signature: Content.bytesToRawBase64UrlSafe(signatureBytes),
    };

    return jwsParts;
  }

  async verifyJws(jws: JwtCompactParts | string, publicJwk: PublicJwk): Promise<boolean> {
    const parts = typeof jws === 'string' ? jwtUtils.getPartsJWT(jws) : jws;
    if (!parts) throw new Error('Invalid Compact JWS format');
    const signingInput = `${parts.protected}.${parts.payload}`;
    const signingInputBytes = Content.stringToBytesUTF8(signingInput);
    const signatureBytes = Content.base64ToBytes(parts.signature as string);
    return this.verifyBytes(signatureBytes, signingInputBytes, publicJwk);
  }

  async verifyDetachedJws(payloadBytes: Uint8Array, detachedJws: string, publicJWKey: PublicJwk): Promise<boolean> {
    const parts = detachedJws.split('..');
    if (parts.length !== 2) throw new Error("Invalid Detached JWS format");
    const protectedHeaderB64Url = parts[0];
    const signatureB64Url = parts[1];

    const payloadB64Url = Content.bytesToRawBase64UrlSafe(payloadBytes);
    const signingInput = `${protectedHeaderB64Url}.${payloadB64Url}`;
    const signingInputBytes = Content.stringToBytesUTF8(signingInput);
    const signatureBytes = Content.base64ToBytes(signatureB64Url);

    return this.verifyBytes(signatureBytes, signingInputBytes, publicJWKey);
  }

  // --- Low-Level Primitives ---

  encrypt(plaintext: string, cekBytes: Uint8Array, aad: string): Promise<ProtectedDataAES> {
    return this.aesManager.encrypt(plaintext, cekBytes, aad);
  }

  decrypt(encryptedData: ProtectedDataAES, cekBytes: Uint8Array, aad: string): Promise<string> {
    return this.aesManager.decrypt(encryptedData, cekBytes, aad);
  }
  
  async encapsulate(cekSeedBytes: Uint8Array, secretKeyBytes: Uint8Array, recipientPublicKeyBytes: Uint8Array): Promise<{ encapsulatedCekBytes: Uint8Array; derivedCekBytes: Uint8Array; }> {
    // FIPS 203 ML-KEM encapsulation returns a ciphertext and a 32-byte shared secret.
    // `secretKeyBytes` is retained only for public API compatibility; encapsulation
    // requires the recipient public key, not a sender private key.
    const mlKem = await this.loadMlKem();
    const { sharedSecret, cipherText } = await mlKem.ml_kem768.encapsulate(recipientPublicKeyBytes, cekSeedBytes);
    return { derivedCekBytes: sharedSecret, encapsulatedCekBytes: cipherText };
  }
  
  async decapsulate(encapsulatedBytes: Uint8Array, secretKeyBytes: Uint8Array): Promise<Uint8Array> {
    const mlKem = await this.loadMlKem();
    return mlKem.ml_kem768.decapsulate(encapsulatedBytes, secretKeyBytes);
  }

  private async wrapCekForRecipient(
    cekBytes: Uint8Array,
    sharedSecret: Uint8Array,
    kemCiphertext: Uint8Array,
    protectedHeader: string,
    recipientKid: string,
  ): Promise<MlKemWrappedCekV1> {
    const kek = this.deriveRecipientKek(sharedSecret, protectedHeader, recipientKid);
    const wrapped = await this.encrypt(Content.bytesToRawBase64UrlSafe(cekBytes), kek, `${protectedHeader}.${recipientKid}.cek`);
    return {
      v: 'gdc-mlkem-cek-wrap-v1',
      kem: 'ML-KEM-768',
      kdf: 'HKDF-SHA-256',
      wrap: 'A256GCM',
      kemCiphertext: Content.bytesToRawBase64UrlSafe(kemCiphertext),
      iv: wrapped.iv,
      ciphertext: wrapped.ciphertext,
      tag: wrapped.tag,
    };
  }

  private async unwrapRecipientCek(encryptedKey: string, secretKeyJwk: MlkemPrivateJwk, protectedHeader: string): Promise<Uint8Array> {
    let wrapped: MlKemWrappedCekV1 | undefined;
    try {
      wrapped = Content.base64UrlSafeToJSON(encryptedKey) as MlKemWrappedCekV1;
    } catch {
      // Legacy v0 used the raw ML-KEM ciphertext and the shared secret as CEK.
      return this.decapsulate(Content.base64ToBytes(encryptedKey), secretKeyJwk.dBytes);
    }
    if (wrapped?.v !== 'gdc-mlkem-cek-wrap-v1' || wrapped.kem !== 'ML-KEM-768' || wrapped.kdf !== 'HKDF-SHA-256' || wrapped.wrap !== 'A256GCM') {
      throw new Error('Unsupported ML-KEM CEK wrap profile.');
    }
    const sharedSecret = await this.decapsulate(Content.base64ToBytes(wrapped.kemCiphertext), secretKeyJwk.dBytes);
    const kek = this.deriveRecipientKek(sharedSecret, protectedHeader, secretKeyJwk.kid!);
    const cek = Content.base64ToBytes(await this.decrypt({ iv: wrapped.iv, ciphertext: wrapped.ciphertext, tag: wrapped.tag }, kek, `${protectedHeader}.${secretKeyJwk.kid}.cek`));
    if (cek.byteLength !== 32) throw new Error('Invalid wrapped AES-256-GCM CEK.');
    return cek;
  }

  private deriveRecipientKek(sharedSecret: Uint8Array, protectedHeader: string, recipientKid: string): Uint8Array {
    return hkdf(
      sha256,
      sharedSecret,
      Content.stringToBytesUTF8('gdc-confidential-pqc-v1'),
      Content.stringToBytesUTF8(`${protectedHeader}.${recipientKid}.document-at-rest`),
      32,
    );
  }

  async signBytes(payloadBytes: Uint8Array, secretKeyBytes: Uint8Array, alg: MldsaAlg): Promise<Uint8Array> {
    const mlDsa = await this.loadMlDsa();
    switch (alg) {
      case 'ML-DSA-44': return mlDsa.ml_dsa44.sign(payloadBytes, secretKeyBytes);
      case 'ML-DSA-65': return mlDsa.ml_dsa65.sign(payloadBytes, secretKeyBytes);
      case 'ML-DSA-87': return mlDsa.ml_dsa87.sign(payloadBytes, secretKeyBytes);
      default: throw new Error(`Unsupported ML-DSA algorithm: ${alg}`);
    }
  }

  async verifyBytes(signatureBytes: Uint8Array, dataBytes: Uint8Array, publicKey: PublicJwk): Promise<boolean> {
    const mlDsa = await this.loadMlDsa();
    const publicKeyBytes = Content.base64ToBytes((publicKey as any).pub || (publicKey as any).x);
    const alg = (publicKey as MldsaPublicJwk).alg;
    if (!alg) throw new Error("Public key must contain 'alg' property for verification.");

    switch (alg) {
      case 'ML-DSA-44': return mlDsa.ml_dsa44.verify(signatureBytes, dataBytes, publicKeyBytes);
      case 'ML-DSA-65': return mlDsa.ml_dsa65.verify(signatureBytes, dataBytes, publicKeyBytes);
      case 'ML-DSA-87': return mlDsa.ml_dsa87.verify(signatureBytes, dataBytes, publicKeyBytes);
      default: throw new Error(`Unsupported ML-DSA algorithm: ${alg}`);
    }
  }
  
  // --- Formatting & Parsing Utilities ---

  jwsToCompact(jws: DataCompactJWT): string {
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }

  parseCompactJws(jwsString: string): DataCompactJWT {
    if (jwsString.trim().startsWith('{')) {
      const parsed = JSON.parse(jwsString);
      if (!parsed.payload || !parsed.signatures || !parsed.signatures[0]) {
        throw new Error("Invalid JWS JSON format");
      }
      return {
        payload: parsed.payload,
        protected: parsed.signatures[0].protected,
        signature: parsed.signatures[0].signature,
      };
    }
    const parts = jwtUtils.getPartsJWT(jwsString);
    if (!parts) throw new Error("Invalid Compact JWS format");

    const result: DataCompactJWT = {
      payload: Content.base64UrlSafeToJSON(parts.payload),
      protected: Content.base64UrlSafeToJSON(parts.protected),
      signature: Content.base64ToBytes(parts.signature),
    };
    return result;
  }

  parseCompactJwe(jweString: string): JweObject {
    if (jweString.trim().startsWith('{')) {
      return JSON.parse(jweString);
    }
    const parts = jweString.split('.');
    if (parts.length !== 5) throw new Error("Invalid Compact JWE format");
    const protectedHeader = Content.base64UrlSafeToJSON(parts[0]);
    // Compact JWE has no per-recipient header, but our model requires one.
    // The 'kid' should be in the main protected header for decryption to work.
    return {
      protected: parts[0],
      recipients: [{ 
        header: { alg: (protectedHeader as any).alg || '', kid: (protectedHeader as any).kid || '' },
        encrypted_key: parts[1] 
      }],
      iv: parts[2],
      ciphertext: parts[3],
      tag: parts[4],
    };
  }

  // --- JWK Thumbprint Calculation (RFC 7638) ---

  /**
   * Computes a JWK thumbprint using a specified hash algorithm.
   * This implementation is platform-agnostic by using the injected ICryptoHelper.
   */
  private async _computeJwkThumbprint(
    jwk: PublicJwk,
    hash: "SHA-256" | "SHA-384" = "SHA-256"
  ): Promise<string> {
    const baseJwk = this._toBaseJwk(jwk);
    const canonical = this._canonicalizeForJwkThumbprint(baseJwk);
    // Use the platform-agnostic digest method
    const digestHex = await this.cryptoHelper.digestString(canonical, hash);
    // The digestString returns a hex string, but thumbprints are Base64UrlSafe.
    // We need to convert from hex to bytes, then bytes to Base64UrlSafe.
    const digestBytes = this._hexToBytes(digestHex);
    return Content.bytesToRawBase64UrlSafe(digestBytes);
  }

  /**
   * Creates a canonical string from a simple, flat JSON object as required by
   * RFC 7638 for JWK thumbprints.
   */
  private _canonicalizeForJwkThumbprint(obj: Record<string, unknown>): string {
    const keys = Object.keys(obj).sort();
    const parts = keys.map(k => `"${k}":${JSON.stringify(obj[k])}`);
    return `{${parts.join(",")}}`;
  }

  /**
   * Extracts the Base JWK for thumbprint calculation per RFC 7638.
   * This handles both Post-Quantum (OKP, AKP) and legacy (EC) key types.
   */
  private _toBaseJwk(jwk: PublicJwk): BaseJwk {
    if (jwk.kty === "OKP") {
      const { crv, x } = jwk;
      return { kty: "OKP", crv, x };
    } else if (jwk.kty === "AKP") {
      const { alg, pub } = jwk;
      return { kty: "AKP", alg, pub };
    } else if (jwk.kty === "EC") {
      const { crv, x, y } = jwk;
      const baseJwk: EcBaseJwk = { kty: "EC", crv, x, y };
      return baseJwk;
    } else {
      const exhaustiveCheck: never = jwk;
      throw new Error(`Unsupported key type for JWK thumbprint: ${(exhaustiveCheck as any).kty}`);
    }
  }

  /**
   * Utility to convert a hex string to a Uint8Array.
   */
  private _hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }
}
