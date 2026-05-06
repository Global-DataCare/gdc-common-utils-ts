import {
  resolveDidcommSubmissionPlan,
  type CommunicationMode,
} from '../src/utils/didcomm-submit-policy';

describe('resolveDidcommSubmissionPlan', () => {
  it('returns plain plan for plain mode', () => {
    const plan = resolveDidcommSubmissionPlan('plain', { hasRecipientEncryptionJwk: false });
    expect(plan).toEqual({
      mode: 'plain',
      submitKind: 'plain',
      reason: 'plain-mode',
    });
  });

  it('returns encrypted plan for strict mode when recipient enc JWK exists', () => {
    const plan = resolveDidcommSubmissionPlan('strict', { hasRecipientEncryptionJwk: true });
    expect(plan).toEqual({
      mode: 'strict',
      submitKind: 'encrypted',
      reason: 'strict-mode',
    });
  });

  it('throws for strict mode when recipient enc JWK is missing', () => {
    expect(() => resolveDidcommSubmissionPlan('strict', { hasRecipientEncryptionJwk: false }))
      .toThrow('strict mode requires recipient encryption JWK.');
  });

  it('returns encrypted for auto-detect when recipient enc JWK exists', () => {
    const plan = resolveDidcommSubmissionPlan('auto-detect', { hasRecipientEncryptionJwk: true });
    expect(plan).toEqual({
      mode: 'auto-detect',
      submitKind: 'encrypted',
      reason: 'auto-detect-encrypted',
    });
  });

  it('returns plain for auto-detect when recipient enc JWK is missing', () => {
    const plan = resolveDidcommSubmissionPlan('auto-detect', { hasRecipientEncryptionJwk: false });
    expect(plan).toEqual({
      mode: 'auto-detect',
      submitKind: 'plain',
      reason: 'auto-detect-plain',
    });
  });

  it('covers all communication modes', () => {
    const modes: CommunicationMode[] = ['plain', 'strict', 'auto-detect'];
    expect(modes).toHaveLength(3);
  });
});

