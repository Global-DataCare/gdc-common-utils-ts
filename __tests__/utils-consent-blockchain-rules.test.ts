import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import {
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER,
  EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER,
  EXAMPLE_CONTENT_ADDRESSED_SOURCE_REFERENCE,
  EXAMPLE_DEFAULT_ICA_DID,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
} from '../src/examples/shared.js';
import { EXAMPLE_CONSENT_ACCESS_RULES } from '../src/examples/consent-access.js';
import type { BundleEntry } from '../src/models/bundle.js';
import { ClaimConsent, ConsentDecisions } from '../src/models/consent-rule.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import type { EvidenceObjectDLT } from '../src/models/oidc4ida.evidence.model.js';
import {
  buildConsentAtomicRuleCidV1,
  buildConsentAtomicRuleId,
  buildConsentRulePrimaryDocument,
  deriveConsentRuleBlockchainStatus,
  resolveSourceReferenceFromEvidence,
  sanitizeConsentReferenceForBlockchain,
} from '../src/utils/permission-templates.js';

const EXPECTED_BLOCKCHAIN_RULE_ENTRY_TYPE = 'ConsentAccessRule' as const;
const EXPECTED_SHA3_384_PREFIX = 'sha3-384:' as const;
const EXPECTED_FHIR_CLAIMS_CONTEXT = EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare['@context'];
const TEST_EVIDENCE_METHOD = 'eid' as const;
const TEST_EVIDENCE_TYPE = 'document' as const;

/**
 * Reusable regex matcher for references that are intentionally hashed before
 * they are allowed to cross the shared blockchain export boundary.
 */
const SHA3_384_REFERENCE_PATTERN = /^sha3-384:[a-f0-9]{96}$/;

/**
 * Builds an evidence fixture with the minimum shape that the shared blockchain
 * helper needs: a public evidence identifier that later becomes
 * `Consent.source-reference`.
 */
function buildExampleEvidence(id: string): EvidenceObjectDLT {
  return {
    id,
    type: TEST_EVIDENCE_TYPE,
    method: TEST_EVIDENCE_METHOD,
    verifier: {
      organization: EXAMPLE_DEFAULT_ICA_DID,
    },
  } as EvidenceObjectDLT;
}

/**
 * Builds a single Consent bundle entry starting from canonical shared consent
 * examples and overriding only the fields that matter to the scenario.
 */
function buildConsentEntry(
  consentClaims: Record<string, unknown>,
  {
    entryId,
    fullUrl,
    evidence,
  }: Readonly<{
    entryId: string;
    fullUrl?: string;
    evidence?: EvidenceObjectDLT[];
  }>,
): BundleEntry {
  return {
    id: entryId,
    ...(fullUrl ? { fullUrl } : {}),
    type: ResourceTypesFhirR4.Consent,
    resource: {
      resourceType: ResourceTypesFhirR4.Consent,
      meta: {
        claims: consentClaims,
        ...(evidence ? { evidence } : {}),
      },
    },
  } as BundleEntry;
}

/**
 * Builds a `DocumentReference` entry that already carries a registered
 * evidence object. Consent rules in the same bundle can later resolve their
 * `Consent.source-reference` through this resource.
 */
function buildDocumentReferenceEntryWithEvidence({
  entryId,
  fullUrl,
  identifier,
  evidenceId,
}: Readonly<{
  entryId: string;
  fullUrl: string;
  identifier: string;
  evidenceId: string;
}>): BundleEntry {
  return {
    id: entryId,
    fullUrl,
    type: ResourceTypesFhirR4.DocumentReference,
    resource: {
      resourceType: ResourceTypesFhirR4.DocumentReference,
      meta: {
        claims: {
          [DocumentReferenceClaim.Identifier]: identifier,
        },
        evidence: [buildExampleEvidence(evidenceId)],
      },
    },
  } as BundleEntry;
}

describe('Consent blockchain rule primary-document utilities', () => {
  /**
   * Contract for junior developers:
   *
   * - GW CORE exports one JSON:API primary document with mandatory `data[]`
   * - every output entry represents one atomic access rule
 * - every output `data[i].id` is the CIDv1 hash of the computed logical `ruleId`
   * - claims used only to derive the `ruleId` stay out of the persisted
   *   blockchain projection
   * - the consent link survives as `Consent.event-basedon`
   * - `meta.audit` is not authored here because that belongs to chaincode
   */
  it('builds one primary document of sanitized atomic blockchain rules from multiple Consent entries', () => {
    const firstConsentClaims = {
      ...EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare,
      [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
      [ClaimConsent.sourceReference]: EXAMPLE_DOCUMENT_REFERENCE_URL,
    };
    const secondConsentClaims = {
      ...EXAMPLE_CONSENT_ACCESS_RULES.nurseByOrganization,
      [ClaimConsent.identifier]: EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER,
      [ClaimConsent.sourceReference]: EXAMPLE_CONTENT_ADDRESSED_SOURCE_REFERENCE,
    };

    const document = buildConsentRulePrimaryDocument([
      buildConsentEntry(firstConsentClaims, {
        entryId: `${EXAMPLE_CONSENT_IDENTIFIER}-entry-1`,
        fullUrl: EXAMPLE_CONSENT_IDENTIFIER,
      }),
      buildConsentEntry(secondConsentClaims, {
        entryId: `${EXAMPLE_CONSENT_IDENTIFIER}-entry-2`,
        fullUrl: EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER,
      }),
    ]);

    expect(document.data).toHaveLength(2);

    const expectedFirstRuleId = buildConsentAtomicRuleId({
      sourceConsentIdentifier: EXAMPLE_CONSENT_IDENTIFIER,
      subject: String(firstConsentClaims[ClaimConsent.subject]),
      decision: ConsentDecisions.Permit,
      actorIdentifier: String(firstConsentClaims[ClaimConsent.actorIdentifier]),
      purpose: String(firstConsentClaims[ClaimConsent.purpose]),
      role: String(firstConsentClaims[ClaimConsent.actorRole]),
    });
    expect(document.data[0].id).toBe(buildConsentAtomicRuleCidV1(expectedFirstRuleId));
    expect(document.data[0].type).toBe(EXPECTED_BLOCKCHAIN_RULE_ENTRY_TYPE);
    expect(document.data[0].resource.meta.claims).toEqual({
      '@context': EXPECTED_FHIR_CLAIMS_CONTEXT,
      [ClaimConsent.action]: firstConsentClaims[ClaimConsent.action],
      [ClaimConsent.actorRole]: firstConsentClaims[ClaimConsent.actorRole],
      [ClaimConsent.eventBasedOn]: expect.stringMatching(SHA3_384_REFERENCE_PATTERN),
      [ClaimConsent.sourceReference]: expect.stringMatching(SHA3_384_REFERENCE_PATTERN),
    });
    expect((document.data[0].resource.meta as Record<string, unknown>).audit).toBeUndefined();
    expect(document.data[0].resource.meta.claims[ClaimConsent.identifier]).toBeUndefined();
    expect(document.data[0].resource.meta.claims[ClaimConsent.subject]).toBeUndefined();
    expect(document.data[0].resource.meta.claims[ClaimConsent.actorIdentifier]).toBeUndefined();
    expect(document.data[0].resource.meta.claims[ClaimConsent.purpose]).toBeUndefined();

    const expectedSecondRuleId = buildConsentAtomicRuleId({
      sourceConsentIdentifier: EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER,
      subject: String(secondConsentClaims[ClaimConsent.subject]),
      decision: ConsentDecisions.Permit,
      actorIdentifier: String(secondConsentClaims[ClaimConsent.actorIdentifier]),
      purpose: String(secondConsentClaims[ClaimConsent.purpose]),
      role: String(secondConsentClaims[ClaimConsent.actorRole]),
    });
    expect(document.data[1].id).toBe(buildConsentAtomicRuleCidV1(expectedSecondRuleId));
    expect(document.data[1].resource.meta.claims).toEqual({
      '@context': EXPECTED_FHIR_CLAIMS_CONTEXT,
      [ClaimConsent.action]: secondConsentClaims[ClaimConsent.action],
      [ClaimConsent.actorRole]: secondConsentClaims[ClaimConsent.actorRole],
      [ClaimConsent.eventBasedOn]: EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER,
      [ClaimConsent.sourceReference]: EXAMPLE_CONTENT_ADDRESSED_SOURCE_REFERENCE,
    });
  });

  /**
   * Contract for public references:
   *
   * - canonical `z...` multibase references already comply with the shared
   *   blockchain boundary and pass through untouched
   * - plain URLs, UUIDs and similar identifiers must be converted to a
   *   deterministic SHA3-384 string before persistence
   */
  it('keeps base58 multibase references and hashes plain references', () => {
    expect(sanitizeConsentReferenceForBlockchain(EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER))
      .toBe(EXAMPLE_CONTENT_ADDRESSED_CONSENT_IDENTIFIER);
    expect(sanitizeConsentReferenceForBlockchain(EXAMPLE_CONTENT_ADDRESSED_SOURCE_REFERENCE))
      .toBe(EXAMPLE_CONTENT_ADDRESSED_SOURCE_REFERENCE);
    expect(sanitizeConsentReferenceForBlockchain('sha3-384:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'))
      .toBe('sha3-384:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    expect(sanitizeConsentReferenceForBlockchain(EXAMPLE_CONSENT_IDENTIFIER))
      .toMatch(SHA3_384_REFERENCE_PATTERN);
    expect(sanitizeConsentReferenceForBlockchain(EXAMPLE_DOCUMENT_REFERENCE_URL))
      .toMatch(SHA3_384_REFERENCE_PATTERN);
  });

  /**
   * Contract for evidence reuse:
   *
   * - when a rule already carries an OIDC4IDA evidence object, the blockchain
   *   projection points to `evidence.id`
   * - the evidence object itself stays out of the consent access asset because
   *   evidence persistence belongs to a dedicated evidence flow
   */
  it('uses evidence.id as Consent.source-reference and never copies evidence into the rule asset', () => {
    const evidence = [buildExampleEvidence(EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER)];
    const consentClaims = {
      ...EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare,
      [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
      [ClaimConsent.sourceReference]: EXAMPLE_DOCUMENT_REFERENCE_URL,
    };

    const document = buildConsentRulePrimaryDocument([
      buildConsentEntry(consentClaims, {
        entryId: `${EXAMPLE_CONSENT_IDENTIFIER}-evidence-entry`,
        evidence,
      }),
    ]);

    expect(resolveSourceReferenceFromEvidence(evidence))
      .toBe(EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER);
    expect(document.data[0].resource.meta.claims[ClaimConsent.sourceReference])
      .toBe(EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER);
    expect((document.data[0].resource.meta as Record<string, unknown>).evidence).toBeUndefined();
  });

  /**
   * Contract for bundle-to-rule projection:
   *
   * - a Consent entry can derive from a `DocumentReference` in the same bundle
   * - when that `DocumentReference` carries evidence, the final blockchain rule
   *   keeps the evidence record id instead of the intermediate document id
   */
  it('resolves Consent.source-reference through DocumentReference evidence inside the same bundle', () => {
    const consentClaims = {
      ...EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare,
      [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
      [ClaimConsent.sourceReference]: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
    };

    const document = buildConsentRulePrimaryDocument([
      buildDocumentReferenceEntryWithEvidence({
        entryId: `${EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER}-entry`,
        fullUrl: EXAMPLE_DOCUMENT_REFERENCE_URL,
        identifier: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
        evidenceId: EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER,
      }),
      buildConsentEntry(consentClaims, {
        entryId: `${EXAMPLE_CONSENT_IDENTIFIER}-document-reference-derived`,
      }),
    ]);

    expect(document.data).toHaveLength(1);
    expect(document.data[0].resource.meta.claims[ClaimConsent.sourceReference])
      .toBe(EXAMPLE_CONTENT_ADDRESSED_EVIDENCE_RECORD_IDENTIFIER);
  });

  /**
   * Contract for hashed evidence references:
   *
   * - a plain evidence identifier is still valid input
   * - the generic resolver must hash it before returning the public blockchain
   *   reference
   */
  it('hashes non-content-addressed evidence ids before they become blockchain references', () => {
    const plainEvidence = [buildExampleEvidence(EXAMPLE_DOCUMENT_REFERENCE_URL)];
    const resolvedReference = resolveSourceReferenceFromEvidence(plainEvidence);

    expect(resolvedReference).toMatch(SHA3_384_REFERENCE_PATTERN);
    expect(resolvedReference?.startsWith(EXPECTED_SHA3_384_PREFIX)).toBe(true);
  });

  /**
   * Contract for lifecycle export:
   *
   * - active rules stay `active` when no validity end is present
   * - a Consent with an already elapsed `Consent.period-end` becomes `revoked`
   * - removing that end date later reactivates the same atomic rule id because
   *   lifecycle status does not participate in the rule hash
   */
  it('derives lifecycle status from Consent.period-end without changing the atomic rule id', () => {
    const activeClaims = {
      ...EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailEmergency,
      [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
    };
    const revokedClaims = {
      ...EXAMPLE_CONSENT_ACCESS_RULES.revokedPhysicianEmailConsent,
      [ClaimConsent.identifier]: EXAMPLE_CONSENT_IDENTIFIER,
    };
    const evaluationTime = '2026-06-07T12:00:00Z';

    expect(deriveConsentRuleBlockchainStatus(activeClaims, { now: evaluationTime })).toBe('active');
    expect(deriveConsentRuleBlockchainStatus(revokedClaims, { now: evaluationTime })).toBe('revoked');

    const activeRuleId = buildConsentAtomicRuleId({
      sourceConsentIdentifier: EXAMPLE_CONSENT_IDENTIFIER,
      subject: String(activeClaims[ClaimConsent.subject]),
      decision: ConsentDecisions.Permit,
      actorIdentifier: String(activeClaims[ClaimConsent.actorIdentifier]),
      purpose: String(activeClaims[ClaimConsent.purpose]),
      role: String(activeClaims[ClaimConsent.actorRole]),
    });
    const revokedRuleId = buildConsentAtomicRuleId({
      sourceConsentIdentifier: EXAMPLE_CONSENT_IDENTIFIER,
      subject: String(revokedClaims[ClaimConsent.subject]),
      decision: ConsentDecisions.Permit,
      actorIdentifier: String(revokedClaims[ClaimConsent.actorIdentifier]),
      purpose: String(revokedClaims[ClaimConsent.purpose]),
      role: String(revokedClaims[ClaimConsent.actorRole]),
    });

    expect(activeRuleId).toBe(revokedRuleId);
    expect(buildConsentAtomicRuleCidV1(activeRuleId)).toBe(buildConsentAtomicRuleCidV1(revokedRuleId));
  });

  /**
   * Contract for role normalization:
   *
   * - role keys are normalized to the shared canonical namespace in lowercase
   * - old HL7 value-set selectors must not leak their legacy namespace into the
   *   computed rule key
   */
  it('normalizes HL7 role namespaces to the canonical lowercase code-system key', () => {
    const roleCodeRuleId = buildConsentAtomicRuleId({
      subject: 'subject-1',
      decision: ConsentDecisions.Permit,
      actorIdentifier: 'actor-1',
      purpose: 'purpose-1',
      role: 'v3-RoleCode|RESPRSN',
    });
    const personalRelationshipRuleId = buildConsentAtomicRuleId({
      subject: 'subject-1',
      decision: ConsentDecisions.Permit,
      actorIdentifier: 'actor-1',
      purpose: 'purpose-1',
      role: 'v3-PersonalRelationshipRoleType|ONESELF',
    });

    expect(roleCodeRuleId).toContain('org.hl7.terminology.codesystem.v3-rolecode.resprsn');
    expect(personalRelationshipRuleId).toContain('org.hl7.terminology.codesystem.v3-rolecode.oneself');
    expect(personalRelationshipRuleId).toBe(roleCodeRuleId.replace('resprsn', 'oneself'));
  });
});
