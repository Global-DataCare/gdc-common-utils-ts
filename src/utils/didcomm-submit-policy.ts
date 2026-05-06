export type CommunicationMode = 'plain' | 'strict' | 'auto-detect';

export type DidcommSubmissionCapabilities = {
  hasRecipientEncryptionJwk: boolean;
};

export type DidcommSubmissionPlan = {
  mode: CommunicationMode;
  submitKind: 'plain' | 'encrypted';
  reason:
    | 'plain-mode'
    | 'strict-mode'
    | 'auto-detect-encrypted'
    | 'auto-detect-plain';
};

export function resolveDidcommSubmissionPlan(
  mode: CommunicationMode,
  capabilities: DidcommSubmissionCapabilities,
): DidcommSubmissionPlan {
  if (mode === 'plain') {
    return { mode, submitKind: 'plain', reason: 'plain-mode' };
  }

  if (mode === 'strict') {
    if (!capabilities.hasRecipientEncryptionJwk) {
      throw new Error('strict mode requires recipient encryption JWK.');
    }
    return { mode, submitKind: 'encrypted', reason: 'strict-mode' };
  }

  if (capabilities.hasRecipientEncryptionJwk) {
    return { mode, submitKind: 'encrypted', reason: 'auto-detect-encrypted' };
  }
  return { mode, submitKind: 'plain', reason: 'auto-detect-plain' };
}

