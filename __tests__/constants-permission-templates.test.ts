import { describe, expect, it } from '@jest/globals';

import { DataspaceSectors } from '../src/constants/sectors.js';
import {
  ConsentPermissionTemplates,
  getConsentPermissionTemplates,
} from '../src/constants/permission-templates.js';

describe('Consent permission-template catalog', () => {
  it('publishes canonical templates keyed by sector plus coding system and code', () => {
    // Member permissions use the canonical FHIR v3-RoleCode namespace. The
    // former PersonalRelationshipRoleType key is not a license-owner class.
    const catalog = getConsentPermissionTemplates();

    expect(catalog).toBe(ConsentPermissionTemplates);
    expect(Object.keys(catalog)).toEqual(expect.arrayContaining([
      `${DataspaceSectors.HealthCare}_isco-08_2211`,
      `${DataspaceSectors.HealthCare}_v3-RoleCode_MTH`,
    ]));
  });
});
