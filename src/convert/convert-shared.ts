// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-shared.ts

export type FlatClaims = Record<string, string | undefined>;
export type FhirResource = Record<string, unknown> & { resourceType: string };

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function codingFromValue(value?: string): Array<{ system?: string; code: string }> | undefined {
  if (!value) return undefined;
  const [system, code] = value.split('|');
  if (!code) return [{ code: system }];
  return [{ system, code }];
}

export function codingToValue(coding?: { system?: string; code?: string }): string | undefined {
  if (!coding?.code) return undefined;
  return coding.system ? `${coding.system}|${coding.code}` : coding.code;
}

export function referenceToValue(reference?: { reference?: string }): string | undefined {
  return reference?.reference;
}

export function referenceListToCsv(references?: Array<{ reference?: string }>): string | undefined {
  const values = (references || [])
    .map((item) => item?.reference)
    .filter((item): item is string => Boolean(item));
  return values.length ? values.join(',') : undefined;
}

export function codingListToCsv(codings?: Array<{ system?: string; code?: string }>): string | undefined {
  const values = (codings || [])
    .map((item) => codingToValue(item))
    .filter((item): item is string => Boolean(item));
  return values.length ? values.join(',') : undefined;
}

export function requireClaim(claims: FlatClaims, key: string): string {
  const value = claims[key];
  if (!value) throw new Error(`Missing required claim: ${key}`);
  return value;
}

export function requireSubjectIdentifier(value: string, key: string): void {
  if (!value.startsWith('urn:') && !value.startsWith('did:web:')) {
    throw new Error(`Invalid ${key}: expected urn:* or did:web:*`);
  }
}

export function requireDidWeb(value: string, key: string): void {
  if (!value.startsWith('did:web:')) {
    throw new Error(`Invalid ${key}: expected did:web:*`);
  }
}

function stringifyClaimLeaf(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
}

function flattenClaimPath(prefix: string, value: unknown, out: FlatClaims): void {
  const primitive = stringifyClaimLeaf(value);
  if (primitive !== undefined) {
    out[prefix] = primitive;
    if (typeof value === 'number' || typeof value === 'boolean') {
      out[`${prefix}#type`] = typeof value;
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      flattenClaimPath(`${prefix}[${index}]`, entry, out);
    });
    return;
  }
  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key === 'meta' && isPlainObject(nestedValue) && 'claims' in nestedValue) {
        const nestedMeta = { ...nestedValue };
        delete (nestedMeta as Record<string, unknown>).claims;
        if (Object.keys(nestedMeta).length === 0) continue;
        flattenClaimPath(`${prefix}.${key}`, nestedMeta, out);
        continue;
      }
      flattenClaimPath(`${prefix}.${key}`, nestedValue, out);
    }
  }
}

function parseClaimPath(path: string): Array<string | number> {
  const segments: Array<string | number> = [];
  const re = /([^[.\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(path)) !== null) {
    if (match[1]) segments.push(match[1]);
    else if (match[2]) segments.push(Number(match[2]));
  }
  return segments;
}

function coerceClaimLeaf(value: string, typeHint?: string): string | number | boolean {
  if (typeHint === 'boolean') return value === 'true';
  if (typeHint === 'number') return Number(value);
  return value;
}

function assignInflatedPath(target: Record<string, unknown>, path: string, value: string, typeHint?: string): void {
  const segments = parseClaimPath(path);
  if (segments.length === 0) return;
  let cursor: unknown = target;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    const isLast = index === segments.length - 1;
    if (typeof segment === 'number') {
      if (!Array.isArray(cursor)) return;
      if (isLast) {
        cursor[segment] = coerceClaimLeaf(value, typeHint);
        return;
      }
      if (cursor[segment] === undefined) cursor[segment] = typeof nextSegment === 'number' ? [] : {};
      cursor = cursor[segment];
      continue;
    }
    if (!isPlainObject(cursor)) return;
    if (isLast) {
      cursor[segment] = coerceClaimLeaf(value, typeHint);
      return;
    }
    if (cursor[segment] === undefined) cursor[segment] = typeof nextSegment === 'number' ? [] : {};
    cursor = cursor[segment];
  }
}

/**
 * Generic structural fallback for unsupported resources.
 */
export function fhirResourceToFlatClaims(resource: FhirResource, context: string = 'org.hl7.fhir.r4'): FlatClaims {
  if (!resource?.resourceType) {
    throw new Error('FHIR resource must define resourceType.');
  }
  const out: FlatClaims = { '@context': context };
  for (const [key, value] of Object.entries(resource)) {
    if (key === 'resourceType') continue;
    flattenClaimPath(`${resource.resourceType}.${key}`, value, out);
  }
  return out;
}

/**
 * Generic structural regeneration for unsupported resources.
 */
export function flatClaimsToFhirResource(claims: FlatClaims): FhirResource {
  const typeHints = new Map<string, string>();
  for (const [key, value] of Object.entries(claims || {})) {
    if (key.endsWith('#type') && typeof value === 'string') {
      typeHints.set(key.slice(0, -5), value);
    }
  }
  const entries = Object.entries(claims || {}).filter(([key, value]) =>
    key !== '@context' && !key.endsWith('#type') && value !== undefined,
  );
  const firstClaimKey = entries[0]?.[0];
  if (!firstClaimKey || !firstClaimKey.includes('.')) {
    throw new Error('Flat claims must contain at least one contextualized resource claim.');
  }
  const resourceType = firstClaimKey.split('.')[0];
  const resource: Record<string, unknown> = { resourceType };
  for (const [key, value] of entries) {
    if (typeof value !== 'string') continue;
    if (!key.startsWith(`${resourceType}.`)) continue;
    assignInflatedPath(resource, key.slice(resourceType.length + 1), value, typeHints.get(key));
  }
  return resource as FhirResource;
}
