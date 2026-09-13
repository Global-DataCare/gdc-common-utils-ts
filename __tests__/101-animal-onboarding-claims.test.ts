/**
 * Flow contract:
 * 1. The application authenticates a human controller outside animal identity.
 * 2. The animal request carries an exact non-human NCBI Taxonomy URI.
 * 3. The first Organization.member is the indexed animal itself, so its
 *    relationship is ONESELF; it is never the human controller.
 * 4. Organization.owner is the creating controller and keeps its contact
 *    separately from the animal subject.
 * 5. GW, not this helper, remains the enrollment authority.
 */
import {
  buildAnimalOnboardingClaims,
  buildNcbiTaxonomyUri,
  NcbiTaxonomy,
} from '../src/models/animal-onboarding';
import {
  HL7_DEFAULT_CONTROLLER_RELATIONSHIP_ANIMAL_CARE,
  HL7_DEFAULT_INDIVIDUAL_MEMBER_ROLE,
  HL7_DEFAULT_ROLE_ANIMAL_CARE,
} from '../src/constants/hl7-roles';

describe('animal onboarding claims', () => {
  it('builds a dog card request without copying the controller into animal identity', () => {
    expect(HL7_DEFAULT_INDIVIDUAL_MEMBER_ROLE).toBe('ONESELF');
    expect(HL7_DEFAULT_ROLE_ANIMAL_CARE).toBe('RESPRSN');
    expect(HL7_DEFAULT_CONTROLLER_RELATIONSHIP_ANIMAL_CARE).toBe('RESPRSN');
    expect(buildAnimalOnboardingClaims({
      subjectId: 'animal-0001',
      cardDidWeb: 'did:web:animals.example:card:subject:animal:animal-0001',
      alternateName: 'Example dog',
      birthYear: 2021,
      gender: 'female',
      ncbiTaxonomyId: NcbiTaxonomy.Dog,
      controllerEmail: 'controller@example.org',
    })).toEqual(expect.objectContaining({
      'org.schema.Organization.identifier.value': 'animal-0001',
      'org.schema.Organization.additionalType': 'animal',
      'org.schema.Organization.member.name': 'Example dog',
      'org.schema.Organization.member.additionalType':
        'http://purl.obolibrary.org/obo/NCBITaxon_9615',
      'org.schema.Organization.member.role': 'ONESELF',
      'org.schema.Organization.member.birthDate': '2021',
      'org.schema.Organization.owner.email': 'controller@example.org',
      'org.schema.Service.category': 'animal-care',
    }));
  });

  it('rejects human and malformed taxonomy identifiers', () => {
    expect(() => buildNcbiTaxonomyUri('9606')).toThrow(/not valid for animal/i);
    expect(() => buildNcbiTaxonomyUri('dog')).toThrow(/positive numeric/i);
  });
});
