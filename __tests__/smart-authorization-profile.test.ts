// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import {
  SmartIntrospectionExtensionFields,
  VerifiablePresentationMediaTypes,
  buildFhirEmergencyAuthorizationDetails,
  readVerifiablePresentationJwtPayload,
} from '../src/utils/smart-authorization-profile';
import { buildSubjectIdentifierAssetId } from '../src/utils/subject-identity';
import { EXAMPLE_PERSON_CARD_URI } from '../src/examples/shared';
import { readFileSync } from 'node:fs';

describe('standards-aligned SMART authorization profile', () => {
  it('builds RFC 9396 emergency authorization details without private token claims', () => {
    const details = buildFhirEmergencyAuthorizationDetails({
      // Synthetic collision-resistant profile URI: the value itself is the validation contract.
      authorizationDetailType: 'urn:example:authorization-details:fhir-emergency-access:v1',
      subject: 'did:example:individual-123',
      scopes: [
        'patient/Composition.rs?subject=did:example:individual-123',
        'patient/Observation.r?subject=did:example:individual-123',
      ],
    });

    expect(details).toEqual([{
      type: 'urn:example:authorization-details:fhir-emergency-access:v1',
      actions: ['read'],
      datatypes: ['Composition', 'Observation'],
      identifier: 'did:example:individual-123',
      privileges: ['http://terminology.hl7.org/CodeSystem/v3-ActReason|BTG'],
    }]);
    expect(JSON.stringify(details)).not.toMatch(
      /emergency_consent_id|emergency_consent_expires_at|break_glass_authorization_id|break_glass_incident_id/,
    );
  });

  it('rejects an absent profile type and any scope that grants write access', () => {
    expect(() => buildFhirEmergencyAuthorizationDetails({
      authorizationDetailType: '',
      subject: 'did:example:individual-123',
      scopes: ['patient/Observation.r?subject=did:example:individual-123'],
    })).toThrow('authorization_detail_type_uri_required');
    expect(() => buildFhirEmergencyAuthorizationDetails({
      authorizationDetailType: 'urn:example:authorization-details:fhir-emergency-access:v1',
      subject: 'did:example:individual-123',
      scopes: ['patient/Observation.cruds?subject=did:example:individual-123'],
    })).toThrow('read_only_smart_scope_required');
  });

  it('uses vp_token as transport and reads VC 2.0 JWT payloads directly', () => {
    const presentation = {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [],
    };

    expect(SmartIntrospectionExtensionFields.VpToken).toBe('vp_token');
    expect(VerifiablePresentationMediaTypes.Jwt).toBe('application/vp+jwt');
    expect(readVerifiablePresentationJwtPayload(presentation)).toEqual({
      presentation,
      format: 'vc-data-model-2.0',
    });
  });

  it('reads the historical payload.vp wrapper only as explicit compatibility', () => {
    const legacyPresentation = {
      type: ['VerifiablePresentation'],
      verifiableCredential: [],
    };

    expect(readVerifiablePresentationJwtPayload({ vp: legacyPresentation })).toEqual({
      presentation: legacyPresentation,
      format: 'legacy-jwt-vp',
    });
    expect(() => readVerifiablePresentationJwtPayload({ vp: {}, type: 'VerifiablePresentation' }))
      .toThrow('ambiguous_verifiable_presentation_payload');
  });

  it('derives the opaque lookup key used to resolve the subject index provider before token issuance', () => {
    const lookupAssetId = buildSubjectIdentifierAssetId({
      codingSystem: 'NN',
      jurisdiction: 'ES',
      codeValue: '12345678Z',
    });

    expect(lookupAssetId).toMatch(/^urn:multibase:z/);
    expect(lookupAssetId).not.toContain('12345678Z');
    expect(EXAMPLE_PERSON_CARD_URI).not.toBe(lookupAssetId);
  });

  it('keeps the same standards boundary in 101 docs, README and every repository skill', () => {
    const guide = readFileSync('docs/101-SMART_AUTHORIZATION_PROFILE.md', 'utf8');
    const readme = readFileSync('README.md', 'utf8');
    const skills = [
      '.codex/skills/preserve-didcomm-identity-boundaries/SKILL.md',
      '.codex/skills/preserve-workspace-node-runtime/SKILL.md',
    ].map((path) => readFileSync(path, 'utf8'));

    expect(guide).toContain('`vp_token` is the OpenID4VP transport parameter');
    expect(guide).toMatch(/MUST NOT contain a wrapper claim named\s+`vp`/);
    expect(guide).toContain('`client_assertion` authenticates the OAuth client');
    expect(guide).toContain('`aud` is always the resolved index provider');
    expect(guide).toContain('The available issuing tenant does not need to host an index');
    expect(guide).toContain('Step 3 — Resolve the individual index provider');
    expect(guide).toContain('Step 4 — Ask an available tenant to issue the token');
    expect(guide).toMatch(/shared code\s+must consume the returned `card.identifier.value`/);
    expect(guide).toMatch(/The receiving EHR\s+is deliberately not the token audience/);
    expect(guide).toContain('not an RFC 9068 `at+jwt`');
    expect(guide).toContain('`authorization_details`');
    expect(guide).toMatch(/FHIR\s+`Consent`[\s\S]+FHIR\s+`AuditEvent`/);
    expect(readme).toContain('docs/101-SMART_AUTHORIZATION_PROFILE.md');
    for (const skill of skills) {
      expect(skill).toContain('SMART, OpenID4VP and introspection red lines');
      expect(skill).toContain('private emergency JWT claims');
    }
  });
});
