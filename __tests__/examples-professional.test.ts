import { describe, expect, it } from '@jest/globals';
import { HealthcareActorRoles, HealthcareConsentPurposes } from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import {
  EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS,
  EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS,
} from '../src/examples/professional.js';
import {
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_HEALTHCARE_JURISDICTION,
  EXAMPLE_PROVIDER_ORGANIZATION_URL,
} from '../src/examples/shared.js';

describe('professional access examples', () => {
  // These assertions must use the shared synthetic fixtures from `src/examples/shared.ts`.
  // Tests here should never re-hardcode actor emails, organization URLs, or jurisdictions.
  it('defines reusable scenarios for multiple professional roles and data sections', () => {
    expect(EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS.physicianAllergiesRead.actorRole).toBe(
      HealthcareActorRoles.GeneralistMedicalPractitioner,
    );
    expect(EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS.nursingMedicationRead.actorRole).toBe(HealthcareActorRoles.NursingProfessional);
    expect(EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS.paramedicEmergencySummaryRead.purpose).toBe(HealthcareConsentPurposes.EmergencyTreatment);
    expect(EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS.physicianResultsAndProblemsRead.includedTypes).toContain(ResourceTypesFhirR4.DiagnosticReport);
  });

  it('keeps clinical reads limited to the section-root scope covered by consent', () => {
    for (const scenario of Object.values(EXAMPLE_PROFESSIONAL_ACCESS_SCENARIOS)) {
      expect(scenario.smartScopes).toHaveLength(1);
      expect(scenario.smartScopes[0]).toMatch(/^organization\/Composition\./);
      expect(scenario.smartScopes[0]).not.toContain('Consent.cruds');
    }
  });

  it('defines consent scenarios for email, organization, and jurisdiction targeting', () => {
    expect(EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS.physicianByEmailContinuousCareAllergiesAllowed.actorId).toBe(EXAMPLE_EMAIL_PROFESSIONAL);
    expect(EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS.physicianByOrganizationResultsAllowed.actorId).toMatchObject({
      organizationUrl: EXAMPLE_PROVIDER_ORGANIZATION_URL,
    });
    expect(EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS.physicianByJurisdictionEmergencySummaryAllowed.actorId).toBe(EXAMPLE_HEALTHCARE_JURISDICTION);
  });

  it('defines both allowed and denied consent-vs-smart outcomes', () => {
    expect(EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS.physicianByEmailEmergencySummaryAllowed.expectedSmartTokenDecision).toBe('allowed');
    expect(EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS.physicianObstetricianDeniedWhenOnlyAllergiesConsent.expectedSmartTokenDecision).toBe('denied');
    expect(EXAMPLE_PROFESSIONAL_CONSENT_SCENARIOS.physicianByEmailDeniedWhenConsentRevokedAndNoOrgNorJurisdictionConsentIsActive.expectedSmartTokenDecision).toBe('denied');
  });
});
