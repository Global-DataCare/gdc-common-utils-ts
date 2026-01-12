import { normalizeDidcommPayloadForId, normalizeObject } from '../src/utils/normalize.js';

describe('normalize utilities', () => {
  it('normalizes objects by removing volatile fields and sorting keys', () => {
    const input = { b: 2, id: '123', a: 1, meta: { a: 1 }, contained: [], text: 'ignore' };
    const normalized = normalizeObject(input);
    expect(normalized).toBe('{"a":1,"b":2}');
  });

  it('normalizes DIDComm payloads by excluding id and meta', () => {
    const payload = { z: 1, id: 'abc', meta: { i: 2 }, a: 2 };
    const normalized = normalizeDidcommPayloadForId(payload);
    expect(normalized).toBe('{"a":2,"z":1}');
  });
});
