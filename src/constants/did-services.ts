// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical DID service fragments published by GW/SDK discovery surfaces.
 */
export const DidServiceIds = Object.freeze({
  DidDocument: '#did-document',
  Jwks: '#jwks',
  OpenIdConfiguration: '#openid-configuration',
  SmartConfiguration: '#smart-configuration',
  SmartToken: '#identity:openid:smart:token',
  CredentialIssuer: '#openid-credential-issuer',
  CapabilityStatement: '#fhir:capabilitystatement',
  Catalog: '#catalog',
} as const);

/**
 * Canonical DID service types published by GW/SDK discovery surfaces.
 */
export const DidServiceTypes = Object.freeze({
  LinkedDomains: 'LinkedDomains',
  JsonWebKeyService2020: 'JsonWebKeyService2020',
  OpenIdProvider: 'OpenIdProvider',
  SmartOnFhirConfiguration: 'SmartOnFhirConfiguration',
  ApiService: 'ApiService',
  CredentialIssuer: 'OpenIdCredentialIssuer',
  FhirCapabilityStatement: 'CapabilityStatement',
  CatalogService: 'CatalogService',
} as const);

/**
 * Canonical discovery capabilities used when selecting endpoints from a DID Document.
 */
export const DiscoveryCapabilities = Object.freeze({
  DidDocument: 'did-document',
  Jwks: 'jwks',
  OpenIdConfiguration: 'openid-configuration',
  SmartConfiguration: 'smart-configuration',
  SmartToken: 'smart-token',
  CredentialIssuer: 'credential-issuer',
  CapabilityStatement: 'capability-statement',
  Catalog: 'catalog',
} as const);

export type DidServiceId = typeof DidServiceIds[keyof typeof DidServiceIds];
export type DidServiceType = typeof DidServiceTypes[keyof typeof DidServiceTypes];
export type DiscoveryCapability = typeof DiscoveryCapabilities[keyof typeof DiscoveryCapabilities];
