import { describe, expect, it } from '@jest/globals';

import {
  DeviceAppTypes,
  DeviceUserClasses,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_LICENSE_ACTIVE_RECORD,
  LicenseCategories,
  LicenseEntryOperations,
  LicenseEntryTypes,
  LicenseStatuses,
  LicenseListSearchEditor,
  readLicenseListRecords,
} from '../src';

describe('101: license list and search', () => {
  it('builds one high-level semantic search draft and maps the supported subset to the current search entry', () => {
    const editor = new LicenseListSearchEditor()
      .setSerialNumbers([EXAMPLE_LICENSE_ACTIVE_RECORD.id])
      .setUserClass(DeviceUserClasses.Employee)
      .setAppType(DeviceAppTypes.Mobile)
      .setEmail(EXAMPLE_EMAIL_CONTROLLER_ORG)
      .setRole(EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER)
      .setActive(true)
      .setAssigned(true)
      .setPeriod('2026-01-01', '2026-12-31');

    const draft = editor.getDraft();
    const entry = editor.buildSearchEntry();

    expect(draft).toEqual(expect.objectContaining({
      active: true,
      assigned: true,
      periodStart: '2026-01-01',
      periodEnd: '2026-12-31',
    }));
    expect(entry.type).toBe(LicenseEntryTypes.Search);
    expect(entry.meta.claims['@type']).toBe(LicenseEntryOperations.Search);
    expect(entry.meta.status).toBe(LicenseStatuses.Active);
  });

  it('reads one current GW-style license list/search response into frontend-friendly records', () => {
    const body = {
      data: [{
        meta: {
          status: LicenseStatuses.Active,
          subjectId: EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId,
          claims: EXAMPLE_LICENSE_ACTIVE_RECORD.claims,
        },
      }],
    };

    expect(readLicenseListRecords(body)).toEqual([
      expect.objectContaining({
        id: EXAMPLE_LICENSE_ACTIVE_RECORD.id,
        status: LicenseStatuses.Active,
        subjectId: EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId,
        email: EXAMPLE_EMAIL_CONTROLLER_ORG,
        role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
        category: LicenseCategories.Professional,
        appType: DeviceAppTypes.Mobile,
      }),
    ]);
  });
});
