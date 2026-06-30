import { describe, expect, it } from '@jest/globals';
import { DidcommAckBodyKeys, DidcommMessageTypes, LifecycleRequestType } from '../src/constants/index.js';
import {
  EXAMPLE_DIDCOMM_BUNDLE_ACK_TYPE,
  EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
} from '../src/examples/bundle-didcomm-payload.js';
import {
  EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY,
  EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_DOCUMENT_IDENTIFIER_KEY,
  EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY,
  EXAMPLE_DIDCOMM_ACK_TYPE,
  EXAMPLE_DIDCOMM_COMMUNICATION_ENTRY_TYPE,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE,
} from '../src/examples/lifecycle.js';
import { EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_TYPE } from '../src/examples/profile-manager-mem.js';
import { EXAMPLE_WALLET_PAYLOAD_TYPE } from '../src/examples/wallet-mem.js';
import { BundleDidcommEntryTypes } from '../src/utils/bundle-didcomm-payload.js';
import { CommunicationDidcommEntryTypes } from '../src/utils/communication-didcomm-payload.js';

describe('constants/didcomm', () => {
  it('keeps canonical DIDComm message catalogs aligned with shared examples and utility type catalogs', () => {
    expect(DidcommMessageTypes.BundleBatchRequest).toBe(BundleDidcommEntryTypes.Batch);
    expect(DidcommMessageTypes.CommunicationAttachedBundle).toBe(CommunicationDidcommEntryTypes.AttachedBundle);
    expect(EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE).toBe(DidcommMessageTypes.BundleBatchRequest);
    expect(EXAMPLE_DIDCOMM_BUNDLE_ACK_TYPE).toBe(DidcommMessageTypes.BundleAck);
    expect(EXAMPLE_DIDCOMM_COMMUNICATION_ENTRY_TYPE).toBe(DidcommMessageTypes.CommunicationAttachedBundle);
    expect(EXAMPLE_DIDCOMM_ACK_TYPE).toBe(DidcommMessageTypes.CommunicationAck);
    expect(EXAMPLE_WALLET_PAYLOAD_TYPE).toBe(DidcommMessageTypes.CommunicationBundleSubmit);
    expect(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_TYPE).toBe(DidcommMessageTypes.CommunicationResponse);
  });

  it('keeps canonical DIDComm acknowledgement body keys aligned with shared examples', () => {
    expect(EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY).toBe(DidcommAckBodyKeys.Ok);
    expect(EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY).toBe(
      DidcommAckBodyKeys.ReceivedMedicationIdentifier,
    );
    expect(EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_DOCUMENT_IDENTIFIER_KEY).toBe(
      DidcommAckBodyKeys.ReceivedDocumentIdentifier,
    );
  });

  it('keeps canonical lifecycle request types aligned with shared individual-organization examples', () => {
    expect(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE).toBe(
      LifecycleRequestType.IndividualOrganizationDisable,
    );
    expect(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE).toBe(
      LifecycleRequestType.IndividualOrganizationPurge,
    );
  });
});
