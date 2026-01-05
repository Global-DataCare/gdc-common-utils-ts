import { generateServiceId } from '../src/utils/did.js';

describe('generateServiceId', () => {
  it('builds #section:format:resourceType:action', () => {
    const id = generateServiceId({
      section: 'identity',
      format: 'openid',
      resourceType: 'Device',
      action: '_dcr',
    });
    expect(id).toBe('#identity:openid:device:_dcr');
  });

  it('filters empty parts', () => {
    const id = generateServiceId({ section: 'x', format: 'y', resourceType: '', action: '_batch' });
    expect(id).toBe('#x:y:_batch');
  });
});
