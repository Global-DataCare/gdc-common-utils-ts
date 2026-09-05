// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import {
  buildClinicalCreatorPermissionActor,
  buildFhirIpsCreatorAuthor,
  buildFhirIpsCreatorProvenance,
  FhirIpsCreatorKinds,
  resolveClinicalCreatorBinding,
} from '../src/utils/fhir-ips-creator-identity';
import { HL7_RELATED_PERSON_FUNCTIONAL_ROLES } from '../src/constants/hl7-roles';
import { buildStableActorIdentifier, StableActorContactKinds } from '../src/utils/actor-identifier';
import {
  EXAMPLE_CLIENT_INSTANCE_UUID,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  EXAMPLE_KYC_CONTROLLER_USER_UUID,
  EXAMPLE_KYC_CONTROLLER_UUID,
  EXAMPLE_PROVIDER_ORGANIZATION_DID,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_KYC_CONTROLLER_TELEPHONE,
} from '../src/examples/shared';

describe('101: one stable clinical creator across channels and FHIR IPS export', () => {
  /**
   * Teaching goal:
   * - an application imports or generates one UUID for the professional
   * - verified portal, telephone and DCR sessions resolve the same role attester
   * - the exported IPS references ordinary FHIR Organization, Practitioner and PractitionerRole resources
   */
  it('keeps one professional attester when portal, telephone and DCR channels change', () => {
    // Step 1. Reuse the imported professional UUID and the role-assignment UUID.
    const practitionerIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`;
    const practitionerRoleIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`;
    const author = buildFhirIpsCreatorAuthor({
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: practitionerIdentifier,
      authorIdentifier: practitionerRoleIdentifier,
      organizationReference: EXAMPLE_PROVIDER_ORGANIZATION_DID,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    });

    // Step 2. Export an IPS-native author reference plus its resolvable resources.
    expect(author.authorReference).toBe(practitionerRoleIdentifier);
    expect(author.entries).toEqual([
      expect.objectContaining({
        fullUrl: EXAMPLE_PROVIDER_ORGANIZATION_DID,
        resource: expect.objectContaining({
          resourceType: 'Organization',
          identifier: [{ value: EXAMPLE_PROVIDER_ORGANIZATION_DID }],
        }),
      }),
      expect.objectContaining({
        fullUrl: practitionerIdentifier,
        resource: expect.objectContaining({
          resourceType: 'Practitioner',
          identifier: [{ value: practitionerIdentifier }],
        }),
      }),
      expect.objectContaining({
        fullUrl: practitionerRoleIdentifier,
        resource: expect.objectContaining({
          resourceType: 'PractitionerRole',
          identifier: [{ value: practitionerRoleIdentifier }],
          practitioner: { reference: practitionerIdentifier },
          organization: { reference: EXAMPLE_PROVIDER_ORGANIZATION_DID },
        }),
      }),
    ]);

    // Step 3. Every already-authenticated channel resolves that same author.
    const emailIdentifier = buildStableActorIdentifier({
      contactKind: StableActorContactKinds.Email,
      contact: EXAMPLE_EMAIL_PROFESSIONAL,
    });
    const telephoneIdentifier = buildStableActorIdentifier({
      contactKind: StableActorContactKinds.Phone,
      contact: EXAMPLE_KYC_CONTROLLER_TELEPHONE,
    });
    const binding = {
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: practitionerIdentifier,
      authorIdentifier: practitionerRoleIdentifier,
      ownerIdentifier: EXAMPLE_PROVIDER_ORGANIZATION_DID,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
      verifiedContactIdentifiers: [emailIdentifier, telephoneIdentifier],
      dcrClientIds: [EXAMPLE_CLIENT_INSTANCE_UUID],
    };

    expect(resolveClinicalCreatorBinding([binding], { verifiedContactIdentifiers: [emailIdentifier] }))
      .toEqual(binding);
    expect(resolveClinicalCreatorBinding([binding], { verifiedContactIdentifiers: [telephoneIdentifier] }))
      .toEqual(binding);
    expect(resolveClinicalCreatorBinding([binding], { dcrClientId: EXAMPLE_CLIENT_INSTANCE_UUID }))
      .toEqual(binding);
    expect(buildClinicalCreatorPermissionActor(binding)).toEqual({
      actorIdentifier: practitionerRoleIdentifier,
      actorRole: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    });
  });

  /**
   * Teaching goal:
   * - an individual member is exported as RelatedPerson
   * - ONESELF remains the individual subject and does not create a fake RelatedPerson
   */
  it('exports an individual member and ONESELF with their correct FHIR references', () => {
    const individualIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`;
    const memberIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`;
    const relationshipIdentifier = `urn:uuid:${EXAMPLE_CLIENT_INSTANCE_UUID}`;

    const member = buildFhirIpsCreatorAuthor({
      kind: FhirIpsCreatorKinds.IndividualMember,
      actorIdentifier: memberIdentifier,
      authorIdentifier: relationshipIdentifier,
      subjectReference: individualIdentifier,
      role: EXAMPLE_RELATED_PERSON_ROLE,
    });
    expect(member.authorReference).toBe(relationshipIdentifier);
    expect(member.entries[0]).toEqual(expect.objectContaining({
      fullUrl: relationshipIdentifier,
      resource: expect.objectContaining({
        resourceType: 'RelatedPerson',
        identifier: [{ value: memberIdentifier }],
        patient: { reference: individualIdentifier },
      }),
    }));

    const oneself = buildFhirIpsCreatorAuthor({
      kind: FhirIpsCreatorKinds.IndividualSubject,
      actorIdentifier: individualIdentifier,
      authorIdentifier: individualIdentifier,
      subjectReference: individualIdentifier,
    });
    expect(oneself).toEqual({ authorReference: individualIdentifier, entries: [] });
  });

  it('exports the canonical cross-sector CAREGIVER function as a RelatedPerson attester', () => {
    // Journey: a residence caregiver records a neutral body-weight Observation.
    // The caregiver function is HL7, not a medical profession or product role.
    const caregiver = HL7_RELATED_PERSON_FUNCTIONAL_ROLES.find(({ code }) => code === 'CAREGIVER')!;
    const relationshipIdentifier = `urn:uuid:${EXAMPLE_CLIENT_INSTANCE_UUID}`;
    const provenance = buildFhirIpsCreatorProvenance({
      kind: FhirIpsCreatorKinds.IndividualMember,
      actorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`,
      authorIdentifier: relationshipIdentifier,
      subjectReference: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      role: `${caregiver.codingSystem}|${caregiver.code}`,
      compositionAuthorReference: relationshipIdentifier,
    });
    expect(provenance.attesters[0].party.reference).toBe(relationshipIdentifier);
    expect(provenance.entries[0].resource).toEqual(expect.objectContaining({
      resourceType: 'RelatedPerson',
      relationship: [{ coding: [expect.objectContaining({ code: caregiver.code })] }],
    }));
  });

  it('rejects an unregistered login or device channel', () => {
    const binding = {
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`,
      authorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      ownerIdentifier: EXAMPLE_PROVIDER_ORGANIZATION_DID,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
      verifiedContactIdentifiers: [],
      dcrClientIds: [],
    };
    expect(resolveClinicalCreatorBinding([binding], {
      dcrClientId: EXAMPLE_CLIENT_INSTANCE_UUID,
    })).toBeUndefined();
  });

  it('rejects non-UUID authors and ambiguous authenticated channel bindings', () => {
    expect(() => buildFhirIpsCreatorAuthor({
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: buildStableActorIdentifier({
        contactKind: StableActorContactKinds.Email,
        contact: EXAMPLE_EMAIL_PROFESSIONAL,
      }),
      authorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      organizationReference: EXAMPLE_PROVIDER_ORGANIZATION_DID,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    })).toThrow('actorIdentifier must be a canonical urn:uuid identifier.');

    const sharedContact = buildStableActorIdentifier({
      contactKind: StableActorContactKinds.Phone,
      contact: EXAMPLE_KYC_CONTROLLER_TELEPHONE,
    });
    const firstBinding = {
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`,
      authorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      ownerIdentifier: EXAMPLE_PROVIDER_ORGANIZATION_DID,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
      verifiedContactIdentifiers: [sharedContact],
    };
    const secondBinding = {
      kind: FhirIpsCreatorKinds.IndividualMember,
      actorIdentifier: `urn:uuid:${EXAMPLE_CLIENT_INSTANCE_UUID}`,
      authorIdentifier: `urn:uuid:${EXAMPLE_CLIENT_INSTANCE_UUID}`,
      ownerIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      role: EXAMPLE_RELATED_PERSON_ROLE,
      verifiedContactIdentifiers: [sharedContact],
    };
    expect(() => resolveClinicalCreatorBinding(
      [firstBinding, secondBinding],
      { verifiedContactIdentifiers: [sharedContact] },
    )).toThrow('Authenticated channel resolves more than one clinical creator binding.');
  });

  it('requires the persisted owner and governed role for every role-scoped binding', () => {
    expect(() => resolveClinicalCreatorBinding([{
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`,
      authorIdentifier: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      ownerIdentifier: '',
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
      dcrClientIds: [EXAMPLE_CLIENT_INSTANCE_UUID],
    }], { dcrClientId: EXAMPLE_CLIENT_INSTANCE_UUID })).toThrow('binding.ownerIdentifier is required.');
  });
});
