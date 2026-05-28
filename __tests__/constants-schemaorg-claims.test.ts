import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsSoftwareApplicationSchemaorg,
} from '../src/constants/schemaorg';

describe('schemaorg claims', () => {
  it('includes organization cryptographic material claim', () => {
    expect(ClaimsOrganizationSchemaorg.hasCredentialMaterial).toBe('org.schema.Organization.hasCredential.material');
  });

  it('includes legal-representative onboarding claims', () => {
    expect(ClaimsPersonSchemaorg.memberOfTaxId).toBe('org.schema.Person.memberOf.taxID');
    expect(ClaimsPersonSchemaorg.memberOfOrgTaxId).toBe('org.schema.Person.memberOf.taxID');
    expect(ClaimsPersonSchemaorg.hasOccupationalRoleValue).toBe('org.schema.Person.hasOccupation.identifier.value');
    expect(ClaimsPersonSchemaorg.hasCredentialMaterial).toBe('org.schema.Person.hasCredential.material');
  });

  it('includes software-application cryptographic material claim', () => {
    expect(ClaimsSoftwareApplicationSchemaorg.material).toBe('org.schema.SoftwareApplication.material');
  });
});
