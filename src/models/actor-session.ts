// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import type { ActorCapabilitiesValue, ActorKindsValue } from '../constants/actor-session';

/**
 * Canonical actor kind shared across SDK packages.
 */
export type ActorKind = ActorKindsValue;

/**
 * Canonical capability token shared across SDK packages.
 */
export type Capability = ActorCapabilitiesValue;
