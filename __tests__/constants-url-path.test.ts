import { Sector } from '../src/models/urlPath';

describe('shared business sector identifiers', () => {
  it('keeps antifraud independent from health and animal sectors', () => {
    expect(Sector.ANTIFRAUD).toBe('antifraud');
    expect(Sector.ANTIFRAUD).not.toContain('health');
    expect(Sector.ANTIFRAUD).not.toContain('animal');
  });
});
