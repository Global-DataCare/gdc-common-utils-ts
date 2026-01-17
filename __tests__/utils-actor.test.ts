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
  });

  it('parses family subject with ONESELF role and no device uuid', () => {
    const sub = 'did:web:api.acme.org:family:zQmHash123:v3-RoleCode|ONESELF';
    const parsed = parseActorFromSub(sub);
    expect(parsed.organization).toBe('did:web:api.acme.org');
    expect(parsed.identifier).toBe('zQmHash123');
    expect(parsed.role).toBe('v3-RoleCode|ONESELF');
  });

  it('parses raw email subject', () => {
    const parsed = parseActorFromSub('  User@Example.com ');
    expect(parsed.sub).toBe('User@Example.com');
    expect(parsed.identifier).toBe('user@example.com');
  });
});
