import {
  buildConsentClaimsSimple,
  buildConsentClaimsSimpleWithCid,
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
    expect(resolveActorIdentifier({ organizationTaxId: 'b12345678' })).toBe('urn:taxid:B12345678');
    expect(resolveActorIdentifier({ phone: '+34 600 111 222' })).toBe('urn:tel:+34600111222');
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
        actor: { url: 'hospital.example.com' },
        actorRole: 'Practitioner',
        purpose: 'TREAT',
        actions: ['organization/Composition.rs', 'organization/Appointment.cruds'],
      },
      { consentIdentifierFactory: () => 'urn:uuid:consent-123' },
    );

    expect(built.actorIdentifier).toBe('did:web:hospital.example.com');
    expect(built.subjectIdentifier).toBe('urn:person:phone:+34600111222:given:ana-maria');
    expect(built.consentClaims['Consent.identifier']).toBe('urn:uuid:consent-123');
    expect(built.consentClaims['Consent.action']).toBe('organization/Composition.rs,organization/Appointment.cruds');
  });

  it('adds deterministic claims CID as @id', () => {
    const withCidA = buildConsentClaimsSimpleWithCid(
      {
        subjectDid: 'did:web:subject.example.com',
        actor: { identifier: 'did:web:hospital.example.com' },
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
        actor: { identifier: 'did:web:hospital.example.com' },
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
