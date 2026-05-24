// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Normalizes either FHIR Bundle (entry[]) or JSON:API bundle (data[])
 * into an array of resources.
 *
 * @param bundle FHIR bundle, JSON:API bundle, or single resource.
 */
export function extractResources(bundle: any): any[] {
  if (!bundle) return [];
  if (Array.isArray(bundle.entry)) {
    return bundle.entry
      .map((e: any) => e && (e.resource || e))
      .filter(Boolean);
  }
  if (Array.isArray(bundle.data)) {
    return bundle.data
      .map((d: any) => d && (d.resource || d))
      .filter(Boolean);
  }
  if (bundle.resourceType) return [bundle];
  return [];
}

/**
 * Returns the next-page link from either FHIR `link[]` or JSON:API `links.next`.
 *
 * @param bundle FHIR bundle or JSON:API bundle.
 */
export function getNextLink(bundle: any): string | null {
  if (Array.isArray(bundle?.link)) {
    const next = bundle.link.find((l: any) => l.relation === 'next');
    if (next?.url) return next.url;
  }
  if (bundle?.links?.next) return bundle.links.next;
  return null;
}
