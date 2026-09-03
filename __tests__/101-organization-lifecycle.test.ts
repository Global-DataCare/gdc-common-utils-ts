// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  ClaimsOrganizationSchemaorg,
  EXAMPLE_TENANT_DISABLE_MESSAGE,
  EXAMPLE_TENANT_DISABLE_REQUEST_TYPE,
  OrganizationLifecycleEditor,
  OrganizationLifecycleOperations,
} from '../src';

describe('101: organization lifecycle editor', () => {
  it('builds the shared current GW payload for tenant or host lifecycle through explicit set/get methods', () => {
    const editor = new OrganizationLifecycleEditor()
      .setIdentifier(String(EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier]))
      .setIdentifierType(String(EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifierType]))
      .setIdentifierValue(String(EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifierValue]))
      .setTaxId(String(EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.taxId]))
      .setOperation(OrganizationLifecycleOperations.Disable)
      .setRequestType(EXAMPLE_TENANT_DISABLE_REQUEST_TYPE)
      .setThreadId('organization-disable-example-001');

    expect(editor.getContext()).toBe('org.schema');
    expect(editor.getIdentifier()).toBe(
      EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier],
    );
    expect(editor.getIdentifierValue()).toBe(
      EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifierValue],
    );
    expect(editor.getIdentifierType()).toBe('taxID');
    expect(editor.getTaxId()).toBe(
      EXAMPLE_TENANT_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.taxId],
    );
    expect(editor.getOperation()).toBe(OrganizationLifecycleOperations.Disable);
    expect(editor.getRequestType()).toBe(EXAMPLE_TENANT_DISABLE_REQUEST_TYPE);
    expect(editor.getThreadId()).toBe('organization-disable-example-001');

    expect(editor.buildCurrentGwPayload()).toEqual({
      thid: 'organization-disable-example-001',
      body: {
        data: [{
          type: EXAMPLE_TENANT_DISABLE_REQUEST_TYPE,
          request: { method: 'POST' },
          resource: {
            resourceType: 'Organization',
            meta: { claims: EXAMPLE_TENANT_DISABLE_MESSAGE.claims },
          },
        }],
      },
    });
    const legacyEntry = editor.buildCurrentGwDataEntry() as ReturnType<typeof editor.buildCurrentGwDataEntry>
      & { meta?: { claims?: unknown } };
    expect(legacyEntry.meta?.claims).toBeUndefined();
  });
});
