// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import {
  BreakGlassReasonCodes,
  BreakGlassSubjectKinds,
  evaluateBreakGlassPolicy,
  matchesBreakGlassSubjectKind,
  type BreakGlassSubjectKindMatcher,
} from '../src/utils/break-glass-policy';
import { DataspaceSectors } from '../src/constants/sectors';
import {
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared';
import { EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN } from '../src/examples/inter-tenant-access-contract';
import { buildSmartCompositionReadScope } from '../src/utils/smart-scope';

describe('shared break-glass policy', () => {
  it('evaluates the neutral person emergency contract without GW-local policy literals', () => {
    expect(evaluateBreakGlassPolicy({
      routeSector: DataspaceSectors.HealthCare,
      subjectKind: BreakGlassSubjectKinds.Human,
      professionalRole: EXAMPLE_HEALTHCARE_ACTOR_ROLE_GENERALIST_MEDICAL_PRACTITIONER,
      requestedScope: buildSmartCompositionReadScope({ subjectDid: EXAMPLE_SUBJECT_DID }),
      reasonCode: BreakGlassReasonCodes.LifeThreatening,
    })).toEqual({ allowed: true, maxLifetimeSeconds: 900 });
  });

  it('keeps product DID formats outside the shared default and accepts injected domain matchers', () => {
    const domainSubjectDid = EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN;
    expect(matchesBreakGlassSubjectKind(domainSubjectDid, BreakGlassSubjectKinds.Animal)).toBe(false);

    const domainMatcher: BreakGlassSubjectKindMatcher = (subjectDid, subjectKind) =>
      subjectKind === BreakGlassSubjectKinds.Animal && subjectDid === domainSubjectDid;
    expect(matchesBreakGlassSubjectKind(
      domainSubjectDid,
      BreakGlassSubjectKinds.Animal,
      [domainMatcher],
    )).toBe(true);
    expect(matchesBreakGlassSubjectKind(EXAMPLE_SUBJECT_DID, BreakGlassSubjectKinds.Human)).toBe(true);
  });
});
