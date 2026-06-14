import { stripUndefinedDeep } from '../src/utils/object-sanitize';

describe('stripUndefinedDeep', () => {
  it('removes undefined values from nested objects and arrays', () => {
    const input = {
      keep: 'value',
      remove: undefined,
      nested: {
        keepNumber: 7,
        removeToo: undefined,
      },
      list: [
        'a',
        undefined,
        {
          keep: true,
          remove: undefined,
        },
      ],
    };

    expect(stripUndefinedDeep(input)).toEqual({
      keep: 'value',
      nested: {
        keepNumber: 7,
      },
      list: [
        'a',
        {
          keep: true,
        },
      ],
    });
  });

  it('preserves primitive values that are not undefined', () => {
    expect(stripUndefinedDeep(null)).toBeNull();
    expect(stripUndefinedDeep(false)).toBe(false);
    expect(stripUndefinedDeep(0)).toBe(0);
    expect(stripUndefinedDeep('')).toBe('');
  });
});
