import { describe, expect, it } from '@jest/globals';
import {
  buildUnifiedHealthIdPersonalDigits,
  computeDammCheckDigit,
  computeUnifiedHealthIdCheckDigit,
} from '../src/utils/unified-health-id.js';

describe('utils/unified-health-id', () => {
  it('computes the provider-scoped control digit for the UNID example and ignores separators', () => {
    const providerId = '72400-0000';
    const personalPayload = '000-000-000-00';

    const checkDigit = computeUnifiedHealthIdCheckDigit(providerId, personalPayload);
    const personalDigits = buildUnifiedHealthIdPersonalDigits(providerId, personalPayload);

    expect(checkDigit).toBe('1');
    expect(personalDigits).toBe('000000000001');
    expect(`did:web:unid.online:personal:${personalDigits.slice(0, 3)}-${personalDigits.slice(3, 6)}-${personalDigits.slice(6, 9)}-${personalDigits.slice(9, 12)}`)
      .toBe('did:web:unid.online:personal:000-000-000-001');
  });

  it('changes the control digit for the 84000-0000 provider with the same personal payload', () => {
    const personalPayload = '000-000-000-00';

    const firstProviderDigit = computeUnifiedHealthIdCheckDigit('72400-0000', personalPayload);
    const secondProviderDigit = computeUnifiedHealthIdCheckDigit('84000-0000', personalPayload);

    expect(firstProviderDigit).toBe('1');
    expect(secondProviderDigit).toBe('0');
    expect(secondProviderDigit).not.toBe(firstProviderDigit);
  });

  it('exposes the generic Damm helper for raw decimal payloads', () => {
    expect(computeDammCheckDigit('12345678901')).toBe('8');
  });

  it('rejects non-numeric provider identifiers', () => {
    expect(() => computeUnifiedHealthIdCheckDigit('72400/0000', '000-000-000-00')).toThrow(
      /providerId/,
    );
  });
});
