import { describe, expect, it } from '@jest/globals';
import {
  EU_COUNTRY_CODES,
  isEuCountryCode,
  normalizeCountryCode,
} from '../src/constants/eu-countries.js';

describe('EU country helpers', () => {
  it('includes well-known EU member countries', () => {
    expect(EU_COUNTRY_CODES).toContain('ES');
    expect(EU_COUNTRY_CODES).toContain('FR');
  });

  it('normalizes country codes to uppercase ISO-2 strings', () => {
    expect(normalizeCountryCode('es')).toBe('ES');
    expect(normalizeCountryCode('  pt  ')).toBe('PT');
    expect(normalizeCountryCode('')).toBe('');
  });

  it('detects EU member countries after normalization', () => {
    expect(isEuCountryCode('es')).toBe(true);
    expect(isEuCountryCode('PT')).toBe(true);
    expect(isEuCountryCode('US')).toBe(false);
    expect(isEuCountryCode('')).toBe(false);
  });
});
