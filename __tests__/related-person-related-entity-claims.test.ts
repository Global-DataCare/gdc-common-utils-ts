import { describe, expect, it } from '@jest/globals';
import { RelatedPersonClaim, RelatedPersonClaimSpecs } from '../src/models/interoperable-claims/related-person-claims';
import { readRelatedPersonListRecords } from '../src/utils/related-person-list';
import {
  HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_CODES,
  HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_ROLES,
  HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_ROLES_FULL,
  HL7_PERSONAL_RELATIONSHIP_ROLES,
  HL7_CODING_SYSTEM_V3_ROLE_CLASS,
  HL7_RELATED_PERSON_FUNCTIONAL_ROLES,
  isHl7IndividualMemberRelationshipCode,
} from '../src/constants/hl7-roles';

describe('RelatedPerson related-entity claims', () => {
  it('publishes the entity kind and original blockchain actor identifiers', () => {
    expect(RelatedPersonClaim.RelatedEntityType).toBe('RelatedPerson.related-entity-type');
    expect(RelatedPersonClaim.ActorIdentifier).toBe('RelatedPerson.actor-identifier');
    expect(RelatedPersonClaim.Role).toBe('RelatedPerson.role');
    expect(RelatedPersonClaimSpecs).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: RelatedPersonClaim.RelatedEntityType }),
      expect.objectContaining({ key: RelatedPersonClaim.ActorIdentifier }),
      expect.objectContaining({ key: RelatedPersonClaim.Role }),
    ]));
  });

  it('offers the documented compact family selector without invented or gendered fallback codes', () => {
    // Step 1. FAMMEMB is the neutral member fallback and specific choices stay
    // small enough for the UHC/VetChain selector shared by non-employees.
    expect(HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_CODES).toEqual([
      'FAMMEMB', 'WIFE', 'HUSB', 'DOMPART', 'SIS', 'BRO', 'SON', 'DAU',
      'PRN', 'GRPRN', 'GRNDCHILD', 'GGRPRN', 'FRND', 'NBOR', 'ROOM',
    ]);
    expect(HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_ROLES.map(({ code }) => code))
      .toEqual(HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_CODES);
    expect(HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_CODES.every((code) =>
      HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_ROLES_FULL.some((entry) => entry.code === code),
    )).toBe(true);
    expect(HL7_INDIVIDUAL_MEMBER_RELATIONSHIP_ROLES_FULL)
      .toBe(HL7_PERSONAL_RELATIONSHIP_ROLES);

    // Step 2. PERMITTED is an access decision, not an HL7 relationship.
    // GGRFTH is valid but male-specific. DEPEN is a functional RoleClass, not
    // a personal relationship choice, so neither belongs in this selector.
    expect(isHl7IndividualMemberRelationshipCode('PERMITTED')).toBe(false);
    expect(isHl7IndividualMemberRelationshipCode('GGRFTH')).toBe(false);
    expect(isHl7IndividualMemberRelationshipCode('DEPEN')).toBe(false);
    expect(HL7_RELATED_PERSON_FUNCTIONAL_ROLES).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'CAREGIVER', codingSystem: HL7_CODING_SYSTEM_V3_ROLE_CLASS }),
      expect.objectContaining({ code: 'DEPEN', codingSystem: HL7_CODING_SYSTEM_V3_ROLE_CLASS }),
    ]));
  });

  it('reads a country set without replacing its public rule inputs by an opaque id', () => {
    const [record] = readRelatedPersonListRecords({
      body: {
        data: [{
          resource: {
            id: 'country-group-1',
            meta: {
              claims: {
                [RelatedPersonClaim.IdentifierValue]: 'urn:uuid:country-group-1',
                [RelatedPersonClaim.Patient]: 'did:web:unid.online:card:subject-1',
                [RelatedPersonClaim.Name]: 'Emergencias España y Portugal',
                [RelatedPersonClaim.RelatedEntityType]: 'country-set',
                [RelatedPersonClaim.ActorIdentifier]: 'ES,PT',
                [RelatedPersonClaim.Role]: 'ECON, BILL',
              },
            },
          },
        }],
      },
    });

    expect(record.relatedEntityType).toBe('country-set');
    expect(record.actorIdentifiers).toEqual(['ES', 'PT']);
    expect(record.roles).toEqual(['ECON', 'BILL']);
    expect(record.resourceId).toBe('country-group-1');
  });

  it('reads contextualized GW projection keys from a Communication write', () => {
    const [record] = readRelatedPersonListRecords({ body: { data: [{ resource: {
      id: 'professional-1',
      meta: { claims: {
        '@context': 'org.hl7.fhir.api',
        'org.hl7.fhir.api.RelatedPerson.identifier': 'urn:uuid:professional-1',
        'org.hl7.fhir.api.RelatedPerson.patient': 'did:web:subject.example',
        'org.hl7.fhir.api.RelatedPerson.name': 'Doctor Test',
        'org.hl7.fhir.api.RelatedPerson.related-entity-type': 'person',
        'org.hl7.fhir.api.RelatedPerson.actor-identifier': 'doctor@example.org',
      } },
    } }] } });

    expect(record).toMatchObject({
      identifier: 'urn:uuid:professional-1',
      name: 'Doctor Test',
      relatedEntityType: 'person',
      actorIdentifiers: ['doctor@example.org'],
    });
  });
});
