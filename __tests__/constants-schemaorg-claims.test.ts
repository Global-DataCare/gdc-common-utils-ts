// TDD: schema.org Person identity resources expose canonical flat jurisdiction claims before portals consume them.
import {
  ClaimsIndividualProductSchemaorg,
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
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
    expect(ClaimsPersonSchemaorg.additionalType).toBe('org.schema.Person.additionalType');
    expect(ClaimsPersonSchemaorg.hasOccupationalCategory)
      .toBe('org.schema.Person.hasOccupation.occupationalCategory');
    expect(ClaimsPersonSchemaorg.hasCredentialMaterial).toBe('org.schema.Person.hasCredential.material');
  });

  it('includes identity-document country and region claims on Person rather than FHIR identity fields', () => {
    expect(ClaimsPersonSchemaorg.addressCountry).toBe('org.schema.Person.address.addressCountry');
    expect(ClaimsPersonSchemaorg.addressRegion).toBe('org.schema.Person.address.addressRegion');
  });

  it('includes service discovery areaServed claim', () => {
    expect(ClaimsServiceSchemaorg.areaServed).toBe('org.schema.Service.areaServed');
  });

  it('includes software-application cryptographic material claim', () => {
    expect(ClaimsSoftwareApplicationSchemaorg.material).toBe('org.schema.SoftwareApplication.material');
  });

  it('includes individual-product licensing claims', () => {
    expect(ClaimsIndividualProductSchemaorg.category).toBe('org.schema.IndividualProduct.category');
    expect(ClaimsIndividualProductSchemaorg.additionalType).toBe('org.schema.IndividualProduct.additionalType');
    expect(ClaimsIndividualProductSchemaorg.serialNumber).toBe('org.schema.IndividualProduct.serialNumber');
  });
});
