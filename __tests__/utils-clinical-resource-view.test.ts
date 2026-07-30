import { describe, expect, it } from '@jest/globals';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ClaimConsent } from '../src/models/consent-rule.js';
import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { FlagClaim } from '../src/models/interoperable-claims/flag-claims.js';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import {
  getLocalTextAndIntDisplay,
  getNarrative,
  getXhtmlOrDerived,
  toClinicalResourceCardView,
  toClinicalResourceCardViews,
  toClinicalResourceCommonView,
  toClinicalResourceCommonViews,
  toClinicalResourceExpandedView,
  toClinicalSectionViews,
} from '../src/utils/clinical-resource-view.js';

describe('clinical resource common view', () => {
  /**
   * Flow contract: adapters turn both contextualized `meta.claims` entries and native
   * FHIR IPS resources into the same compact cards. IPS section placement is
   * always read from Composition references, never guessed from resourceType.
   */
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
    expect(view.title).toBe(ResourceTypesFhirR4.Consent);
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

  it('maps condition and allergy titles, dates, and actors from meta.claims', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      data: [
        {
          fullUrl: 'urn:uuid:condition-1',
          type: 'Condition-edit-request-v1.0',
          resource: {
            resourceType: ResourceTypesFhirR4.Condition,
            meta: {
              claims: {
                [ConditionClaim.Identifier]: 'condition-1',
                [ConditionClaim.Code]: 'http://snomed.info/sct|44054006',
                [ConditionClaim.Category]: 'LOINC|11450-4',
                [ConditionClaim.OnsetDateTime]: '2026-05-03T09:00:00Z',
                [ConditionClaim.Subject]: 'did:web:patient.example.org',
                [ConditionClaim.Recorder]: 'did:web:doctor.example.org',
              },
            },
          },
        },
        {
          fullUrl: 'urn:uuid:allergy-1',
          type: 'AllergyIntolerance-edit-request-v1.0',
          resource: {
            resourceType: ResourceTypesFhirR4.AllergyIntolerance,
            meta: {
              claims: {
                [AllergyIntoleranceClaim.Identifier]: 'allergy-1',
                [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|227493005',
                [AllergyIntoleranceClaim.OnsetDateTime]: '2026-05-01T08:30:00Z',
                [AllergyIntoleranceClaim.Subject]: 'did:web:patient.example.org',
                [AllergyIntoleranceClaim.Recorder]: 'did:web:allergist.example.org',
              },
            },
          },
        },
      ],
    };

    const views = toClinicalResourceCommonViews(bundle);

    expect(views[0]).toEqual(expect.objectContaining({
      title: ResourceTypesFhirR4.Condition,
      resourceType: ResourceTypesFhirR4.Condition,
      identifier: 'condition-1',
      date: '2026-05-03T09:00:00Z',
    }));
    expect(views[0].actors).toEqual(expect.arrayContaining([
      { identifier: 'did:web:patient.example.org', role: undefined, type: 'subject' },
      { identifier: 'did:web:doctor.example.org', role: undefined, type: 'asserter' },
    ]));

    expect(views[1]).toEqual(expect.objectContaining({
      title: ResourceTypesFhirR4.AllergyIntolerance,
      resourceType: ResourceTypesFhirR4.AllergyIntolerance,
      identifier: 'allergy-1',
      date: '2026-05-01T08:30:00Z',
    }));
  });

  it('accepts FHIR bundle entry[] shape directly for card views', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          fullUrl: 'urn:uuid:med-3',
          resource: {
            resourceType: ResourceTypesFhirR4.MedicationStatement,
            meta: {
              claims: {
                [MedicationStatementClaim.MedicationText]: 'Ibuprofen 400mg',
                [MedicationStatementClaim.Effective]: '2026-06-01',
                [MedicationStatementClaim.Subject]: 'did:web:patient.example.org',
              },
            },
          },
        },
      ],
    };

    const cards = toClinicalResourceCardViews(bundle);

    expect(cards).toEqual([
      {
        title: 'Ibuprofen 400mg',
        resourceType: ResourceTypesFhirR4.MedicationStatement,
        date: '2026-06-01',
        fullUrl: 'urn:uuid:med-3',
        actorsCount: 1,
      },
    ]);
  });

  it('summarizes native IPS FHIR resources without requiring meta.claims', () => {
    const cards = toClinicalResourceCardViews({
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          fullUrl: 'urn:uuid:medication-statement-ips-1',
          resource: {
            resourceType: ResourceTypesFhirR4.MedicationStatement,
            id: 'medication-statement-ips-1',
            identifier: [{ value: 'medication-business-id-1' }],
            medicationCodeableConcept: {
              text: 'Metformina 850 mg',
              coding: [{ display: 'Metformin 850 mg oral tablet' }],
            },
            effectivePeriod: { start: '2026-07-01' },
            subject: { reference: 'Patient/patricia' },
            informationSource: { reference: 'Practitioner/fernando' },
          },
        },
      ],
    });

    expect(cards).toEqual([
      {
        title: 'Metformina 850 mg',
        resourceType: ResourceTypesFhirR4.MedicationStatement,
        date: '2026-07-01',
        fullUrl: 'urn:uuid:medication-statement-ips-1',
        actorsCount: 2,
      },
    ]);
  });

  it('groups resources by Composition.section references instead of guessing from resourceType', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          fullUrl: 'urn:uuid:composition-ips-1',
          resource: {
            resourceType: ResourceTypesFhirR4.Composition,
            section: [
              {
                title: 'Diagnostic results',
                code: { coding: [{ system: 'http://loinc.org', code: '30954-2' }] },
                entry: [{ reference: 'Observation/laboratory-result-1' }],
              },
              {
                title: 'Vital signs',
                code: { coding: [{ system: 'http://loinc.org', code: '8716-3' }] },
                entry: [{ reference: 'Observation/blood-pressure-1' }],
              },
            ],
          },
        },
        {
          fullUrl: 'http://example.test/fhir/Observation/laboratory-result-1',
          resource: {
            resourceType: ResourceTypesFhirR4.Observation,
            id: 'laboratory-result-1',
            code: { text: 'Hemoglobina' },
            effectiveDateTime: '2026-07-10T08:00:00Z',
          },
        },
        {
          fullUrl: 'http://example.test/fhir/Observation/blood-pressure-1',
          resource: {
            resourceType: ResourceTypesFhirR4.Observation,
            id: 'blood-pressure-1',
            code: { text: 'Presion arterial' },
            effectiveDateTime: '2026-07-10T09:00:00Z',
          },
        },
      ],
    };

    const sections = toClinicalSectionViews(bundle);

    expect(sections).toHaveLength(2);
    expect(sections[0]).toEqual(expect.objectContaining({
      code: 'http://loinc.org|30954-2',
      title: 'Diagnostic results',
      unresolvedReferences: [],
    }));
    expect(sections[0].resources.map((resource) => resource.title)).toEqual(['Hemoglobina']);
    expect(sections[1].resources.map((resource) => resource.title)).toEqual(['Presion arterial']);
  });

  it('propagates UI locale and terminology translation while building section cards', () => {
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Composition,
            section: [{
              title: 'Problems',
              code: { coding: [{ system: 'http://loinc.org', code: '11450-4' }] },
              entry: [{ reference: 'Condition/diabetes' }],
            }],
          },
        },
        {
          fullUrl: 'Condition/diabetes',
          resource: {
            resourceType: ResourceTypesFhirR4.Condition,
            id: 'diabetes',
            language: 'es',
            code: {
              text: 'Diabetes mellitus tipo 2',
              coding: [{
                system: 'http://snomed.info/sct',
                code: '44054006',
                display: 'Type 2 diabetes mellitus',
              }],
            },
          },
        },
      ],
    };

    expect(toClinicalSectionViews(bundle, { locale: 'es-ES' })[0].resources[0].title)
      .toBe('Diabetes mellitus tipo 2');
    expect(toClinicalSectionViews(bundle, { locale: 'en' })[0].resources[0].title)
      .toBe('Type 2 diabetes mellitus');
    expect(toClinicalSectionViews(bundle, {
      locale: 'fr',
      translateCode: ({ token }) => token === 'http://snomed.info/sct|44054006'
        ? 'Diabète de type 2'
        : undefined,
    })[0].resources[0].title).toBe('Diabète de type 2');
  });

  it.each([
    {
      resourceType: ResourceTypesFhirR4.Observation,
      tokenClaim: ObservationClaim.Code,
      conceptField: 'code',
    },
    {
      resourceType: ResourceTypesFhirR4.Flag,
      tokenClaim: FlagClaim.Code,
      conceptField: 'code',
    },
    {
      resourceType: ResourceTypesFhirR4.Immunization,
      tokenClaim: ImmunizationClaim.VaccineCode,
      conceptField: 'vaccineCode',
    },
  ])(
    'translates $resourceType from its canonical claim token when summary readback coding only retains display',
    ({ resourceType, tokenClaim, conceptField }) => {
      const token = 'http://snomed.info/sct|123456';
      const translated = toClinicalResourceCardView({
        resource: {
          resourceType,
          language: 'en',
          meta: {
            claims: {
              [tokenClaim]: token,
            },
          },
          [conceptField]: {
            coding: [{ display: `International ${resourceType}` }],
          },
        },
      }, {
        locale: 'fr',
        translateCode: ({ token: inputToken }) => inputToken === token
          ? `Traduit ${resourceType}`
          : undefined,
      });

      expect(translated.title).toBe(`Traduit ${resourceType}`);
    },
  );

  it('keeps the readback display fallback when neither native coding nor claims contain a code token', () => {
    const card = toClinicalResourceCardView({
      resource: {
        resourceType: ResourceTypesFhirR4.Observation,
        code: {
          coding: [{ display: 'Blood pressure' }],
        },
      },
    }, {
      locale: 'fr',
      translateCode: () => 'must not be called without a token',
    });

    expect(card.title).toBe('Blood pressure');
  });

  it('keeps unresolved Composition references visible to the caller', () => {
    const sections = toClinicalSectionViews({
      resourceType: 'Bundle',
      type: 'document',
      entry: [{
        resource: {
          resourceType: ResourceTypesFhirR4.Composition,
          section: [{
            title: 'Results',
            entry: [{ reference: 'Observation/missing' }],
          }],
        },
      }],
    });

    expect(sections[0].resources).toEqual([]);
    expect(sections[0].unresolvedReferences).toEqual(['Observation/missing']);
  });

  it('builds combined local text plus international display when both are present', () => {
    const labels = getLocalTextAndIntDisplay({
      resourceType: ResourceTypesFhirR4.Observation,
      meta: {
        claims: {
          [ConditionClaim.Code]: 'http://loinc.org|85354-9',
          'Observation.code-text': 'Tension arterial',
          'Observation.code-display': 'Blood pressure',
        },
      },
    });

    expect(labels.localText).toBe('Tension arterial');
    expect(labels.internationalDisplay).toBe('Blood pressure');
    expect(labels.combined).toBe('Tension arterial (Blood pressure)');
  });

  it('derives xhtml from medication claims when no resource.text.div exists', () => {
    const xhtml = getXhtmlOrDerived({
      resourceType: ResourceTypesFhirR4.MedicationStatement,
      meta: {
        claims: {
          [MedicationStatementClaim.MedicationText]: 'Ibuprofen 400 mg',
          [MedicationStatementClaim.Effective]: '2026-06-20',
          [MedicationStatementClaim.Status]: 'active',
          'MedicationStatement.dose-quantity-value': 400,
          'MedicationStatement.dose-quantity-unit': 'mg',
          'MedicationStatement.timing-frequency': 1,
          'MedicationStatement.timing-period': 8,
          'MedicationStatement.timing-period-unit': 'h',
        },
      },
    });

    expect(xhtml).toContain('Ibuprofen 400 mg');
    expect(xhtml).toContain('Date: 2026-06-20');
    expect(xhtml).toContain('Dose: 400 mg');
    expect(xhtml).toContain('Timing: 1x every 8 h');
  });

  it('derives blood pressure xhtml with systolic and diastolic lines', () => {
    const narrative = getNarrative({
      resourceType: ResourceTypesFhirR4.Observation,
      meta: {
        claims: {
          'Observation.code-text': 'Presion arterial',
          'Observation.code-display': 'Blood pressure',
          'Observation.code': 'http://loinc.org|85354-9',
          'Observation.date': '2026-06-20T10:00:00Z',
          'Observation.bp-systolic-number': 120,
          'Observation.bp-diastolic-number': 80,
          'Observation.value-quantity-unit': 'mmHg',
        },
      },
    });

    expect(narrative.source).toBe('derived-from-claims');
    expect(narrative.xhtml).toContain('Presion arterial (Blood pressure)');
    expect(narrative.xhtml).toContain('Systolic: 120 mmHg');
    expect(narrative.xhtml).toContain('Diastolic: 80 mmHg');
  });
});
