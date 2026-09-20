// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

/**
 * Executable IPS 2.0.1 field, type, obligation and terminology contract.
 *
 * Generated from the official `hl7.fhir.uv.ips#2.0.1` and
 * `hl7.fhir.r4.core#4.0.1` packages. Regenerate with
 * `scripts/generate-ips-profile-catalog.mjs`.
 */
import { IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE } from './ips-profile-catalog.generated';

export * from './ips-profile-types';
export * from './ips-profile-catalog.generated';

export type IpsResourceType = keyof typeof IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE;

export type IpsCanonicalFlatClaim<
  Resource extends IpsResourceType = IpsResourceType,
> = (typeof IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE)[Resource][number];
