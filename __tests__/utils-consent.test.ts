import {
  buildConsentClaimsSimple,
  buildConsentClaimsSimpleWithCid,
  normalizeConsentActors,
  parseConsentActorToken,
  resolveActorIdentifier,
  resolveSubjectIdentifier,
} from '../src/utils/consent';

describe('consent utilities', () => {
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
    expect(built.consentClaims['Consent.identifier']).toBe('urn:uuid:consent-123');
    expect(built.consentClaims['Consent.action']).toBe('organization/Composition.rs,organization/Appointment.cruds');
    expect(built.consentClaims['Consent.actor-identifier']).toBe('hospital@example.com,ES');
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
});
