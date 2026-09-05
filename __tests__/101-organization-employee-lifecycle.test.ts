// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
// Controller inventory reads each Employee and License from
// `DIDComm.body.data[].resource`; the deprecated nested search-list envelope
// remains read-only compatibility during a rolling GW/SDK deployment.
import {
  DeviceBindingStatuses,
  EmployeeDirectoryStatuses,
  EmployeeLifecycleActions,
  IdentityAuthActions,
  IdentityAuthRequestFields,
} from '../src/constants';
import {
  EXAMPLE_EMPLOYEE_DEVICE_BINDINGS,
  EXAMPLE_EMPLOYEE_ACTIVATION_CODE,
  EXAMPLE_EMPLOYEE_LIFECYCLE_RECORD,
  EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY,
  EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY_LEGACY,
  EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES,
  EXAMPLE_LICENSE_ISSUE_RESPONSE_BODY,
} from '../src/examples';
import {
  buildEmployeeDeviceRevocationBody,
  extractBundleSearchResources,
  projectOrganizationEmployeeLifecycle,
  readEmployeeActivationCode,
} from '../src/utils';

describe('organization employee lifecycle shared contract', () => {
  it('extracts primary resources from canonical DIDComm Bundle entries', () => {
    expect(extractBundleSearchResources(EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY))
      .toEqual(EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY.data.map(entry => entry.resource));
  });

  it('reads the deprecated nested search-list envelope during rolling upgrades', () => {
    expect(extractBundleSearchResources(EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY_LEGACY))
      .toEqual(EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY.data.map(entry => entry.resource));
  });

  it('returns no resources for an empty deprecated nested search-list envelope', () => {
    const emptyLegacyBody = {
      ...EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY_LEGACY,
      data: EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY_LEGACY.data.map(entry => ({
        ...entry,
        resource: { ...entry.resource, total: 0, data: [] },
      })),
    };

    expect(extractBundleSearchResources(emptyLegacyBody)).toEqual([]);
  });

  it('publishes protocol tokens instead of requiring product-local strings', () => {
    expect(IdentityAuthActions.Issue).toBe('_issue');
    expect(IdentityAuthActions.RevokeResponse).toBe('_revoke-response');
    expect(EmployeeLifecycleActions.RevokeDevice).toBe('revoke_device');
    expect(DeviceBindingStatuses.Active).toBe('active');
    expect(EmployeeDirectoryStatuses.Purged).toBe('purged');
  });

  it('builds the typed revoke body with canonical wire keys', () => {
    const activeBinding = EXAMPLE_EMPLOYEE_DEVICE_BINDINGS[0];
    expect(buildEmployeeDeviceRevocationBody({
      licenseId: EXAMPLE_EMPLOYEE_LIFECYCLE_RECORD.license!.id,
      clientId: activeBinding.clientId,
    })).toEqual({
      [IdentityAuthRequestFields.LicenseId]: EXAMPLE_EMPLOYEE_LIFECYCLE_RECORD.license!.id,
      [IdentityAuthRequestFields.ClientId]: activeBinding.clientId,
    });
  });

  it('reads the activation credential and projects employee plus device state', () => {
    expect(readEmployeeActivationCode(EXAMPLE_LICENSE_ISSUE_RESPONSE_BODY))
      .toBe(EXAMPLE_EMPLOYEE_ACTIVATION_CODE);
    expect(projectOrganizationEmployeeLifecycle({
      employeeResponse: EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY,
      licenseResponse: EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES,
    })[0]).toEqual(EXAMPLE_EMPLOYEE_LIFECYCLE_RECORD);
  });

  it('preserves device activation time and the verified licensed contact', () => {
    const projected = projectOrganizationEmployeeLifecycle({
      employeeResponse: EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY,
      licenseResponse: EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES,
    })[0];

    expect(projected.license?.devices[0]).toMatchObject({
      activatedAt: EXAMPLE_EMPLOYEE_DEVICE_BINDINGS[0].activatedAt,
      ownerContact: projected.email,
      ownerContactKind: 'email', // The literal is the discriminated-union behavior under test.
    });
  });

  it('matches a representative seat by its verified email and role when legacy subjectId is absent', () => {
    const employee = EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY.data[0].resource;
    const license = EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES.body.data[0].resource;
    const projected = projectOrganizationEmployeeLifecycle({
      employeeResponse: EXAMPLE_EMPLOYEE_SEARCH_RESPONSE_BODY,
      licenseResponse: {
        body: {
          ...EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES.body,
          data: [{
            ...EXAMPLE_LICENSE_LIST_RESPONSE_BODY_WITH_DEVICES.body.data[0],
            resource: {
              ...license,
              meta: {
                ...license.meta,
                subjectId: undefined,
                claims: employee.claims,
              },
            },
          }],
        },
      },
    })[0];

    expect(projected.license?.id).toBe(license.id);
  });
});
