import {
  HealthcareBasicSections,
  HealthcareConsentPurposes,
  HealthcareSummarySections,
} from '../src/constants/healthcare';
import {
  EXAMPLE_CONSENT_ACCESS_RULES,
  EXAMPLE_CONSENT_ACCESS_SUBJECT,
  EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
} from '../src/examples/consent-access';
import { EXAMPLE_RELATED_PERSON_ROLE } from '../src/examples/shared';
import {
  buildSmartCompositionReadScope,
  deriveGrantedSmartScopes,
} from '../src/utils/smart-scope';
import { ClaimConsent } from '../src/models/consent-rule';

/**
 * Teaching goal:
 * show how an invited individual member may ask for every IPS section while
 * the trusted runtime derives a fail-closed token scope containing only the
 * sections granted by the controller's active Consent.
 */
describe('101 individual-member SMART scope derivation', () => {
  it('narrows an all-sections request to the exact controller grant', () => {
    // Step 1. The member asks for every known IPS summary section. Application
    // code imports the shared registry instead of copying LOINC literals.
    const requestedSections = Object.values(HealthcareSummarySections)
      .map((section) => section.attributeValue);
    const requestedScope = buildSmartCompositionReadScope({
      subjectDid: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      sections: requestedSections,
    });

    // Step 2. GW reads active Consent rules for this subject. This shared test
    // fixture models the controller grant created for the invited member.
    const result = deriveGrantedSmartScopes(
      [EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections],
      {
        requestedScopes: [requestedScope],
        actor: {
          actorKind: 'related-person',
          email: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
        },
        actorRole: EXAMPLE_RELATED_PERSON_ROLE,
        purpose: HealthcareConsentPurposes.Treatment,
      },
    );

    // Step 3. Only the granted allergies and medication-history sections are
    // returned. The signed token is created later by GW; common-utils never
    // signs or emits a bearer token.
    expect(result.decision).toBe('partial');
    expect(result.subject).toBe(EXAMPLE_CONSENT_ACCESS_SUBJECT);
    expect(result.grantedSections).toEqual([
      HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);
    expect(result.grantedScopes).toEqual([
      buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_CONSENT_ACCESS_SUBJECT,
        sections: result.grantedSections,
      }),
    ]);
    expect(result.deniedSections).toHaveLength(
      requestedSections.length - result.grantedSections.length,
    );
  });

  it('fails closed for a different member and for multi-subject requests', () => {
    const allergiesScope = buildSmartCompositionReadScope({
      subjectDid: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      sections: HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
    });

    const denied = deriveGrantedSmartScopes(
      [EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections],
      {
        requestedScopes: [allergiesScope],
        actor: {
          actorKind: 'related-person',
          email: 'different.member@example.org',
        },
        actorRole: EXAMPLE_RELATED_PERSON_ROLE,
        purpose: HealthcareConsentPurposes.Treatment,
      },
    );
    expect(denied.decision).toBe('denied');
    expect(denied.grantedScopes).toEqual([]);

    const otherSubjectScope = buildSmartCompositionReadScope({
      subjectDid: 'did:web:api.example.org:individual:other',
      sections: HealthcareBasicSections.AllergiesAndIntolerances.attributeValue,
    });
    expect(() => deriveGrantedSmartScopes(
      [EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections],
      {
        requestedScopes: [allergiesScope, otherSubjectScope],
        actor: {
          actorKind: 'related-person',
          email: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
        },
        actorRole: EXAMPLE_RELATED_PERSON_ROLE,
        purpose: HealthcareConsentPurposes.Treatment,
      },
    )).toThrow('single subject');
  });

  it('matches canonical LOINC pipe claims against registry colon section values', () => {
    const registrySection = 'loinc:48765-2';
    const canonicalClaim = 'LOINC|48765-2';
    const rule = Object.fromEntries(
      Object.entries({
        ...EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections,
        [ClaimConsent.action]: canonicalClaim,
      }).map(([key, value]) => [
        key.startsWith('Consent.') ? `org.hl7.fhir.api.${key}` : key,
        value,
      ]),
    ) as unknown as typeof EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections;
    const result = deriveGrantedSmartScopes([rule], {
      requestedScopes: buildSmartCompositionReadScope({
        subjectDid: EXAMPLE_CONSENT_ACCESS_SUBJECT,
        sections: registrySection,
      }),
      actor: {
        actorKind: 'related-person',
        email: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
      },
      actorRole: EXAMPLE_RELATED_PERSON_ROLE,
      purpose: HealthcareConsentPurposes.Treatment,
    });

    expect(result.grantedSections).toEqual([registrySection]);
  });
});
