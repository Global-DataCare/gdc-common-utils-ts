// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type { ClinicalResourceBundleLike } from './clinical-resource-view.js';
import { toClinicalResourceExpandedViews } from './clinical-resource-view.js';

export type ClinicalBundleTypeSummary = Readonly<{
  resourceType: string;
  count: number;
}>;

export type ClinicalBundleSummary = Readonly<{
  totalEntries: number;
  resourceTypes: ClinicalBundleTypeSummary[];
  xhtmlEntries: number;
  notedEntries: number;
}>;

/**
 * Builds one high-level summary from a FHIR/IPS bundle already normalized to
 * the common clinical-resource view contract.
 *
 * Intended for BFF/frontend/call-center code that needs to announce simple
 * menu facts such as "how many medications are present" without hand-reading
 * bundle entries.
 */
export function summarizeClinicalBundle(
  bundle: ClinicalResourceBundleLike,
): ClinicalBundleSummary {
  const views = toClinicalResourceExpandedViews(bundle);
  const counts = new Map<string, number>();
  let xhtmlEntries = 0;
  let notedEntries = 0;

  views.forEach((view) => {
    const resourceType = String(view.common.resourceType || 'Unknown').trim() || 'Unknown';
    counts.set(resourceType, (counts.get(resourceType) || 0) + 1);
    if (String(view.xhtml || '').trim()) {
      xhtmlEntries += 1;
    }
    if (Array.isArray(view.notes) && view.notes.length > 0) {
      notedEntries += 1;
    }
  });

  return {
    totalEntries: views.length,
    resourceTypes: [...counts.entries()]
      .map(([resourceType, count]) => ({ resourceType, count }))
      .sort((left, right) => left.resourceType.localeCompare(right.resourceType)),
    xhtmlEntries,
    notedEntries,
  };
}
