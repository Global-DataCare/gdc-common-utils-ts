import { normalizeUuid } from '../src/utils/normalize-uuid';
import { encodeHexToMultibase58btc, decodeMultibase58btcToHex } from '../src/utils/multibase58';

describe('normalizeUuid', () => {
  const uuidHex = '123e4567e89b12d3a456426614174000';
  const uuidDashed = '123e4567-e89b-12d3-a456-426614174000';
  const mb58 = encodeHexToMultibase58btc(uuidHex);

  console.log('DEBUG mb58:', mb58);
  console.log('DEBUG decodeMultibase58btcToHex(mb58):', decodeMultibase58btcToHex(mb58));
  console.log('DEBUG decodeMultibase58btcToHex(z3FfGK34vwMvVFDedyb2nkf):', decodeMultibase58btcToHex('z3FfGK34vwMvVFDedyb2nkf'));
  console.log('DEBUG normalizeUuid(mb58):', normalizeUuid(mb58));

  it('normalizes urn:uuid:<uuid>', () => {
    expect(normalizeUuid('urn:uuid:' + uuidDashed)).toBe(uuidHex);
  });
  it('normalizes <ResourceType>/<uuid>', () => {
    expect(normalizeUuid('Organization/' + uuidDashed)).toBe(uuidHex);
  });
  it('normalizes <uuid> with dashes', () => {
    expect(normalizeUuid(uuidDashed)).toBe(uuidHex);
  });
  it('normalizes <uuid> without dashes', () => {
    expect(normalizeUuid(uuidHex)).toBe(uuidHex);
  });
  it('normalizes urn:uuid:<mb58>', () => {
    expect(normalizeUuid('urn:uuid:' + mb58)).toBe(uuidHex);
  });
  it('normalizes <ResourceType>/<mb58>', () => {
    expect(normalizeUuid('Organization/' + mb58)).toBe(uuidHex);
  });
  it('normalizes <mb58>', () => {
    expect(normalizeUuid(mb58)).toBe(uuidHex);
  });
  it('returns undefined for invalid input', () => {
    expect(normalizeUuid('not-a-uuid')).toBeUndefined();
    expect(normalizeUuid('')).toBeUndefined();
    expect(normalizeUuid(undefined)).toBeUndefined();
  });
});
