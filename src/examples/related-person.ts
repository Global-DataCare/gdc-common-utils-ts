// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { RelatedPersonClaim } from '../models/interoperable-claims/related-person-claims';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import { HL7_CODING_SYSTEM_V3_ROLE_CODE } from '../constants/hl7-roles';
import {
  EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API,
  EXAMPLE_EMAIL_RELATED_PERSON,
  EXAMPLE_FORM_CONTROLLER_PHONE,
  EXAMPLE_RELATED_PERSON_MEMBER_DID,
  EXAMPLE_RELATED_PERSON_ACTIVE_NAME,
  EXAMPLE_RELATED_PERSON_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_INACTIVE_EMAIL,
  EXAMPLE_RELATED_PERSON_INACTIVE_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_INACTIVE_NAME,
  EXAMPLE_RELATED_PERSON_INACTIVE_RELATIONSHIP,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_SUBJECT_DID,
} from './shared';
import {
  createInteroperableResourceOperationEditor,
  InteroperableOperationMethods,
  buildInteroperableSearchPath,
  InteroperableLifecycleStatuses,
} from '../utils/interoperable-resource-operation';
import { LifecycleRequestType } from '../constants/lifecycle';

/**
 * Examples for related-person / family-member flows.
 */

export const EXAMPLE_RELATED_PERSON_RESOURCE_TYPE = ResourceTypesFhirR4.RelatedPerson;
export const EXAMPLE_RELATED_PERSON_DISABLE_REQUEST_TYPE = LifecycleRequestType.RelatedPersonDisable;
export const EXAMPLE_RELATED_PERSON_PURGE_REQUEST_TYPE = LifecycleRequestType.RelatedPersonPurge;
export const EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID = 'related-person-internal-001' as const;
export const EXAMPLE_RELATED_PERSON_SEARCH_URL =
  buildInteroperableSearchPath(EXAMPLE_RELATED_PERSON_RESOURCE_TYPE);
export const EXAMPLE_RELATED_PERSON_DISPLAY_NAME = EXAMPLE_RELATED_PERSON_ACTIVE_NAME;
export const EXAMPLE_INDIVIDUAL_MEMBER_IDENTITY = Object.freeze({
  actorDid: EXAMPLE_RELATED_PERSON_MEMBER_DID,
  subjectDid: EXAMPLE_SUBJECT_DID,
  relationship: EXAMPLE_RELATED_PERSON_ROLE,
  authorityBasis: 'family-book',
  email: EXAMPLE_EMAIL_RELATED_PERSON,
  telephone: EXAMPLE_FORM_CONTROLLER_PHONE,
  credentialMaterial: `${EXAMPLE_RELATED_PERSON_MEMBER_DID}#signing-key-1`,
  evidence: [{
    type: ['DocumentVerification'],
    evidenceDocument: 'LibroDeFamilia',
    verifier: 'did:web:kyc.example.org',
  }],
} as const);

/**
 * Minimal semantic input used by SDK helpers to disable one subject-side
 * relationship record through the identifier-first lifecycle contract.
 */
export const EXAMPLE_RELATED_PERSON_DISABLE_INPUT = {
  memberClaims: {
    '@context': EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API,
    [RelatedPersonClaim.IdentifierValue]: EXAMPLE_RELATED_PERSON_IDENTIFIER,
    [RelatedPersonClaim.Patient]: EXAMPLE_SUBJECT_DID,
    [RelatedPersonClaim.Telecom]: `mailto:${EXAMPLE_EMAIL_RELATED_PERSON}`,
    [RelatedPersonClaim.Relationship]: EXAMPLE_RELATED_PERSON_ROLE,
  },
  resourceId: EXAMPLE_RELATED_PERSON_IDENTIFIER,
} as const;

/**
 * Canonical lifecycle resource emitted by the shared identifier-first disable
 * contract after the FHIR/business identifier has been normalized.
 */
export const EXAMPLE_RELATED_PERSON_DISABLE_LIFECYCLE_RESOURCE =
  createInteroperableResourceOperationEditor()
    .setResourceType(EXAMPLE_RELATED_PERSON_RESOURCE_TYPE)
    .setIdentifierClaimKey(RelatedPersonClaim.IdentifierValue)
    .setBusinessIdentifier(EXAMPLE_RELATED_PERSON_DISABLE_INPUT.memberClaims[RelatedPersonClaim.IdentifierValue])
    .setClaims({ ...EXAMPLE_RELATED_PERSON_DISABLE_INPUT.memberClaims })
    .setLifecycleStatus(InteroperableLifecycleStatuses.Inactive)
    .buildLifecycleResource();

/**
 * Shared operational bundle entry for `disableIndividualMember(...)`.
 *
 * Downstream SDK tests can assert against this fixture directly instead of
 * rebuilding the lifecycle resource shape inline.
 */
export const EXAMPLE_RELATED_PERSON_DISABLE_BUNDLE_ENTRY = {
  request: { method: InteroperableOperationMethods.Post },
  meta: { claims: { ...EXAMPLE_RELATED_PERSON_DISABLE_INPUT.memberClaims } },
  resource: {
    ...EXAMPLE_RELATED_PERSON_DISABLE_LIFECYCLE_RESOURCE,
    id: EXAMPLE_RELATED_PERSON_DISABLE_INPUT.resourceId,
  },
} as const;

/**
 * Full shared disable payload used by runtime/documentation examples.
 */
export const EXAMPLE_RELATED_PERSON_DISABLE_BUNDLE_PAYLOAD = {
  thid: 'relatedperson-disable-example-001',
  body: {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'batch',
    entry: [EXAMPLE_RELATED_PERSON_DISABLE_BUNDLE_ENTRY],
  },
} as const;

export const EXAMPLE_RELATED_PERSON_PURGE_LIFECYCLE_RESOURCE =
  createInteroperableResourceOperationEditor()
    .setResourceType(EXAMPLE_RELATED_PERSON_RESOURCE_TYPE)
    .setIdentifierClaimKey(RelatedPersonClaim.IdentifierValue)
    .setBusinessIdentifier(EXAMPLE_RELATED_PERSON_DISABLE_INPUT.memberClaims[RelatedPersonClaim.IdentifierValue])
    .setClaims({ ...EXAMPLE_RELATED_PERSON_DISABLE_INPUT.memberClaims })
    .setLifecycleStatus(InteroperableLifecycleStatuses.Purged)
    .buildLifecycleResource();

export const EXAMPLE_RELATED_PERSON_PURGE_BUNDLE_ENTRY = {
  type: EXAMPLE_RELATED_PERSON_PURGE_REQUEST_TYPE,
  request: { method: InteroperableOperationMethods.Post },
  meta: { claims: { ...EXAMPLE_RELATED_PERSON_DISABLE_INPUT.memberClaims } },
  resource: {
    ...EXAMPLE_RELATED_PERSON_PURGE_LIFECYCLE_RESOURCE,
    id: EXAMPLE_RELATED_PERSON_DISABLE_INPUT.resourceId,
  },
} as const;

export const EXAMPLE_RELATED_PERSON_PURGE_BUNDLE_PAYLOAD = {
  thid: 'relatedperson-purge-example-001',
  body: {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'batch',
    entry: [EXAMPLE_RELATED_PERSON_PURGE_BUNDLE_ENTRY],
  },
} as const;

/**
 * Canonical upsert payload for subject-side relationship examples.
 *
 * This bundle shape is the shared SDK/documentation fixture and should be
 * reused by downstream repositories instead of rebuilding inline `Bundle`
 * examples for `upsertRelatedPersonAndPoll(...)`.
 */
export const EXAMPLE_RELATED_PERSON_UPSERT_BUNDLE_PAYLOAD = {
  thid: 'relatedperson-upsert-example-001',
  body: {
    resourceType: ResourceTypesFhirR4.Bundle,
    type: 'batch',
    entry: [{
      resource: {
        resourceType: EXAMPLE_RELATED_PERSON_RESOURCE_TYPE,
        id: 'grandfather-001',
        patient: { reference: EXAMPLE_SUBJECT_DID },
        relationship: [{ text: 'Grandfather' }],
        name: [{ text: EXAMPLE_RELATED_PERSON_DISPLAY_NAME }],
      },
    }],
  },
} as const;

/** @deprecated Use `EXAMPLE_RELATED_PERSON_UPSERT_BUNDLE_PAYLOAD`. */
export const EXAMPLE_RELATED_PERSON_PAYLOAD = EXAMPLE_RELATED_PERSON_UPSERT_BUNDLE_PAYLOAD;

/**
 * Legacy JSON:API-style shell still referenced by older pass-through tests.
 */
export const EXAMPLE_RELATED_PERSON_BATCH_DATA_PAYLOAD = {
  body: {
    data: [
      {
        type: EXAMPLE_RELATED_PERSON_RESOURCE_TYPE,
      },
    ],
  },
} as const;

/**
 * FHIR-shaped example used to demonstrate identifier-first operational
 * normalization before claims-first processing.
 */
export const EXAMPLE_RELATED_PERSON_FHIR_RESOURCE = {
  resourceType: EXAMPLE_RELATED_PERSON_RESOURCE_TYPE,
  id: EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID,
  identifier: [{ value: EXAMPLE_RELATED_PERSON_IDENTIFIER }],
  active: true,
  patient: { reference: EXAMPLE_SUBJECT_DID },
  relationship: [{ coding: [{ code: EXAMPLE_RELATED_PERSON_ROLE.split('|')[1], system: HL7_CODING_SYSTEM_V3_ROLE_CODE }] }],
  telecom: [{ value: `mailto:${EXAMPLE_EMAIL_RELATED_PERSON}` }],
} as const;

export const EXAMPLE_RELATED_PERSON_DISABLE_SEARCH_PARAMS = {
  identifier: EXAMPLE_RELATED_PERSON_IDENTIFIER,
} as const;

export const EXAMPLE_RELATED_PERSON_LIST_RECORD_ACTIVE = {
  id: EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID,
  meta: {
    status: 'active',
  },
  resource: {
    resourceType: EXAMPLE_RELATED_PERSON_RESOURCE_TYPE,
    id: EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID,
    meta: {
      claims: {
        '@context': EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API,
        [RelatedPersonClaim.IdentifierValue]: EXAMPLE_RELATED_PERSON_IDENTIFIER,
        [RelatedPersonClaim.Patient]: EXAMPLE_SUBJECT_DID,
        [RelatedPersonClaim.Telecom]: `mailto:${EXAMPLE_EMAIL_RELATED_PERSON}`,
        [RelatedPersonClaim.Relationship]: EXAMPLE_RELATED_PERSON_ROLE,
        [RelatedPersonClaim.Name]: EXAMPLE_RELATED_PERSON_DISPLAY_NAME,
        [RelatedPersonClaim.Active]: 'true',
      },
    },
  },
} as const;

export const EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE = {
  id: 'related-person-internal-002',
  meta: {
    status: 'inactive',
  },
  resource: {
    resourceType: EXAMPLE_RELATED_PERSON_RESOURCE_TYPE,
    id: 'related-person-internal-002',
    meta: {
      claims: {
        '@context': EXAMPLE_INTEROPERABLE_CONTEXT_FHIR_API,
        [RelatedPersonClaim.IdentifierValue]: EXAMPLE_RELATED_PERSON_INACTIVE_IDENTIFIER,
        [RelatedPersonClaim.Patient]: EXAMPLE_SUBJECT_DID,
        [RelatedPersonClaim.Telecom]: `mailto:${EXAMPLE_RELATED_PERSON_INACTIVE_EMAIL}`,
        [RelatedPersonClaim.Relationship]: EXAMPLE_RELATED_PERSON_INACTIVE_RELATIONSHIP,
        [RelatedPersonClaim.Name]: EXAMPLE_RELATED_PERSON_INACTIVE_NAME,
        [RelatedPersonClaim.Active]: 'false',
      },
    },
  },
} as const;

export const EXAMPLE_RELATED_PERSON_LIST_RESPONSE_BODY = {
  body: {
    data: [
      EXAMPLE_RELATED_PERSON_LIST_RECORD_ACTIVE,
      EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE,
    ],
  },
} as const;

export const EXAMPLE_RELATED_PERSON_INACTIVE_STATUS = InteroperableLifecycleStatuses.Inactive;
export const EXAMPLE_RELATED_PERSON_PURGED_STATUS = InteroperableLifecycleStatuses.Purged;
