// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import { HealthcareActorRoleCodes } from '../src/constants/healthcare.js';
import {
  GovernedOrganizationIdentifierCodes,
} from '../src/constants/identity-identifiers.js';
import {
  EXAMPLE_KYC_CONTROLLER_USER_UUID,
  EXAMPLE_PROVIDER_LEGAL_IDENTIFIER_VALUE_CDS,
} from '../src/examples/shared.js';
import {
  buildOrganizationAuthorizationUrnCds,
  buildOrganizationEmployeeAuthorizationUrnCds,
} from '../src/utils/organization-authorization-urn.js';

describe('organization employee authorization URN', () => {
  it('appends the Base58btc encoding of the UUID bytes and the ISCO-08 code to the unchanged organization URN', () => {
    const organizationUrn = buildOrganizationAuthorizationUrnCds({
      jurisdiction: 'CA-BC',
      identifierType: GovernedOrganizationIdentifierCodes.BusinessNumber,
      identifierValue: EXAMPLE_PROVIDER_LEGAL_IDENTIFIER_VALUE_CDS,
    });

    expect(buildOrganizationEmployeeAuthorizationUrnCds({
      organizationUrn,
      employeeUuid: EXAMPLE_KYC_CONTROLLER_USER_UUID,
      roleCode: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
    })).toBe(
      'urn:cds-ca-bc:v1:organization:bn:ES-B00112233:member:zJJPb9sJCAcnFLu8tVHGF4c:2211',
    );
  });

  it('rejects a hash, arbitrary Base58 value or malformed UUID instead of creating a new employee identity', () => {
    const organizationUrn = buildOrganizationAuthorizationUrnCds({
      jurisdiction: 'CA-BC',
      identifierType: GovernedOrganizationIdentifierCodes.BusinessNumber,
      identifierValue: EXAMPLE_PROVIDER_LEGAL_IDENTIFIER_VALUE_CDS,
    });

    expect(() => buildOrganizationEmployeeAuthorizationUrnCds({
      organizationUrn,
      employeeUuid: 'zNotAnEmployeeUuid',
      roleCode: HealthcareActorRoleCodes.GeneralistMedicalPractitioner,
    })).toThrow(/UUID/i);
  });
});
