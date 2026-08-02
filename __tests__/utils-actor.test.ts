import { parseActorFromSub } from '../src/utils/actor.js';

describe('parseActorFromSub', () => {
  it('returns trimmed subject and minimal info for empty input', () => {
    expect(parseActorFromSub('  ')).toEqual({ sub: '' });
  });

  it('parses did:web subject with organization, email, and role', () => {
    const sub = 'did:web:api.acme.org:employee:doctor1@acme.org:ISCO-08|2211';
    const parsed = parseActorFromSub(sub);
    expect(parsed.sub).toBe(sub);
    expect(parsed.organization).toBe('did:web:api.acme.org');
    expect(parsed.identifier).toBe('doctor1@acme.org');
    expect(parsed.role).toBe('ISCO-08|2211');
    expect(parsed.memberKind).toBe('organization');
  });

  it('parses did:web subject with role and device uuid', () => {
    const sub = 'did:web:api.acme.org:employee:doctor1@acme.org:ISCO-08|2211:550e8400-e29b-41d4-a716-446655440000';
    const parsed = parseActorFromSub(sub);
    expect(parsed.organization).toBe('did:web:api.acme.org');
    expect(parsed.identifier).toBe('doctor1@acme.org');
    expect(parsed.role).toBe('ISCO-08|2211');
  });

  it('parses family subject with role and device uuid', () => {
    const sub = 'did:web:api.acme.org:family:zQmHash123:v3-RoleCode|CHILD:550e8400-e29b-41d4-a716-446655440000';
    const parsed = parseActorFromSub(sub);
    expect(parsed.organization).toBe('did:web:api.acme.org');
    expect(parsed.identifier).toBe('zQmHash123');
    expect(parsed.role).toBe('v3-RoleCode|CHILD');
    expect(parsed.memberKind).toBe('individual');
  });

  it('parses family subject with ONESELF role and no device uuid', () => {
    const sub = 'did:web:api.acme.org:family:zQmHash123:v3-RoleCode|ONESELF';
    const parsed = parseActorFromSub(sub);
    expect(parsed.organization).toBe('did:web:api.acme.org');
    expect(parsed.identifier).toBe('zQmHash123');
    expect(parsed.role).toBe('v3-RoleCode|ONESELF');
  });

  it('parses an organization member independently of the member path label', () => {
    const sub = 'did:web:external.example.org:member:zEmailHash:ISCO-08|2211';
    const parsed = parseActorFromSub(sub);
    expect(parsed.organization).toBe('did:web:external.example.org');
    expect(parsed.identifier).toBe('zEmailHash');
    expect(parsed.role).toBe('ISCO-08|2211');
    expect(parsed.memberKind).toBe('organization');
  });

  it('parses an individual member by the terminal identifier and role tuple', () => {
    const sub = 'did:web:personal.example.org:individual-member:zPhoneHash:v3-RoleCode|CHILD:device-1';
    const parsed = parseActorFromSub(sub);
    expect(parsed.organization).toBe('did:web:personal.example.org');
    expect(parsed.identifier).toBe('zPhoneHash');
    expect(parsed.role).toBe('v3-RoleCode|CHILD');
    expect(parsed.memberKind).toBe('individual');
  });

  it('does not infer an identifier when the DID has no coded role segment', () => {
    const parsed = parseActorFromSub('did:web:external.example.org:member:zEmailHash');
    expect(parsed.organization).toBe('did:web:external.example.org');
    expect(parsed.identifier).toBeUndefined();
    expect(parsed.role).toBeUndefined();
  });

  it('parses raw email subject', () => {
    const parsed = parseActorFromSub('  User@Example.com ');
    expect(parsed.sub).toBe('User@Example.com');
    expect(parsed.identifier).toBe('user@example.com');
  });
});
