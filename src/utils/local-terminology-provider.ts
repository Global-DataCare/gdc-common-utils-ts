import type {
  TerminologyCatalogDocument,
  TerminologyLookupInput,
  TerminologyProvider,
  TerminologySearchInput,
  TerminologySearchResult,
} from '../models/terminology.js';
import type {
  ClinicalTerminologyTranslationInput,
} from './clinical-resource-view.js';

const SNOMED_SYSTEM = 'http://snomed.info/sct';
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type IndexedTerm = TerminologySearchResult & Readonly<{
  jurisdiction?: string;
}>;

function normalizedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSystem(value: unknown): string {
  const system = normalizedString(value);
  return system.toLowerCase() === 'ips' ? SNOMED_SYSTEM : system;
}

function normalizeLanguage(value: unknown): string {
  return normalizedString(value).replace(/_/g, '-').toLowerCase();
}

function normalizeJurisdiction(value: unknown): string {
  return normalizedString(value).toUpperCase();
}

function languageCandidates(language: string): string[] {
  const normalized = normalizeLanguage(language);
  const base = normalized.split('-')[0];
  return [...new Set([normalized, base, DEFAULT_LANGUAGE].filter(Boolean))];
}

function searchableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
}

function normalizedLimit(value: number | undefined): number {
  if (!Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, Math.trunc(value as number)));
}

/**
 * In-memory terminology provider compatible with the historic JSON
 * catalogs. It performs no network requests and keeps catalog loading under
 * application control.
 */
export class LocalTerminologyProvider implements TerminologyProvider {
  private readonly terms: readonly IndexedTerm[];
  private readonly byIdentity: ReadonlyMap<string, string>;
  private readonly byScopedIdentity: ReadonlyMap<string, string>;

  public constructor(catalogs: readonly TerminologyCatalogDocument[]) {
    const terms: IndexedTerm[] = [];
    const byIdentity = new Map<string, string>();
    const byScopedIdentity = new Map<string, string>();

    for (const catalog of catalogs) {
      const catalogLanguage = normalizeLanguage(catalog.language) || DEFAULT_LANGUAGE;
      const jurisdiction = normalizeJurisdiction(catalog.jurisdiction) || undefined;
      for (const resource of catalog.data || []) {
        const system = normalizeSystem(resource.id || catalog.system);
        const language = normalizeLanguage(resource.language) || catalogLanguage;
        if (!system || !language || !resource.attributes) continue;

        for (const [rawCode, rawDisplay] of Object.entries(resource.attributes)) {
          const code = normalizedString(rawCode);
          const display = normalizedString(rawDisplay);
          if (!code || !display) continue;
          const term = { system, code, display, language, jurisdiction };
          terms.push(term);
          byIdentity.set(this.identityKey(language, system, code), display);
          byScopedIdentity.set(
            this.scopedIdentityKey(language, jurisdiction, system, code),
            display,
          );
        }
      }
    }

    this.terms = terms;
    this.byIdentity = byIdentity;
    this.byScopedIdentity = byScopedIdentity;
  }

  /** Returns the best local label for one canonical coding identity. */
  public lookup(input: TerminologyLookupInput): string | undefined {
    const system = normalizeSystem(input.system);
    const code = normalizedString(input.code);
    const jurisdiction = normalizeJurisdiction(input.jurisdiction) || undefined;
    if (!system || !code) return undefined;

    for (const language of languageCandidates(input.language)) {
      if (jurisdiction) {
        const scopedDisplay = this.byScopedIdentity.get(
          this.scopedIdentityKey(language, jurisdiction, system, code),
        ) || this.byScopedIdentity.get(
          this.scopedIdentityKey(language, undefined, system, code),
        );
        if (scopedDisplay) return scopedDisplay;
        continue;
      }
      const display = this.byIdentity.get(this.identityKey(language, system, code));
      if (display) return display;
    }
    return undefined;
  }

  /**
   * Searches local labels and codes, optionally constrained to coding systems.
   * Results are deterministic and contain at most 100 entries.
   */
  public search(input: TerminologySearchInput): readonly TerminologySearchResult[] {
    const query = searchableText(normalizedString(input.text));
    if (!query) return [];

    const allowedSystems = new Set(
      (input.systems || []).map(normalizeSystem).filter(Boolean),
    );
    const jurisdiction = normalizeJurisdiction(input.jurisdiction);
    const languages = languageCandidates(input.language);
    const languageRank = new Map(languages.map((language, index) => [language, index]));
    const selected = new Map<string, { term: IndexedTerm; rank: number }>();

    for (const term of this.terms) {
      if (allowedSystems.size > 0 && !allowedSystems.has(term.system)) continue;
      if (jurisdiction && term.jurisdiction && term.jurisdiction !== jurisdiction) continue;
      const rank = languageRank.get(term.language);
      if (rank === undefined) continue;
      if (
        !searchableText(term.code).includes(query)
        && !searchableText(term.display).includes(query)
      ) {
        continue;
      }

      const identity = `${term.system}\u0000${term.code}`;
      const current = selected.get(identity);
      if (!current || rank < current.rank) selected.set(identity, { term, rank });
    }

    return [...selected.values()]
      .sort((left, right) => (
        left.rank - right.rank
        || left.term.display.localeCompare(right.term.display)
        || left.term.code.localeCompare(right.term.code)
      ))
      .slice(0, normalizedLimit(input.limit))
      .map(({ term }) => ({
        system: term.system,
        code: term.code,
        display: term.display,
        language: term.language,
      }));
  }

  private identityKey(language: string, system: string, code: string): string {
    return `${language}\u0000${system}\u0000${code}`;
  }

  private scopedIdentityKey(
    language: string,
    jurisdiction: string | undefined,
    system: string,
    code: string,
  ): string {
    return `${language}\u0000${jurisdiction || ''}\u0000${system}\u0000${code}`;
  }
}

/**
 * Adapts a synchronous local terminology provider to
 * `ClinicalResourceDisplayOptions.translateCode`.
 */
export function createClinicalCodeTranslator(
  provider: Pick<TerminologyProvider, 'lookup'>,
): (input: ClinicalTerminologyTranslationInput) => string | undefined {
  return (input) => {
    if (!input.system) return undefined;
    return provider.lookup({
      system: input.system,
      code: input.code,
      language: input.locale,
    });
  };
}
