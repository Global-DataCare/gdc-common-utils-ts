import { safelyJoinUrl, splitUrl } from '../src/utils/url.js';

describe('url utilities', () => {
  it('joins URL parts safely', () => {
    expect(safelyJoinUrl('https://example.com/', '/path')).toBe('https://example.com/path');
    expect(safelyJoinUrl('https://example.com', 'path')).toBe('https://example.com/path');
  });

  it('splits a valid URL', () => {
    expect(splitUrl('https://www.example.com/some/path?query=1')).toEqual({
      domain: 'www.example.com',
      path: '/some/path',
    });
  });

  it('returns null for invalid URLs', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(splitUrl('not-a-url')).toBeNull();
    spy.mockRestore();
  });
});
