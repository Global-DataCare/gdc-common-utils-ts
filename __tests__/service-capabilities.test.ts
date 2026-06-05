import { describe, expect, it } from '@jest/globals';
import {
  DeprecatedServiceCapabilityToken,
  getServiceCapabilityKind,
  hasServiceCapabilityKind,
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
      IndexReader: 'organization/Composition.rs',
      IndexProvider: 'organization/Composition.cruds',
      DigitalTwinReader: 'organization/ResearchSubject.rs',
      DigitalTwinProvider: 'organization/ResearchSubject.cruds',
    });
  });

  it('normalizes deprecated indexing and digitaltwin tokens into the canonical values', () => {
    expect(parseServiceCapabilityTokens(
      `${DeprecatedServiceCapabilityToken.IndexProvider},${DeprecatedServiceCapabilityToken.DigitalTwinReader}`,
    )).toEqual([
      ServiceCapability.IndexProvider,
      ServiceCapability.DigitalTwinReader,
    ]);
    expect(serializeServiceCapabilityTokens([
      DeprecatedServiceCapabilityToken.IndexProvider,
      DeprecatedServiceCapabilityToken.DigitalTwinReader,
    ])).toBe(`${ServiceCapability.IndexProvider},${ServiceCapability.DigitalTwinReader}`);
    expect(normalizeServiceCapability(DeprecatedServiceCapabilityToken.IndexProvider)).toBe(ServiceCapability.IndexProvider);
  });

  it('derives canonical families and provider role from normalized capability values', () => {
    expect(getServiceCapabilityKind(ServiceCapability.IndexProvider)).toBe(ServiceCapabilityKind.Indexing);
    expect(getServiceCapabilityKind(ServiceCapability.DigitalTwinReader)).toBe(ServiceCapabilityKind.DigitalTwin);
    expect(hasServiceCapabilityKind(
      DeprecatedServiceCapabilityToken.IndexProvider,
      ServiceCapabilityKind.Indexing,
    )).toBe(true);
    expect(isProviderServiceCapability(ServiceCapability.IndexProvider)).toBe(true);
    expect(isProviderServiceCapability(ServiceCapability.IndexReader)).toBe(false);
  });

  it('rejects empty capability inputs', () => {
    expect(parseServiceCapabilityTokens('')).toEqual([]);
    expect(serializeServiceCapabilityTokens([])).toBeUndefined();
    expect(normalizeServiceCapability(undefined)).toBeUndefined();
    expect(hasServiceCapabilityKind('', ServiceCapabilityKind.Indexing)).toBe(false);
  });
});
