// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg } from '../constants/schemaorg.js';

export const OrganizationLifecycleOperations = Object.freeze({
  Enable: 'enable',
  Disable: 'disable',
  Purge: 'purge',
} as const);

export type OrganizationLifecycleOperation =
  typeof OrganizationLifecycleOperations[keyof typeof OrganizationLifecycleOperations];

export type OrganizationLifecycleClaims = Record<string, unknown>;

export type OrganizationLifecycleEditorState = Readonly<{
  operation: OrganizationLifecycleOperation;
  claims: OrganizationLifecycleClaims;
  requestType?: string;
  thid?: string;
}>;

export type OrganizationLifecycleDataEntry = Readonly<{
  type: string;
  request: { method: 'POST' };
  meta: { claims: OrganizationLifecycleClaims };
  resource: { resourceType: 'Organization'; meta: { claims: OrganizationLifecycleClaims } };
}>;

export type OrganizationLifecyclePayload = Readonly<{
  thid: string;
  body: {
    data: OrganizationLifecycleDataEntry[];
  };
}>;

function cloneClaims(claims?: OrganizationLifecycleClaims): OrganizationLifecycleClaims {
  return { ...(claims || {}) };
}

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function normalizeDraft(
  draft?: Partial<OrganizationLifecycleEditorState>,
): OrganizationLifecycleEditorState {
  return {
    operation: draft?.operation || OrganizationLifecycleOperations.Disable,
    claims: {
      '@context': 'org.schema',
      ...cloneClaims(draft?.claims),
    },
    requestType: normalizeText(draft?.requestType),
    thid: normalizeText(draft?.thid),
  };
}

function patchDraft(
  draft: OrganizationLifecycleEditorState,
  patch: Partial<OrganizationLifecycleEditorState>,
): OrganizationLifecycleEditorState {
  return normalizeDraft({
    ...draft,
    ...patch,
    claims: patch.claims ? cloneClaims(patch.claims) : cloneClaims(draft.claims),
  });
}

function createLifecycleThreadId(operation: OrganizationLifecycleOperation): string {
  return `organization-${operation}-example-001`;
}

export class OrganizationLifecycleEditor {
  private draft: OrganizationLifecycleEditorState;

  constructor(initial?: Partial<OrganizationLifecycleEditorState>) {
    this.draft = normalizeDraft(initial);
  }

  mergeClaims(claims: OrganizationLifecycleClaims): this {
    this.draft = patchDraft(this.draft, { claims: { ...this.draft.claims, ...cloneClaims(claims) } });
    return this;
  }

  setClaims(claims: OrganizationLifecycleClaims): this {
    this.draft = patchDraft(this.draft, { claims });
    return this;
  }

  setContext(context: string): this {
    this.draft = patchDraft(this.draft, {
      claims: {
        ...this.draft.claims,
        '@context': String(context).trim(),
      },
    });
    return this;
  }

  setIdentifier(identifier: string): this {
    this.draft = patchDraft(this.draft, {
      claims: {
        ...this.draft.claims,
        [ClaimsOrganizationSchemaorg.identifier]: String(identifier).trim(),
      },
    });
    return this;
  }

  setIdentifierValue(identifierValue: string): this {
    this.draft = patchDraft(this.draft, {
      claims: {
        ...this.draft.claims,
        [ClaimsOrganizationSchemaorg.identifierValue]: String(identifierValue).trim(),
      },
    });
    return this;
  }

  setTaxId(taxId: string): this {
    this.draft = patchDraft(this.draft, {
      claims: {
        ...this.draft.claims,
        [ClaimsOrganizationSchemaorg.taxId]: String(taxId).trim(),
      },
    });
    return this;
  }

  setOperation(operation: OrganizationLifecycleOperation): this {
    this.draft = patchDraft(this.draft, { operation });
    return this;
  }

  setRequestType(requestType: string): this {
    this.draft = patchDraft(this.draft, { requestType });
    return this;
  }

  setThreadId(thid: string): this {
    this.draft = patchDraft(this.draft, { thid });
    return this;
  }

  getContext(): string | undefined {
    return normalizeText(this.draft.claims['@context']) || undefined;
  }

  getIdentifier(): string | undefined {
    return normalizeText(this.draft.claims[ClaimsOrganizationSchemaorg.identifier]) || undefined;
  }

  getIdentifierValue(): string | undefined {
    return normalizeText(this.draft.claims[ClaimsOrganizationSchemaorg.identifierValue]) || undefined;
  }

  getTaxId(): string | undefined {
    return normalizeText(this.draft.claims[ClaimsOrganizationSchemaorg.taxId]) || undefined;
  }

  getOperation(): OrganizationLifecycleOperation {
    return this.draft.operation;
  }

  getRequestType(): string | undefined {
    return normalizeText(this.draft.requestType) || undefined;
  }

  getThreadId(): string | undefined {
    return normalizeText(this.draft.thid) || undefined;
  }

  getClaims(): OrganizationLifecycleClaims {
    return cloneClaims(this.draft.claims);
  }

  getState(): OrganizationLifecycleEditorState {
    return normalizeDraft(this.draft);
  }

  getEditorState(): OrganizationLifecycleEditorState {
    return this.getState();
  }

  buildCurrentGwDataEntry(): OrganizationLifecycleDataEntry {
    const requestType = normalizeText(this.draft.requestType);
    if (!requestType) {
      throw new Error('OrganizationLifecycleEditor.buildCurrentGwDataEntry requires requestType.');
    }
    const claims = this.getClaims();
    return {
      type: requestType,
      request: { method: 'POST' },
      meta: { claims },
      resource: {
        resourceType: 'Organization',
        meta: { claims },
      },
    };
  }

  buildCurrentGwPayload(): OrganizationLifecyclePayload {
    const requestType = normalizeText(this.draft.requestType);
    if (!requestType) {
      throw new Error('OrganizationLifecycleEditor.buildCurrentGwPayload requires requestType.');
    }
    return {
      thid: this.draft.thid || createLifecycleThreadId(this.draft.operation),
      body: {
        data: [this.buildCurrentGwDataEntry()],
      },
    };
  }
}
