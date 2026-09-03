/**
 * Canonical low-level DIDComm-style message types reused by examples, tests,
 * and runtime-neutral transport helpers in this package.
 */
export const DidcommMessageTypes = Object.freeze({
  BundleAck: 'Bundle-ack-v1.0',
  BundleBatchRequest: 'Bundle-batch-request-v1.0',
  BundleDocumentRequest: 'Bundle-document-request-v1.0',
  CommunicationAck: 'Communication-ack-v1.0',
  CommunicationAttachedBundle: 'Communication-attached-bundle-v1.0',
  CommunicationBundleSubmit: 'Communication-bundle-submit-v1.0',
  CommunicationResponse: 'Communication-response-v1.0',
  SmartTokenRequest: 'Smart-token-request-v1.0',
} as const);

/** Payload model discriminators used by the extended DIDComm transport. */
export const DidcommPayloadTypes = Object.freeze({
  ExtendedCommunicationMessage: 'CommMsgExtended',
} as const);

/**
 * Canonical low-level DIDComm acknowledgement body keys used in shared tests
 * and examples.
 */
export const DidcommAckBodyKeys = Object.freeze({
  Ok: 'ok',
  ReceivedDocumentIdentifier: 'receivedDocumentIdentifier',
  ReceivedMedicationIdentifier: 'receivedMedicationIdentifier',
} as const);
