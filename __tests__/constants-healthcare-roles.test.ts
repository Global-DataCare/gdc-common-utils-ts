import { describe, expect, it } from '@jest/globals';
import {
  HealthcareActorRoles,
  HealthcareRoleFamilies,
  HealthcareRolesBySector,
  HealthcareRolesByFamily,
  getHealthcareRoleByClaim,
  getHealthcareRolesBySector,
  getHealthcareRolesByFamily,
  getHealthcareProfessionalRolesBySector,
} from '../src/constants/healthcare.js';
import { DataspaceSectors } from '../src/constants/sectors.js';
import { roleCodeI18nEn } from '../src/i18n/role-codes.i18n.js';

describe('healthcare role catalogs', () => {
  it('exposes role families for ISCO-08 and HL7 relationship/legal sets', () => {
    const professional = getHealthcareRolesByFamily(HealthcareRoleFamilies.ProfessionalOccupationIsco08);
    const personal = getHealthcareRolesByFamily(HealthcareRoleFamilies.PersonalRelationshipHl7);
    const legal = getHealthcareRolesByFamily(HealthcareRoleFamilies.LegalRepresentativeHl7);

    expect(Object.keys(professional).length).toBeGreaterThan(0);
    expect(Object.keys(personal).length).toBeGreaterThan(10);
    expect(Object.keys(legal).length).toBeGreaterThan(0);
  });

  it('resolves role descriptors by claim with i18n keys and labels', () => {
    const physician = getHealthcareRoleByClaim(HealthcareActorRoles.Physician);
    const responsibleParty = getHealthcareRoleByClaim('v3-RoleCode|RESPRSN');

    expect(physician).toBeDefined();
    expect(physician?.code).toBe('2211');
    expect(physician?.i18nKey).toBe('org.ilo.isco-08.2211');

    expect(responsibleParty).toBeDefined();
    expect(responsibleParty?.i18nKey).toBe('org.hl7.v3.roleCode.RESPRSN');
  });

  it('returns professional ISCO roles by health and animal sectors', () => {
    const healthRoles = getHealthcareProfessionalRolesBySector(DataspaceSectors.HealthCare);
    const animalRoles = getHealthcareProfessionalRolesBySector(DataspaceSectors.AnimalCare);

    expect(Object.keys(healthRoles).length).toBeGreaterThan(0);
    expect(healthRoles['2211']?.claim).toBe(HealthcareActorRoles.Physician);
    expect(Object.keys(animalRoles).length).toBeGreaterThan(0);
    expect(animalRoles['2250']?.claim).toBe(HealthcareActorRoles.Veterinarian);
    expect(animalRoles['2211']).toBeUndefined();
  });

  it('exposes per-sector family catalogs for professional and personal roles', () => {
    const healthProfessional = getHealthcareRolesBySector(
      DataspaceSectors.HealthResearch,
      HealthcareRoleFamilies.ProfessionalOccupationIsco08,
    );
    const personalForAnimal = getHealthcareRolesBySector(
      DataspaceSectors.AnimalResearch,
      HealthcareRoleFamilies.PersonalRelationshipHl7,
    );

    expect(healthProfessional['2211']).toBeDefined();
    expect(healthProfessional['2250']).toBeUndefined();
    expect(personalForAnimal.ONESELF).toBeDefined();
    expect(HealthcareRolesBySector[DataspaceSectors.AnimalResearch]).toBeDefined();
  });

  it('builds role i18n map entries for ISCO and HL7 relationship/role codes', () => {
    expect(roleCodeI18nEn['org.ilo.isco-08.2211']).toBe('Physician');
    expect(roleCodeI18nEn['org.ilo.isco-08.2250']).toBe('Veterinarian');
    expect(roleCodeI18nEn['org.isco08.2211']).toBe('Physician');
    expect(roleCodeI18nEn['org.hl7.v3.personalRelationship.ONESELF']).toBeDefined();
    expect(roleCodeI18nEn['org.hl7.v3.roleCode.RESPRSN']).toBeDefined();
  });

  it('keeps exported family maps accessible for front/back usage', () => {
    expect(HealthcareRolesByFamily.professionalOccupationIsco08['2211']).toBeDefined();
    expect(HealthcareRolesByFamily.personalRelationshipHl7.ONESELF).toBeDefined();
    expect(HealthcareRolesByFamily.legalRepresentativeHl7.RESPRSN).toBeDefined();
  });
});
