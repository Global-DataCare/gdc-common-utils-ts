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
  IndividualOrganizationLifecycleDraft,
  IndividualOrganizationLifecycleOperations,
} from '../src';

describe('101: individual organization lifecycle draft', () => {
  it('builds the shared current GW payload for disable and purge without losing the semantic organization claim set', () => {
    const disableDraft = new IndividualOrganizationLifecycleDraft()
      .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
      .setIdentifier(String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.identifier]))
      .setAlternateName(String(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims[ClaimsOrganizationSchemaorg.alternateName]))
      .setOwnerEmail(EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL)
      .setOperation(IndividualOrganizationLifecycleOperations.Disable)
      .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE)
      .setThreadId('individual-organization-disable-example-001');

    expect(disableDraft.toSemanticMessage()).toEqual({
      operation: IndividualOrganizationLifecycleOperations.Disable,
      resourceType: 'IndividualOrganization',
      claims: EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims,
    });
    expect(disableDraft.buildCurrentGwDataEntry()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_ENTRY);
    expect(disableDraft.buildCurrentGwPayload()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_PAYLOAD);

    const purgeDraft = new IndividualOrganizationLifecycleDraft()
      .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
      .setOperation(IndividualOrganizationLifecycleOperations.Purge)
      .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE)
      .setThreadId('individual-organization-purge-example-001');

    expect(purgeDraft.buildCurrentGwDataEntry()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_ENTRY);
    expect(purgeDraft.buildCurrentGwPayload()).toEqual(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_PAYLOAD);
  });
});
