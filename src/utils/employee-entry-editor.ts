/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { createCanonicalIdentifierUrn, normalizeOptionalIdentifier } from './bundle-editor-helpers';
import { BundleEntryEditor } from './bundle-entry-editor';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Employee resource entry.
 *
 * Use this when a caller needs to stage one employee row with claims-first
 * accessors in a bundle authoring flow.
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
registerBundleEntryEditor(BundleEditableResourceTypes.employee, EmployeeEntryEditor);
