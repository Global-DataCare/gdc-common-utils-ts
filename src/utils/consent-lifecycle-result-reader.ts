// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  createLifecycleResultReader,
  LifecycleResultAnalysis,
  LifecycleResultEntrySummary,
  LifecycleResultReader,
} from './lifecycle-result-reader.js';

export type ConsentLifecycleResultEntrySummary = LifecycleResultEntrySummary;
export type ConsentLifecycleResultAnalysis = LifecycleResultAnalysis;

/**
 * Consent-named alias over the neutral lifecycle result reader.
 *
 * Intent:
 * - keep one explicit frontend-facing entry point for consent lifecycle
 *   responses
 * - avoid duplicating parser logic already shared by `LifecycleResultReader`
 * - make docs/tests easier to follow for teams integrating consent first
 */
export class ConsentLifecycleResultReader extends LifecycleResultReader {}

/**
 * Creates one consent-named lifecycle result reader while preserving the same
 * neutral output contract as `createLifecycleResultReader(...)`.
 */
export function createConsentLifecycleResultReader(
  result: Record<string, unknown>,
): ConsentLifecycleResultReader {
  return new ConsentLifecycleResultReader(result);
}

/**
 * Short alias for teams that prefer an explicit read verb in code examples.
 */
export function readConsentLifecycleResult(
  result: Record<string, unknown>,
): ConsentLifecycleResultReader {
  return createConsentLifecycleResultReader(result);
}

export {
  createLifecycleResultReader,
};
