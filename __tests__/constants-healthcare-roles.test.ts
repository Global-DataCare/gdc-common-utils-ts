// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
/**
 * Flow contract: consumers select one typed sector catalog, render its shared
 * i18n descriptors, and still authorize concrete actions independently. A role
 * appearing in a catalog never grants clinical or ledger permissions itself.
 */
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
  getHealthcareProfessionalRolesBySectorAndClaim,
} from '../src/constants/healthcare.js';
import { DataspaceSectors } from '../src/constants/sectors.js';
import { roleCodeI18nEn } from '../src/i18n/role-codes.i18n.js';
import { HL7_CODING_SYSTEM_V3_ROLE_CODE } from '../src/constants/hl7-roles.js';

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
    const generalistDoctor = getHealthcareRoleByClaim(HealthcareActorRoles.GeneralistMedicalPractitioner);
    const responsibleParty = getHealthcareRoleByClaim('v3-RoleCode|RESPRSN');
    const responsiblePartyFhirToken = getHealthcareRoleByClaim(
      `${HL7_CODING_SYSTEM_V3_ROLE_CODE}|RESPRSN`,
    );
    const oneSelf = getHealthcareRoleByClaim('v3-RoleCode|ONESELF');

    expect(generalistDoctor).toBeDefined();
    expect(generalistDoctor?.code).toBe('2211');
    expect(generalistDoctor?.i18nKey).toBe('org.ilo.isco-08.2211');

    expect(responsibleParty).toBeDefined();
    expect(responsiblePartyFhirToken).toEqual(responsibleParty);
    expect(responsibleParty?.i18nKey).toBe('org.hl7.terminology.CodeSystem.v3-RoleCode.RESPRSN');

    expect(oneSelf).toBeDefined();
    expect(oneSelf?.i18nKey).toBe('org.hl7.terminology.CodeSystem.v3-RoleCode.ONESELF');
  });

  it('returns professional ISCO roles by health and animal sectors', () => {
    const healthRoles = getHealthcareProfessionalRolesBySector(DataspaceSectors.HealthCare);
    const healthResearchRoles = getHealthcareProfessionalRolesBySector(DataspaceSectors.HealthResearch);
    const oneHealthResearchRoles = getHealthcareProfessionalRolesBySector(DataspaceSectors.OneHealthResearch);
    const animalRoles = getHealthcareProfessionalRolesBySector(DataspaceSectors.AnimalCare);
    const healthRolesByClaim = getHealthcareProfessionalRolesBySectorAndClaim(DataspaceSectors.HealthCare);

    expect(Object.keys(healthRoles).length).toBeGreaterThan(0);
    expect(healthRoles['221']?.claim).toBe(HealthcareActorRoles.MedicalDoctors);
    expect(healthRoles['2211']?.claim).toBe(HealthcareActorRoles.GeneralistMedicalPractitioner);
    expect(healthRoles['2212']?.claim).toBe(HealthcareActorRoles.SpecialistMedicalPractitioner);
    expect(healthRoles['2222']?.claim).toBe(HealthcareActorRoles.MidwiferyProfessional);
    expect(healthRoles['3344']?.claim).toBe(HealthcareActorRoles.MedicalSecretary);
    expect(healthRoles['4226']?.claim).toBe(HealthcareActorRoles.Receptionist);
    expect(healthResearchRoles['3344']?.claim).toBe(HealthcareActorRoles.MedicalSecretary);
    expect(oneHealthResearchRoles['3344']?.claim).toBe(HealthcareActorRoles.MedicalSecretary);
    expect(
      healthRolesByClaim[HealthcareActorRoles.GeneralistMedicalPractitioner]?.code,
    ).toBe('2211');
    expect(
      healthRolesByClaim[HealthcareActorRoles.GeneralistMedicalPractitioner]?.i18nKey,
    ).toBe('org.ilo.isco-08.2211');
    expect(Object.keys(animalRoles).length).toBeGreaterThan(0);
    expect(animalRoles['2250']?.claim).toBe(HealthcareActorRoles.Veterinarian);
    expect(animalRoles['4226']?.claim).toBe(HealthcareActorRoles.Receptionist);
    expect(animalRoles['2211']).toBeUndefined();
    expect(animalRoles['3344']).toBeUndefined();
  });

  it('exposes laboratory sectors with human, animal, and one-health occupations', () => {
    const healthLab = getHealthcareProfessionalRolesBySector(DataspaceSectors.HealthLab);
    const animalLab = getHealthcareProfessionalRolesBySector(DataspaceSectors.AnimalLab);
    const oneHealthLab = getHealthcareProfessionalRolesBySector(DataspaceSectors.OneHealthLab);

    expect(healthLab['3212']?.claim).toBe(HealthcareActorRoles.MedicalAndPathologyLaboratoryTechnician);
    expect(healthLab['3141']).toBeUndefined();
    expect(animalLab['3141']?.claim).toBe(HealthcareActorRoles.LifeScienceTechnician);
    expect(animalLab['3212']).toBeUndefined();
    expect(oneHealthLab['3212']?.claim).toBe(HealthcareActorRoles.MedicalAndPathologyLaboratoryTechnician);
    expect(oneHealthLab['3141']?.claim).toBe(HealthcareActorRoles.LifeScienceTechnician);
    expect(oneHealthLab['2250']?.claim).toBe(HealthcareActorRoles.Veterinarian);
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
    expect(roleCodeI18nEn['org.ilo.isco-08.221']).toBe('Medical doctors');
    expect(roleCodeI18nEn['org.ilo.isco-08.2211']).toBe('Generalist medical practitioner');
    expect(roleCodeI18nEn['org.ilo.isco-08.2212']).toBe('Specialist medical practitioner');
    expect(roleCodeI18nEn['org.ilo.isco-08.2222']).toBe('Midwifery professional');
    expect(roleCodeI18nEn['org.ilo.isco-08.3344']).toBe('Medical secretary');
    expect(roleCodeI18nEn['org.ilo.isco-08.4226']).toBe('Receptionists (general)');
    expect(roleCodeI18nEn['org.ilo.isco-08.2250']).toBe('Veterinarian');
    expect(roleCodeI18nEn['org.ilo.isco-08.3212']).toBe('Medical and pathology laboratory technician');
    expect(roleCodeI18nEn['org.ilo.isco-08.3141']).toBe('Life science technician (excluding medical)');
    expect(roleCodeI18nEn['org.hl7.terminology.CodeSystem.v3-RoleCode.ONESELF']).toBeDefined();
    expect(roleCodeI18nEn['org.hl7.terminology.CodeSystem.v3-RoleCode.RESPRSN']).toBeDefined();
  });

  it('keeps exported family maps accessible for front/back usage', () => {
    expect(HealthcareRolesByFamily.professionalOccupationIsco08['2211']).toBeDefined();
    expect(HealthcareRolesByFamily.personalRelationshipHl7.ONESELF).toBeDefined();
    expect(HealthcareRolesByFamily.legalRepresentativeHl7.RESPRSN).toBeDefined();
  });
});
