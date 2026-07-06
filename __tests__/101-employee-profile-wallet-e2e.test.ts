/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { createHash, randomBytes, randomUUID } from 'crypto';
import { describe, expect, it } from '@jest/globals';
import { ClaimsPersonSchemaorg } from '../src/constants/schemaorg.js';
import { CryptographyService } from '../src/CryptographyService.js';
import type { ICryptoHelper } from '../src/interfaces/ICryptoHelper.js';
import {
  EXAMPLE_DIDCOMM_BUNDLE_ACK_TYPE,
  EXAMPLE_DIDCOMM_BUNDLE_AUD,
  EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
  EXAMPLE_DIDCOMM_BUNDLE_ISS,
  EXAMPLE_DIDCOMM_BUNDLE_JTI,
  EXAMPLE_DIDCOMM_BUNDLE_REPLY_AUD,
  EXAMPLE_DIDCOMM_BUNDLE_REPLY_JTI,
  EXAMPLE_DIDCOMM_BUNDLE_THID,
} from '../src/examples/bundle-didcomm-payload.js';
import { EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE } from '../src/examples/employee.js';
import {
  EXAMPLE_PROFILE_MANAGER_MEM_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
  EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
  EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
} from '../src/examples/profile-manager-mem.js';
import { BundleEditor, BundleEditableResourceTypes } from '../src/utils/bundle-editor.js';
import { BundleReader } from '../src/utils/bundle-reader.js';
import {
  buildDidcommPayloadFromBundle,
  getFirstBundleResourceFromDidcommPayload,
} from '../src/utils/bundle-didcomm-payload.js';
import { EmployeeBundleOperations } from '../src/utils/employee.js';
import { ProfileManagerMem } from '../src/utils/profile-manager-mem.js';
import { WalletMem } from '../src/utils/wallet-mem.js';

const cryptoHelper: ICryptoHelper = {
  async getRandomBytes(byteCount: number): Promise<Uint8Array> {
    return randomBytes(byteCount);
  },
  async digestString(data: string, algorithm: string): Promise<string> {
    const normalized = String(algorithm).replace('-', '').toLowerCase();
    return createHash(normalized).update(data).digest('hex');
  },
  randomUUID(): string {
    return randomUUID();
  },
};

describe('101: employee bundle through profile manager and wallet', () => {
  it('teaches the direct batch-bundle path from bundle editor to DIDComm pack/unpack and bundle readback', async () => {
    /**
     * Teaching goal:
     * - show the low-level direct-bundle path used by operational batch flows
     * - show what belongs to the frontend/app side vs the BFF/runtime side
     * - build one employee batch bundle without higher actor SDK facades
     * - wrap the bundle itself as one DIDComm payload
     * - let the BFF/runtime layer pack, sign, encrypt, and send it
     * - decode the bundle on the receiver side and read the employee claims back
     *
     * Escape hatch note:
     * - callers can still use raw `WalletMem.pack/unpack` for transport-only tests
     * - the main tutorial path here is bundle -> profile -> message manager
     */
    const senderWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    const gatewayWallet = new WalletMem({ cryptoHelper, cryptography: new CryptographyService(cryptoHelper) });
    await gatewayWallet.provisionKeys(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);

    // Step 1.
    // Frontend/app responsibility:
    // build the business bundle that represents the intended employee action.
    const employeeBundle = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.employee)
      .newEntry(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.resourceId)
      .asEmployee()
      .setIdentifier(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier)
      .setEmail(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.email)
      .setRole(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.role)
      .doneEntry()
      .build();

    // Step 2.
    // BFF/runtime responsibility:
    // wrap the business bundle as DIDComm plaintext JSON before crypto/transport.
    // In one FHIR-compat/plain mode this payload may travel without encryption.
    // In the normal DIDComm-proxy mode this same payload is the input to
    // `WalletMem.pack(...)` or equivalent backend wallet encryption/signing.
    const didcommPayload = buildDidcommPayloadFromBundle({
      bundle: employeeBundle,
      iss: EXAMPLE_DIDCOMM_BUNDLE_ISS,
      aud: EXAMPLE_DIDCOMM_BUNDLE_AUD,
      jti: EXAMPLE_DIDCOMM_BUNDLE_JTI,
      thid: EXAMPLE_DIDCOMM_BUNDLE_THID,
      entryType: EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
    });
    // Step 3.
    const senderManager = new ProfileManagerMem({
      profile: {
        profileId: EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID,
        did: EXAMPLE_PROFILE_MANAGER_MEM_DID,
        displayName: EXAMPLE_PROFILE_MANAGER_MEM_DISPLAY_NAME,
      },
      wallet: senderWallet,
      transport: {
        submit: async ({ envelope }) => {
          const decoded = await gatewayWallet.unpack!(envelope, EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
          const receivedBundle = getFirstBundleResourceFromDidcommPayload(decoded.content as any);
          const reader = new BundleReader(receivedBundle);

          expect(reader.getEntryClaimsByArrayIndex(0)[ClaimsPersonSchemaorg.identifier]).toBe(
            EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier,
          );

          const senderKeys = await senderWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_PROFILE_ID);
          return {
            accepted: true,
            responseEnvelope: await gatewayWallet.pack!(
              {
                iss: EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_DID,
                aud: EXAMPLE_DIDCOMM_BUNDLE_REPLY_AUD,
                jti: EXAMPLE_DIDCOMM_BUNDLE_REPLY_JTI,
                thid: EXAMPLE_DIDCOMM_BUNDLE_THID,
                type: EXAMPLE_DIDCOMM_BUNDLE_ACK_TYPE,
                body: {
                  ok: true,
                  receivedEmployeeIdentifier: reader.getEntryClaimsByArrayIndex(0)[ClaimsPersonSchemaorg.identifier],
                },
              },
              senderKeys.encryptionJwk,
              EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID,
            ),
          };
        },
      },
    });
    await senderManager.initialize();
    const gatewayKeys = await gatewayWallet.getPublicKeys!(EXAMPLE_PROFILE_MANAGER_MEM_GATEWAY_PROFILE_ID);
    await senderManager.queueMessage({
      payload: didcommPayload as unknown as Record<string, unknown>,
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_EMERGENCY,
      recipientEncryptionJwk: gatewayKeys.encryptionJwk,
    });

    // Step 4.
    const submitted = await senderManager.submitNextPendingMessage(gatewayKeys.encryptionJwk);
    expect(((submitted.response?.content as Record<string, unknown>)['body'] as Record<string, unknown>)['receivedEmployeeIdentifier'])
      .toBe(EXAMPLE_EMPLOYEE_DOCTOR_ACTIVE.identifier);
  });
});
