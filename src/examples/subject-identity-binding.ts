// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { DataspaceSectors } from '../constants/sectors';
import { buildSubjectIdentityBindingCredential } from '../utils/subject-identity-binding';

/** Synthetic trusted portal DID used by binding examples and tests. */
export const EXAMPLE_TRUSTED_HEALTH_PORTAL_DID = 'did:web:portal.example.org' as const;
/** Synthetic individual DID exposed by one health portal. */
export const EXAMPLE_PORTAL_INDIVIDUAL_DID =
  'did:web:portal.example.org:health-care:individual:multibase:zSubjectExample' as const;
/** Synthetic individual DID exposed by a second, independent portal. */
export const EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID =
  'did:web:cards.example.org:individual:multibase:zSubjectExample' as const;
/** Physical support/card DID used only to demonstrate that it is not an auth alias. */
export const EXAMPLE_PHYSICAL_SUPPORT_DID =
  'did:web:cards.example.org:card:personal:000-000-000-001' as const;

export const EXAMPLE_SUBJECT_IDENTITY_BINDING_CREDENTIAL = Object.freeze(
  buildSubjectIdentityBindingCredential({
    id: 'urn:uuid:subject-identity-binding-001',
    issuerDid: EXAMPLE_TRUSTED_HEALTH_PORTAL_DID,
    subjectDid: EXAMPLE_PORTAL_INDIVIDUAL_DID,
    aliasDids: [EXAMPLE_ALTERNATE_PORTAL_INDIVIDUAL_DID],
    sectors: [DataspaceSectors.HealthCare],
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2027-01-01T00:00:00.000Z',
  }),
);
