// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';
import { encodeMultibase58btc } from './multibase58.js';

export type FhirCanonicalizationOptions = {
  /**
   * Removes `meta.versionId` from canonical input to avoid self-referential hashes.
   * Default: true.
   */
  stripMetaVersionId?: boolean;
  /**
   * Removes top-level narrative `text` if present.
   * Default: false.
   */
  stripNarrativeText?: boolean;
  /**
   * Removes nested `id` fields in backbone elements (resource root `id` is preserved).
   * Default: false.
   */
  stripNestedElementIds?: boolean;
};

export type FhirCidBuildOptions = {
  canonicalization?: FhirCanonicalizationOptions;
  /**
   * CID multicodec for canonical FHIR JSON payloads.
   * `0x0129` is DAG-JSON.
   */
  multicodecCode?: number;
};

export type FhirCidResult = {
  cid: string;
  versionId: string;
  canonicalJson: string;
  digestHex: string;
};

export type ClaimsCidResult = {
  cid: string;
  canonicalJson: string;
  digestHex: string;
};

export type FhirCidVersionMapping = {
  resourceType?: string;
  resourceId?: string;
  fullUrl?: string;
  cid: string;
  versionId: string;
};

const DEFAULT_MULTICODEC_DAG_JSON = 0x0129;
const MULTIHASH_SHA2_256_CODE = 0x12;
const MULTIHASH_SHA2_256_LEN = 32;
const CID_V1 = 0x01;

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

function encodeVarint(value: number): Uint8Array {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid varint value: ${value}`);
  }

  const out: number[] = [];
  let n = value >>> 0;
  while (n >= 0x80) {
    out.push((n & 0x7f) | 0x80);
    n >>>= 7;
  }
  out.push(n);
  return Uint8Array.from(out);
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function canonicalizeValue(
  value: unknown,
  options: Required<FhirCanonicalizationOptions>,
  depth: number,
): unknown {
  if (Array.isArray(value)) {
    // FHIR array order can be significant; preserve order, canonicalize each element.
    return value.map((entry) => canonicalizeValue(entry, options, depth + 1));
  }
  if (value && typeof value === 'object') {
    const asRecord = value as Record<string, unknown>;
    const keys = Object.keys(asRecord).sort();
    const out: Record<string, unknown> = {};

    for (const key of keys) {
      if (options.stripNarrativeText && depth === 0 && key === 'text') {
        continue;
      }
      if (options.stripNestedElementIds && depth > 0 && key === 'id') {
        continue;
      }

      let next = asRecord[key];
      if (next === undefined) continue;

      if (options.stripMetaVersionId && key === 'meta' && next && typeof next === 'object' && !Array.isArray(next)) {
        const metaRecord = { ...(next as Record<string, unknown>) };
        delete metaRecord.versionId;
        next = metaRecord;
      }

      out[key] = canonicalizeValue(next, options, depth + 1);
    }
    return out;
  }
  return value;
}

export function canonicalizeFhirResource(
  resource: Record<string, unknown>,
  options: FhirCanonicalizationOptions = {},
): string {
  const normalizedOptions: Required<FhirCanonicalizationOptions> = {
    stripMetaVersionId: options.stripMetaVersionId ?? true,
    stripNarrativeText: options.stripNarrativeText ?? false,
    stripNestedElementIds: options.stripNestedElementIds ?? false,
  };
  const normalized = canonicalizeValue(resource, normalizedOptions, 0);
  return JSON.stringify(normalized);
}

export function buildCidV1FromCanonicalJson(
  canonicalJson: string,
  multicodecCode: number = DEFAULT_MULTICODEC_DAG_JSON,
): FhirCidResult {
  const digest = sha256(utf8ToBytes(canonicalJson));
  const multihash = concatBytes(
    Uint8Array.from([MULTIHASH_SHA2_256_CODE, MULTIHASH_SHA2_256_LEN]),
    digest,
  );
  const cidBytes = concatBytes(
    encodeVarint(CID_V1),
    encodeVarint(multicodecCode),
    multihash,
  );
  const cid = encodeMultibase58btc(cidBytes);
  return {
    cid,
    versionId: cid,
    canonicalJson,
    digestHex: toHex(digest),
  };
}

export function canonicalizeClaimsForCid(
  claims: Record<string, unknown>,
): string {
  const stripped: Record<string, unknown> = { ...(claims || {}) };
  delete stripped['@context'];
  delete stripped['@type'];
  delete stripped['@id'];
  const normalized = canonicalizeValue(
    stripped,
    {
      stripMetaVersionId: false,
      stripNarrativeText: false,
      stripNestedElementIds: false,
    },
    0,
  );
  return JSON.stringify(normalized);
}

export function claimsToCid(
  claims: Record<string, unknown>,
): ClaimsCidResult {
  const canonicalJson = canonicalizeClaimsForCid(claims);
  const cidData = buildCidV1FromCanonicalJson(canonicalJson, DEFAULT_MULTICODEC_DAG_JSON);
  return {
    cid: cidData.cid,
    canonicalJson,
    digestHex: cidData.digestHex,
  };
}

export function assignCidToClaimsId(
  claims: Record<string, unknown>,
): { claims: Record<string, unknown>; cid: string } {
  const out: Record<string, unknown> = JSON.parse(JSON.stringify(claims || {}));
  const { cid } = claimsToCid(out);
  out['@id'] = cid;
  return {
    claims: out,
    cid,
  };
}

export function fhirResourceToCid(
  resource: Record<string, unknown>,
  options: FhirCidBuildOptions = {},
): FhirCidResult {
  const canonicalJson = canonicalizeFhirResource(resource, options.canonicalization);
  return buildCidV1FromCanonicalJson(canonicalJson, options.multicodecCode ?? DEFAULT_MULTICODEC_DAG_JSON);
}

export function assignCidToFhirResourceVersionId(
  resource: Record<string, unknown>,
  options: FhirCidBuildOptions = {},
): { resource: Record<string, unknown>; mapping: FhirCidVersionMapping } {
  const cid = fhirResourceToCid(resource, options);
  const out: Record<string, unknown> = JSON.parse(JSON.stringify(resource));

  const meta = (out.meta && typeof out.meta === 'object' && !Array.isArray(out.meta))
    ? { ...(out.meta as Record<string, unknown>) }
    : {};
  meta.versionId = cid.versionId;
  out.meta = meta;

  return {
    resource: out,
    mapping: {
      resourceType: String(out.resourceType || ''),
      resourceId: out.id ? String(out.id) : undefined,
      cid: cid.cid,
      versionId: cid.versionId,
    },
  };
}

export function assignCidToFhirBundleEntries(
  bundle: Record<string, unknown>,
  options: FhirCidBuildOptions = {},
): { bundle: Record<string, unknown>; mappings: FhirCidVersionMapping[] } {
  const out: Record<string, unknown> = JSON.parse(JSON.stringify(bundle));
  const entries = Array.isArray(out.entry) ? out.entry as Array<Record<string, unknown>> : [];
  const mappings: FhirCidVersionMapping[] = [];

  for (const entry of entries) {
    const resource = entry?.resource;
    if (!resource || typeof resource !== 'object' || Array.isArray(resource)) continue;

    const assigned = assignCidToFhirResourceVersionId(resource as Record<string, unknown>, options);
    entry.resource = assigned.resource;
    assigned.mapping.fullUrl = entry.fullUrl ? String(entry.fullUrl) : undefined;
    mappings.push(assigned.mapping);
  }

  return { bundle: out, mappings };
}
