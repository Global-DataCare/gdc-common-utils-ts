// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ClaimsOrganizationSchemaorg } from '../constants/schemaorg';

export const IndividualOrganizationLifecycleOperations = Object.freeze({
  Disable: 'disable',
  Purge: 'purge',
} as const);

export type IndividualOrganizationLifecycleOperation =
  typeof IndividualOrganizationLifecycleOperations[keyof typeof IndividualOrganizationLifecycleOperations];

export const IndividualOrganizationLifecycleRequestMethods = Object.freeze({
  Post: 'POST',
} as const);

export type IndividualOrganizationLifecycleClaims = Record<string, unknown>;

export type IndividualOrganizationLifecycleSemanticMessage = Readonly<{
  operation: IndividualOrganizationLifecycleOperation;
  resourceType: 'IndividualOrganization';
  claims: IndividualOrganizationLifecycleClaims;
  resourceId?: string;
}>;

export type IndividualOrganizationLifecycleDataEntryInput = Readonly<{
  claims: IndividualOrganizationLifecycleClaims;
  requestType: string;
  resourceId?: string;
  requestMethod?: typeof IndividualOrganizationLifecycleRequestMethods.Post;
}>;

export type IndividualOrganizationLifecyclePayloadInput = Readonly<{
  claims: IndividualOrganizationLifecycleClaims;
  requestType: string;
  resourceId?: string;
  requestMethod?: typeof IndividualOrganizationLifecycleRequestMethods.Post;
  thid?: string;
}>;

export type IndividualOrganizationLifecycleDataEntry = Readonly<{
  type: string;
  request: { method: typeof IndividualOrganizationLifecycleRequestMethods.Post };
  resource: { id?: string; meta: { claims: IndividualOrganizationLifecycleClaims } };
}>;

export type IndividualOrganizationLifecyclePayload = Readonly<{
  thid: string;
  body: {
    data: IndividualOrganizationLifecycleDataEntry[];
  };
}>;

export type IndividualOrganizationLifecycleEditorState = Readonly<{
  operation: IndividualOrganizationLifecycleOperation;
  claims: IndividualOrganizationLifecycleClaims;
  resourceId?: string;
  requestType?: string;
  thid?: string;
}>;

function cloneClaims(claims?: IndividualOrganizationLifecycleClaims): IndividualOrganizationLifecycleClaims {
  return { ...(claims || {}) };
}

function normalizeText(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized || undefined;
}

function normalizeDraft(
  draft?: Partial<IndividualOrganizationLifecycleEditorState>,
): IndividualOrganizationLifecycleEditorState {
  return {
    operation: draft?.operation || IndividualOrganizationLifecycleOperations.Disable,
    claims: {
      '@context': 'org.schema',
      ...cloneClaims(draft?.claims),
    },
    resourceId: normalizeText(draft?.resourceId),
    requestType: normalizeText(draft?.requestType),
    thid: normalizeText(draft?.thid),
  };
}

function patchDraft(
  draft: IndividualOrganizationLifecycleEditorState,
  patch: Partial<IndividualOrganizationLifecycleEditorState>,
): IndividualOrganizationLifecycleEditorState {
  return normalizeDraft({
    ...draft,
    ...patch,
    claims: patch.claims ? cloneClaims(patch.claims) : cloneClaims(draft.claims),
  });
}

function createLifecycleThreadId(operation: IndividualOrganizationLifecycleOperation): string {
  return `individual-organization-${operation}-example-001`;
}

/**
 * Builds the current GW CORE `body.data[]` entry for `individual/org.schema/Organization`
 * lifecycle operations.
 *
 * Current contract note:
 * - `disable` still goes through the explicit `/_disable` route
 * - `purge` still goes through the explicit `/_purge` route
 * - both current routes expect `request.method = POST`
 * - both use canonical flat `org.schema.Organization.*` claims in
 *   `resource.meta.claims`
 */
export function buildCurrentIndividualOrganizationLifecycleDataEntry(
  input: IndividualOrganizationLifecycleDataEntryInput,
): IndividualOrganizationLifecycleDataEntry {
  const claims = cloneClaims(input.claims);
  return {
    type: String(input.requestType).trim(),
    request: {
      method: input.requestMethod || IndividualOrganizationLifecycleRequestMethods.Post,
    },
    resource: {
      ...(normalizeText(input.resourceId) ? { id: normalizeText(input.resourceId) } : {}),
      meta: { claims },
    },
  };
}

/**
 * Builds the current GW CORE lifecycle payload shape for
 * `individual/org.schema/Organization`.
 *
 * This helper deliberately builds only the stable body structure shared by
 * docs, tests, and SDK plumbing. Runtime-specific DIDComm fields (`iss`, `aud`,
 * `jti`, content type) still belong to the caller/runtime layer.
 */
export function buildCurrentIndividualOrganizationLifecyclePayload(
  input: IndividualOrganizationLifecyclePayloadInput,
): IndividualOrganizationLifecyclePayload {
  return {
    thid: normalizeText(input.thid) || createLifecycleThreadId(IndividualOrganizationLifecycleOperations.Disable),
    body: {
      data: [buildCurrentIndividualOrganizationLifecycleDataEntry(input)],
    },
  };
}

/**
 * High-level chainable editor for hosted individual/family lifecycle work.
 *
 * Teaching goal:
 * - authors one canonical flat `org.schema.Organization.*` claim set
 * - keeps disable/purge operation intent explicit
 * - can emit either a semantic lifecycle message or the current GW CORE
 *   payload shape used by `sdk-node`
 */
export class IndividualOrganizationLifecycleEditor {
  private draft: IndividualOrganizationLifecycleEditorState;

  constructor(initial?: Partial<IndividualOrganizationLifecycleEditorState>) {
    this.draft = normalizeDraft(initial);
  }

  mergeClaims(claims: IndividualOrganizationLifecycleClaims): this {
    this.draft = patchDraft(this.draft, { claims: { ...this.draft.claims, ...cloneClaims(claims) } });
    return this;
  }

  setClaims(claims: IndividualOrganizationLifecycleClaims): this {
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

  setAlternateName(alternateName: string): this {
    this.draft = patchDraft(this.draft, {
      claims: {
        ...this.draft.claims,
        [ClaimsOrganizationSchemaorg.alternateName]: String(alternateName).trim(),
      },
    });
    return this;
  }

  setOwnerEmail(email: string): this {
    this.draft = patchDraft(this.draft, {
      claims: {
        ...this.draft.claims,
        [ClaimsOrganizationSchemaorg.ownerEmail]: String(email).trim(),
      },
    });
    return this;
  }

  setOperation(operation: IndividualOrganizationLifecycleOperation): this {
    this.draft = patchDraft(this.draft, { operation });
    return this;
  }

  setResourceId(resourceId?: string): this {
    this.draft = patchDraft(this.draft, { resourceId });
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

  getIdentifier(): string | undefined {
    const value = this.draft.claims[ClaimsOrganizationSchemaorg.identifier];
    const normalized = normalizeText(value);
    return normalized || undefined;
  }

  getContext(): string | undefined {
    const value = this.draft.claims['@context'];
    const normalized = normalizeText(value);
    return normalized || undefined;
  }

  getAlternateName(): string | undefined {
    const value = this.draft.claims[ClaimsOrganizationSchemaorg.alternateName];
    const normalized = normalizeText(value);
    return normalized || undefined;
  }

  getOwnerEmail(): string | undefined {
    const value = this.draft.claims[ClaimsOrganizationSchemaorg.ownerEmail];
    const normalized = normalizeText(value);
    return normalized || undefined;
  }

  getOperation(): IndividualOrganizationLifecycleOperation {
    return this.draft.operation;
  }

  getResourceId(): string | undefined {
    return normalizeText(this.draft.resourceId) || undefined;
  }

  getRequestType(): string | undefined {
    return normalizeText(this.draft.requestType) || undefined;
  }

  getThreadId(): string | undefined {
    return normalizeText(this.draft.thid) || undefined;
  }

  getClaims(): IndividualOrganizationLifecycleClaims {
    return cloneClaims(this.draft.claims);
  }

  getState(): IndividualOrganizationLifecycleEditorState {
    return normalizeDraft(this.draft);
  }

  getEditorState(): IndividualOrganizationLifecycleEditorState {
    return this.getState();
  }

  toSemanticMessage(): IndividualOrganizationLifecycleSemanticMessage {
    return {
      operation: this.draft.operation,
      resourceType: 'IndividualOrganization',
      claims: this.getClaims(),
      ...(this.draft.resourceId ? { resourceId: this.draft.resourceId } : {}),
    };
  }

  buildCurrentGwDataEntry(): IndividualOrganizationLifecycleDataEntry {
    const requestType = normalizeText(this.draft.requestType);
    if (!requestType) {
      throw new Error('IndividualOrganizationLifecycleEditor.buildCurrentGwDataEntry requires requestType.');
    }
    return buildCurrentIndividualOrganizationLifecycleDataEntry({
      claims: this.getClaims(),
      requestType,
      resourceId: this.draft.resourceId,
    });
  }

  buildCurrentGwPayload(): IndividualOrganizationLifecyclePayload {
    const requestType = normalizeText(this.draft.requestType);
    if (!requestType) {
      throw new Error('IndividualOrganizationLifecycleEditor.buildCurrentGwPayload requires requestType.');
    }
    return {
      thid: this.draft.thid || createLifecycleThreadId(this.draft.operation),
      body: {
        data: [this.buildCurrentGwDataEntry()],
      },
    };
  }
}
