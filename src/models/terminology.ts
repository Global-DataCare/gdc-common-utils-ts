/**
 * One terminology block in the legacy JSON catalog format.
 *
 * `id` is normally the canonical coding-system URI. The compatibility alias
 * `ips` is accepted for the SNOMED IPS catalog used by
 * the predecessor FHIR utility package.
 */
export type TerminologyCatalogResource = Readonly<{
  id: string;
  language?: string;
  attributes: Readonly<Record<string, string>>;
  meta?: Readonly<Record<string, unknown>>;
}>;

/**
 * Loadable local terminology document compatible with the historic
 * `data[].attributes[code] = display` JSON shape.
 */
export type TerminologyCatalogDocument = Readonly<{
  id?: string;
  name?: string;
  language?: string;
  system?: string;
  version?: string;
  jurisdiction?: string;
  data: readonly TerminologyCatalogResource[];
  meta?: Readonly<Record<string, unknown>>;
}>;

/** Input for a synchronous local terminology label lookup. */
export type TerminologyLookupInput = Readonly<{
  system: string;
  code: string;
  language: string;
  jurisdiction?: string;
}>;

/** Input for an offline/local terminology text search. */
export type TerminologySearchInput = Readonly<{
  text: string;
  language: string;
  jurisdiction?: string;
  systems?: readonly string[];
  limit?: number;
}>;

/** One terminology option suitable for a coded clinical form control. */
export type TerminologySearchResult = Readonly<{
  system: string;
  code: string;
  display: string;
  language: string;
}>;

/**
 * Synchronous terminology contract used by cached and offline applications.
 *
 * A future remote terminology client should populate a local implementation
 * of this contract before synchronous clinical-card rendering.
 */
export interface TerminologyProvider {
  lookup(input: TerminologyLookupInput): string | undefined;
  search(input: TerminologySearchInput): readonly TerminologySearchResult[];
}
