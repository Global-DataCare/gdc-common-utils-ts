// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ServiceCapability } from '../constants/service-capabilities';
import { DataspaceSectors } from '../constants/sectors';
import { ClaimConsent } from '../models/consent-rule';
import { ClaimInterTenantAccessContract } from '../models/inter-tenant-access-contract';
import {
  buildInterTenantAccessContractCredential,
  buildInterTenantAccessContractResource,
  getInterTenantAccessContractBlockchainReference,
} from '../utils/inter-tenant-access-contract';
import {
  buildMemberAuthorizationUrn,
  buildOrganizationAuthorizationUrn,
} from '../utils/organization-authorization-urn';
import {
  EXAMPLE_API_ORGANIZATION_DID,
  EXAMPLE_CONTROLLER_DID,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  EXAMPLE_JURISDICTION,
  EXAMPLE_RESEARCH_API_ORGANIZATION_DID,
  EXAMPLE_RESEARCH_CONTROLLER_DID,
  EXAMPLE_RESEARCH_TENANT_IDENTIFIER,
  EXAMPLE_SECTOR,
  EXAMPLE_TENANT_IDENTIFIER,
} from './shared';

/**
 * Shared synthetic inter-tenant contract fixtures reused by GW and SDK tests.
 *
 * Scenario:
 * - `acme-id` is the clinical provider tenant in `health-care`
 * - `lab-id` is the research tenant in `health-research`
 * - both are assumed to be hosted by the same operator for the current scope
 *
 * Programmer hints:
 * - provider = the tenant that owns/exposes the data
 * - consumer = the foreign tenant asking for access
 * - capability = the allowed technical scope, for example
 *   `organization/Composition.rs`
 * - purpose = the allowed business/legal reason, for example `RESEARCH`
 * - instantiates-uri = primary agreement artifact URL/CID, typically the
 *   signed PDF of the contract itself
 * - invoice/payment evidence is intentionally not modeled as a mandatory core
 *   field in this first inter-tenant fixture
 */

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_ID =
  'urn:uuid:inter-tenant-access-contract-001' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM =
  '2026-06-29T00:00:00.000Z' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_UNTIL =
  '2027-06-29T00:00:00.000Z' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PURPOSE =
  'RESEARCH' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SCOPE =
  ServiceCapability.IndexReader;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SUBJECT_DID =
  'did:web:api.acme.org:individual:123' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SECTION =
  'LOINC|48765-2' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_AGREEMENT_PDF_URL =
  'https://portal.example.org/files/contracts/inter-tenant-contract-acme-lab-001.pdf' as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_PROFESSIONAL_DID =
  `${EXAMPLE_RESEARCH_API_ORGANIZATION_DID}:employee:researcher1@lab.org:${EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN}` as const;
export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SMART_SCOPE =
  `${EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SCOPE}?subject=${EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SUBJECT_DID}&section=${EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SECTION}` as const;

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS = Object.freeze({
  [ClaimInterTenantAccessContract.identifier]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_ID,
  [ClaimInterTenantAccessContract.status]: 'executed',
  [ClaimInterTenantAccessContract.issued]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
  [ClaimInterTenantAccessContract.appliesStart]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
  [ClaimInterTenantAccessContract.appliesEnd]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_UNTIL,
  [ClaimInterTenantAccessContract.providerOrganization]: EXAMPLE_API_ORGANIZATION_DID,
  [ClaimInterTenantAccessContract.consumerOrganization]: EXAMPLE_RESEARCH_API_ORGANIZATION_DID,
  [ClaimInterTenantAccessContract.providerController]: EXAMPLE_CONTROLLER_DID,
  [ClaimInterTenantAccessContract.consumerController]: EXAMPLE_RESEARCH_CONTROLLER_DID,
  [ClaimInterTenantAccessContract.capability]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SCOPE,
  [ClaimInterTenantAccessContract.purpose]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PURPOSE,
  [ClaimInterTenantAccessContract.instantiatesUri]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_AGREEMENT_PDF_URL,
} as const);

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_RESOURCE = Object.freeze(
  buildInterTenantAccessContractResource(EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS),
);

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL = Object.freeze(
  buildInterTenantAccessContractCredential({
    claims: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CLAIMS,
    issuer: EXAMPLE_CONTROLLER_DID,
    validFrom: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
    validUntil: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_UNTIL,
    additionalCredential: {
      id: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_ID,
    },
  }),
);

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT = Object.freeze({
  providerTenantId: EXAMPLE_TENANT_IDENTIFIER,
  providerSector: EXAMPLE_SECTOR,
  providerOrganizationDid: EXAMPLE_API_ORGANIZATION_DID,
  consumerTenantId: EXAMPLE_RESEARCH_TENANT_IDENTIFIER,
  consumerSector: DataspaceSectors.HealthResearch,
  consumerOrganizationDid: EXAMPLE_RESEARCH_API_ORGANIZATION_DID,
  jurisdiction: EXAMPLE_JURISDICTION,
  actorRole: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  subjectDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SUBJECT_DID,
  consumerProfessionalDid: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_PROFESSIONAL_DID,
  requestedScope: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SCOPE,
  requestedSection: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SECTION,
  smartScope: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_SMART_SCOPE,
  purpose: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PURPOSE,
} as const);

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN =
  buildOrganizationAuthorizationUrn({
    identifierType: 'TAX',
    identifierValue: EXAMPLE_TENANT_IDENTIFIER,
  });

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN =
  buildOrganizationAuthorizationUrn({
    identifierType: 'TAX',
    identifierValue: EXAMPLE_RESEARCH_TENANT_IDENTIFIER,
  });

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_MEMBER_URN =
  buildMemberAuthorizationUrn({
    organizationUrn: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
    memberId: 'researcher-001',
  });

export const EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT_WITH_URNS = Object.freeze({
  ...EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT,
  providerOrganizationUrn: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN,
  consumerOrganizationUrn: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
  consumerMemberUrn: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_MEMBER_URN,
} as const);

/**
 * Consent-style organization-to-employee delegation rule reused for the
 * consumer tenant side.
 *
 * This intentionally reuses the existing `Consent.*` rule pattern:
 * - `Consent.subject` is the consumer organization URN
 * - `Consent.actor-identifier` is the delegated member URN
 * - `Consent.actor-role` carries the role separately
 * - `Consent.source-reference` points to the blockchain-safe contract VC
 *   reference that was or will be anchored on-chain
 */
export const EXAMPLE_INTER_TENANT_EMPLOYEE_CONTRACT_AUTHORIZATION_CONSENT = Object.freeze({
  '@context': 'org.hl7.fhir.api',
  [ClaimConsent.identifier]: 'urn:uuid:employee-contract-authorization-001',
  [ClaimConsent.subject]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
  [ClaimConsent.actorIdentifier]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_MEMBER_URN,
  [ClaimConsent.actorRole]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.actorRole,
  [ClaimConsent.decision]: 'permit',
  [ClaimConsent.purpose]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
  [ClaimConsent.action]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope,
  [ClaimConsent.sourceReference]: getInterTenantAccessContractBlockchainReference(
    EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL,
  ),
  [ClaimConsent.date]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
  [ClaimConsent.periodStart]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
  [ClaimConsent.periodEnd]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_UNTIL,
} as const);

export const EXAMPLE_INTER_TENANT_PROVIDER_CONTRACT_AUTHORIZATION_CONSENT = Object.freeze({
  '@context': 'org.hl7.fhir.api',
  [ClaimConsent.identifier]: 'urn:uuid:provider-contract-authorization-001',
  [ClaimConsent.subject]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_PROVIDER_ORGANIZATION_URN,
  [ClaimConsent.actorIdentifier]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONSUMER_ORGANIZATION_URN,
  [ClaimConsent.actorRole]: 'organization',
  [ClaimConsent.decision]: 'permit',
  [ClaimConsent.purpose]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.purpose,
  [ClaimConsent.action]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CONTEXT.requestedScope,
  [ClaimConsent.sourceReference]: getInterTenantAccessContractBlockchainReference(
    EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_CREDENTIAL,
  ),
  [ClaimConsent.date]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
  [ClaimConsent.periodStart]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_FROM,
  [ClaimConsent.periodEnd]: EXAMPLE_INTER_TENANT_ACCESS_CONTRACT_VALID_UNTIL,
} as const);
