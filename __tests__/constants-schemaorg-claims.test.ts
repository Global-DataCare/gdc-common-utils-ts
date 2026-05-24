import { ClaimsPersonSchemaorg } from '../src/constants/schemaorg';

describe('schemaorg person claims', () => {
  it('includes legal-representative onboarding claims', () => {
    expect(ClaimsPersonSchemaorg.memberOfTaxId).toBe('org.schema.Person.memberOf.taxID');
    expect(ClaimsPersonSchemaorg.memberOfOrgTaxId).toBe('org.schema.Person.memberOf.taxID');
    expect(ClaimsPersonSchemaorg.hasOccupationalRoleValue).toBe('org.schema.Person.hasOccupation.identifier.value');
    expect(ClaimsPersonSchemaorg.hasCredentialMaterial).toBe('org.schema.Person.hasCredential.material');
  });
});
