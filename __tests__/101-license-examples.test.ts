/**
 * Teaching goal
 *
 * Explain the two license stories without making an application author edit
 * raw claims:
 *
 * 1. An organization controller reserves a professional seat for an employee.
 * 2. An individual controller reserves one of the household seats when an
 *    existing contact is invited to become a member/caregiver.
 * 3. Buying or adding seats is different from issuing one existing seat.
 * 4. Individual seats may be free, but they still have an owner organization
 *    and an auditable allocation lifecycle.
 *
 * Low-level `meta` assertions below are an executable transport reference.
 * Product code should call the builders instead of writing these keys itself.
 */

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
  EXAMPLE_EMPLOYEE_DEVICE_ACTIVATION_INPUT,
  LicenseCategories,
  LicenseEntryOperations,
  LicenseEntryTypes,
  LicenseRoleKinds,
  LicenseStatuses,
  buildLicensePurchaseEntry,
  classifyLicenseRole,
  canRegisterLicenseDevice,
  listActiveLicenseDeviceBindings,
  resolveLicenseDeviceAllowance,
} from '../src';

describe('101: license examples', () => {
  it('allows two installations on one seat without consuming another professional license', () => {
    const seat = {
      deviceId: 'client-laptop',
      deviceInfo: { clientInstanceId: 'install-laptop' },
      activatedAt: 100,
    };

    expect(resolveLicenseDeviceAllowance(seat)).toBe(2);
    expect(listActiveLicenseDeviceBindings(seat)).toHaveLength(1);
    expect(canRegisterLicenseDevice(seat, 'install-desktop')).toBe(true);

    const fullSeat = {
      maxDevices: 2,
      deviceBindings: [
        { clientId: 'client-laptop', clientInstanceId: 'install-laptop', status: 'active' as const, deviceInfo: { clientInstanceId: 'install-laptop' }, activatedAt: 100 },
        { clientId: 'client-desktop', clientInstanceId: 'install-desktop', status: 'active' as const, deviceInfo: { clientInstanceId: 'install-desktop' }, activatedAt: 200 },
      ],
    };
    expect(canRegisterLicenseDevice(fullSeat, 'install-mobile')).toBe(false);
    expect(canRegisterLicenseDevice(fullSeat, 'install-desktop')).toBe(true);
  });
  it('builds canonical issue claims from one controller/employee invitation without exposing raw claim keys to callers', () => {
    // Step 1. The organization controller identifies one professional by
    // verified email and role.
    expect(EXAMPLE_LICENSE_ISSUE_CLAIMS).toEqual({
      '@context': 'org.schema',
      [ClaimsPersonSchemaorg.email]: EXAMPLE_EMAIL_CONTROLLER_ORG,
      [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
      [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Mobile,
    });
  });

  it('builds the canonical License/_issue batch entry with IndividualProduct semantics', () => {
    // Step 2. The shared builder turns that business input into the transport
    // entry consumed by GW License/_issue.
    const entry = buildLicenseIssueEntry(EXAMPLE_LICENSE_ISSUE_INPUT);

    expect(entry.type).toBe(LicenseEntryTypes.Issue);
    expect(entry.request.method).toBe('POST');
    expect(entry.meta.claims).toEqual({
      ...EXAMPLE_LICENSE_ISSUE_CLAIMS,
      '@type': LicenseEntryOperations.Issue,
    });
  });

  it('builds an individual-member invitation from an existing phone contact and keeps the owning organization explicit', () => {
    // Step 1. Patricia already has Fernando as a contact, so the invitation
    // targets the verified international phone and the RelatedPerson id.
    const entry = buildLicenseIssueEntry({
      telephone: '+34600111222',
      role: 'v3-RoleCode|RESPRSN',
      userClass: DeviceUserClasses.Individual,
      type: DeviceAppTypes.Web,
      ownerOrganizationId: 'individual-org-patricia',
      subjectDid: 'did:web:subject.example:card:personal:patricia',
      relatedPersonId: 'related-person-fernando',
      invitationId: 'invitation-patricia-fernando',
    });

    // Step 2. GW receives public recipient data because the invitation code
    // and later blockchain permission rule cannot be resolved from an opaque
    // browser-only id.
    expect(entry.meta.claims).toMatchObject({
      [ClaimsPersonSchemaorg.telephone]: '+34600111222',
      [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: 'v3-RoleCode|RESPRSN',
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Individual,
      [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Web,
    });

    // Step 3. Seat ownership, contact linkage and invitation lifecycle remain
    // separate identifiers even though one invitation reserves one seat.
    expect(entry.meta.ownerOrganizationId).toBe('individual-org-patricia');
    expect(entry.meta.subjectDid).toBe('did:web:subject.example:card:personal:patricia');
    expect(entry.meta.relatedPersonId).toBe('related-person-fernando');
    expect(entry.meta.invitationId).toBe('invitation-patricia-fernando');
  });

  it('rejects an invitation that has neither an email nor an international telephone', () => {
    // Step 1. A contact reference alone is not a deliverable or independently
    // verifiable invitation target.
    expect(() => buildLicenseIssueEntry({
      role: 'v3-RoleCode|RESPRSN',
      userClass: DeviceUserClasses.Individual,
      ownerOrganizationId: 'individual-org-patricia',
      relatedPersonId: 'related-person-fernando',
    })).toThrow('License issue requires an email or telephone recipient.');
  });

  it('classifies FHIR v3 roles as individual members and ISCO roles as externally licensed professionals', () => {
    // Step 1. A family member, caregiver or representative belongs to the
    // individual organization and therefore needs one seat from its pool.
    expect(classifyLicenseRole('v3-RoleCode|RESPRSN')).toBe(LicenseRoleKinds.IndividualMember);

    // Step 2. A doctor belongs to a professional organization. Patricia may
    // grant consent and send a notification, but her household must not pay or
    // consume a second license for that professional.
    expect(classifyLicenseRole('ISCO-08|2211')).toBe(LicenseRoleKinds.Professional);
    expect(classifyLicenseRole('org.ilo.isco-08|2211')).toBe(LicenseRoleKinds.Professional);
  });

  it('refuses to reserve an individual-member seat for an ISCO professional', () => {
    // Step 1. This negative path protects the license pool even if a portal or
    // voice client accidentally routes a professional invitation to
    // License/_issue with userClass=individual.
    expect(() => buildLicenseIssueEntry({
      email: 'doctor@example.org',
      role: 'ISCO-08|2211',
      userClass: DeviceUserClasses.Individual,
      ownerOrganizationId: 'individual-org-patricia',
    })).toThrow('ISCO professional roles do not consume individual-member licenses.');
  });

  it('builds purchase claims from quantity plus explicit seat ids without inventing non-schema fields', () => {
    // Step 3. Adding seats changes the pool; it does not invite anyone yet.
    expect(EXAMPLE_LICENSE_PURCHASE_CLAIMS).toEqual({
      '@context': 'org.schema',
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Professional,
      [ClaimsIndividualProductSchemaorg.additionalType]: DeviceAppTypes.Web,
      [ClaimsOfferSchemaorg.eligibleQuantityValue]: EXAMPLE_LICENSE_PURCHASE_INPUT.quantity,
      [ClaimsOfferSchemaorg.serialNumber]: EXAMPLE_LICENSE_PURCHASE_EXPECTED_SERIAL_NUMBER,
    });
  });

  it('builds a zero-cost individual seat addition without requiring payment proof', () => {
    // Step 1. The controller asks for one more household seat and sees its
    // complete commercial truth: the price is zero, not unknown.
    const entry = buildLicensePurchaseEntry({
      quantity: 1,
      userClass: DeviceUserClasses.Individual,
      type: DeviceAppTypes.Web,
      price: 0,
      priceCurrency: 'EUR',
      ownerOrganizationId: 'individual-org-patricia',
    });

    // Step 2. Zero remains present in the canonical claims so GW can
    // materialize the seat immediately without a payment-proof branch.
    expect(entry.meta.claims).toMatchObject({
      [ClaimsOfferSchemaorg.eligibleQuantityValue]: 1,
      [ClaimsOfferSchemaorg.price]: 0,
      [ClaimsOfferSchemaorg.priceCurrency]: 'EUR',
      [ClaimsIndividualProductSchemaorg.category]: LicenseCategories.Individual,
    });
    expect(entry.meta.ownerOrganizationId).toBe('individual-org-patricia');
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
    // Step 4. Controllers list their pool through the same shared reader,
    // filtered by the organization that owns the seats.
    const entry = buildLicenseSearchEntry({
      serialNumbers: [EXAMPLE_LICENSE_ACTIVE_RECORD.id],
      userClass: DeviceUserClasses.Employee,
      type: DeviceAppTypes.Mobile,
      email: EXAMPLE_EMAIL_CONTROLLER_ORG,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
      status: LicenseStatuses.Active,
      subjectId: EXAMPLE_LICENSE_ACTIVE_RECORD.subjectId,
      ownerOrganizationId: 'organization-acme',
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
    expect(entry.meta.ownerOrganizationId).toBe('organization-acme');
  });

  it('ships a minimum valid DCR payload in the shared employee device activation example', () => {
    expect(EXAMPLE_EMPLOYEE_DEVICE_ACTIVATION_INPUT.dcrPayload).toEqual({
      application_type: 'native',
      client_name: 'Acme Controller App',
      redirect_uris: ['acme-controller://callback'],
      jwks: {
        keys: [{ kid: 'controller-didcomm-enc-001', kty: 'EC', crv: 'P-384', x: '<enc-x>', y: '<enc-y>', use: 'enc', purposes: ['didcomm-enc'] }],
      },
      ext_device_info: {
        push_token: 'ExponentPushToken[example-controller]',
        push_provider: 'expo',
        device_id: 'device-controller-001',
        device_name: 'Controller iPhone',
      },
    });
  });
});
