// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

const FHIR_API_PREFIX = 'org.hl7.fhir.api.';
const FHIR_VERSIONED_PREFIX = 'org.hl7.fhir.';
const SHORT_FHIR_API_CLAIM = /^[A-Z][A-Za-z0-9]+\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Returns the canonical short FHIR API claim or throws for another vocabulary. */
export function normalizeFhirApiClaimKey(claimKey: string): string {
  const raw = String(claimKey || '').trim();
  if (raw.startsWith(FHIR_VERSIONED_PREFIX) && !raw.startsWith(FHIR_API_PREFIX)) {
    throw new Error(`FHIR claims must use org.hl7.fhir.api, not version-specific key: ${raw}`);
  }
  const normalized = raw.startsWith(FHIR_API_PREFIX) ? raw.slice(FHIR_API_PREFIX.length) : raw;
  if (!SHORT_FHIR_API_CLAIM.test(normalized)) {
    throw new Error(`Invalid FHIR API claim key: ${raw}`);
  }
  return normalized;
}

