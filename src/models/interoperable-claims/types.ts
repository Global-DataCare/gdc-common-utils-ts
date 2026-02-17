// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/types.ts

/**
 * Canonical interoperable-claims keys used by claims-first payloads.
 * Keep this separated from strict FHIR resource typings.
 */

export type ClaimSpec = {
  key: string;
  meaning: string;
  example: string;
};
