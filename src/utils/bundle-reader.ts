export type BundleReaderEntry = Record<string, unknown>;

function cloneEntry<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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
    const entries = this.bundle.entry;
    return Array.isArray(entries) ? entries.map((entry) => cloneEntry(entry as BundleReaderEntry)) : [];
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

  /** Returns the active entry response status when present. */
  public getEntryResponseStatus(): string | undefined {
    const entry = this.getRequiredActiveEntry();
    const response = entry.response as Record<string, unknown> | undefined;
    const status = response?.status;
    return typeof status === 'string' && status.trim() ? status.trim() : undefined;
  }

  /** Returns all active entry issue severities. */
  public getIssueSeverities(): string[] {
    return this.getActiveEntryIssues()
      .map((issue) => issue.severity)
      .filter((severity): severity is string => typeof severity === 'string' && severity.trim().length > 0);
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
    return this.getEntries().filter((entry) => {
      const response = entry.response as Record<string, unknown> | undefined;
      return typeof response?.status === 'string' && /^2\d\d$/.test(response.status);
    }).length;
  }

  /** Returns the number of entries without one 2xx response status. */
  public getTotalErrorOperations(): number {
    return this.getTotalOperations() - this.getTotalSuccessfulOperations();
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
    const response = entry.response as Record<string, unknown> | undefined;
    const outcome = response?.outcome as Record<string, unknown> | undefined;
    const issue = outcome?.issue;
    return Array.isArray(issue) ? issue.filter((value): value is Record<string, unknown> => !!value && typeof value === 'object') : [];
  }
}
