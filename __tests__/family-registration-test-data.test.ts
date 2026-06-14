import {
  buildExampleFamilyRegistrationClaims,
  buildExampleFamilyRegistrationContent,
  EXAMPLE_FAMILY_REGISTRATION_OWNER_IDENTIFIER,
  EXAMPLE_FAMILY_REGISTRATION_OWNER_TELEPHONE,
  EXAMPLE_FAMILY_REGISTRATION_PERSON_IDENTIFIER,
} from '../src/utils/family-registration-test-data';
import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import { EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME } from '../src/examples/shared';

describe('family-registration-test-data', () => {
  it('builds a canonical normalized family-registration claim set', () => {
    const claims = buildExampleFamilyRegistrationClaims();

    expect(claims).toMatchObject({
      [ClaimsOrganizationSchemaorg.ownerTelephone]: EXAMPLE_FAMILY_REGISTRATION_OWNER_TELEPHONE,
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: EXAMPLE_FAMILY_REGISTRATION_OWNER_IDENTIFIER,
      [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_FAMILY_REGISTRATION_PERSON_IDENTIFIER,
      [ClaimsPersonSchemaorg.identifierValue]: EXAMPLE_FAMILY_REGISTRATION_PERSON_IDENTIFIER,
    });
  });

  it('builds content snapshots while allowing focused overrides', () => {
    const content = buildExampleFamilyRegistrationContent({
      status: 'inactive',
      claims: {
        [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
      },
    });

    expect(content.status).toBe('inactive');
    expect(content.claims[ClaimsOrganizationSchemaorg.alternateName]).toBe(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME);
    expect(Array.isArray(content.contained)).toBe(true);
  });
});
