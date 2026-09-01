/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - This file owns only the typed editor for one staged Consent entry.
 */
import { ClaimConsent, type ConsentDecision, type ConsentStatus } from '../models/consent-rule';
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
 * Typed editor for one Consent permission staged inside a Bundle.
 *
 * It edits semantic permission data only. It does not create a Communication,
 * choose a clinical projection, pack DIDComm, authorize, submit or poll.
 */
export class ConsentEntryEditor extends BundleEntryEditor {
  public setIdentifier(value?: string | null): this {
    const normalized = normalizeText(value);
    if (!normalized) {
      this.removeClaim(ClaimConsent.identifier).setResourceId().setFullUrl();
      return this;
    }
    return this.setClaim(ClaimConsent.identifier, normalized)
      .setResourceId(normalized)
      .setFullUrl(normalized);
  }

  public getIdentifier(): string | undefined {
    return normalizeText(String(this.getClaim(ClaimConsent.identifier) || this.getResourceId() || this.getFullUrl() || ''));
  }

  public ensureIdentifier(): string {
    const identifier = this.getIdentifier();
    if (!identifier) throw new Error('Consent entry requires a generated resource id or explicit identifier.');
    this.setIdentifier(identifier);
    return identifier;
  }

  public setSubject(value?: string | null): this { return this.setOptionalText(ClaimConsent.subject, value); }
  public getSubject(): string | undefined { return this.getOptionalText(ClaimConsent.subject); }
  public setStatus(value?: ConsentStatus | null): this { return this.setOptionalText(ClaimConsent.status, value); }
  public getStatus(): string | undefined { return this.getOptionalText(ClaimConsent.status); }
  public setDecision(value?: ConsentDecision | null): this { return this.setOptionalText(ClaimConsent.decision, value); }
  public getDecision(): string | undefined { return this.getOptionalText(ClaimConsent.decision); }
  public setActorIdentifierList(values: readonly string[]): this { return this.setList(ClaimConsent.actorIdentifier, values); }
  public getActorIdentifierList(): string[] { return this.getList(ClaimConsent.actorIdentifier); }
  public setActorRoleList(values: readonly string[]): this { return this.setList(ClaimConsent.actorRole, values); }
  public getActorRoleList(): string[] { return this.getList(ClaimConsent.actorRole); }
  public setPurposeList(values: readonly string[]): this { return this.setList(ClaimConsent.purpose, values); }
  public getPurposeList(): string[] { return this.getList(ClaimConsent.purpose); }
  public setSectionList(values: readonly string[]): this { return this.setList(ClaimConsent.action, values); }
  public getSectionList(): string[] { return this.getList(ClaimConsent.action); }
  public setResourceTypeList(values: readonly string[]): this { return this.setList(ClaimConsent.resourceType, values); }
  public getResourceTypeList(): string[] { return this.getList(ClaimConsent.resourceType); }
  public setDate(value?: string | null): this { return this.setOptionalText(ClaimConsent.date, value); }
  public getDate(): string | undefined { return this.getOptionalText(ClaimConsent.date); }
  public setPeriodStart(value?: string | null): this { return this.setOptionalText(ClaimConsent.periodStart, value); }
  public getPeriodStart(): string | undefined { return this.getOptionalText(ClaimConsent.periodStart); }
  public setPeriodEnd(value?: string | null): this { return this.setOptionalText(ClaimConsent.periodEnd, value); }
  public getPeriodEnd(): string | undefined { return this.getOptionalText(ClaimConsent.periodEnd); }

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

registerBundleEntryEditor(BundleEditableResourceTypes.consent, ConsentEntryEditor);
