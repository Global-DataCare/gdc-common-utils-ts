import { describe, expect, it } from '@jest/globals';
import { ClaimsPersonSchemaorg } from '../src/constants/schemaorg.js';
import {
  EXAMPLE_DIDCOMM_BUNDLE_AUD,
  EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
  EXAMPLE_DIDCOMM_BUNDLE_ISS,
  EXAMPLE_DIDCOMM_BUNDLE_JTI,
  EXAMPLE_DIDCOMM_BUNDLE_THID,
} from '../src/examples/bundle-didcomm-payload.js';
import { EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE } from '../src/examples/employee.js';
import {
  BundleEditor,
  BundleEditableResourceTypes,
} from '../src/utils/bundle-editor.js';
import {
  EmployeeBundleOperations,
} from '../src/utils/employee.js';
import {
  buildDidcommPayloadFromBundle,
  getFirstBundleResourceFromDidcommPayload,
} from '../src/utils/bundle-didcomm-payload.js';
import { BundleReader } from '../src/utils/bundle-reader.js';

describe('utils/bundle-didcomm-payload', () => {
  it('wraps one direct employee batch bundle as one DIDComm-style payload and reads it back as a bundle', () => {
    const bundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.employee)
      .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.resourceId)
      .asEmployee()
      .setIdentifier(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    const payload = buildDidcommPayloadFromBundle({
      bundle,
      iss: EXAMPLE_DIDCOMM_BUNDLE_ISS,
      aud: EXAMPLE_DIDCOMM_BUNDLE_AUD,
      jti: EXAMPLE_DIDCOMM_BUNDLE_JTI,
      thid: EXAMPLE_DIDCOMM_BUNDLE_THID,
      entryType: EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
    });

    const receivedBundle = getFirstBundleResourceFromDidcommPayload(payload);
    const reader = new BundleReader(receivedBundle);

    expect(reader.getResourceType()).toBe('Bundle');
    expect(reader.getBundleType()).toBe('batch');
    expect(reader.getEntryClaimsByArrayIndex(0)[ClaimsPersonSchemaorg.identifier]).toBe(
      EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
    );
  });

  it('fails when the first DIDComm resource is not one Bundle', () => {
    expect(() => getFirstBundleResourceFromDidcommPayload({
      iss: EXAMPLE_DIDCOMM_BUNDLE_ISS,
      aud: EXAMPLE_DIDCOMM_BUNDLE_AUD,
      jti: EXAMPLE_DIDCOMM_BUNDLE_JTI,
      thid: EXAMPLE_DIDCOMM_BUNDLE_THID,
      type: EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
      body: {
        data: [
          {
            id: EXAMPLE_DIDCOMM_BUNDLE_JTI,
            type: EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
            resource: {
              resourceType: 'Communication',
            },
          },
        ],
      },
    } as any)).toThrow(
      'getFirstBundleResourceFromDidcommPayload requires body.data[0].resource.resourceType = Bundle.',
    );
  });
});
