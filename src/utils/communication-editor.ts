// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { BundleEntry, BundleJsonApi } from '../models/bundle';
import type { BundleResourceIdFilters } from './bundle-query';
import {
  CommunicationClaimsContext,
  type CommunicationAttachedBundleSessionMode,
} from '../models/communication-attached-bundle-session';
import { BundleReader } from './bundle-reader';
import { CommunicationAttachedBundleSession } from './communication-attached-bundle-session';
import {
  getCommunicationClaimsListFromDidcommPayload,
  getFirstCommunicationClaimsFromDidcommPayload,
} from './communication-didcomm-payload';
import type { IDecodedDidcommPayload } from '../models/confidential-message';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims';

export type CommunicationEditorOptions = Readonly<{
  initialBundle?: BundleJsonApi<BundleEntry>;
  mode?: CommunicationAttachedBundleSessionMode;
  communicationClaims?: Record<string, unknown>;
}>;

/**
 * Public high-level editor for one delivery `Communication`.
 *
 * Teaching contract:
 * - use this name in tutorials when the caller is authoring one outer
 *   `Communication`
 * - keep `CommunicationAttachedBundleSession` as the lower-level compatibility
 *   implementation detail underneath
 */
export class CommunicationEditor extends CommunicationAttachedBundleSession {
  constructor(options: CommunicationEditorOptions = {}) {
    super({
      ...options,
      communicationClaims: {
        '@context': CommunicationClaimsContext,
        ...(options.communicationClaims || {}),
      },
    });
  }

  /** Materializes one immutable snapshot of the current Communication claims. */
  done(): Record<string, unknown> {
    return this.getCommunicationClaims();
  }

  /** Returns one reader over the current Communication snapshot. */
  toReader(): CommunicationReader {
    return new CommunicationReader(this.getCommunicationClaims());
  }
}

/**
 * Public high-level reader for one delivery `Communication`.
 */
export class CommunicationReader {
  private readonly session: CommunicationAttachedBundleSession;

  constructor(communicationClaims: Record<string, unknown>) {
    this.session = new CommunicationAttachedBundleSession({ communicationClaims });
  }

  /** Reads the first delivery `Communication` carried in one DIDComm/plain payload. */
  static fromDidcommPayload(payload: IDecodedDidcommPayload): CommunicationReader {
    return new CommunicationReader(getFirstCommunicationClaimsFromDidcommPayload(payload));
  }

  /** Reads every delivery `Communication` carried in one DIDComm/plain payload. */
  static listFromDidcommPayload(payload: IDecodedDidcommPayload): CommunicationReader[] {
    return getCommunicationClaimsListFromDidcommPayload(payload)
      .map((communicationClaims) => new CommunicationReader(communicationClaims));
  }

  getCommunicationClaims(): Record<string, unknown> {
    return this.session.getCommunicationClaims();
  }

  getCommunicationIdentifier(): string {
    return this.session.getCommunicationIdentifier();
  }

  getCommunicationSubject(): string {
    return this.session.getCommunicationSubject();
  }

  getCommunicationCategoryList(): string[] {
    return this.session.getCommunicationCategoryList();
  }

  getCommunicationTopic(): string {
    return this.session.getCommunicationTopic();
  }

  getCommunicationText(): string {
    return this.session.getCommunicationText();
  }

  getAttachmentContentType(): string {
    return String(this.getCommunicationClaims()[CommunicationClaim.ContentAttachmentType] || '').trim();
  }

  getAttachmentTitle(): string {
    return String(this.getCommunicationClaims()[CommunicationClaim.ContentAttachmentTitle] || '').trim();
  }

  getAttachmentUrl(): string {
    return String(this.getCommunicationClaims()[CommunicationClaim.ContentAttachmentUrl] || '').trim();
  }

  getAttachmentDataBase64(): string {
    return String(this.getCommunicationClaims()[CommunicationClaim.ContentAttachmentData] || '').trim();
  }

  getAttachedBundle(): BundleJsonApi<BundleEntry> {
    return this.session.getAttachedBundle();
  }

  getAttachedBundleReader(): BundleReader {
    return new BundleReader(this.getAttachedBundle() as unknown as Record<string, unknown>);
  }

  getAttachedBundleResourceIds(filters: BundleResourceIdFilters = {}): string[] {
    return this.getAttachedBundleReader().getResourceIds(filters);
  }

  getAttachedBundleEntriesByIds(resourceIds: readonly string[]): BundleEntry[] {
    return this.getAttachedBundleReader().getEntriesByIds(resourceIds) as BundleEntry[];
  }

  getAttachedBundleEntryUrl(resourceId: string): string | undefined {
    return this.getAttachedBundleReader().getEntryUrl(resourceId);
  }
}
