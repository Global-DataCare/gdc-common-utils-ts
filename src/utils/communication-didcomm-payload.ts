// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { DidcommMessageTypes } from '../constants/didcomm';
import type { IDecodedDidcommPayload } from '../models/confidential-message';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';
import { transformCommunicationClaimsToResourceFhirR4 } from './communication-fhir-r4';

export const CommunicationDidcommEntryTypes = Object.freeze({
  AttachedBundle: DidcommMessageTypes.CommunicationAttachedBundle,
} as const);

/**
 * Input contract for wrapping canonical Communication claims as one low-level
 * DIDComm-style batch payload.
 */
export type BuildDidcommPayloadFromCommunicationClaimsInput = Readonly<{
  communicationClaims: Record<string, unknown>;
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
 * Builds the low-level DIDComm-style batch payload that carries one FHIR-like
 * `Communication` resource authored from canonical communication claims.
 *
 * This helper intentionally stays below actor-specific SDK facades so frontend,
 * BFF, and GW-like tests can reuse the same wrapping contract.
 */
export function buildDidcommPayloadFromCommunicationClaims(
  input: BuildDidcommPayloadFromCommunicationClaimsInput,
): IDecodedDidcommPayload {
  const claims = clone(input.communicationClaims);
  const transformed = transformCommunicationClaimsToResourceFhirR4([claims], {
    mode: 'strict',
  });
  const communicationResource = transformed.resources[0] || {};

  return {
    iss: String(input.iss || '').trim(),
    aud: String(input.aud || '').trim(),
    jti: String(input.jti || '').trim(),
    thid: String(input.thid || '').trim(),
    type: CommunicationDidcommEntryTypes.AttachedBundle,
    body: {
      data: [
        {
          id: String(claims[CommunicationClaim.Identifier] || input.jti || '').trim(),
          type: String(input.entryType || CommunicationDidcommEntryTypes.AttachedBundle).trim(),
          meta: {
            claims,
          },
          resource: communicationResource,
        },
      ],
    },
  };
}

/**
 * Reads canonical communication claims from the first `body.data[]` entry of
 * one DIDComm-style payload.
 */
export function getFirstCommunicationClaimsFromDidcommPayload(
  payload: IDecodedDidcommPayload,
): Record<string, unknown> {
  return getCommunicationClaimsListFromDidcommPayload(payload)[0] || {};
}

/**
 * Reads canonical communication claims from every `body.data[]` entry of one
 * DIDComm-style payload.
 */
export function getCommunicationClaimsListFromDidcommPayload(
  payload: IDecodedDidcommPayload,
): Record<string, unknown>[] {
  const entries = Array.isArray(payload?.body?.data) ? payload.body.data as Array<Record<string, unknown>> : [];
  return entries.map((first) => {
    const metaClaims = first?.meta && typeof first.meta === 'object'
      ? (first.meta as Record<string, unknown>)['claims']
      : undefined;
    if (metaClaims && typeof metaClaims === 'object') {
      return clone(metaClaims as Record<string, unknown>);
    }
    const resource = first?.resource && typeof first.resource === 'object'
      ? first.resource as Record<string, unknown>
      : {};
    const meta = resource.meta && typeof resource.meta === 'object'
      ? resource.meta as Record<string, unknown>
      : {};
    const claims = meta.claims && typeof meta.claims === 'object'
      ? meta.claims as Record<string, unknown>
      : {};
    return clone(claims);
  });
}

/**
 * Decodes the attached bundle carried in `Communication.content-attachment-data`.
 */
export function decodeAttachedBundleFromCommunicationClaims(
  communicationClaims: Record<string, unknown>,
): Record<string, unknown> {
  const encoded = String(communicationClaims[CommunicationClaim.ContentAttachmentData] || '').trim();
  if (!encoded) {
    throw new Error(`decodeAttachedBundleFromCommunicationClaims requires ${CommunicationClaim.ContentAttachmentData}.`);
  }
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as Record<string, unknown>;
}
