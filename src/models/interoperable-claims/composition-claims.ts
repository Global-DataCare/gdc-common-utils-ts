// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/composition-claims.ts

export const CompositionClaim = {
  Subject: 'Composition.subject',
  Section: 'Composition.section',
  Author: 'Composition.author',
  /** CSV of Composition.attester.party references, aligned with AttesterMode and AttesterTime. */
  Attester: 'Composition.attester',
  /** CSV of required R4 Composition.attester.mode values, one per attester. */
  AttesterMode: 'Composition.attester-mode',
  /** CSV of optional R4 Composition.attester.time values, positionally aligned with AttesterMode. */
  AttesterTime: 'Composition.attester-time',
  /** Composition.custodian Organization reference. */
  Custodian: 'Composition.custodian',
  Date: 'Composition.date',
  Entry: 'Composition.entry',
  Type: 'Composition.type',
  Identifier: 'Composition.identifier',
  Title: 'Composition.title',
} as const;

/** Canonical FHIR R4 Composition.attester.mode codes. */
export const CompositionAttesterModes = Object.freeze({
  Personal: 'personal',
  Professional: 'professional',
  Legal: 'legal',
  Official: 'official',
} as const);

export type CompositionAttesterMode =
  typeof CompositionAttesterModes[keyof typeof CompositionAttesterModes];

export type CompositionClaimKey = typeof CompositionClaim[keyof typeof CompositionClaim];
