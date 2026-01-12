import { parseActorFromSub } from '../src/utils/actor.js';

describe('parseActorFromSub', () => {
  it('returns trimmed subject and minimal info for empty input', () => {
    expect(parseActorFromSub('  ')).toEqual({ sub: '' });
  });

  it('parses did:web subject with organization, email, and role', () => {
    const sub = 'did:web:api.acme.org:employee:Doctor1@ACME.org:role:ISCO-08|2211';
    const parsed = parseActorFromSub(sub);
    expect(parsed.sub).toBe(sub);
    expect(parsed.organization).toBe('did:web:api.acme.org');
    expect(parsed.email).toBe('doctor1@acme.org');
    expect(parsed.role).toBe('ISCO-08|2211');
  });

  it('parses raw email subject', () => {
    const parsed = parseActorFromSub('  User@Example.com ');
    expect(parsed.sub).toBe('User@Example.com');
    expect(parsed.email).toBe('user@example.com');
  });
});
