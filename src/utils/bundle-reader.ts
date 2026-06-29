import {
  getHighestIssueSeverity,
  isIssueSeverityCode,
  IssueSeverity,
  type IssueSeverityCode,
} from '../models/issue';

export type BundleReaderEntry = Record<string, unknown>;

export type BundleReaderEntrySummary = Readonly<{
  index: number;
  identifier?: string;
  responseStatus?: string;
  issueSeverities: readonly IssueSeverityCode[];
  issueDiagnostics: readonly string[];
  severity?: IssueSeverityCode;
  isSuccessful: boolean;
}>;

export type BundleReaderSeverityBucket = Readonly<{
  entryIndexes: readonly number[];
  identifiers: readonly string[];
  identifierList: string;
}>;

export type BundleReaderResponseAnalysis = Readonly<{
  totalOperations: number;
  successfulOperations: number;
  errorOperations: number;
  hasWarnings: boolean;
  hasErrors: boolean;
  issueDiagnostics: readonly string[];
  severityBuckets: Readonly<{
    fatal: BundleReaderSeverityBucket;
    error: BundleReaderSeverityBucket;
    warning: BundleReaderSeverityBucket;
    information: BundleReaderSeverityBucket;
    success: BundleReaderSeverityBucket;
  }>;
}>;

function cloneEntry<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

/**
 * Returns the canonical claims view for one bundle entry array index.
 *
 * The helper accepts the full bundle-like object plus the entry position to
 * inspect inside `bundle.data[]` or `bundle.entry[]`.
 */
export function getClaimsInBundleEntryAt(bundle: unknown, index: number): Record<string, unknown> {
  const bundleRecord = asRecord(bundle);
  const entries = Array.isArray(bundleRecord.data)
    ? bundleRecord.data
    : (Array.isArray(bundleRecord.entry) ? bundleRecord.entry : []);
  if (!Number.isInteger(index) || index < 0 || index >= entries.length) {
    return {};
  }
  const entryRecord = asRecord(entries[index]);
  const resource = asRecord(entryRecord.resource);
  const resourceMeta = asRecord(resource.meta);
  return asRecord(resourceMeta.claims);
}

/**
 * Returns the merged claims view for the first `data[]` or `entry[]` item in a
 * bundle-like body.
 *
 * Use this for the common "one operation, one returned entry" flows when the
 * caller does not want to manually navigate `body.data[0]`.
 */
export function getClaimsInFirstDataEntry(bundle: unknown): Record<string, unknown> {
  return getClaimsInBundleEntryAt(bundle, 0);
}

/**
 * Runtime-neutral reader for built or received FHIR-like bundles.
 *
 * The reader does not assume one business resource. It only exposes generic
 * bundle navigation, per-entry response inspection, and aggregate counters.
 */
export class BundleReader {
  private readonly bundle: Record<string, unknown>;
  private activeEntryIndex: number | null = null;

  constructor(bundle: Record<string, unknown>) {
    this.bundle = cloneEntry(bundle);
  }

  /** Returns the current bundle resource type when present. */
  public getResourceType(): string | undefined {
    const resourceType = this.bundle.resourceType;
    return typeof resourceType === 'string' && resourceType.trim() ? resourceType.trim() : undefined;
  }

  /** Returns the current FHIR bundle type when present. */
  public getBundleType(): string | undefined {
    const bundleType = this.bundle.type;
    return typeof bundleType === 'string' && bundleType.trim() ? bundleType.trim() : undefined;
  }

  /** Returns cloned bundle entries. */
  public getEntries(): readonly BundleReaderEntry[] {
    const entries = Array.isArray(this.bundle.entry)
      ? this.bundle.entry
      : (Array.isArray(this.bundle.data) ? this.bundle.data : []);
    return entries.map((entry) => cloneEntry(entry as BundleReaderEntry));
  }

  /** Opens one entry by index. */
  public openEntry(index: number): this {
    const entries = this.getEntries();
    if (!Number.isInteger(index) || index < 0 || index >= entries.length) {
      throw new Error(`BundleReader could not open entry index: ${index}`);
    }
    this.activeEntryIndex = index;
    return this;
  }

  /** Returns the resolved identifier for one entry array index when present. */
  public getEntryIdentifierByArrayIndex(index: number): string | undefined {
    const entries = this.getEntries();
    if (!Number.isInteger(index) || index < 0 || index >= entries.length) {
      return undefined;
    }
    return this.resolveEntryIdentifier(entries[index]);
  }

  /** Returns merged claims for one entry array index. */
  public getEntryClaimsByArrayIndex(index: number): Record<string, unknown> {
    return getClaimsInBundleEntryAt(this.bundle, index);
  }

  /** Returns merged claims for the currently opened entry. */
  public getActiveEntryClaims(): Record<string, unknown> {
    if (this.activeEntryIndex === null) {
      throw new Error('BundleReader does not have one active entry. Call openEntry(index) first.');
    }
    return this.getEntryClaimsByArrayIndex(this.activeEntryIndex);
  }

  /** Returns the first entry array index whose resolved identifier matches the requested value. */
  public getEntryIndexByIdentifier(identifier: string): number | undefined {
    const normalizedIdentifier = normalizeOptionalString(identifier);
    if (!normalizedIdentifier) {
      return undefined;
    }

    const entries = this.getEntries();
    for (let index = 0; index < entries.length; index += 1) {
      if (this.resolveEntryIdentifier(entries[index]) === normalizedIdentifier) {
        return index;
      }
    }
    return undefined;
  }

  /** Returns the active entry response status when present. */
  public getEntryResponseStatus(): string | undefined {
    const entry = this.getRequiredActiveEntry();
    const response = entry.response as Record<string, unknown> | undefined;
    const status = response?.status;
    return typeof status === 'string' && status.trim() ? status.trim() : undefined;
  }

  /** Returns all active entry issue severities. */
  public getIssueSeverities(): IssueSeverityCode[] {
    return this.getActiveEntryIssues()
      .map((issue) => issue.severity)
      .filter(isIssueSeverityCode);
  }

  /** Returns all active entry issue diagnostics strings. */
  public getIssueDiagnostics(): string[] {
    return this.getActiveEntryIssues()
      .map((issue) => issue.diagnostics)
      .filter((diagnostics): diagnostics is string => typeof diagnostics === 'string' && diagnostics.trim().length > 0);
  }

  /** Returns the number of bundle entries. */
  public getTotalOperations(): number {
    return this.getEntries().length;
  }

  /** Returns the number of entries with one 2xx response status. */
  public getTotalSuccessfulOperations(): number {
    return this.getEntrySummaries().filter((entry) => entry.isSuccessful).length;
  }

  /** Returns the number of entries without one 2xx response status. */
  public getTotalErrorOperations(): number {
    return this.getTotalOperations() - this.getTotalSuccessfulOperations();
  }

  /** Returns normalized summaries for every bundle entry. */
  public getEntrySummaries(): BundleReaderEntrySummary[] {
    return this.getEntries().map((entry, index) => this.buildEntrySummary(entry, index));
  }

  /** Returns all issue severities across the whole bundle in entry order. */
  public getBundleIssueSeverities(): IssueSeverityCode[] {
    return this.getEntrySummaries().flatMap((entry) => [...entry.issueSeverities]);
  }

  /** Returns all issue diagnostics strings across the whole bundle in entry order. */
  public getBundleIssueDiagnostics(): string[] {
    return this.getEntrySummaries().flatMap((entry) => [...entry.issueDiagnostics]);
  }

  /** Returns `true` when at least one bundle entry contains warning issues. */
  public hasWarnings(): boolean {
    return this.getEntrySummaries().some((entry) => entry.issueSeverities.includes(IssueSeverity.Warning));
  }

  /** Returns `true` when at least one bundle entry contains fatal/error issues. */
  public hasErrors(): boolean {
    return this.getEntrySummaries().some((entry) =>
      entry.issueSeverities.some((severity) =>
        severity === IssueSeverity.Fatal || severity === IssueSeverity.Error));
  }

  /** Returns entries whose issues contain warning/fatal/error severities. */
  public getEntriesWithWarningOrErrorIssues(): BundleReaderEntrySummary[] {
    return this.getEntrySummaries().filter((entry) =>
      entry.issueSeverities.some((severity) =>
        severity === IssueSeverity.Warning
        || severity === IssueSeverity.Error
        || severity === IssueSeverity.Fatal));
  }

  /** Returns one frontend-oriented response analysis for global bundle outcome rendering. */
  public getResponseAnalysis(): BundleReaderResponseAnalysis {
    const summaries = this.getEntrySummaries();
    const severityBuckets = {
      fatal: this.buildSeverityBucket(summaries, [IssueSeverity.Fatal]),
      error: this.buildSeverityBucket(summaries, [IssueSeverity.Error]),
      warning: this.buildSeverityBucket(summaries, [IssueSeverity.Warning]),
      information: this.buildSeverityBucket(summaries, [IssueSeverity.Information]),
      success: this.buildSeverityBucket(summaries, [IssueSeverity.Success]),
    } as const;

    return {
      totalOperations: this.getTotalOperations(),
      successfulOperations: this.getTotalSuccessfulOperations(),
      errorOperations: this.getTotalErrorOperations(),
      hasWarnings: summaries.some((entry) => entry.issueSeverities.includes(IssueSeverity.Warning)),
      hasErrors: summaries.some((entry) =>
        entry.issueSeverities.some((severity) =>
          severity === IssueSeverity.Fatal || severity === IssueSeverity.Error)),
      issueDiagnostics: summaries.flatMap((entry) => [...entry.issueDiagnostics]),
      severityBuckets,
    };
  }

  private getRequiredActiveEntry(): BundleReaderEntry {
    if (this.activeEntryIndex === null) {
      throw new Error('BundleReader requires one active entry. Call openEntry(...) first.');
    }
    const entries = this.getEntries();
    return entries[this.activeEntryIndex];
  }

  private getActiveEntryIssues(): Array<Record<string, unknown>> {
    const entry = this.getRequiredActiveEntry();
    return this.getEntryIssues(entry);
  }

  private getEntryIssues(entry: BundleReaderEntry): Array<Record<string, unknown>> {
    const response = entry.response as Record<string, unknown> | undefined;
    const outcome = response?.outcome as Record<string, unknown> | undefined;
    const issue = outcome?.issue;
    return Array.isArray(issue) ? issue.filter((value): value is Record<string, unknown> => !!value && typeof value === 'object') : [];
  }

  private buildEntrySummary(entry: BundleReaderEntry, index: number): BundleReaderEntrySummary {
    const response = entry.response as Record<string, unknown> | undefined;
    const responseStatus = typeof response?.status === 'string' && response.status.trim()
      ? response.status.trim()
      : undefined;
    const issues = this.getEntryIssues(entry);
    const issueSeverities = issues
      .map((issue) => issue.severity)
      .filter(isIssueSeverityCode);
    const issueDiagnostics = issues
      .map((issue) => issue.diagnostics)
      .filter((diagnostics): diagnostics is string =>
        typeof diagnostics === 'string' && diagnostics.trim().length > 0);
    const is2xxResponse = typeof responseStatus === 'string' && /^2\d\d$/.test(responseStatus);
    const hasBlockingSeverity = issueSeverities.some((severity) =>
      severity === IssueSeverity.Warning
      || severity === IssueSeverity.Error
      || severity === IssueSeverity.Fatal);
    const severity = getHighestIssueSeverity(issueSeverities)
      ?? (is2xxResponse ? IssueSeverity.Success : undefined);

    return {
      index,
      ...(this.resolveEntryIdentifier(entry) ? { identifier: this.resolveEntryIdentifier(entry) } : {}),
      ...(responseStatus ? { responseStatus } : {}),
      issueSeverities,
      issueDiagnostics,
      ...(severity ? { severity } : {}),
      isSuccessful: is2xxResponse && !hasBlockingSeverity,
    };
  }

  private buildSeverityBucket(
    summaries: readonly BundleReaderEntrySummary[],
    severities: readonly IssueSeverityCode[],
  ): BundleReaderSeverityBucket {
    const matches = summaries.filter((entry) =>
      typeof entry.severity === 'string' && severities.includes(entry.severity));
    const identifiers = matches
      .map((entry) => entry.identifier)
      .filter((identifier): identifier is string => typeof identifier === 'string' && identifier.trim().length > 0);
    return {
      entryIndexes: matches.map((entry) => entry.index),
      identifiers,
      identifierList: identifiers.join(','),
    };
  }

  private resolveEntryIdentifier(entry: BundleReaderEntry): string | undefined {
    const explicitEntryId = normalizeOptionalString(entry.id);
    if (explicitEntryId) {
      return explicitEntryId;
    }

    const resource = entry.resource as Record<string, unknown> | undefined;
    const resourceId = normalizeOptionalString(resource?.id);
    if (resourceId) {
      return resourceId;
    }

    const fullUrl = normalizeOptionalString(entry.fullUrl);
    if (fullUrl) {
      return fullUrl;
    }

    const claims = (resource?.meta as Record<string, unknown> | undefined)?.claims as Record<string, unknown> | undefined;
    if (!claims) {
      return undefined;
    }

    const identifierKey = Object.keys(claims)
      .find((key) => String(key || '').toLowerCase().endsWith('.identifier'));
    return identifierKey ? normalizeOptionalString(claims[identifierKey]) : undefined;
  }
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function unwrapBundleLikeResponseBody(input: unknown): Record<string, unknown> {
  const body = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const nested = body.body && typeof body.body === 'object' ? body.body as Record<string, unknown> : undefined;
  const candidate = nested && (Array.isArray(nested.data) || Array.isArray(nested.entry))
    ? nested
    : body;
  return candidate && typeof candidate === 'object' ? candidate : {};
}

export function readFirstBundleResourceFromResponseBody(input: unknown): Record<string, unknown> | undefined {
  const reader = new BundleReader(unwrapBundleLikeResponseBody(input));
  const first = reader.getEntries()[0] as Record<string, unknown> | undefined;
  const resource = first?.resource;
  return resource && typeof resource === 'object' ? resource as Record<string, unknown> : undefined;
}
