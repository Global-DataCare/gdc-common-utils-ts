// Flow contract: dentists retain their own ISCO occupation in health-care; controller authority and animal-care roles remain separate.
import {HealthcareActorRoles,HealthcareActorRoleCodes,HealthcareProfessionalRoleCodesBySector,getHealthcareRoleByClaim} from '../src/constants/healthcare';
import {DataspaceSectors} from '../src/constants/sectors';

test('publishes dentists as a health-care occupation, not medical doctors or controller authority',()=>{
  expect(HealthcareActorRoles).toHaveProperty('Dentist','ISCO-08|2261');
  expect(HealthcareActorRoleCodes).toHaveProperty('Dentist','2261');
  expect(getHealthcareRoleByClaim('ISCO-08|2261')).toMatchObject({code:'2261',titleEn:'Dentist'});
  expect(HealthcareProfessionalRoleCodesBySector[DataspaceSectors.HealthCare]).toContain('2261');
  expect(HealthcareProfessionalRoleCodesBySector[DataspaceSectors.AnimalCare]).not.toContain('2261');
  expect(HealthcareActorRoles.Controller).toBe('RESPRSN');
});
