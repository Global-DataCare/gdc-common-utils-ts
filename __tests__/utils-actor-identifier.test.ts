import {
  buildPortalActorDidWeb,
  buildStableActorIdentifier,
  stableActorIdentifierFromDidWeb,
} from '../src/utils/actor-identifier';
import { multibase58MultihashSha3_256 } from '../src/utils/same-as';

describe('buildStableActorIdentifier', () => {
  it('uses the existing normalized-email hash followed by the actor role', () => {
    const expectedHash = multibase58MultihashSha3_256('person@example.org');
    expect(buildStableActorIdentifier({
      contactKind: 'email', contact: ' MAILTO:Person@Example.ORG ',
    })).toBe(`urn:multibase:${expectedHash}`);
  });

  it('normalizes equivalent phone spellings and separates the personal role', () => {
    const formatted = buildStableActorIdentifier({
      contactKind: 'phone', contact: 'tel:+34 600 111 222',
    });
    const compact = buildStableActorIdentifier({
      contactKind: 'phone', contact: '+34600111222',
    });
    expect(formatted).toBe(compact);
    expect(formatted).toMatch(/^urn:multibase:z[^:]+$/);
  });

  it('round-trips through different portal did:web bindings', () => {
    const actorIdentifier = buildStableActorIdentifier({
      contactKind: 'email', contact: 'person@example.org',
    });
    for (const portalDidWeb of ['did:web:portal-a.example', 'did:web:portal-b.example']) {
      const did = buildPortalActorDidWeb({ portalDidWeb, actorIdentifier, role: 'RESPRSN' });
      expect(stableActorIdentifierFromDidWeb(did)).toBe(actorIdentifier);
    }
  });

  it('rejects an empty contact and a role outside the stable contract', () => {
    expect(() => buildStableActorIdentifier({
      contactKind: 'email', contact: '',
    })).toThrow('email is required');
  });
});
