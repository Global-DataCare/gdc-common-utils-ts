// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Canonical route-sector identifiers used by GW/ICA URLs and examples.
 *
 * Notes:
 * - These are route/service taxonomy identifiers, not free-text business labels.
 * - The actual supported subset for a given ICA or node operator should be
 *   discovered from metadata such as ICA `/.well-known/ica-configuration`.
 * - This catalog intentionally includes current CORE examples, ICA defaults,
 *   and a small set of near-term extension sectors so callers do not need to
 *   hardcode strings in application code.
 */
export const DataspaceSectors = Object.freeze({
  HealthCare: 'health-care',
  HealthLab: 'health-lab',
  HealthResearch: 'health-research',
  HealthTech: 'health-tech',
  HealthInsurance: 'health-insurance',
  AnimalCare: 'animal-care',
  AnimalLab: 'animal-lab',
  AnimalResearch: 'animal-research',
  AnimalInsurance: 'animal-insurance',
  AnimalTech: 'animal-tech',
  OneHealthResearch: 'onehealth-research',
  OneHealthLab: 'onehealth-lab',
  OneHealthTech: 'onehealth-tech',
} as const);

export type DataspaceSector = typeof DataspaceSectors[keyof typeof DataspaceSectors];
