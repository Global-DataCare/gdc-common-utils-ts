import { describe, expect, it } from '@jest/globals';

import {
  ClaimsOrganizationSchemaorg,
  EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_ENTRY,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_PAYLOAD,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_ENTRY,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_PAYLOAD,
  EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE,
  IndividualOrganizationLifecycleEditor,
  IndividualOrganizationLifecycleOperations,
} from '../src';

describe('101: individual organization lifecycle editor', () => {
  it('builds the shared current GW payload for disable and purge through explicit set/get lifecycle methods', () => {
    const disableEditor = new IndividualOrganizationLifecycleEditor()
      .setContext('org.schema')
      .setIdentifier(String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier]))
      .setAlternateName(String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.alternateName]))
      .setOwnerEmail(EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL)
      .setOperation(IndividualOrganizationLifecycleOperations.Disable)
      .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE)
      .setThreadId('individual-organization-disable-example-001');

    expect(disableEditor.getContext()).toBe('org.schema');
    expect(disableEditor.getIdentifier()).toBe(
      EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier],
    );
    expect(disableEditor.getAlternateName()).toBe(
      EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.alternateName],
    );
    expect(disableEditor.getOwnerEmail()).toBe(EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL);
    expect(disableEditor.getOperation()).toBe(IndividualOrganizationLifecycleOperations.Disable);
    expect(disableEditor.getRequestType()).toBe(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE);
    expect(disableEditor.getThreadId()).toBe('individual-organization-disable-example-001');

    expect(disableEditor.toSemanticMessage()).toEqual({
      operation: IndividualOrganizationLifecycleOperations.Disable,
      resourceType: 'IndividualOrganization',
      claims: EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims,
    });
    expect(disableEditor.buildCurrentGwDataEntry()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_ENTRY);
    expect(disableEditor.buildCurrentGwPayload()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_PAYLOAD);

    const purgeEditor = new IndividualOrganizationLifecycleEditor()
      .setContext('org.schema')
      .setIdentifier(String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier]))
      .setAlternateName(String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.alternateName]))
      .setOwnerEmail(EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL)
      .setOperation(IndividualOrganizationLifecycleOperations.Purge)
      .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE)
      .setThreadId('individual-organization-purge-example-001');

    expect(purgeEditor.getOperation()).toBe(IndividualOrganizationLifecycleOperations.Purge);
    expect(purgeEditor.buildCurrentGwDataEntry()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_ENTRY);
    expect(purgeEditor.buildCurrentGwPayload()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_PAYLOAD);
  });
});
