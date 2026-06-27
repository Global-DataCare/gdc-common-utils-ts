// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Compatibility re-export for the historical medication claim-helper subpath.
 *
 * `gdc-sdk-core-ts` and older consumers still import
 * `gdc-common-utils-ts/utils/medication-claim-helpers`, while the canonical
 * implementation file is `claims-helpers-medication-statement`.
 */
export * from './claims-helpers-medication-statement';
