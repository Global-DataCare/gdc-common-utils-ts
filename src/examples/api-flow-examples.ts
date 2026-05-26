// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Compatibility aggregator for shared API flow examples.
 *
 * Prefer importing from `gdc-common-utils-ts/examples` or the flow-specific modules
 * in this folder. This file exists to avoid the overloaded term `contract`
 * while preserving a stable migration target for older imports.
 */

export * from './shared';
export * from './organization-controller';
export * from './individual-controller';
export * from './professional';
export * from './related-person';
export * from './frontend-session';
export * from './lifecycle';
