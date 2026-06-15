/**
 * Environment variable controlling whether communication retention is disabled.
 *
 * Default behavior:
 * - unset => retention stays enabled
 * - `false` => retention stays enabled
 * - `true` => retention is disabled and purge flows may remove communications
 */
export const CommunicationRetentionEnv = Object.freeze({
  Disabled: 'COMMUNICATION_RETENTION_DISABLED',
} as const);

/**
 * Canonical retention decisions reused by lifecycle/purge flows.
 */
export const CommunicationRetentionDecisions = Object.freeze({
  SkipPurge: 'skip-purge',
  AllowPurge: 'allow-purge',
} as const);

export type CommunicationRetentionDecision =
  typeof CommunicationRetentionDecisions[keyof typeof CommunicationRetentionDecisions];

function normalizeBooleanText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized || undefined;
}

/**
 * Returns whether the communication-retention safety rail is disabled.
 *
 * This helper intentionally defaults to `false`. Production callers must opt in
 * explicitly to purge communication records by setting
 * `COMMUNICATION_RETENTION_DISABLED=true`.
 */
export function isCommunicationRetentionDisabled(
  env: Readonly<Record<string, unknown>> = process.env as Record<string, unknown>,
): boolean {
  return normalizeBooleanText(env[CommunicationRetentionEnv.Disabled]) === 'true';
}

/**
 * Resolves the retention decision that lifecycle/purge code should apply to
 * communication records.
 */
export function resolveCommunicationRetentionDecision(
  env: Readonly<Record<string, unknown>> = process.env as Record<string, unknown>,
): CommunicationRetentionDecision {
  return isCommunicationRetentionDisabled(env)
    ? CommunicationRetentionDecisions.AllowPurge
    : CommunicationRetentionDecisions.SkipPurge;
}
