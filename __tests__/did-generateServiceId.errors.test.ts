import { generateServiceId } from '../src/utils/did.js';

describe('generateServiceId (edge cases)', () => {
  it('keeps action casing', () => {
    const id = generateServiceId({ section: 'identity', format: 'openid', resourceType: 'device', action: '_DCR' });
    expect(id).toBe('#identity:openid:device:_DCR');
  });
});
