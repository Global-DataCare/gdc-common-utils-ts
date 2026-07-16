import { describe, expect, it } from '@jest/globals';
import { roleCodeI18nEn } from '../src/i18n/role-codes.i18n.js';

describe('healthcare role catalog legacy aliases', () => {
  it('keeps the old i18n aliases available for compatibility only', () => {
    expect(roleCodeI18nEn['org.isco08.2211']).toBe('Generalist medical practitioner');
    expect(roleCodeI18nEn['org.hl7.v3.personalRelationship.ONESELF']).toBe('self');
    expect(roleCodeI18nEn['org.hl7.v3.roleCode.RESPRSN']).toBe('Responsible party');
  });
});
