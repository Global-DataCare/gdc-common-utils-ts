import { describe, expect, it } from '@jest/globals';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  toClinicalResourceCardView,
  toClinicalResourceCommonView,
  toClinicalResourceCommonViews,
  toClinicalResourceExpandedView,
} from '../src/utils/clinical-resource-view.js';

describe('clinical resource common view', () => {
  it('maps consent common fields including period and actor identifier/role/type', () => {
    const consentEntry = {
      fullUrl: 'urn:uuid:consent-1',
      type: 'Consent-edit-request-v1.0',
      resource: {
        resourceType: ResourceTypesFhirR4.Consent,
        meta: {
          claims: {
            [ClaimConsent.identifier]: 'consent-1',
            [ClaimConsent.date]: '2026-06-01',
            [ClaimConsent.periodStart]: '2026-06-01T00:00:00Z',
            [ClaimConsent.periodEnd]: '2026-12-31T23:59:59Z',
            [ClaimConsent.category]: 'LOINC|64292-6',
            [ClaimConsent.actorIdentifier]: 'did:web:hospital.example.org,doctor@example.org',
            [ClaimConsent.actorRole]: 'creator,performer',
          },
        },
      },
    };

    const view = toClinicalResourceCommonView(consentEntry);

    expect(view.resourceType).toBe(ResourceTypesFhirR4.Consent);
    expect(view.title).toBe('LOINC|64292-6');
    expect(view.identifier).toBe('consent-1');
    expect(view.date).toBe('2026-06-01');
    expect(view.periodStart).toBe('2026-06-01T00:00:00Z');
    expect(view.periodEnd).toBe('2026-12-31T23:59:59Z');
    expect(view.fullUrl).toBe('urn:uuid:consent-1');
    expect(view.actors).toEqual([
      {
        identifier: 'did:web:hospital.example.org',
        role: 'creator',
        type: 'actor',
      },
      {
        identifier: 'doctor@example.org',
        role: 'performer',
        type: 'actor',
      },
    ]);
  });

  it('falls back title to resourceType and captures communication actors', () => {
    const communicationEntry = {
      fullUrl: 'urn:uuid:comm-1',
      type: 'Communication-edit-request-v1.0',
      resource: {
        resourceType: ResourceTypesFhirR4.Communication,
        meta: {
          claims: {
            [CommunicationClaim.Identifier]: 'comm-1',
            [CommunicationClaim.Sent]: '2026-06-01T10:15:00Z',
            [CommunicationClaim.Sender]: 'did:web:gp.example.org',
            [CommunicationClaim.Recipient]: 'did:web:hospital.example.org,did:web:family.example.org',
          },
        },
      },
    };

    const view = toClinicalResourceCommonView(communicationEntry);

    expect(view.resourceType).toBe(ResourceTypesFhirR4.Communication);
    expect(view.title).toBe(ResourceTypesFhirR4.Communication);
    expect(view.date).toBe('2026-06-01T10:15:00Z');
    expect(view.actors).toEqual([
      {
        identifier: 'did:web:gp.example.org',
        role: undefined,
        type: 'sender',
      },
      {
        identifier: 'did:web:hospital.example.org',
        role: undefined,
        type: 'recipient',
      },
      {
        identifier: 'did:web:family.example.org',
        role: undefined,
        type: 'recipient',
      },
    ]);
  });

  it('maps medication title from medication text and generic performer/asserter actors', () => {
    const medicationEntry = {
      fullUrl: 'urn:uuid:med-1',
      type: 'MedicationStatement-edit-request-v1.0',
      resource: {
        resourceType: ResourceTypesFhirR4.MedicationStatement,
        meta: {
          claims: {
            [MedicationStatementClaim.Identifier]: 'med-1',
            [MedicationStatementClaim.Effective]: '2026-05-28',
            [MedicationStatementClaim.MedicationText]: 'Metformin 850mg',
            [MedicationStatementClaim.Source]: 'did:web:pharmacy.example.org',
            [MedicationStatementClaim.Subject]: 'did:web:patient.example.org',
            'MedicationStatement.performer': 'did:web:doctor.example.org',
            'MedicationStatement.asserter': 'did:web:nurse.example.org',
          },
        },
      },
    };

    const views = toClinicalResourceCommonViews({
      resourceType: 'Bundle',
      type: 'transaction',
      data: [medicationEntry],
    });

    expect(views).toHaveLength(1);
    expect(views[0].title).toBe('Metformin 850mg');
    expect(views[0].date).toBe('2026-05-28');
    expect(views[0].actors).toEqual(expect.arrayContaining([
      {
        identifier: 'did:web:pharmacy.example.org',
        role: undefined,
        type: 'source',
      },
      {
        identifier: 'did:web:patient.example.org',
        role: undefined,
        type: 'subject',
      },
      {
        identifier: 'did:web:doctor.example.org',
        role: undefined,
        type: 'performer',
      },
      {
        identifier: 'did:web:nurse.example.org',
        role: undefined,
        type: 'asserter',
      },
    ]));
  });

  it('builds a minimal card view with 4-5 core fields', () => {
    const entry = {
      fullUrl: 'urn:uuid:comm-2',
      type: 'Communication-edit-request-v1.0',
      resource: {
        resourceType: ResourceTypesFhirR4.Communication,
        meta: {
          claims: {
            [CommunicationClaim.Text]: 'Resumen IPS',
            [CommunicationClaim.Sent]: '2026-06-01T11:00:00Z',
            [CommunicationClaim.Sender]: 'did:web:gp.example.org',
            [CommunicationClaim.Recipient]: 'did:web:hospital.example.org',
          },
        },
      },
    };

    const card = toClinicalResourceCardView(entry);

    expect(card).toEqual({
      title: 'Resumen IPS',
      resourceType: ResourceTypesFhirR4.Communication,
      date: '2026-06-01T11:00:00Z',
      fullUrl: 'urn:uuid:comm-2',
      actorsCount: 2,
    });
  });

  it('builds expanded view with FHIR xhtml narrative and notes array', () => {
    const entry = {
      fullUrl: 'urn:uuid:med-2',
      type: 'MedicationStatement-edit-request-v1.0',
      resource: {
        resourceType: ResourceTypesFhirR4.MedicationStatement,
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><p>Medication narrative</p></div>',
        },
        note: [
          { text: 'Take after meals' },
          { text: 'Check renal function monthly' },
        ],
        meta: {
          claims: {
            [MedicationStatementClaim.Identifier]: 'med-2',
            [MedicationStatementClaim.Note]: 'Take after meals,Observe side effects',
          },
        },
      },
    };

    const expanded = toClinicalResourceExpandedView(entry);

    expect(expanded.xhtml).toBe('<div xmlns="http://www.w3.org/1999/xhtml"><p>Medication narrative</p></div>');
    expect(expanded.notes).toEqual([
      'Take after meals',
      'Check renal function monthly',
      'Observe side effects',
    ]);
    expect(expanded.common.resourceType).toBe(ResourceTypesFhirR4.MedicationStatement);
  });
});
