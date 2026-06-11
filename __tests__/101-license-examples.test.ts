import {
  buildLicenseIssueEntry,
  buildLicenseSearchEntry,
  ClaimsIndividualProductSchemaorg,
  ClaimsOfferSchemaorg,
  ClaimsPersonSchemaorg,
  DeviceAppTypes,
  DeviceUserClasses,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_LICENSE_ACTIVE_RECORD,
  EXAMPLE_LICENSE_ISSUE_CLAIMS,
  EXAMPLE_LICENSE_ISSUE_INPUT,
  EXAMPLE_LICENSE_PURCHASE_CLAIMS,
  EXAMPLE_LICENSE_PURCHASE_EXPECTED_SERIAL_NUMBER,
  EXAMPLE_LICENSE_PURCHASE_INPUT,
  LicenseCategories,
  LicenseEntryOperations,
  LicenseEntryTypes,
  LicenseStatuses,
  buildLicensePurchaseEntry,
} from '../src';

describe('101: license examples', () => {
  it('builds canonical issue claims from one controller/employee invitation without exposing raw claim keys to callers', () => {
    expect(EXAMPLE_LICENSE_ISSUE_CLAIMS).toEqual({
      '@context': 'org.schema',
      [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
      [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
      [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Mobile,
    });
  });

  it('builds the canonical License/_issue batch entry with IndividualProduct semantics', () => {
    const entry = buildLicenseIssueEntry(EXAMPLE_LICENSE_ISSUE_INPUT);

    expect(entry.type).toBe(LicenseEntryTypes.Issue);
    expect(entry.request.method).toBe('POST');
    expect(entry.meta.claims).toEqual({
      ...EXAMPLE_LICENSE_ISSUE_CLAIMS,
      '@type': LicenseEntryOperations.Issue,
    });
  });

  it('builds purchase claims from quantity plus explicit seat ids without inventing non-schema fields', () => {
    expect(EXAMPLE_LICENSE_PURCHASE_CLAIMS).toEqual({
      '@context': 'org.schema',
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
      [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Web,
      [ClaimsOfferSchemaorg.eligibleQuantityValue]: EXAMPLE_LICENSE_PURCHASE_INPUT.quantity,
      [ClaimsOfferSchemaorg.serialNumber]: EXAMPLE_LICENSE_PURCHASE_EXPECTED_SERIAL_NUMBER,
    });
  });

  it('builds the canonical purchase batch entry from the same neutral helper layer', () => {
    const entry = buildLicensePurchaseEntry(EXAMPLE_LICENSE_PURCHASE_INPUT);

    expect(entry.type).toBe(LicenseEntryTypes.Purchase);
    expect(entry.meta.claims).toEqual({
      ...EXAMPLE_LICENSE_PURCHASE_CLAIMS,
      '@type': LicenseEntryOperations.Purchase,
    });
  });

  it('builds a search entry that keeps schema.org selectors in claims and storage lifecycle selectors beside them', () => {
    const entry = buildLicenseSearchEntry({
      serialNumbers: [EXAMPLE_LICENSE_ACTIVE_RECORD.id],
      userClass: DeviceUserClasses.Employee,
      type: DeviceAppTypes.Mobile,
      email: EXAMPLE_EMAIL_CONTROLLER_ORG,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
      status: LicenseStatuses.Active,
      subjectId: EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId,
    });

    expect(entry.type).toBe(LicenseEntryTypes.Search);
    expect(entry.meta.claims).toMatchObject({
      '@context': 'org.schema',
      '@type': LicenseEntryOperations.Search,
      [ClaimsOfferSchemaorg.serialNumber]: EXAMPLE_LICENSE_ACTIVE_RECORD.id,
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
      [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Mobile,
      [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
      [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
    });
    expect(entry.meta.status).toBe(LicenseStatuses.Active);
    expect(entry.meta.subjectId).toBe(EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId);
  });
});
