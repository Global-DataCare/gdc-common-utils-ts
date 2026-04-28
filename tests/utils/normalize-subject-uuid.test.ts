import { normalizeSubjectUuid } from '../../src/utils/normalize-subject-uuid';
import { encodeHexToMultibase58btc } from '../../src/utils/multibase58';

describe('normalizeSubjectUuid', () => {
  const uuidHex = '123e4567e89b12d3a456426614174000';
  const uuidDashed = '123e4567-e89b-12d3-a456-426614174000';
  const mb58 = encodeHexToMultibase58btc(uuidHex);

  it('normalizes urn:uuid:<uuid>', () => {
    expect(normalizeSubjectUuid('urn:uuid:' + uuidDashed)).toBe(uuidHex);
  });
  it('normalizes <ResourceType>/<uuid>', () => {
    expect(normalizeSubjectUuid('Organization/' + uuidDashed)).toBe(uuidHex);
  });
  it('normalizes <uuid> with dashes', () => {
    expect(normalizeSubjectUuid(uuidDashed)).toBe(uuidHex);
  });
  it('normalizes <uuid> without dashes', () => {
    expect(normalizeSubjectUuid(uuidHex)).toBe(uuidHex);
  });
  it('normalizes urn:uuid:<mb58>', () => {
    expect(normalizeSubjectUuid('urn:uuid:' + mb58)).toBe(uuidHex);
  });
  it('normalizes <ResourceType>/<mb58>', () => {
    expect(normalizeSubjectUuid('Organization/' + mb58)).toBe(uuidHex);
  });
  it('normalizes <mb58>', () => {
    expect(normalizeSubjectUuid(mb58)).toBe(uuidHex);
  });
  it('returns undefined for invalid input', () => {
    expect(normalizeSubjectUuid('not-a-uuid')).toBeUndefined();
    expect(normalizeSubjectUuid('')).toBeUndefined();
    expect(normalizeSubjectUuid(undefined)).toBeUndefined();
  });
});
