// Flow contract: SDKs and gateways share one named wire field for portable professional DCR and never duplicate a raw request literal.
import { IdentityAuthRequestFields } from '../src/constants/identity-auth.js';

describe('portable professional identity exchange fields', () => {
  it('exports the neutral employee authorization URN request key', () => {
    expect(IdentityAuthRequestFields.EmployeeAuthorizationUrn).toBe('employee_authorization_urn');
  });
});
