import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT,
  EXAMPLE_FAMILY_ORGANIZATION_SEARCH_RESPONSE_BODY,
  readFamilyOrganizationSummaryFromResponseBody,
} from '../src';

describe('101: family organization search summary reader', () => {
  it('reads one backend-friendly family-organization summary from current GW-style responses', () => {
    const summary = readFamilyOrganizationSummaryFromResponseBody(
      EXAMPLE_FAMILY_ORGANIZATION_SEARCH_RESPONSE_BODY,
    );

    expect(summary).toEqual({
      status: 'already_exists',
      offerId: 'offer-uuid-001',
      organizationId: 'org-uuid-001',
      subjectInfo: {
        identifierType: undefined,
        identifierValue: 'org-uuid-001',
        alternateName: EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT.usualname,
        birthDate: EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT.birthDate,
        ownerTelephone: EXAMPLE_FAMILY_ORGANIZATION_SEARCH_INPUT.controllerPhone,
      },
      missingFields: undefined,
      updatedAt: undefined,
    });
  });
});
