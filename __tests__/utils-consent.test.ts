import {
  buildConsentClaimsSimple,
  buildConsentClaimsSimpleWithCid,
  evaluateConsentCoverage,
  groupActiveConsentsByTarget,
  normalizeConsentTarget,
  normalizeConsentActors,
  parseConsentActorToken,
  resolveConsentActor,
  resolveActorIdentifier,
  resolveSubjectIdentifier,
} from '../src/utils/consent';
import {
  EXAMPLE_CONSENT_ACCESS_JURISDICTION,
  EXAMPLE_CONSENT_ACCESS_PROVIDER_DID,
  EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
  EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
  EXAMPLE_CONSENT_ACCESS_RULES,
  EXAMPLE_CONSENT_ACCESS_SUBJECT,
} from '../src/examples/consent-access';
import { ClaimConsent } from '../src/models/consent-rule';
import {
  HealthcareActorRoles,
  HealthcareBasicSections,
  HealthcareConsentPurposes,
} from '../src/constants/healthcare';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types';

describe('consent utilities', () => {
  // This suite may use synthetic fixtures, but they must come from shared/example imports
  // or be clearly local to the parser/normalizer behavior under test.
  // Canonical consent claim keys must be referenced through `ClaimConsent`.
  it('resolves actor identifier with canonical-first precedence', () => {
    expect(resolveActorIdentifier({ identifier: 'did:web:clinic.example.com' })).toBe('did:web:clinic.example.com');
    expect(resolveActorIdentifier({ didWeb: 'did:web:hospital.example.com' })).toBe('did:web:hospital.example.com');
    expect(resolveActorIdentifier({ url: 'https://hospital.example.com/portal' })).toBe('did:web:hospital.example.com');
    expect(resolveActorIdentifier({ url: 'hospital.example.com' })).toBe('did:web:hospital.example.com');
    expect(resolveActorIdentifier({ organizationUrl: 'https://legacy.example.com/app' })).toBe('did:web:legacy.example.com');
    expect(resolveActorIdentifier({ email: 'DOC@EXAMPLE.COM' })).toBe('doc@example.com');
    expect(resolveActorIdentifier({ phone: '+34 600 111 222' })).toBe('tel:+34600111222');
  });

  it('parses canonical consent actor tokens by format', () => {
    expect(parseConsentActorToken('did:web:clinic.example.com')).toEqual({ kind: 'did', value: 'did:web:clinic.example.com' });
    expect(parseConsentActorToken('DOC@EXAMPLE.COM')).toEqual({ kind: 'email', value: 'doc@example.com' });
    expect(parseConsentActorToken('tel:+34 600 111 222')).toEqual({ kind: 'phone', value: 'tel:+34600111222' });
    expect(parseConsentActorToken('ES')).toEqual({ kind: 'country', value: 'ES' });
    expect(parseConsentActorToken('not-a-valid-actor')).toBeUndefined();
  });

  it('normalizes actor lists and removes duplicates', () => {
    expect(normalizeConsentActors('did:web:clinic.example.com, DOC@EXAMPLE.COM, ES, DOC@EXAMPLE.COM')).toEqual([
      'did:web:clinic.example.com',
      'doc@example.com',
      'ES',
    ]);
    expect(normalizeConsentActors(['tel:+34 600 111 222', 'ES'])).toEqual(['tel:+34600111222', 'ES']);
  });

  it('throws when no resolvable actor remains after parsing', () => {
    expect(() => normalizeConsentActors('not-valid, neither-this')).toThrow(
      'Consent.actor-identifier input is required and must contain at least one resolvable token',
    );
  });

  it('resolves subject identifier from did or phone+givenName', () => {
    expect(resolveSubjectIdentifier({ subjectDid: 'did:web:subject.example.com' })).toBe('did:web:subject.example.com');
    expect(
      resolveSubjectIdentifier({
        subjectPhone: '+34 600 111 222',
        subjectGivenName: 'Ana Maria',
      }),
    ).toBe('urn:person:phone:+34600111222:given:ana-maria');
  });

  it('builds canonical consent claims from minimal fields', () => {
    const built = buildConsentClaimsSimple(
      {
        subjectPhone: '+34 600 111 222',
        subjectGivenName: 'Ana Maria',
        actor: 'hospital@example.com,ES',
        actorRole: 'Practitioner',
        purpose: 'TREAT',
        actions: ['organization/Composition.rs', 'organization/Appointment.cruds'],
      },
      { consentIdentifierFactory: () => 'urn:uuid:consent-123' },
    );

    expect(built.actorIdentifier).toBe('hospital@example.com,ES');
    expect(built.subjectIdentifier).toBe('urn:person:phone:+34600111222:given:ana-maria');
    expect(built.consentClaims[ClaimConsent.identifier]).toBe('urn:uuid:consent-123');
    expect(built.consentClaims[ClaimConsent.action]).toBe('organization/Composition.rs,organization/Appointment.cruds');
    expect(built.consentClaims[ClaimConsent.actorIdentifier]).toBe('hospital@example.com,ES');
  });

  it('adds deterministic claims CID as @id', () => {
    const withCidA = buildConsentClaimsSimpleWithCid(
      {
        subjectDid: 'did:web:subject.example.com',
        actor: 'did:web:hospital.example.com',
        actorRole: 'Practitioner',
        purpose: 'TREAT',
        actions: ['organization/Composition.rs', 'organization/Appointment.cruds'],
        consentIdentifier: 'urn:uuid:consent-abc',
        consentDate: '2026-04-24',
      },
      {},
    );

    const withCidB = buildConsentClaimsSimpleWithCid(
      {
        subjectDid: 'did:web:subject.example.com',
        actor: 'did:web:hospital.example.com',
        actorRole: 'Practitioner',
        purpose: 'TREAT',
        actions: ['organization/Composition.rs', 'organization/Appointment.cruds'],
        consentIdentifier: 'urn:uuid:consent-abc',
        consentDate: '2026-04-24',
      },
      {},
    );

    expect(withCidA.consentClaims['@id']).toBe(withCidA.claimsCid);
    expect(withCidA.claimsCid.startsWith('z')).toBe(true);
    expect(withCidA.claimsCid).toBe(withCidB.claimsCid);
  });

  it('normalizes organization URL targets into did:web organization selectors', () => {
    expect(normalizeConsentTarget('https://hospital.example.org/portal', { preferOrganizationDid: true })).toMatchObject({
      kind: 'organization',
      canonicalValue: 'did:web:hospital.example.org',
      isOrganizationTarget: true,
    });
  });

  it('resolves consent actor with direct, organization, and jurisdiction targets', () => {
    const actor = resolveConsentActor({
      actorKind: 'professional',
      email: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
      did: 'did:web:hospital.acme.org:employee:doctor.oncall@example.org:physician',
      jurisdiction: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
    });
    expect(actor.directTargets.map((target) => target.canonicalValue)).toContain(EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL);
    expect(actor.organizationTargets.map((target) => target.canonicalValue)).toContain('did:web:hospital.acme.org');
    expect(actor.jurisdictionTargets.map((target) => target.canonicalValue)).toContain('ES');
  });

  it('groups active consent rules by direct target, organization, and jurisdiction', () => {
    const grouped = groupActiveConsentsByTarget(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      now: '2026-05-23T10:00:00Z',
    });
    expect(grouped.byDirectTarget[EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL]).toHaveLength(3);
    expect(grouped.byOrganizationTarget[EXAMPLE_CONSENT_ACCESS_PROVIDER_DID]).toHaveLength(2);
    expect(grouped.byJurisdictionTarget.ES).toHaveLength(2);
    expect(grouped.byDirectTarget[EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL]).toHaveLength(1);
  });

  it('allows physician by direct email and role for continuous care', () => {
    const evaluation = evaluateConsentCoverage(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
        organizationDid: EXAMPLE_CONSENT_ACCESS_PROVIDER_DID,
        jurisdiction: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
      },
      actorRole: HealthcareActorRoles.Physician,
      purpose: HealthcareConsentPurposes.Treatment,
      sections: [HealthcareBasicSections.AllergiesAndIntolerances.claim],
      resourceTypes: [ResourceTypesFhirR4.AllergyIntolerance],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(true);
    expect(evaluation.allowedSections).toContain(HealthcareBasicSections.AllergiesAndIntolerances.claim);
  });

  it('allows physician by direct email and role for emergencies', () => {
    const evaluation = evaluateConsentCoverage(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
        organizationDid: EXAMPLE_CONSENT_ACCESS_PROVIDER_DID,
        jurisdiction: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
      },
      actorRole: HealthcareActorRoles.Physician,
      purpose: HealthcareConsentPurposes.EmergencyTreatment,
      sections: [HealthcareBasicSections.PatientSummaryDocument.claim],
      resourceTypes: [ResourceTypesFhirR4.DocumentReference],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(true);
  });

  it('applies explicit deny over broader organization allow for a concrete physician', () => {
    const evaluation = evaluateConsentCoverage(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
        organizationDid: EXAMPLE_CONSENT_ACCESS_PROVIDER_DID,
        jurisdiction: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
      },
      actorRole: HealthcareActorRoles.Physician,
      purpose: HealthcareConsentPurposes.Treatment,
      sections: [HealthcareBasicSections.Results.claim],
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(false);
    expect(evaluation.explicitDenials).toHaveLength(1);
    expect(evaluation.explicitDenials[0].matchKind).toBe('direct');
  });

  it('allows organization-scoped nurse access', () => {
    const evaluation = evaluateConsentCoverage(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: 'nurse1@hospital.acme.org',
        organizationDid: EXAMPLE_CONSENT_ACCESS_PROVIDER_DID,
      },
      actorRole: HealthcareActorRoles.NursingProfessional,
      purpose: HealthcareConsentPurposes.Treatment,
      sections: [HealthcareBasicSections.HistoryOfMedicationUse.claim],
      resourceTypes: [ResourceTypesFhirR4.MedicationStatement],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(true);
    expect(evaluation.winningRules[0].matchKind).toBe('organization');
  });

  it('allows jurisdiction-scoped paramedic access', () => {
    const evaluation = evaluateConsentCoverage(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: 'paramedic1@example.es',
        jurisdiction: EXAMPLE_CONSENT_ACCESS_JURISDICTION,
      },
      actorRole: HealthcareActorRoles.Paramedic,
      purpose: HealthcareConsentPurposes.EmergencyTreatment,
      sections: [HealthcareBasicSections.PatientSummaryDocument.claim],
      resourceTypes: [ResourceTypesFhirR4.Observation],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(true);
    expect(evaluation.winningRules[0].matchKind).toBe('jurisdiction');
  });

  it('denies physician obstetrician when only allergies consent exists', () => {
    const evaluation = evaluateConsentCoverage([
      EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare as any,
    ], {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
      },
      actorRole: `${HealthcareActorRoles.Physician}:obstetrician`,
      purpose: HealthcareConsentPurposes.Treatment,
      sections: [HealthcareBasicSections.Results.claim],
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(false);
    expect(evaluation.missing.sections).toContain(HealthcareBasicSections.Results.claim);
  });

  it('denies physician by email when consent is revoked and no broader rule remains active', () => {
    const evaluation = evaluateConsentCoverage([
      EXAMPLE_CONSENT_ACCESS_RULES.revokedPhysicianEmailConsent as any,
    ], {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'professional',
        email: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
      },
      actorRole: HealthcareActorRoles.Physician,
      purpose: HealthcareConsentPurposes.EmergencyTreatment,
      sections: [HealthcareBasicSections.PatientSummaryDocument.claim],
      resourceTypes: [ResourceTypesFhirR4.DocumentReference],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(false);
    expect(evaluation.missing.pairs[0].reason).toBe('default-deny-no-active-consent');
  });

  it('allows related person by direct email target', () => {
    const evaluation = evaluateConsentCoverage(Object.values(EXAMPLE_CONSENT_ACCESS_RULES) as any, {
      subject: EXAMPLE_CONSENT_ACCESS_SUBJECT,
      actor: {
        actorKind: 'related-person',
        email: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
      },
      actorRole: 'v3-RoleCode|RESPRSN',
      purpose: HealthcareConsentPurposes.Treatment,
      sections: [HealthcareBasicSections.PatientSummaryDocument.claim],
      resourceTypes: [ResourceTypesFhirR4.DocumentReference],
      now: '2026-05-23T10:00:00Z',
    });
    expect(evaluation.allowed).toBe(true);
    expect(evaluation.winningRules[0].matchKind).toBe('direct');
  });
});
