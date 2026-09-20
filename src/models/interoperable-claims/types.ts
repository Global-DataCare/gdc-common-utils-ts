// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/types.ts

/**
 * FHIR-like flat-claim metadata used by claims-first payloads.
 *
 * Only names published under the resource's official FHIR `#search` section
 * are canonical flat-search claims. Every other key is either a documented
 * FHIR standard extension or a documented custom extension; being a native
 * FHIR element does not by itself make a flat claim canonical.
 * Applicable IPS profiles govern creation/card support and ValueSet bindings;
 * the IPS Server CapabilityStatement governs the server interaction surface.
 *
 * @see ../../../../docs/FHIR-LIKE-FLAT-CLAIMS.md
 */

export type ClaimSpec = {
  key: string;
  meaning: string;
  example: string;
};

export type FhirStandardExtensionClaimSpec = ClaimSpec & {
  origin: 'fhir-standard-extension';
  canonicalUrl: `http${string}/StructureDefinition/${string}`;
  fhirType: string;
};
