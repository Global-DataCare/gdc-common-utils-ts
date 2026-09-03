// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  DeviceAppTypes,
  DeviceUserClasses,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_LICENSE_ACTIVE_RECORD,
  EXAMPLE_LICENSE_AVAILABLE_RECORD,
  EXAMPLE_LICENSE_LIST_RESPONSE_BODY,
  LicenseCategories,
  LicenseEntryOperations,
  LicenseEntryTypes,
  LicenseStatuses,
  findLicenseListRecord,
  LicenseListSearchEditor,
  readLicenseListRecords,
  summarizeLicenseListRecords,
} from '../src';

describe('101: license list and search', () => {
  it('builds one high-level semantic search state and maps the supported subset to the current search entry', () => {
    const editor = new LicenseListSearchEditor()
      .setSerialNumbers([EXAMPLE_LICENSE_ACTIVE_RECORD.id])
      .setUserClass(DeviceUserClasses.Employee)
      .setAppType(DeviceAppTypes.Mobile)
      .setEmail(EXAMPLE_EMAIL_CONTROLLER_ORG)
      .setRole(EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER)
      .setActive(true)
      .setAssigned(true)
      .setPeriod('2026-01-01', '2026-12-31');

    const state = editor.getState();
    const entry = editor.buildSearchEntry();

    expect(state).toEqual(expect.objectContaining({
      active: true,
      assigned: true,
      periodStart: '2026-01-01',
      periodEnd: '2026-12-31',
    }));
    expect(entry.type).toBe(LicenseEntryTypes.Search);
    expect(entry.resource.meta.claims['@type']).toBe(LicenseEntryOperations.Search);
    expect((entry.meta as Record<string, unknown>).claims).toBeUndefined();
    expect(entry.meta.status).toBe(LicenseStatuses.Active);
  });

  it('reads one current GW-style license list/search response into frontend-friendly records', () => {
    const records = readLicenseListRecords(EXAMPLE_LICENSE_LIST_RESPONSE_BODY);

    expect(records).toEqual([
      expect.objectContaining({
        id: EXAMPLE_LICENSE_ACTIVE_RECORD.id,
        status: LicenseStatuses.Active,
        subjectId: EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId,
        email: EXAMPLE_EMAIL_CONTROLLER_ORG,
        role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
        category: LicenseCategories.Professional,
        appType: DeviceAppTypes.Mobile,
      }),
      expect.objectContaining({
        id: EXAMPLE_LICENSE_AVAILABLE_RECORD.id,
        status: LicenseStatuses.Available,
      }),
    ]);
    expect(findLicenseListRecord(EXAMPLE_LICENSE_LIST_RESPONSE_BODY, EXAMPLE_LICENSE_ACTIVE_RECORD.id)).toEqual(records[0]);
    expect(summarizeLicenseListRecords(EXAMPLE_LICENSE_LIST_RESPONSE_BODY)).toEqual({
      contracted: 2,
      free: 1,
      used: 1,
      available: 1,
      issued: 0,
      active: 1,
      inactive: 0,
    });
  });

  it('reads license rows nested in the current GW search entry without counting the response wrapper', () => {
    const nestedResponse = {
      resourceType: 'Bundle',
      data: [{
        type: 'device-license',
        resource: {
          total: 2,
          data: EXAMPLE_LICENSE_LIST_RESPONSE_BODY.data,
        },
        response: { status: '200' },
      }],
    };

    expect(readLicenseListRecords(nestedResponse).map((record) => record.id)).toEqual([
      EXAMPLE_LICENSE_ACTIVE_RECORD.id,
      EXAMPLE_LICENSE_AVAILABLE_RECORD.id,
    ]);
    expect(summarizeLicenseListRecords(nestedResponse)).toEqual({
      contracted: 2,
      free: 1,
      used: 1,
      available: 1,
      issued: 0,
      active: 1,
      inactive: 0,
    });
  });

  it('reads status and ownership from canonical primary-resource metadata', () => {
    const primaryResourceResponse = {
      resourceType: 'Bundle',
      data: [{
        type: 'License-search-response-v1.0',
        resource: {
          id: EXAMPLE_LICENSE_AVAILABLE_RECORD.id,
          meta: {
            status: LicenseStatuses.Available,
            claims: EXAMPLE_LICENSE_AVAILABLE_RECORD.claims,
          },
        },
        response: { status: '200' },
      }],
    };

    expect(summarizeLicenseListRecords(primaryResourceResponse)).toEqual({
      contracted: 1,
      free: 1,
      used: 0,
      available: 1,
      issued: 0,
      active: 0,
      inactive: 0,
    });
  });

  it('ignores operation outcomes and empty GW response wrappers', () => {
    expect(readLicenseListRecords({
      data: [
        { type: 'OperationOutcome', resource: { issue: [{ diagnostics: 'example failure' }] } },
        { type: 'device-license', resource: { total: 0, data: [] }, response: { status: '200' } },
      ],
    })).toEqual([]);
  });
});
