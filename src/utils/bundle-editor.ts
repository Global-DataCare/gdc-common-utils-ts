import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import {
  buildEmployeeBatchEntry,
  buildEmployeePurgeBundle,
  buildEmployeeSearchBundle,
  EmployeeBatchEntryTypes,
  EmployeeBatchMethod,
  EmployeeBundleMethods,
  EmployeeBundleOperations,
  EmployeeClaims,
  EmployeeResourceTypes,
  EmployeeSearchValue,
} from './employee';

export type BundleOperation =
  (typeof EmployeeBundleOperations)[keyof typeof EmployeeBundleOperations];

export type AllowedResourceType =
  (typeof EmployeeResourceTypes)[keyof typeof EmployeeResourceTypes];

export type BuiltBundleEntry = ReturnType<typeof buildEmployeeBatchEntry> & {
  fullUrl?: string;
};

function cloneEntry<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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

function createCanonicalIdentifierUrn(): string {
  const cryptoLike = globalThis as typeof globalThis & {
    crypto?: { randomUUID?: () => string };
  };
  const uuid = typeof cryptoLike.crypto?.randomUUID === 'function'
    ? cryptoLike.crypto.randomUUID()
    : `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `urn:uuid:${uuid}`;
}

function resolveRequestMethodForOperation(operation: BundleOperation): EmployeeBatchMethod {
  switch (operation) {
    case EmployeeBundleOperations.disable:
      return EmployeeBundleMethods.disable;
    case EmployeeBundleOperations.search:
    case EmployeeBundleOperations.create:
    case EmployeeBundleOperations.purge:
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
 * Generic bundle editor for FHIR-like bundle payloads assembled in memory.
 *
 * This class owns bundle-level concerns:
 * - which business operation the bundle represents
 * - which resource type the bundle allows
 * - which entries belong to the bundle
 * - when the final bundle is materialized through `build()`
 *
 * Resource-specific semantics belong to resource entry editors such as
 * `EmployeeEntryEditor`.
 */
export class BundleEditor {
  private bundleOperation: BundleOperation | null = null;
  private allowedResourceType: AllowedResourceType | null = null;
  private readonly entries: BuiltBundleEntry[] = [];

  /** Declares which business operation this bundle is staging. */
  public setBundleOperation(operation: BundleOperation): this {
    this.bundleOperation = operation;
    return this;
  }

  /** Returns the current business operation assigned to the bundle. */
  public getBundleOperation(): BundleOperation | null {
    return this.bundleOperation;
  }

  /**
   * Restricts the bundle to one resource type.
   *
   * For employee batch bundles this should be fixed to
   * `EmployeeResourceTypes.employee` so the editor cannot mix unrelated
   * resource kinds.
   */
  public setAllowedResourceType(resourceType: AllowedResourceType): this {
    this.allowedResourceType = resourceType;
    return this;
  }

  /** Returns the bundle resource type restriction when already declared. */
  public getAllowedResourceType(): AllowedResourceType | null {
    return this.allowedResourceType;
  }

  /**
   * Opens one new entry and returns a generic entry editor for that slot.
   *
   * The entry editor can later expose resource-specific semantics through
   * methods such as `asEmployee()`.
   */
  public newEntry(resourceId?: string): BundleEntryEditor {
    const operation = this.requireBundleOperation();
    const resourceType = this.requireAllowedResourceType();
    const entry = this.createEntryDraft(operation, resourceType, resourceId);
    this.entries.push(entry);
    return new BundleEntryEditor(this, this.entries.length - 1);
  }

  /** Reopens one existing entry by `resource.id` or `fullUrl`. */
  public openEntry(resourceIdOrFullUrl: string): BundleEntryEditor {
    const normalizedIdentifier = normalizeOptionalIdentifier(resourceIdOrFullUrl);
    if (!normalizedIdentifier) {
      throw new Error('openEntry requires a non-empty resource identifier or fullUrl.');
    }

    const entryIndex = this.entries.findIndex((entry) => {
      return normalizeOptionalIdentifier(entry.resource?.id) === normalizedIdentifier
        || normalizeOptionalIdentifier(entry.fullUrl) === normalizedIdentifier;
    });

    if (entryIndex < 0) {
      throw new Error(`openEntry could not find resource identifier or fullUrl: ${normalizedIdentifier}`);
    }

    return new BundleEntryEditor(this, entryIndex);
  }

  /** Returns cloned staged entries for inspection or debugging. */
  public getEntries(): readonly BuiltBundleEntry[] {
    return this.entries.map((entry) => cloneEntry(entry));
  }

  /**
   * Materializes the final bundle payload from the editor state.
   *
   * `build()` does not send, sign, or wrap the payload. It only returns the
   * final bundle object for the declared operation and staged entries.
   */
  public build():
    | ReturnType<typeof buildEmployeePurgeBundle>
    | ReturnType<typeof buildEmployeeSearchBundle> {
    const operation = this.requireBundleOperation();
    const resourceType = this.requireAllowedResourceType();

    if (resourceType !== EmployeeResourceTypes.employee) {
      throw new Error(`BundleEditor does not yet support build() for resource type: ${resourceType}`);
    }

    if (operation === EmployeeBundleOperations.search) {
      return buildEmployeeSearchBundle({
        claims: this.getSingleSearchClaims(),
        resourceType,
      });
    }

    if (operation === EmployeeBundleOperations.purge) {
      return {
        resourceType: EmployeeResourceTypes.bundle,
        type: EmployeeResourceTypes.batch,
        entry: this.entries.map((entry) => {
          const identifier = normalizeOptionalIdentifier(
            entry.resource?.meta?.claims?.[ClaimsPersonSchemaorg.identifier]
              || entry.resource?.id
              || entry.fullUrl,
          );
          if (!identifier) {
            throw new Error('Every purge entry requires one canonical employee identifier.');
          }
          return buildEmployeePurgeBundle({
            identifier,
            resourceType,
          }).entry[0];
        }),
      };
    }

    return {
      resourceType: EmployeeResourceTypes.bundle,
      type: EmployeeResourceTypes.batch,
      entry: this.entries.map((entry) => cloneEntry(entry)),
    };
  }

  /** @internal */
  public getMutableEntry(entryIndex: number): BuiltBundleEntry {
    if (!Number.isInteger(entryIndex) || entryIndex < 0 || entryIndex >= this.entries.length) {
      throw new Error(`BundleEditor could not open entry index: ${entryIndex}`);
    }
    return this.entries[entryIndex];
  }

  private createEntryDraft(
    operation: BundleOperation,
    resourceType: AllowedResourceType,
    resourceId?: string,
  ): BuiltBundleEntry {
    if (resourceType !== EmployeeResourceTypes.employee) {
      throw new Error(`BundleEditor does not yet support newEntry() for resource type: ${resourceType}`);
    }

    const normalizedIdentifier = operation === EmployeeBundleOperations.search
      ? normalizeOptionalIdentifier(resourceId)
      : (normalizeOptionalIdentifier(resourceId) || createCanonicalIdentifierUrn());
    const claims: EmployeeClaims = {
      '@context': 'org.schema',
      ...(normalizedIdentifier ? { [ClaimsPersonSchemaorg.identifier]: normalizedIdentifier } : {}),
    };

    const entry = buildEmployeeBatchEntry({
      type: resolveEntryTypeForOperation(operation),
      method: resolveRequestMethodForOperation(operation),
      resourceId: normalizedIdentifier,
      resourceType,
      claims,
    }) as BuiltBundleEntry;

    if (normalizedIdentifier) {
      entry.fullUrl = normalizedIdentifier;
    }

    return entry;
  }

  private getSingleSearchClaims(): Record<string, EmployeeSearchValue | undefined> {
    if (this.entries.length === 0) {
      return {};
    }

    if (this.entries.length > 1) {
      throw new Error('Search bundles currently support one entry per bundle.');
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

  private requireBundleOperation(): BundleOperation {
    if (!this.bundleOperation) {
      throw new Error('BundleEditor requires setBundleOperation(...) before newEntry() or build().');
    }
    return this.bundleOperation;
  }

  private requireAllowedResourceType(): AllowedResourceType {
    if (!this.allowedResourceType) {
      throw new Error('BundleEditor requires setAllowedResourceType(...) before newEntry() or build().');
    }
    return this.allowedResourceType;
  }
}

/**
 * Generic editor for one staged bundle entry.
 *
 * This class only knows generic entry concerns such as:
 * - resource id
 * - fullUrl
 * - meta claims
 * - conversion to one resource-specific entry editor
 */
export class BundleEntryEditor {
  constructor(
    protected readonly bundleEditor: BundleEditor,
    protected readonly entryIndex: number,
  ) {}

  /** Opens the current entry as one employee-specific resource editor. */
  public asEmployee(): EmployeeEntryEditor {
    const entry = this.getMutableEntry();
    if (entry.resource?.resourceType !== EmployeeResourceTypes.employee) {
      throw new Error(`BundleEntryEditor cannot open this entry as Employee: ${String(entry.resource?.resourceType || '')}`);
    }
    return new EmployeeEntryEditor(this.bundleEditor, this.entryIndex);
  }

  /** Reads one claim from this entry. */
  public getClaim(key: string): unknown {
    return cloneClaimValue(this.getClaims()[String(key).trim()]);
  }

  /** Checks whether this entry contains one claim key. */
  public hasClaim(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.getClaims(), String(key).trim());
  }

  /** Writes one claim on this entry. */
  public setClaim(key: string, value: unknown): this {
    const entry = this.getMutableEntry();
    entry.resource = entry.resource || {
      resourceType: this.bundleEditor.getAllowedResourceType() || EmployeeResourceTypes.employee,
      meta: { claims: {} },
    };
    entry.resource.meta = entry.resource.meta || {};
    entry.resource.meta.claims = {
      ...(entry.resource.meta.claims || {}),
      [String(key).trim()]: cloneClaimValue(value),
    };
    return this;
  }

  /** Appends one claim value on this entry. */
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

  /** Removes one claim from this entry. */
  public removeClaim(key: string): this {
    const entry = this.getMutableEntry();
    const claims = {
      ...(entry.resource?.meta?.claims || {}),
    };
    delete claims[String(key).trim()];
    entry.resource = entry.resource || {
      resourceType: this.bundleEditor.getAllowedResourceType() || EmployeeResourceTypes.employee,
      meta: { claims: {} },
    };
    entry.resource.meta = entry.resource.meta || {};
    entry.resource.meta.claims = claims;
    return this;
  }

  /** Writes the staged entry `resource.id`. */
  public setResourceId(resourceId?: string | null): this {
    const entry = this.getMutableEntry();
    const normalized = normalizeOptionalIdentifier(resourceId);
    if (!normalized) {
      delete entry.resource?.id;
      return this;
    }
    entry.resource = entry.resource || {
      resourceType: this.bundleEditor.getAllowedResourceType() || EmployeeResourceTypes.employee,
      meta: { claims: {} },
    };
    entry.resource.id = normalized;
    return this;
  }

  /** Reads the staged entry `resource.id` when present. */
  public getResourceId(): string | undefined {
    return normalizeOptionalIdentifier(this.getMutableEntry().resource?.id);
  }

  /** Writes the staged entry `fullUrl`. */
  public setFullUrl(fullUrl?: string | null): this {
    const entry = this.getMutableEntry();
    const normalized = normalizeOptionalIdentifier(fullUrl);
    if (!normalized) {
      delete entry.fullUrl;
      return this;
    }
    entry.fullUrl = normalized;
    return this;
  }

  /** Reads the staged entry `fullUrl` when present. */
  public getFullUrl(): string | undefined {
    return normalizeOptionalIdentifier(this.getMutableEntry().fullUrl);
  }

  /** Returns control to the parent bundle editor. */
  public doneEntry(): BundleEditor {
    return this.bundleEditor;
  }

  protected getMutableEntry(): BuiltBundleEntry {
    return this.bundleEditor.getMutableEntry(this.entryIndex);
  }

  protected getClaims(): EmployeeClaims {
    return {
      ...(this.getMutableEntry().resource?.meta?.claims || {}),
    };
  }
}

/**
 * Employee-specific editor for one staged bundle entry.
 *
 * Use this class after `bundle.newEntry().asEmployee()` or
 * `bundle.openEntry(...).asEmployee()`.
 */
export class EmployeeEntryEditor extends BundleEntryEditor {
  /**
   * Writes the canonical employee identifier.
   *
   * The identifier is synchronized across:
   * - `entry.fullUrl`
   * - `resource.id`
   * - `org.schema.Person.identifier`
   */
  public setIdentifier(identifier?: string | null): this {
    const normalized = normalizeOptionalIdentifier(identifier);
    if (!normalized) {
      this.removeClaim(ClaimsPersonSchemaorg.identifier);
      this.setResourceId(undefined);
      this.setFullUrl(undefined);
      return this;
    }
    this.setClaim(ClaimsPersonSchemaorg.identifier, normalized);
    this.setResourceId(normalized);
    this.setFullUrl(normalized);
    return this;
  }

  /** Reads the canonical employee identifier from claims, resource id, or fullUrl. */
  public getIdentifier(): string | undefined {
    return normalizeOptionalIdentifier(
      this.getClaim(ClaimsPersonSchemaorg.identifier)
        || this.getResourceId()
        || this.getFullUrl(),
    );
  }

  /** Ensures the employee entry carries one canonical `urn:uuid:*` identifier. */
  public ensureIdentifier(): string {
    const existing = this.getIdentifier();
    if (existing) {
      return existing;
    }
    const generated = createCanonicalIdentifierUrn();
    this.setIdentifier(generated);
    return generated;
  }

  /** Writes the canonical employee email claim on this entry. */
  public setEmail(email: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.email, String(email).trim());
  }

  /** Reads the canonical employee email claim from this entry. */
  public getEmail(): string | undefined {
    const email = this.getClaim(ClaimsPersonSchemaorg.email);
    return typeof email === 'string' && email.trim() ? email.trim() : undefined;
  }

  /** Writes the canonical employee occupational role claim on this entry. */
  public setRole(role: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.hasOccupationalRoleValue, String(role).trim());
  }

  /** Reads the canonical employee occupational role claim from this entry. */
  public getRole(): string | undefined {
    const role = this.getClaim(ClaimsPersonSchemaorg.hasOccupationalRoleValue);
    return typeof role === 'string' && role.trim() ? role.trim() : undefined;
  }

  /** Writes the canonical employee `worksFor` claim on this entry. */
  public setWorksFor(worksFor: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.worksFor, String(worksFor).trim());
  }

  /** Writes the canonical employee `memberOf` claim on this entry. */
  public setMemberOf(memberOf: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.memberOf, String(memberOf).trim());
  }

  /** Writes the canonical employee organization tax id claim on this entry. */
  public setMemberOfOrgTaxId(taxId: string): this {
    return this.setClaim(ClaimsPersonSchemaorg.memberOfOrgTaxId, String(taxId).trim());
  }
}
