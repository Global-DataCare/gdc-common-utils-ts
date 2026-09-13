// Flow contract: a valid birth-date-only individual registration is an owner-private draft, while not-found and legacy status envelopes keep their existing behavior.
import { describe, expect, it } from '@jest/globals';
import { readFamilyOrganizationSummaryFromResponseBody } from '../src';

const response = (claims: Record<string, unknown>) => ({
  body: {
    data: [{
      resource: {
        id: 'private-draft-uuid',
        meta: { claims },
      },
    }],
  },
});

describe('family organization private-draft summary', () => {
  it('reads draft_saved without requiring a public name or Offer', () => {
    expect(readFamilyOrganizationSummaryFromResponseBody(response({
      'org.schema.FamilyRegistration.status': 'draft_saved',
      'org.schema.Organization.identifier.value': 'private-draft-uuid',
      'org.schema.Organization.foundingDate': '2022-01',
      'org.schema.FamilyRegistration.missingFields': ['alternateName', 'sameAs'],
    }))).toEqual(expect.objectContaining({
      status: 'draft_saved',
      offerId: undefined,
      organizationId: 'private-draft-uuid',
      missingFields: ['alternateName', 'sameAs'],
    }));
  });

  it('keeps an explicit not_found result out of the caller directory', () => {
    expect(readFamilyOrganizationSummaryFromResponseBody(response({
      'org.schema.FamilyRegistration.status': 'not_found',
    }))).toBeNull();
  });

  it('rejects an unknown status instead of treating it as a valid registration', () => {
    expect(readFamilyOrganizationSummaryFromResponseBody(response({
      'org.schema.FamilyRegistration.status': 'invented_terminal_state',
    }))).toBeNull();
  });

  it('continues reading the compatibility status claim', () => {
    expect(readFamilyOrganizationSummaryFromResponseBody(response({
      status: 'resume_required',
      missingFields: ['alternateName'],
    }))).toEqual(expect.objectContaining({
      status: 'resume_required',
      missingFields: ['alternateName'],
    }));
  });
});
