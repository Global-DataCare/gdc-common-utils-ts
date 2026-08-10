import {
  normalizeDataspaceMembershipScope,
  parseDataspaceMembershipScopeCsv,
} from '../src/utils/dataspace-membership-scope';

describe('dataspace membership scopes', () => {
  it('normalizes explicit scopes and provider shorthand without a product allowlist', () => {
    expect(normalizeDataspaceMembershipScope('Health-Research:Reader')).toBe('health-research:reader');
    expect(normalizeDataspaceMembershipScope('future-sector')).toBe('future-sector:provider');
    expect(normalizeDataspaceMembershipScope('onehealth:ica')).toBe('onehealth:ica');
  });

  it('supports optional deployment policy and rejects malformed input', () => {
    expect(() => normalizeDataspaceMembershipScope('health care:reader')).toThrow(/Expected/);
    expect(() => normalizeDataspaceMembershipScope('health-care:reader:extra')).toThrow(/Expected/);
    expect(() => normalizeDataspaceMembershipScope('animal-care:reader', {
      allowedScopes: ['health-care:reader'],
    })).toThrow(/not allowed/);
  });

  it('parses a normalized deduplicated CSV policy', () => {
    expect(parseDataspaceMembershipScopeCsv('health-care:reader, HEALTH-CARE:READER,animal-care')).toEqual([
      'health-care:reader',
      'animal-care:provider',
    ]);
  });
});
