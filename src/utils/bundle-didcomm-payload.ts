// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { IDecodedDidcommPayload } from '../models/confidential-message';

export const BundleDidcommEntryTypes = Object.freeze({
  Batch: 'Bundle-batch-request-v1.0',
  Document: 'Bundle-document-request-v1.0',
} as const);

/**
 * Input contract for wrapping one bundle-like resource as one low-level
 * DIDComm-style batch payload.
 */
export type BuildDidcommPayloadFromBundleInput = Readonly<{
  bundle: Record<string, unknown>;
  iss: string;
  aud: string;
  jti: string;
  thid: string;
  entryType?: string;
}>;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Builds one low-level DIDComm-style payload carrying one direct `Bundle`
 * resource in `body.data[0].resource`.
 *
 * This path is meant for operational bundles such as employee/search/purge
 * flows that travel as a bundle itself, not nested inside a `Communication`.
 */
export function buildDidcommPayloadFromBundle(
  input: BuildDidcommPayloadFromBundleInput,
): IDecodedDidcommPayload {
  return {
    iss: String(input.iss || '').trim(),
    aud: String(input.aud || '').trim(),
    jti: String(input.jti || '').trim(),
    thid: String(input.thid || '').trim(),
    type: String(input.entryType || BundleDidcommEntryTypes.Batch).trim(),
    body: {
      data: [
        {
          id: String(input.jti || '').trim(),
          type: String(input.entryType || BundleDidcommEntryTypes.Batch).trim(),
          resource: clone(input.bundle),
        },
      ],
    },
  };
}

/**
 * Reads the first `Bundle` resource carried under `body.data[0].resource`.
 */
export function getFirstBundleResourceFromDidcommPayload(
  payload: IDecodedDidcommPayload,
): Record<string, unknown> {
  const first = Array.isArray(payload?.body?.data)
    ? payload.body.data[0] as Record<string, unknown>
    : undefined;
  const resource = first?.resource && typeof first.resource === 'object'
    ? clone(first.resource as Record<string, unknown>)
    : {};
  if (String(resource['resourceType'] || '').trim() !== 'Bundle') {
    throw new Error('getFirstBundleResourceFromDidcommPayload requires body.data[0].resource.resourceType = Bundle.');
  }
  return resource;
}
