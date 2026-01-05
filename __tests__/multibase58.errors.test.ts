import { decodeMultibase58btc } from '../src/utils/multibase58.js';

describe('multibase58 (errors)', () => {
  it('throws on empty string', () => {
    expect(() => decodeMultibase58btc('')).toThrow();
  });
});
