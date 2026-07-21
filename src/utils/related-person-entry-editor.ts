/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - This file owns only the typed editor for one staged RelatedPerson entry.
 */
import { RelatedPersonClaim } from '../models/interoperable-claims/related-person-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { BundleEntryEditor } from './bundle-entry-editor';
import { registerBundleEntryEditor } from './bundle-editor-registry';

function normalizeText(value?: string | null): string | undefined {
  const normalized = String(value || '').trim();
  return normalized || undefined;
}

function normalizeList(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

/**
 * Typed editor for one RelatedPerson/contact staged inside a Bundle.
 *
 * Relationship authoring is separate from access authorization. This editor
 * does not grant Consent, build a Communication, submit or poll.
 */
export class RelatedPersonEntryEditor extends BundleEntryEditor {
  public setIdentifier(value?: string | null): this {
    const normalized = normalizeText(value);
    if (!normalized) {
      this.removeClaim(RelatedPersonClaim.IdentifierValue)
        .removeClaim(RelatedPersonClaim.Identifier)
        .setResourceId()
        .setFullUrl();
      return this;
    }
    return this.setClaim(RelatedPersonClaim.IdentifierValue, normalized)
      .setClaim(RelatedPersonClaim.Identifier, normalized)
      .setResourceId(normalized)
      .setFullUrl(normalized);
  }

  public getIdentifier(): string | undefined {
    return normalizeText(String(
      this.getClaim(RelatedPersonClaim.IdentifierValue)
        || this.getClaim(RelatedPersonClaim.Identifier)
        || this.getResourceId()
        || this.getFullUrl()
        || '',
    ));
  }

  public ensureIdentifier(): string {
    const identifier = this.getIdentifier();
    if (!identifier) throw new Error('RelatedPerson entry requires a generated resource id or explicit identifier.');
    this.setIdentifier(identifier);
    return identifier;
  }

  public setActive(value?: boolean | null): this {
    return value === undefined || value === null
      ? this.removeClaim(RelatedPersonClaim.Active)
      : this.setClaim(RelatedPersonClaim.Active, value);
  }

  public getActive(): boolean | undefined {
    const value = this.getClaim(RelatedPersonClaim.Active);
    if (typeof value === 'boolean') return value;
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return undefined;
  }

  public setSubject(value?: string | null): this { return this.setOptionalText(RelatedPersonClaim.Patient, value); }
  public getSubject(): string | undefined { return this.getOptionalText(RelatedPersonClaim.Patient); }
  public setRelationship(value?: string | null): this { return this.setOptionalText(RelatedPersonClaim.Relationship, value); }
  public getRelationship(): string | undefined { return this.getOptionalText(RelatedPersonClaim.Relationship); }
  public setRoleList(values: readonly string[]): this { return this.setList(RelatedPersonClaim.Role, values); }
  public getRoleList(): string[] { return this.getList(RelatedPersonClaim.Role); }
  public setName(value?: string | null): this { return this.setOptionalText(RelatedPersonClaim.Name, value); }
  public getName(): string | undefined { return this.getOptionalText(RelatedPersonClaim.Name); }
  public setTelecom(value?: string | null): this { return this.setOptionalText(RelatedPersonClaim.Telecom, value); }
  public getTelecom(): string | undefined { return this.getOptionalText(RelatedPersonClaim.Telecom); }
  public setRelatedEntityType(value?: string | null): this { return this.setOptionalText(RelatedPersonClaim.RelatedEntityType, value); }
  public getRelatedEntityType(): string | undefined { return this.getOptionalText(RelatedPersonClaim.RelatedEntityType); }
  public setActorIdentifierList(values: readonly string[]): this { return this.setList(RelatedPersonClaim.ActorIdentifier, values); }
  public getActorIdentifierList(): string[] { return this.getList(RelatedPersonClaim.ActorIdentifier); }

  private setOptionalText(key: string, value?: string | null): this {
    const normalized = normalizeText(value);
    return normalized ? this.setClaim(key, normalized) : this.removeClaim(key);
  }

  private getOptionalText(key: string): string | undefined {
    return normalizeText(String(this.getClaim(key) || ''));
  }

  private setList(key: string, values: readonly string[]): this {
    const normalized = normalizeList(values);
    return normalized.length ? this.setClaim(key, normalized.join(',')) : this.removeClaim(key);
  }

  private getList(key: string): string[] {
    const value = this.getClaim(key);
    return normalizeList(Array.isArray(value) ? value.map(String) : String(value || '').split(','));
  }
}

registerBundleEntryEditor(BundleEditableResourceTypes.relatedPerson, RelatedPersonEntryEditor);
