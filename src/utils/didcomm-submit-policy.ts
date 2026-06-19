export const DIDCOMM_COMMUNICATION_MODES = Object.freeze({
  Plain: 'plain',
  Strict: 'strict',
  AutoDetect: 'auto-detect',
} as const);

export type CommunicationMode =
  typeof DIDCOMM_COMMUNICATION_MODES[keyof typeof DIDCOMM_COMMUNICATION_MODES];

export const DIDCOMM_SUBMIT_KINDS = Object.freeze({
  Plain: 'plain',
  Encrypted: 'encrypted',
} as const);

export type DidcommSubmitKind =
  typeof DIDCOMM_SUBMIT_KINDS[keyof typeof DIDCOMM_SUBMIT_KINDS];

export type DidcommSubmissionCapabilities = {
  hasRecipientEncryptionJwk: boolean;
};

export const DIDCOMM_SUBMISSION_REASONS = Object.freeze({
  PlainMode: 'plain-mode',
  StrictMode: 'strict-mode',
  AutoDetectEncrypted: 'auto-detect-encrypted',
  AutoDetectPlain: 'auto-detect-plain',
} as const);

export type DidcommSubmissionReason =
  typeof DIDCOMM_SUBMISSION_REASONS[keyof typeof DIDCOMM_SUBMISSION_REASONS];

export type DidcommSubmissionPlan = {
  mode: CommunicationMode;
  submitKind: DidcommSubmitKind;
  reason: DidcommSubmissionReason;
};

export function resolveDidcommSubmissionPlan(
  mode: CommunicationMode,
  capabilities: DidcommSubmissionCapabilities,
): DidcommSubmissionPlan {
  if (mode === DIDCOMM_COMMUNICATION_MODES.Plain) {
    return {
      mode,
      submitKind: DIDCOMM_SUBMIT_KINDS.Plain,
      reason: DIDCOMM_SUBMISSION_REASONS.PlainMode,
    };
  }

  if (mode === DIDCOMM_COMMUNICATION_MODES.Strict) {
    if (!capabilities.hasRecipientEncryptionJwk) {
      throw new Error('strict mode requires recipient encryption JWK.');
    }
    return {
      mode,
      submitKind: DIDCOMM_SUBMIT_KINDS.Encrypted,
      reason: DIDCOMM_SUBMISSION_REASONS.StrictMode,
    };
  }

  if (capabilities.hasRecipientEncryptionJwk) {
    return {
      mode,
      submitKind: DIDCOMM_SUBMIT_KINDS.Encrypted,
      reason: DIDCOMM_SUBMISSION_REASONS.AutoDetectEncrypted,
    };
  }
  return {
    mode,
    submitKind: DIDCOMM_SUBMIT_KINDS.Plain,
    reason: DIDCOMM_SUBMISSION_REASONS.AutoDetectPlain,
  };
}
