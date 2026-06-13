// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
} from '../constants/schemaorg';
import { ClaimConsent } from '../models/consent-rule';
import {
  IndividualOrganizationLifecycleDraft,
  IndividualOrganizationLifecycleOperations,
} from '../utils/individual-organization-lifecycle';
import {
  EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  EXAMPLE_EMAIL_CONTROLLER_ORG,
  EXAMPLE_CLINICAL_SECTION_ALLERGIES,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  EXAMPLE_JURISDICTION,
  EXAMPLE_SECTOR,
  EXAMPLE_TENANT_IDENTIFIER,
} from './shared';

/**
 * Canonical lifecycle naming for `v1`.
 *
 * SDKs, Swagger examples, portal payload builders, and GW adapters should use
 * these semantic operation names instead of mixing `revoke`, `suspend`,
 * `deactivate`, or product-specific labels at the API contract layer.
 */
export const EXAMPLE_LIFECYCLE_OPERATIONS = {
  enable: 'enable',
  disable: 'disable',
  delete: 'delete',
} as const;

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE = 'Family-disable-request-v1.0' as const;
export const EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE = 'Family-purge-request-v1.0' as const;

/**
 * Shared placeholder values used by copy/paste examples.
 *
 * These are intentionally synthetic and stable. Repositories should override
 * them at runtime with environment variables, UI form values, or test fixtures
 * rather than committing personal data.
 *
 * Keep all repeated actor/section/code fixtures imported from `./shared`.
 */
export const EXAMPLE_LIFECYCLE_PLACEHOLDERS = {
  tenantId: EXAMPLE_TENANT_IDENTIFIER,
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
  tenantTaxId: '{{tenantTaxId}}',
  tenantDid: '{{tenantDid}}',
  employeeIdentifier: '{{employeeIdentifier}}',
  employeeEmail: '{{employeeEmail}}',
  employeeRole: '{{employeeRole}}',
  individualIdentifier: '{{individualIdentifier}}',
  individualAlternateName: '{{individualAlternateName}}',
  individualSubjectDid: '{{individualSubjectDid}}',
  consentIdentifier: '{{consentIdentifier}}',
  consentActorIdentifier: '{{consentActorIdentifier}}',
  deleteReason: '{{deleteReason}}',
  icaCredentialStatus: '{{icaCredentialStatus}}',
} as const;

/**
 * Canonical semantic lifecycle message examples.
 *
 * These examples are transport-neutral. GW Swagger, Node SDK, Front SDK, and
 * backend adapters may embed them inside route-specific envelopes, but they
 * must not fork the claim content or lifecycle naming.
 */
export const EXAMPLE_EMPLOYEE_ENABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.enable,
  resourceType: 'Employee',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsPersonSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeIdentifier,
    [ClaimsPersonSchemaorg.email]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeEmail,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeRole,
  },
} as const;

export const EXAMPLE_EMPLOYEE_DISABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.disable,
  resourceType: 'Employee',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsPersonSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeIdentifier,
    [ClaimsPersonSchemaorg.email]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeEmail,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeRole,
  },
  expectedSemantics: {
    keepsAuditTrail: true,
    releasesLicenseSeat: false,
    requiresIcaCredentialStatusUpdate: true,
  },
} as const;

export const EXAMPLE_EMPLOYEE_DELETE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.delete,
  resourceType: 'Employee',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsPersonSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeIdentifier,
    [ClaimsPersonSchemaorg.email]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeEmail,
    [ClaimsPersonSchemaorg.hasOccupationalRoleValue]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.employeeRole,
  },
  deleteReason: EXAMPLE_LIFECYCLE_PLACEHOLDERS.deleteReason,
} as const;

export const EXAMPLE_TENANT_ENABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.enable,
  resourceType: 'Organization',
  routeContext: {
    tenantId: 'host',
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantTaxId,
    [ClaimsOrganizationSchemaorg.taxId]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantTaxId,
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantDid,
  },
} as const;

export const EXAMPLE_TENANT_DISABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.disable,
  resourceType: 'Organization',
  routeContext: {
    tenantId: 'host',
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantTaxId,
    [ClaimsOrganizationSchemaorg.taxId]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantTaxId,
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantDid,
  },
  expectedSemantics: {
    keepsAuditTrail: true,
    purgeAllowedByDefault: false,
    requiresIcaCredentialStatusUpdate: true,
  },
} as const;

export const EXAMPLE_TENANT_DELETE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.delete,
  resourceType: 'Organization',
  routeContext: {
    tenantId: 'host',
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifierValue]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantTaxId,
    [ClaimsOrganizationSchemaorg.taxId]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantTaxId,
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.tenantDid,
  },
  deleteReason: EXAMPLE_LIFECYCLE_PLACEHOLDERS.deleteReason,
} as const;

export const EXAMPLE_INDIVIDUAL_ENABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.enable,
  resourceType: 'IndividualOrganization',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualIdentifier,
    [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualAlternateName,
    [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  },
} as const;

export const EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.disable,
  resourceType: 'IndividualOrganization',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualIdentifier,
    [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualAlternateName,
    [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  },
  expectedSemantics: {
    keepsAuditTrail: true,
    erasesPersonalDataImmediately: false,
  },
} as const;

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_ENTRY =
  new IndividualOrganizationLifecycleDraft()
    .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
    .setOperation(IndividualOrganizationLifecycleOperations.Disable)
    .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE)
    .buildCurrentGwDataEntry();

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_PAYLOAD =
  new IndividualOrganizationLifecycleDraft()
    .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
    .setOperation(IndividualOrganizationLifecycleOperations.Disable)
    .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_DISABLE_REQUEST_TYPE)
    .setThreadId('individual-organization-disable-example-001')
    .buildCurrentGwPayload();

export const EXAMPLE_INDIVIDUAL_DELETE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.delete,
  resourceType: 'IndividualOrganization',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualIdentifier,
    [ClaimsOrganizationSchemaorg.alternateName]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualAlternateName,
    [ClaimsOrganizationSchemaorg.ownerEmail]: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  },
  deleteReason: 'right-to-be-forgotten',
  expectedSemantics: {
    invokesPrivacyWorkflow: true,
    keepsMinimumAuditTrailRequiredByLaw: true,
  },
} as const;

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_ENTRY =
  new IndividualOrganizationLifecycleDraft()
    .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
    .setOperation(IndividualOrganizationLifecycleOperations.Purge)
    .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE)
    .buildCurrentGwDataEntry();

export const EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_PAYLOAD =
  new IndividualOrganizationLifecycleDraft()
    .setClaims(EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE.claims)
    .setOperation(IndividualOrganizationLifecycleOperations.Purge)
    .setRequestType(EXAMPLE_INDIVIDUAL_ORGANIZATION_PURGE_REQUEST_TYPE)
    .setThreadId('individual-organization-purge-example-001')
    .buildCurrentGwPayload();

export const EXAMPLE_CONSENT_ENABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.enable,
  resourceType: 'Consent',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.hl7.fhir.api',
    [ClaimConsent.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.consentIdentifier,
    [ClaimConsent.subject]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualSubjectDid,
    [ClaimConsent.actorIdentifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.consentActorIdentifier,
    [ClaimConsent.actorRole]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    [ClaimConsent.purpose]: EXAMPLE_CONSENT_PURPOSE_TREATMENT,
    [ClaimConsent.action]: EXAMPLE_CLINICAL_SECTION_ALLERGIES,
    [ClaimConsent.decision]: 'permit',
  },
} as const;

export const EXAMPLE_CONSENT_DISABLE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.disable,
  resourceType: 'Consent',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.hl7.fhir.api',
    [ClaimConsent.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.consentIdentifier,
    [ClaimConsent.subject]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualSubjectDid,
    [ClaimConsent.actorIdentifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.consentActorIdentifier,
    [ClaimConsent.actorRole]: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    [ClaimConsent.purpose]: EXAMPLE_CONSENT_PURPOSE_TREATMENT,
    [ClaimConsent.action]: EXAMPLE_CLINICAL_SECTION_ALLERGIES,
    [ClaimConsent.decision]: 'permit',
  },
} as const;

export const EXAMPLE_CONSENT_DELETE_MESSAGE = {
  operation: EXAMPLE_LIFECYCLE_OPERATIONS.delete,
  resourceType: 'Consent',
  routeContext: {
    tenantId: EXAMPLE_TENANT_IDENTIFIER,
    jurisdiction: EXAMPLE_JURISDICTION,
    sector: EXAMPLE_SECTOR,
  },
  claims: {
    '@context': 'org.hl7.fhir.api',
    [ClaimConsent.identifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.consentIdentifier,
    [ClaimConsent.subject]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.individualSubjectDid,
    [ClaimConsent.actorIdentifier]: EXAMPLE_LIFECYCLE_PLACEHOLDERS.consentActorIdentifier,
  },
  deleteReason: EXAMPLE_LIFECYCLE_PLACEHOLDERS.deleteReason,
} as const;

/**
 * A compact reference object that documentation generators and SDK tutorials can
 * render without having to cherry-pick individual exports by hand.
 */
export const EXAMPLE_LIFECYCLE_REFERENCE = {
  placeholders: EXAMPLE_LIFECYCLE_PLACEHOLDERS,
  operations: EXAMPLE_LIFECYCLE_OPERATIONS,
  employee: {
    enable: EXAMPLE_EMPLOYEE_ENABLE_MESSAGE,
    disable: EXAMPLE_EMPLOYEE_DISABLE_MESSAGE,
    delete: EXAMPLE_EMPLOYEE_DELETE_MESSAGE,
  },
  tenant: {
    enable: EXAMPLE_TENANT_ENABLE_MESSAGE,
    disable: EXAMPLE_TENANT_DISABLE_MESSAGE,
    delete: EXAMPLE_TENANT_DELETE_MESSAGE,
  },
  individual: {
    enable: EXAMPLE_INDIVIDUAL_ENABLE_MESSAGE,
    disable: EXAMPLE_INDIVIDUAL_DISABLE_MESSAGE,
    delete: EXAMPLE_INDIVIDUAL_DELETE_MESSAGE,
  },
  consent: {
    enable: EXAMPLE_CONSENT_ENABLE_MESSAGE,
    disable: EXAMPLE_CONSENT_DISABLE_MESSAGE,
    delete: EXAMPLE_CONSENT_DELETE_MESSAGE,
  },
  exampleActors: {
    organizationControllerEmail: EXAMPLE_EMAIL_CONTROLLER_ORG,
    individualControllerEmail: EXAMPLE_EMAIL_CONTROLLER_INDIVIDUAL,
  },
} as const;
