import {
  ActorCapabilities,
  ActorCapabilityDocs,
  ActorKinds,
  getActorCapabilityDoc,
} from '../src/constants/actor-session.js';

describe('actor capability docs', () => {
  it('documents hosting capabilities with unified Hosting naming', () => {
    expect(ActorCapabilities.HostingActivateOrganization).toBe('hosting.activate_organization');
    expect(ActorCapabilities.HostingConfirmOrder).toBe('hosting.confirm_order');
    expect(ActorCapabilities.HostingDisableHost).toBe('hosting.disable_host');
    expect(ActorCapabilities.HostingPurgeHost).toBe('hosting.purge_host');
    expect(ActorCapabilities.IndividualReadClinicalSummary).toBe(
      'individual.read_clinical_summary',
    );

    expect(getActorCapabilityDoc(ActorCapabilities.HostingDisableHost)).toEqual({
      actorKind: ActorKinds.HostOnboarding,
      summary: 'Disables the host publication lifecycle once no hosted tenants remain registered.',
      programmingHint: 'Expect discovery and DCAT publication to become unavailable after success.',
      relatedMethods: ['disableHost'],
    });
  });

  it('documents every capability with actor ownership, summary, and programming hint', () => {
    for (const capability of Object.values(ActorCapabilities)) {
      const doc = ActorCapabilityDocs[capability];
      expect(typeof doc.actorKind).toBe('string');
      expect(doc.actorKind.length).toBeGreaterThan(0);
      expect(typeof doc.summary).toBe('string');
      expect(doc.summary.length).toBeGreaterThan(0);
      expect(typeof doc.programmingHint).toBe('string');
      expect(doc.programmingHint.length).toBeGreaterThan(0);
      expect(Array.isArray(doc.relatedMethods)).toBe(true);
      expect(doc.relatedMethods.length).toBeGreaterThan(0);
    }
  });
});
