import { describe, expect, it } from '@jest/globals';
import {
  EXAMPLE_INTER_TENANT_EMPLOYEE_CONTRACT_AUTHORIZATION_CONSENT,
  EXAMPLE_INTER_TENANT_PROVIDER_CONTRACT_AUTHORIZATION_CONSENT,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_AGREEMENT_PDF_URL,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_MEMBER_URN,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
  EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN,
} from '../src/examples/inter-tenant-access-contract.js';
import {
  buildInterTenantAccessContractCredential,
  buildInterTenantAccessContractResource,
  getMatchingInterTenantAccessContractFromVpToken,
  getInterTenantAccessContractBlockchainReference,
  isInterTenantAccessContractActive,
  matchesInterTenantAccessContract,
  matchesInterTenantContractAuthorizationConsentRule,
  summarizeInterTenantAccessContract,
} from '../src/utils/inter-tenant-access-contract.js';
import { addVC, createVP } from '../src/utils/vp-token.js';
import { ClaimInterTenantAccessContract } from '../src/models/inter-tenant-access-contract.js';
import { buildConsentRulePrimaryDocument } from '../src/utils/permission-templates.js';
import { ClaimConsent } from '../src/models/consent-rule.js';

describe('inter-tenant access contract utils', () => {
  it('builds a canonical FHIR Contract resource from claims-first form data', () => {
    const resource = buildInterTenantAccessContractResource(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS);

    expect(resource.resourceType).toBe('Contract');
    expect(resource.id).toBe(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS['Contract.identifier']);
    expect(resource.status).toBe('executed');
    expect(resource.type).toEqual({
      coding: [{
        system: 'https://example.org/fhir/CodeSystem/contract-type',
        code: 'data-sharing',
      }],
    });
    expect(resource.instantiatesUri).toBe(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_AGREEMENT_PDF_URL);
    expect(resource.term?.[0]?.offer?.party).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reference: { reference: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid },
        }),
        expect.objectContaining({
          reference: { reference: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid },
        }),
      ]),
    );
    expect(resource.term?.[0]?.offer?.securityLabel).toEqual([
      { text: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope },
    ]);
  });

  it('builds and summarizes a VC that wraps the FHIR Contract in credentialSubject', () => {
    const credential = buildInterTenantAccessContractCredential({
      claims: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS,
      issuer: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
      validFrom: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS['Contract.issued']!,
      validUntil: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS[ClaimInterTenantAccessContract.appliesEnd]!,
    });

    const summary = summarizeInterTenantAccessContract(credential);

    expect(credential.type).toContain('InterTenantAccessContractCredential');
    expect(summary).toMatchObject({
      providerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
      consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid,
    });
    expect(summary?.capabilities).toContain(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope);
    expect(summary?.purposes).toContain(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose);
    expect(isInterTenantAccessContractActive(summary, { now: '2026-07-01T00:00:00.000Z' })).toBe(true);
  });

  it('omits Contract.type when the claims transport does not provide one', () => {
    const claims = { ...EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS };
    delete (claims as Partial<Record<ClaimInterTenantAccessContract, string>>)[ClaimInterTenantAccessContract.type];

    expect(buildInterTenantAccessContractResource(claims).type).toBeUndefined();
  });

  it('matches only active contracts with the expected tenant pair, purpose, and capability', () => {
    const summary = summarizeInterTenantAccessContract(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL);

    expect(matchesInterTenantAccessContract(summary, {
      providerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
      consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid,
      requiredCapabilities: [EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope],
      purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
      now: '2026-07-01T00:00:00.000Z',
    })).toBe(true);

    expect(matchesInterTenantAccessContract(summary, {
      providerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
      consumerOrganizationDid: 'did:web:api.other.example',
      requiredCapabilities: [EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope],
      purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
      now: '2026-07-01T00:00:00.000Z',
    })).toBe(false);

    expect(matchesInterTenantAccessContract(summary, {
      providerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
      consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid,
      requiredCapabilities: ['organization/ResearchSubject.rs'],
      purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
      now: '2026-07-01T00:00:00.000Z',
    })).toBe(false);
  });

  it('extracts the matching contract VC from a VP token payload', () => {
    const vpPayload = createVP({
      iss: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid,
    });
    addVC(vpPayload, EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL);

    const matched = getMatchingInterTenantAccessContractFromVpToken(
      JSON.stringify(vpPayload),
      {
        providerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
        consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid,
        requiredCapabilities: [EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope],
        purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
        now: '2026-07-01T00:00:00.000Z',
      },
    );

    expect(matched).toBeDefined();
    expect(summarizeInterTenantAccessContract(matched)).toMatchObject({
      providerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.providerOrganizationDid,
      consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.consumerOrganizationDid,
    });
  });

  it('reuses Consent.source-reference as the blockchain-safe hash of the contract VC for employee delegation', () => {
    const contractReference = getInterTenantAccessContractBlockchainReference(
      EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL,
    );

    expect(contractReference).toBeDefined();
    expect(EXAMPLE_INTER_TENANT_EMPLOYEE_CONTRACT_AUTHORIZATION_CONSENT[ClaimConsent.sourceReference])
      .toBe(contractReference);

    const blockchainDocument = buildConsentRulePrimaryDocument([
      {
        id: 'employee-contract-authorization-entry-1',
        type: 'Consent',
        resource: {
          resourceType: 'Consent',
          meta: {
            claims: EXAMPLE_INTER_TENANT_EMPLOYEE_CONTRACT_AUTHORIZATION_CONSENT,
          },
        },
      } as any,
    ]);

    expect(blockchainDocument.data).toHaveLength(1);
    expect(blockchainDocument.data[0].resource.meta.claims[ClaimConsent.sourceReference])
      .toBe(contractReference);
  });

  it('matches a reused consent-style organization-to-employee rule against the referenced contract VC', () => {
    expect(matchesInterTenantContractAuthorizationConsentRule(
      EXAMPLE_INTER_TENANT_EMPLOYEE_CONTRACT_AUTHORIZATION_CONSENT as unknown as Record<string, unknown>,
      EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL,
      {
        consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
        actorIdentifier: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_MEMBER_URN,
        actorRole: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.actorRole,
        requiredCapabilities: [EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope],
        purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
        now: '2026-07-01T00:00:00.000Z',
      },
    )).toBe(true);

    expect(matchesInterTenantContractAuthorizationConsentRule(
      {
        ...EXAMPLE_INTER_TENANT_EMPLOYEE_CONTRACT_AUTHORIZATION_CONSENT,
        [ClaimConsent.sourceReference]: 'sha3-384:deadbeef',
      } as unknown as Record<string, unknown>,
      EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL,
      {
        consumerOrganizationDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
        actorIdentifier: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_MEMBER_URN,
        actorRole: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.actorRole,
        requiredCapabilities: [EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope],
        purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
        now: '2026-07-01T00:00:00.000Z',
      },
    )).toBe(false);
  });

  it('keeps a separate provider-owned consent-style rule for provider-to-consumer contract authorization', () => {
    expect(EXAMPLE_INTER_TENANT_PROVIDER_CONTRACT_AUTHORIZATION_CONSENT[ClaimConsent.subject])
      .toBe(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN);
    expect(EXAMPLE_INTER_TENANT_PROVIDER_CONTRACT_AUTHORIZATION_CONSENT[ClaimConsent.actorIdentifier])
      .toBe(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN);
  });
});
