/**
 * Canonical FHIR version labels shared across GW and SDK packages.
 *
 * Use these constants instead of inline strings such as `"4.0"` or `"5.0"`.
 */
export const FhirVersions = Object.freeze({
  R4: '4.0',
  R401: '4.0.1',
  R5: '5.0',
} as const);
