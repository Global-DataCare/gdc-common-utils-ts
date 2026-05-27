// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { ActorKind } from '../models/actor-session';
import { DidDocument, DidService, DidResolutionResult, ResolvedServiceEndpoint } from '../models/did';
import { ActorKinds } from '../constants/actor-session';
import { DiscoveryCapabilities, DidServiceIds } from '../constants/did-services';

/**
 * Service selection criteria used when resolving operational endpoints from a DID Document.
 */
export type ServiceEndpointMatchInput = {
  /** Exact service id, such as `#jwks` or `#identity-openid-smart-token`. */
  id?: string;
  /** Exact DID service type, such as `OpenIdProvider` or `JsonWebKeyService2020`. */
  type?: string;
  /** Logical capability inferred from service id/type, such as `smart-token`. */
  capability?: string;
};

function normalizeServiceEndpoint(service: DidService): ResolvedServiceEndpoint {
  const capability =
    inferCapabilityFromServiceId(service.id)
    || inferCapabilityFromServiceType(service.type);
  return {
    id: service.id,
    type: service.type,
    serviceEndpoint: service.serviceEndpoint,
    capability,
    raw: service,
  };
}

function inferCapabilityFromServiceId(serviceId?: string): string | undefined {
  const normalized = String(serviceId || '').trim().toLowerCase();
  switch (normalized) {
    case DidServiceIds.DidDocument:
      return DiscoveryCapabilities.DidDocument;
    case DidServiceIds.Jwks:
      return DiscoveryCapabilities.Jwks;
    case DidServiceIds.OpenIdConfiguration:
      return DiscoveryCapabilities.OpenIdConfiguration;
    case DidServiceIds.SmartConfiguration:
      return DiscoveryCapabilities.SmartConfiguration;
    case DidServiceIds.SmartToken:
      return DiscoveryCapabilities.SmartToken;
    case DidServiceIds.CredentialIssuer:
      return DiscoveryCapabilities.CredentialIssuer;
    case DidServiceIds.CapabilityStatement:
      return DiscoveryCapabilities.CapabilityStatement;
    case DidServiceIds.Catalog:
      return DiscoveryCapabilities.Catalog;
    default:
      if (normalized.endsWith(':smart:token')) return DiscoveryCapabilities.SmartToken;
      return undefined;
  }
}

function inferCapabilityFromServiceType(serviceType?: string): string | undefined {
  const normalized = String(serviceType || '').trim().toLowerCase();
  switch (normalized) {
    case 'linkeddomains':
      return DiscoveryCapabilities.DidDocument;
    case 'jsonwebkeyservice2020':
      return DiscoveryCapabilities.Jwks;
    case 'openidprovider':
      return DiscoveryCapabilities.OpenIdConfiguration;
    case 'smartonfhirconfiguration':
      return DiscoveryCapabilities.SmartConfiguration;
    case 'openidcredentialissuer':
      return DiscoveryCapabilities.CredentialIssuer;
    case 'capabilitystatement':
      return DiscoveryCapabilities.CapabilityStatement;
    case 'catalogservice':
      return DiscoveryCapabilities.Catalog;
    case 'apiservice':
      return undefined;
    default:
      return undefined;
  }
}

/**
 * Normalizes every `service[]` entry in a DID Document into a capability-aware structure.
 *
 * This is the canonical starting point for SDK and GW code that needs to select
 * operational endpoints without reconstructing URLs manually.
 */
export function resolveDidDocumentServices(didDocument: DidDocument): ResolvedServiceEndpoint[] {
  return (didDocument.service || []).map(normalizeServiceEndpoint);
}

/**
 * Returns the first DID service entry matching the provided selector.
 */
export function getDidDocumentService(
  didDocument: DidDocument,
  match: ServiceEndpointMatchInput,
): ResolvedServiceEndpoint | undefined {
  return resolveDidDocumentServices(didDocument).find((service) => {
    if (match.id && service.id !== match.id) return false;
    if (match.type && service.type !== match.type) return false;
    if (match.capability && service.capability !== match.capability) return false;
    return true;
  });
}

/**
 * Returns the invocable `serviceEndpoint` URL for the first matching DID service entry.
 */
export function selectServiceEndpoint(
  didDocument: DidDocument,
  match: ServiceEndpointMatchInput,
): string | undefined {
  return getDidDocumentService(didDocument, match)?.serviceEndpoint;
}

/**
 * Returns the public URL that serves the DID Document itself, when published in `service[]`.
 */
export function getDidDocumentEndpoint(didDocument: DidDocument): string | undefined {
  return selectServiceEndpoint(didDocument, {
    id: DidServiceIds.DidDocument,
    capability: DiscoveryCapabilities.DidDocument,
  });
}

/**
 * Returns the public JWKS endpoint advertised by the DID Document.
 */
export function getJwksServiceEndpoint(didDocument: DidDocument): string | undefined {
  return selectServiceEndpoint(didDocument, {
    id: DidServiceIds.Jwks,
    capability: DiscoveryCapabilities.Jwks,
  });
}

/**
 * Returns the SMART token endpoint advertised by the DID Document.
 */
export function getSmartTokenEndpoint(didDocument: DidDocument): string | undefined {
  return selectServiceEndpoint(didDocument, {
    id: DidServiceIds.SmartToken,
    capability: DiscoveryCapabilities.SmartToken,
  });
}

/**
 * Collapses an actor DID into the owning organization/provider DID when the actor
 * uses the current data-space member suffix conventions.
 */
export function getOrganizationDidFromIndividualDid(did: string): string {
  const markers = [':family:', ':employee:', ':member:'];
  for (const marker of markers) {
    const index = did.indexOf(marker);
    if (index > -1) {
      return did.slice(0, index);
    }
  }
  return did;
}

/**
 * Alias of `getOrganizationDidFromIndividualDid` kept for provider-centric callers.
 */
export function getProviderDidFromSubjectDid(did: string): string {
  return getOrganizationDidFromIndividualDid(did);
}

/**
 * Infers the current actor kind from a DID naming convention.
 *
 * This helper is intentionally heuristic and should be treated as a convenience
 * layer over the currently published DID patterns, not as an authorization decision.
 */
export function getActorKindFromDid(did: string): ActorKind | 'unknown' {
  const normalized = String(did || '').trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (normalized.includes(':employee:')) {
    return normalized.includes('resprsn') || normalized.includes('controller')
      ? ActorKinds.OrganizationController
      : ActorKinds.Professional;
  }
  if (normalized.includes(':family:') || normalized.includes(':member:')) {
    return normalized.includes('oneself') || normalized.includes('controller')
      ? ActorKinds.IndividualController
      : ActorKinds.IndividualMember;
  }
  if (normalized.includes('host')) return ActorKinds.HostOnboarding;
  return 'unknown';
}

/**
 * Builds a reusable DID resolution result from a raw DID Document.
 */
export function toDidResolutionResult(didDocument: DidDocument): DidResolutionResult {
  return {
    did: didDocument.id,
    didDocument,
    serviceEndpoints: resolveDidDocumentServices(didDocument),
    jwksUri: getJwksServiceEndpoint(didDocument),
  };
}
