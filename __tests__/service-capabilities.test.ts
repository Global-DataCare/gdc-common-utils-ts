import { describe, expect, it } from '@jest/globals';
import {
  DeprecatedServiceCapabilityToken,
  getServiceCapabilityKind,
  hasServiceCapabilityKind,
  isKnownServiceCapability,
  isProviderServiceCapability,
  normalizeServiceCapability,
  parseServiceCapabilityTokens,
  serializeServiceCapabilityTokens,
  ServiceCapability,
  ServiceCapabilityKind,
} from '../src/constants/service-capabilities.js';

describe('service capability constants', () => {
  it('exposes the canonical public capability values through ServiceCapability', () => {
    expect(ServiceCapability).toEqual({
      OrganizationRegistryProvider: 'organization/Organization.cruds',
      IndexReader: 'organization/Composition.rs',
      IndexProvider: 'organization/Composition.cruds',
      DigitalTwinReader: 'organization/ResearchSubject.rs',
      DigitalTwinProvider: 'organization/ResearchSubject.cruds',
    });
  });

  it('normalizes deprecated indexing and digitaltwin tokens into the canonical values', () => {
    expect(parseServiceCapabilityTokens(
      `${DeprecatedServiceCapabilityToken.OrganizationRegistryProvider},${DeprecatedServiceCapabilityToken.IndexProvider},${DeprecatedServiceCapabilityToken.DigitalTwinReader}`,
    )).toEqual([
      ServiceCapability.OrganizationRegistryProvider,
      ServiceCapability.IndexProvider,
      ServiceCapability.DigitalTwinReader,
    ]);
    expect(serializeServiceCapabilityTokens([
      DeprecatedServiceCapabilityToken.OrganizationRegistryProvider,
      DeprecatedServiceCapabilityToken.IndexProvider,
      DeprecatedServiceCapabilityToken.DigitalTwinReader,
    ])).toBe(`${ServiceCapability.OrganizationRegistryProvider},${ServiceCapability.IndexProvider},${ServiceCapability.DigitalTwinReader}`);
    expect(normalizeServiceCapability(DeprecatedServiceCapabilityToken.OrganizationRegistryProvider)).toBe(ServiceCapability.OrganizationRegistryProvider);
  });

  it('derives canonical families and provider role from normalized capability values', () => {
    expect(getServiceCapabilityKind(ServiceCapability.OrganizationRegistryProvider)).toBe(ServiceCapabilityKind.OrganizationRegistry);
    expect(getServiceCapabilityKind(ServiceCapability.IndexProvider)).toBe(ServiceCapabilityKind.Indexing);
    expect(getServiceCapabilityKind(ServiceCapability.DigitalTwinReader)).toBe(ServiceCapabilityKind.DigitalTwin);
    expect(hasServiceCapabilityKind(
      DeprecatedServiceCapabilityToken.OrganizationRegistryProvider,
      ServiceCapabilityKind.OrganizationRegistry,
    )).toBe(true);
    expect(hasServiceCapabilityKind(
      DeprecatedServiceCapabilityToken.IndexProvider,
      ServiceCapabilityKind.Indexing,
    )).toBe(true);
    expect(isProviderServiceCapability(ServiceCapability.OrganizationRegistryProvider)).toBe(true);
    expect(isProviderServiceCapability(ServiceCapability.IndexProvider)).toBe(true);
    expect(isProviderServiceCapability(ServiceCapability.IndexReader)).toBe(false);
    expect(isKnownServiceCapability(ServiceCapability.IndexProvider)).toBe(true);
    expect(isKnownServiceCapability('http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT')).toBe(false);
  });

  it('rejects empty capability inputs', () => {
    expect(parseServiceCapabilityTokens('')).toEqual([]);
    expect(serializeServiceCapabilityTokens([])).toBeUndefined();
    expect(normalizeServiceCapability(undefined)).toBeUndefined();
    expect(hasServiceCapabilityKind('', ServiceCapabilityKind.Indexing)).toBe(false);
  });
});
