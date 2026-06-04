import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import {
  EmployeeBatchEntryTypes,
  buildEmployeeBatchBundle,
  buildEmployeeBatchEntry,
  buildEmployeeClaims,
  buildEmployeePurgeBundle,
  buildEmployeeSearchBundle,
  EmployeeClaims,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeSearchValue,
} from './employee';

export type BundleOperation =
  (typeof EmployeeBundleOperations)[keyof typeof EmployeeBundleOperations];

export type BuiltEmployeeBatchEntry = ReturnType<typeof buildEmployeeBatchEntry> & {
  fullUrl?: string;
};

function cloneEntry(entry: BuiltEmployeeBatchEntry): BuiltEmployeeBatchEntry {
  return JSON.parse(JSON.stringify(entry)) as BuiltEmployeeBatchEntry;
}

function cloneClaimValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }
  return value;
}

function normalizeOptionalIdentifier(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  return normalized ? normalized : undefined;
}

function createEmployeeIdentifierUrn(): string {
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  const uuid = typeof cryptoLike.crypto?.randomUUID === 'function'
    ? cryptoLike.crypto.randomUUID()
    : `employee-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `urn:uuid:${uuid}`;
}

function resolveRequestMethodForOperation(operation: BundleOperation): 'POST' | 'DELETE' {
  switch (operation) {
    case EmployeeBundleOperations.disable:
      return EmployeeBundleMethods.disable;
    case EmployeeBundleOperations.create:
    case EmployeeBundleOperations.purge:
    case EmployeeBundleOperations.search:
    default:
      return EmployeeBundleMethods.create;
  }
}

function resolveEntryTypeForOperation(operation: BundleOperation): string {
  switch (operation) {
    case EmployeeBundleOperations.disable:
      return EmployeeBatchEntryTypes.disable;
    case EmployeeBundleOperations.purge:
      return EmployeeBatchEntryTypes.purge;
    case EmployeeBundleOperations.search:
      return EmployeeBatchEntryTypes.search;
    case EmployeeBundleOperations.create:
    default:
      return EmployeeBatchEntryTypes.create;
  }
}

/**
 * Generic bundle editor with an employee adapter surface.
 *
 * Current scope:
 * - one declared business operation per bundle
 * - active-entry editing through generic claim helpers
 * - employee convenience setters layered on the same active entry
 *
 * This editor lives in `common-utils` because it is runtime-neutral and can be
 * consumed by frontend SDKs, backend SDKs, and backend services.
 */
export class BundleEditor {
  private bundleOperation: BundleOperation | null = null;
  private readonly entries: BuiltEmployeeBatchEntry[] = [];
  private activeEntryIndex: number | null = null;

  /** Declares which business operation the bundle is assembling. */
  public setBundleOperation(operation: BundleOperation): this {
    this.bundleOperation = operation;
    return this;
  }

  /** Returns the operation currently assigned to this bundle. */
  public getBundleOperation(): BundleOperation | null {
    return this.bundleOperation;
  }

  /**
   * Opens one new active entry.
   *
   * If the current bundle operation needs an identifier and none is supplied,
   * a canonical `urn:uuid:*` identifier is generated and aligned across
   * `fullUrl`, `resource.id`, and `org.schema.Person.identifier`.
   */
  public newEntry(resourceId?: string): this {
    const operation = this.requireBundleOperation();
    const normalizedIdentifier = operation === EmployeeBundleOperations.search
      ? normalizeOptionalIdentifier(resourceId)
      : (normalizeOptionalIdentifier(resourceId) || createEmployeeIdentifierUrn());
    const claims = normalizedIdentifier
      ? buildEmployeeClaims({ identifier: normalizedIdentifier })
      : buildEmployeeClaims({});

    const entry = buildEmployeeBatchEntry({
      type: resolveEntryTypeForOperation(operation),
      method: resolveRequestMethodForOperation(operation),
      resourceId: normalizedIdentifier,
      claims,
    }) as BuiltEmployeeBatchEntry;

    if (normalizedIdentifier) {
      entry.fullUrl = normalizedIdentifier;
    }

    this.entries.push(entry);
    this.activeEntryIndex = this.entries.length - 1;
    return this;
  }

  /** Reopens an existing entry by identifier or `fullUrl`. */
  public openEntry(resourceId: string): this {
    const normalizedIdentifier = normalizeOptionalIdentifier(resourceId);
    if (!normalizedIdentifier) {
      throw new Error('openEntry requires a non-empty resource identifier.');
    }

    const nextIndex = this.entries.findIndex((entry) => {
      const claims = entry.resource?.meta?.claims || {};
      return normalizeOptionalIdentifier(entry.resource?.id) === normalizedIdentifier
        || normalizeOptionalIdentifier(entry.fullUrl) === normalizedIdentifier
        || normalizeOptionalIdentifier(claims[ClaimsPersonSchemaorg.identifier]) === normalizedIdentifier;
    });

    if (nextIndex < 0) {
      throw new Error(`openEntry could not find resource identifier: ${normalizedIdentifier}`);
    }

    this.activeEntryIndex = nextIndex;
    return this;
  }

  /** Closes the current active entry while preserving it inside the bundle draft. */
  public doneEntry(): this {
    this.activeEntryIndex = null;
    return this;
  }

  /** Returns a cloned snapshot of the currently staged entries. */
  public getEntries(): readonly BuiltEmployeeBatchEntry[] {
    return this.entries.map((entry) => cloneEntry(entry));
  }

  /**
   * Builds the final bundle payload for the declared operation.
   *
   * `search` returns one canonical search bundle.
   * `purge` returns a batch bundle whose entries are routed later to
   * `Employee/_purge`.
   * `create` and `disable` return canonical batch bundles.
   */
  public build():
    | ReturnType<typeof buildEmployeeBatchBundle>
    | ReturnType<typeof buildEmployeeSearchBundle> {
    const operation = this.requireBundleOperation();
    if (operation === EmployeeBundleOperations.search) {
      const claims = this.getActiveOrSingleSearchClaims();
      return buildEmployeeSearchBundle({ claims });
    }

    if (operation === EmployeeBundleOperations.purge) {
      return {
        resourceType: 'Bundle' as const,
        type: 'batch' as const,
        entry: this.entries.map((entry) => {
          const identifier = normalizeOptionalIdentifier(entry.resource?.meta?.claims?.[ClaimsPersonSchemaorg.identifier]);
          if (!identifier) {
            throw new Error('Every purge entry requires org.schema.Person.identifier.');
          }
          return buildEmployeePurgeBundle({ identifier }).entry[0];
        }),
      };
    }

    return {
      resourceType: 'Bundle' as const,
      type: 'batch' as const,
      entry: this.entries.map((entry) => cloneEntry(entry)),
    };
  }

  /** Reads one claim from the active entry. */
  public getClaim(key: string): unknown {
    return cloneClaimValue(this.getActiveEntryClaims()[String(key).trim()]);
  }

  /** Checks whether the active entry contains one claim key. */
  public hasClaim(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.getActiveEntryClaims(), String(key).trim());
  }

  /** Writes one claim on the active entry. */
  public setClaim(key: string, value: unknown): this {
    const entry = this.getRequiredActiveEntry();
    entry.resource = entry.resource || { resourceType: 'Employee', meta: { claims: {} } };
    entry.resource.meta = entry.resource.meta || {};
    entry.resource.meta.claims = {
      ...(entry.resource.meta.claims || {}),
      [String(key).trim()]: cloneClaimValue(value),
    };
    return this;
  }

  /** Appends one claim value on the active entry. */
  public addClaim(key: string, value: unknown): this {
    const normalizedKey = String(key).trim();
    const current = this.getClaim(normalizedKey);
    if (current === undefined) {
      return this.setClaim(normalizedKey, value);
    }
    if (Array.isArray(current)) {
      return this.setClaim(normalizedKey, [...current, cloneClaimValue(value)]);
    }
    return this.setClaim(normalizedKey, [current, cloneClaimValue(value)]);
  }

  /** Removes one claim from the active entry. */
  public removeClaim(key: string): this {
    const entry = this.getRequiredActiveEntry();
    const claims = {
      ...(entry.resource?.meta?.claims || {}),
    };
    delete claims[String(key).trim()];
    entry.resource = entry.resource || { resourceType: 'Employee', meta: { claims: {} } };
    entry.resource.meta = entry.resource.meta || {};
    entry.resource.meta.claims = claims;
    return this;
  }

  /**
   * Sets the active entry identifier.
   *
   * When informed, the value is synchronized into `fullUrl`, `resource.id`,
   * and the canonical identifier claim.
   * Empty values remove the identifier from all three places.
   */
  public setIdentifier(identifier?: string | null): this {
    const normalized = normalizeOptionalIdentifier(identifier);
    const entry = this.getRequiredActiveEntry();
    if (!normalized) {
      this.removeClaim(ClaimsPersonSchemaorg.identifier);
      delete entry.resource?.id;
      delete entry.fullUrl;
      return this;
    }
    this.setClaim(ClaimsPersonSchemaorg.identifier, normalized);
    entry.resource = entry.resource || { resourceType: 'Employee', meta: { claims: {} } };
    entry.resource.id = normalized;
    entry.fullUrl = normalized;
    return this;
  }

  /** Reads the active entry identifier from claims, resource id, or fullUrl. */
  public getIdentifier(): string | undefined {
    const entry = this.getRequiredActiveEntry();
    return normalizeOptionalIdentifier(
      entry.resource?.meta?.claims?.[ClaimsPersonSchemaorg.identifier]
      || entry.resource?.id
      || entry.fullUrl,
    );
  }

  /** Ensures the active entry carries one canonical identifier. */
  public ensureIdentifier(): string {
    const existing = this.getIdentifier();
    if (existing) {
      return existing;
    }
    const generated = createEmployeeIdentifierUrn();
    this.setIdentifier(generated);
    return generated;
  }

  /** Sets the active entry `fullUrl` explicitly. */
  public setFullUrl(fullUrl?: string | null): this {
    const entry = this.getRequiredActiveEntry();
    const normalized = normalizeOptionalIdentifier(fullUrl);
    if (!normalized) {
      delete entry.fullUrl;
      return this;
    }
    entry.fullUrl = normalized;
    return this;
  }

  /** Returns the active entry `fullUrl` when present. */
  public getFullUrl(): string | undefined {
    return normalizeOptionalIdentifier(this.getRequiredActiveEntry().fullUrl);
  }

  /** Convenience employee setter for email. */
  public setEmail(email: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.email, String(email).trim());
  }

  /** Convenience employee setter for occupational role. */
  public setRole(role: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.hasOccupationalRoleValue, String(role).trim());
  }

  /** Convenience employee setter for `worksFor`. */
  public setWorksFor(worksFor: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.worksFor, String(worksFor).trim());
  }

  /** Convenience employee setter for `memberOf`. */
  public setMemberOf(memberOf: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.memberOf, String(memberOf).trim());
  }

  /** Convenience employee setter for `memberOf.taxID`. */
  public setMemberOfOrgTaxId(taxId: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.memberOfOrgTaxId, String(taxId).trim());
  }

  private requireBundleOperation(): BundleOperation {
    if (!this.bundleOperation) {
      throw new Error('BundleEditor requires setBundleOperation(...) before newEntry() or build().');
    }
    return this.bundleOperation;
  }

  private getRequiredActiveEntry(): BuiltEmployeeBatchEntry {
    if (this.activeEntryIndex === null) {
      throw new Error('BundleEditor requires one active entry. Call newEntry(...) or openEntry(...) first.');
    }
    return this.entries[this.activeEntryIndex];
  }

  private getActiveEntryClaims(): EmployeeClaims {
    return {
      ...(this.getRequiredActiveEntry().resource?.meta?.claims || {}),
    };
  }

  private getActiveOrSingleSearchClaims(): Record<string, EmployeeSearchValue | undefined> {
    if (this.entries.length === 0) {
      return {};
    }
    if (this.entries.length > 1) {
      throw new Error('Search bundles currently support one search entry per bundle.');
    }
    const claims = this.entries[0].resource?.meta?.claims || {};
    const searchClaims: Record<string, EmployeeSearchValue | undefined> = {};
    for (const [key, value] of Object.entries(claims)) {
      if (
        value === undefined
        || value === null
        || typeof value === 'string'
        || typeof value === 'number'
        || typeof value === 'boolean'
      ) {
        searchClaims[key] = value as EmployeeSearchValue | undefined;
      }
    }
    return searchClaims;
  }
}
