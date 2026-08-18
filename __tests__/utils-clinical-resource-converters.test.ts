// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims';
import { CarePlanClaim } from '../src/models/interoperable-claims/care-plan-claims';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims';
import { DiagnosticReportClaim } from '../src/models/interoperable-claims/diagnostic-report-claims';
import { DeviceUseStatementClaim } from '../src/models/interoperable-claims/device-use-statement-claims';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims';
import { LocationClaim } from '../src/models/interoperable-claims/location-claims';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims';
import { OrganizationClaim } from '../src/models/interoperable-claims/organization-claims';
import {
  EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_HASH,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DATE,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_LANGUAGE,
  EXAMPLE_DOCUMENT_REFERENCE_URL,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared';
import {
  allergyIntoleranceFhirR4ToFlat,
  allergyIntoleranceFlatToFhirR4,
  carePlanFhirR4ToFlat,
  carePlanFlatToFhirR4,
  conditionFhirR4ToFlat,
  conditionFlatToFhirR4,
  diagnosticReportFhirR4ToFlat,
  diagnosticReportFlatToFhirR4,
  deviceUseStatementFhirR4ToFlat,
  deviceUseStatementFlatToFhirR4,
  documentReferenceFhirR4ToFlat,
  documentReferenceFlatToFhirR4,
  locationFhirR4ToFlat,
  locationFlatToFhirR4,
  immunizationFhirR4ToFlat,
  immunizationFlatToFhirR4,
  medicationStatementFhirR4ToFlat,
  medicationStatementFlatToFhirR4,
  observationFromFlatToFhirR4,
  observationToFlatFhirR4,
  organizationFhirR4ToFlat,
  organizationFlatToFhirR4,
} from '../src/utils/clinical-resource-converters';
import { convertClaimsToFhirResource } from '../src/utils/bundle-document-builder';

const EXAMPLE_ALLERGY_CATEGORY = 'food';
const EXAMPLE_ALLERGY_CRITICALITY = 'high';
const EXAMPLE_ALLERGY_ONSET = '2026-01-10T10:00:00Z';

describe('clinical-resource-converters', () => {
  it.each([
    ['AllergyIntolerance', AllergyIntoleranceClaim],
    ['CarePlan', CarePlanClaim],
    ['Condition', ConditionClaim],
    ['DiagnosticReport', DiagnosticReportClaim],
    ['Immunization', ImmunizationClaim],
    ['MedicationStatement', MedicationStatementClaim],
    ['Observation', ObservationClaim],
  ] as const)('keeps every %s FHIR-like claim leaf lowercase kebab-case', (resourceType, claims) => {
    const keyPattern = new RegExp(`^${resourceType}\\.[a-z0-9]+(?:-[a-z0-9]+)*$`);
    for (const claim of new Set(Object.values(claims))) {
      expect(claim).toMatch(keyPattern);
    }
  });

  it('rehydrates canonical Observation fields from expanded org.hl7.fhir.api claims', () => {
      const context = 'org.hl7.fhir.api';
      const contextualizedClaims = {
        '@context': context,
        [`${context}.${ObservationClaim.Identifier}`]: 'obs-context-1',
        [`${context}.${ObservationClaim.Subject}`]: 'Patient/p1',
        [`${context}.${ObservationClaim.Status}`]: 'final',
        [`${context}.${ObservationClaim.Code}`]: 'http://loinc.org|718-7',
        [`${context}.${ObservationClaim.CodeText}`]: 'Hemoglobin',
        [`${context}.${ObservationClaim.EffectiveDateTime}`]: '2026-08-04T08:00:00Z',
        [`${context}.${ObservationClaim.ValueQuantityNumber}`]: '13.7',
        [`${context}.${ObservationClaim.ValueQuantityUnit}`]: 'http://unitsofmeasure.org|g/dL',
      };

      expect(convertClaimsToFhirResource(contextualizedClaims)).toMatchObject({
        resourceType: 'Observation',
        identifier: [{ value: 'obs-context-1' }],
        status: 'final',
        subject: { reference: 'Patient/p1' },
        effectiveDateTime: '2026-08-04T08:00:00Z',
        valueQuantity: {
          value: 13.7,
          system: 'http://unitsofmeasure.org',
          code: 'g/dL',
        },
      });
  });

  it('rehydrates every clinical-summary resource type from org.hl7.fhir.api claims', () => {
      const context = 'org.hl7.fhir.api';
      const cases: ReadonlyArray<Readonly<{
        claims: Record<string, string>;
        expected: Record<string, unknown>;
      }>> = [
        {
          claims: {
            [AllergyIntoleranceClaim.Subject]: 'urn:uuid:11111111-1111-4111-8111-111111111111',
            [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|227493005',
            [AllergyIntoleranceClaim.Criticality]: 'high',
            [AllergyIntoleranceClaim.OnsetDateTime]: '2020-01-02',
          },
          expected: {
            resourceType: 'AllergyIntolerance',
            criticality: 'high',
            onsetDateTime: '2020-01-02',
          },
        },
        {
          claims: {
            [CarePlanClaim.Subject]: 'Patient/p1',
            [CarePlanClaim.Status]: 'active',
            [CarePlanClaim.Intent]: 'plan',
            [CarePlanClaim.CategoryText]: 'Treatment plan',
          },
          expected: {
            resourceType: 'CarePlan',
            status: 'active',
            intent: 'plan',
            category: [{ text: 'Treatment plan' }],
          },
        },
        {
          claims: {
            [ConditionClaim.Subject]: 'Patient/p1',
            [ConditionClaim.Code]: 'http://snomed.info/sct|44054006',
            [ConditionClaim.OnsetDateTime]: '2020-01-02',
          },
          expected: {
            resourceType: 'Condition',
            subject: { reference: 'Patient/p1' },
            onsetDateTime: '2020-01-02',
          },
        },
        {
          claims: {
            [DiagnosticReportClaim.Subject]: 'Patient/p1',
            [DiagnosticReportClaim.Status]: 'final',
            [DiagnosticReportClaim.Code]: 'http://loinc.org|58410-2',
            [DiagnosticReportClaim.Result]: 'Observation/o1',
          },
          expected: {
            resourceType: 'DiagnosticReport',
            status: 'final',
            result: [{ reference: 'Observation/o1' }],
          },
        },
        {
          claims: {
            [ImmunizationClaim.Subject]: 'Patient/p1',
            [ImmunizationClaim.Status]: 'completed',
            [ImmunizationClaim.VaccineCode]: 'http://hl7.org/fhir/sid/cvx|207',
            [ImmunizationClaim.LotNumber]: 'LOT-42',
          },
          expected: {
            resourceType: 'Immunization',
            status: 'completed',
            lotNumber: 'LOT-42',
          },
        },
        {
          claims: {
            [MedicationStatementClaim.Subject]: 'Patient/p1',
            [MedicationStatementClaim.Status]: 'active',
            [MedicationStatementClaim.MedicationText]: 'Ibuprofen 400 mg',
            [MedicationStatementClaim.DosageInstruction]: 'One tablet every 8 hours',
          },
          expected: {
            resourceType: 'MedicationStatement',
            status: 'active',
            dosage: [{ text: 'One tablet every 8 hours' }],
          },
        },
        {
          claims: {
            [ObservationClaim.Subject]: 'Patient/p1',
            [ObservationClaim.Status]: 'final',
            [ObservationClaim.Code]: 'http://loinc.org|718-7',
            [ObservationClaim.ValueQuantityNumber]: '13.7',
            [ObservationClaim.ValueQuantityUnit]: 'g/dL',
          },
          expected: {
            resourceType: 'Observation',
            status: 'final',
            valueQuantity: { value: 13.7, unit: 'g/dL' },
          },
        },
      ];

      for (const testCase of cases) {
        const contextualized = Object.fromEntries(Object.entries(testCase.claims)
          .map(([key, value]) => [`${context}.${key}`, value]));
        expect(convertClaimsToFhirResource({ '@context': context, ...contextualized }))
          .toMatchObject(testCase.expected);
      }
  });

  it.each([
    { '@context': 'org.hl7.fhir.r4', [ObservationClaim.Subject]: 'Patient/p1' },
    { 'org.hl7.fhir.r4.Observation.subject': 'Patient/p1' },
  ])('rejects version-specific FHIR R4 claim contexts', (claims) => {
    expect(() => convertClaimsToFhirResource(claims)).toThrow(
      'FHIR claims require @context org.hl7.fhir.api',
    );
  });

  it('accepts the legacy Observation.effectiveDateTime input without emitting it', () => {
    const resource = observationFromFlatToFhirR4({
      [ObservationClaim.Subject]: 'Patient/p1',
      [ObservationClaim.Status]: 'final',
      'Observation.effectiveDateTime': '2026-08-04T08:00:00Z',
    });

    expect(resource.effectiveDateTime).toBe('2026-08-04T08:00:00Z');
    expect(observationToFlatFhirR4(resource)).toMatchObject({
      [ObservationClaim.EffectiveDateTime]: '2026-08-04T08:00:00Z',
    });
    expect(observationToFlatFhirR4(resource)).not.toHaveProperty('Observation.effectiveDateTime');
  });

  it('prefers an explicit short canonical claim over contextual compatibility copies', () => {
    const resource = convertClaimsToFhirResource({
      '@context': 'org.hl7.fhir.api',
      [ObservationClaim.Subject]: 'Patient/canonical',
      [`org.hl7.fhir.api.${ObservationClaim.Subject}`]: 'Patient/api-copy',
      [ObservationClaim.Status]: 'final',
      [ObservationClaim.Code]: 'http://loinc.org|718-7',
    });

    expect(resource.subject).toEqual({ reference: 'Patient/canonical' });
  });

  it('preserves text-only Condition and AllergyIntolerance codes in canonical code claims', () => {
    expect(conditionFhirR4ToFlat({
      resourceType: 'Condition',
      subject: { reference: 'Patient/patricia' },
      code: { text: 'Type 2 diabetes' },
    })[ConditionClaim.Code]).toBe('Type 2 diabetes');
    expect(allergyIntoleranceFhirR4ToFlat({
      resourceType: 'AllergyIntolerance',
      patient: { reference: 'Patient/patricia' },
      code: { text: 'Penicillin allergy' },
    })[AllergyIntoleranceClaim.Code]).toBe('Penicillin allergy');
  });

  // Reusable clinical claim keys must be imported from interoperable-claims, never duplicated inline in tests.
  it('roundtrips MedicationStatement flat -> FHIR -> flat', () => {
    const flat = {
      [MedicationStatementClaim.Identifier]: 'MED-1',
      [MedicationStatementClaim.Subject]: 'Patient/p1',
      [MedicationStatementClaim.Status]: 'active',
      [MedicationStatementClaim.Effective]: '2026-05-17T08:00:00Z',
      [MedicationStatementClaim.Code]: 'http://rxnorm|123',
      [MedicationStatementClaim.CodeText]: 'Paracetamol 500mg capsule',
      [MedicationStatementClaim.Note]: 'captured by [device]',
      [MedicationStatementClaim.DosageInstruction]: '1 capsule every 8 hours',
      [MedicationStatementClaim.MedicationIdentifier]: '08470001234567',
      [MedicationStatementClaim.MedicationSerialNumber]: 'LOT-2026-01',
      [MedicationStatementClaim.MedicationExpirationDate]: '2027-12-31',
    };

    expect(medicationStatementFhirR4ToFlat(medicationStatementFlatToFhirR4(flat))).toEqual(flat);
  });

  it('maps MedicationStatement.medication-* claims to contained Medication in FHIR R4', () => {
    const flat = {
      [MedicationStatementClaim.Subject]: 'Patient/p2',
      [MedicationStatementClaim.Status]: 'active',
      [MedicationStatementClaim.CodeText]: 'Ibuprofen 400mg tablet',
      [MedicationStatementClaim.MedicationIdentifier]: '05550001112222',
      [MedicationStatementClaim.MedicationSerialNumber]: 'LOT-IBU-9',
      [MedicationStatementClaim.MedicationExpirationDate]: '2028-01-01',
    };

    const fhir = medicationStatementFlatToFhirR4(flat);
    expect((fhir.medicationReference as { reference?: string } | undefined)?.reference).toBe('#medication-contained-1');
    expect(Array.isArray(fhir.contained)).toBe(true);
    const medication = (fhir.contained as Array<Record<string, unknown>>)[0];
    expect(medication.resourceType).toBe('Medication');
    expect((medication.identifier as Array<{ value?: string }>)[0]?.value).toBe('05550001112222');
    expect((medication.batch as { lotNumber?: string })?.lotNumber).toBe('LOT-IBU-9');
    expect((medication.batch as { expirationDate?: string })?.expirationDate).toBe('2028-01-01');
  });

  it('roundtrips AllergyIntolerance flat -> FHIR -> flat', () => {
    const flat = {
      [AllergyIntoleranceClaim.Identifier]: 'ALG-1',
      [AllergyIntoleranceClaim.Subject]: 'urn:uuid:11111111-1111-4111-8111-111111111111',
      [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|227493005',
      [AllergyIntoleranceClaim.ClinicalStatus]: 'active',
      [AllergyIntoleranceClaim.VerificationStatus]: 'confirmed',
      [AllergyIntoleranceClaim.Category]: EXAMPLE_ALLERGY_CATEGORY,
      [AllergyIntoleranceClaim.Criticality]: EXAMPLE_ALLERGY_CRITICALITY,
      [AllergyIntoleranceClaim.OnsetDateTime]: EXAMPLE_ALLERGY_ONSET,
      [AllergyIntoleranceClaim.Recorder]: 'did:web:example.com:organization:taxid:123456789:member:987:MD',
    };

    expect(allergyIntoleranceFhirR4ToFlat(allergyIntoleranceFlatToFhirR4(flat))).toEqual({
      ...flat,
      [AllergyIntoleranceClaim.Patient]: 'urn:uuid:11111111-1111-4111-8111-111111111111',
    });
  });

  it('accepts deprecated AllergyIntolerance.patient alias as input', () => {
    const flat = {
      [AllergyIntoleranceClaim.Identifier]: 'ALG-2',
      [AllergyIntoleranceClaim.Patient]: 'did:web:example.com:individual:22b8d5d5-52f6-44a0-b047-feb5fdbbe1a0',
      [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|91936005',
    };

    expect(allergyIntoleranceFhirR4ToFlat(allergyIntoleranceFlatToFhirR4(flat))).toEqual({
      [AllergyIntoleranceClaim.Identifier]: 'ALG-2',
      [AllergyIntoleranceClaim.Subject]: 'did:web:example.com:individual:22b8d5d5-52f6-44a0-b047-feb5fdbbe1a0',
      [AllergyIntoleranceClaim.Patient]: 'did:web:example.com:individual:22b8d5d5-52f6-44a0-b047-feb5fdbbe1a0',
      [AllergyIntoleranceClaim.Code]: 'http://snomed.info/sct|91936005',
      [AllergyIntoleranceClaim.ClinicalStatus]: undefined,
      [AllergyIntoleranceClaim.VerificationStatus]: undefined,
      [AllergyIntoleranceClaim.Category]: undefined,
      [AllergyIntoleranceClaim.Criticality]: undefined,
      [AllergyIntoleranceClaim.OnsetDateTime]: undefined,
      [AllergyIntoleranceClaim.Recorder]: undefined,
    });
  });

  it('roundtrips Condition flat -> FHIR -> flat', () => {
    const flat = {
      [ConditionClaim.Identifier]: 'COND-1',
      [ConditionClaim.Subject]: 'Patient/p1',
      [ConditionClaim.Code]: 'http://snomed.info/sct|44054006',
      [ConditionClaim.CodeText]: 'Diabetes tipo 2',
      [ConditionClaim.CodeDisplay]: 'Type 2 diabetes mellitus',
      [ConditionClaim.ClinicalStatus]: 'active',
      [ConditionClaim.VerificationStatus]: 'confirmed',
      [ConditionClaim.Category]: 'http://terminology.hl7.org/CodeSystem/condition-category|problem-list-item',
      [ConditionClaim.Severity]: 'http://snomed.info/sct|24484000',
      [ConditionClaim.OnsetDateTime]: '2020-01-02',
      [ConditionClaim.Recorder]: 'Practitioner/p1',
    };

    expect(conditionFhirR4ToFlat(conditionFlatToFhirR4(flat))).toEqual(flat);
  });

  it('roundtrips every native Immunization claim flat -> FHIR -> flat', () => {
    const flat = {
      [ImmunizationClaim.Identifier]: 'IMM-1',
      [ImmunizationClaim.Subject]: 'Patient/p1',
      [ImmunizationClaim.Status]: 'completed',
      [ImmunizationClaim.VaccineCode]: 'http://hl7.org/fhir/sid/cvx|207',
      [ImmunizationClaim.VaccineCodeText]: 'Vacuna COVID-19',
      [ImmunizationClaim.VaccineCodeDisplay]: 'COVID-19 vaccine',
      [ImmunizationClaim.Date]: '2026-08-04T08:00:00Z',
      [ImmunizationClaim.Location]: 'Location/room-1',
      [ImmunizationClaim.Manufacturer]: 'Organization/lab-1',
      [ImmunizationClaim.LotNumber]: 'LOT-42',
      [ImmunizationClaim.Performer]: 'Practitioner/p1,Organization/o1',
      [ImmunizationClaim.ReactionDate]: '2026-08-05T08:00:00Z',
      [ImmunizationClaim.ReasonCode]: 'http://snomed.info/sct|281647001',
      [ImmunizationClaim.ReasonReference]: 'Condition/c1',
      [ImmunizationClaim.Series]: 'Primary series',
      [ImmunizationClaim.StatusReason]: 'http://terminology.hl7.org/CodeSystem/immunization-status-reason|expired',
      [ImmunizationClaim.TargetDisease]: 'http://snomed.info/sct|840539006',
      [ImmunizationClaim.DoseSequence]: '2',
      [ImmunizationClaim.Note]: 'No adverse reaction.',
    };

    expect(immunizationFhirR4ToFlat(immunizationFlatToFhirR4(flat))).toEqual({
      ...flat,
      [ImmunizationClaim.Patient]: 'Patient/p1',
    });
  });

  it('roundtrips every native CarePlan claim flat -> FHIR -> flat', () => {
    const flat = {
      [CarePlanClaim.Identifier]: 'CP-1',
      [CarePlanClaim.Subject]: 'Patient/p1',
      [CarePlanClaim.Status]: 'active',
      [CarePlanClaim.Intent]: 'plan',
      [CarePlanClaim.Category]: 'http://snomed.info/sct|736373009',
      [CarePlanClaim.CategoryText]: 'Plan de tratamiento',
      [CarePlanClaim.CategoryDisplay]: 'Treatment plan',
      [CarePlanClaim.Date]: '2026-08-04T08:00:00Z',
      [CarePlanClaim.Note]: 'Daily exercise.',
      [CarePlanClaim.BasedOn]: 'ServiceRequest/sr-1',
      [CarePlanClaim.CareTeam]: 'CareTeam/team-1',
      [CarePlanClaim.Condition]: 'Condition/c1',
      [CarePlanClaim.Encounter]: 'Encounter/e1',
      [CarePlanClaim.Goal]: 'Goal/g1',
      [CarePlanClaim.PartOf]: 'CarePlan/parent-1',
      [CarePlanClaim.Replaces]: 'CarePlan/old-1',
      [CarePlanClaim.ActivityCode]: 'http://snomed.info/sct|229065009',
      [CarePlanClaim.ActivityDate]: '2026-08-05T09:00:00Z',
      [CarePlanClaim.ActivityReference]: 'ServiceRequest/sr-2',
      [CarePlanClaim.Performer]: 'Practitioner/p1',
    };

    expect(Object.fromEntries(Object.entries(carePlanFhirR4ToFlat(carePlanFlatToFhirR4(flat))).filter(([, value]) => value !== undefined))).toEqual({
      ...flat,
      [CarePlanClaim.Patient]: 'Patient/p1',
    });
  });

  it('roundtrips every native DiagnosticReport claim flat -> FHIR -> flat', () => {
    const flat = {
      [DiagnosticReportClaim.Identifier]: 'DR-1',
      [DiagnosticReportClaim.Subject]: 'Patient/p1',
      [DiagnosticReportClaim.Status]: 'final',
      [DiagnosticReportClaim.Category]: 'http://terminology.hl7.org/CodeSystem/v2-0074|LAB',
      [DiagnosticReportClaim.Code]: 'http://loinc.org|58410-2',
      [DiagnosticReportClaim.CodeText]: 'Hemograma',
      [DiagnosticReportClaim.CodeDisplay]: 'Complete blood count panel',
      [DiagnosticReportClaim.Date]: '2026-08-04T08:00:00Z',
      [DiagnosticReportClaim.Encounter]: 'Encounter/e1',
      [DiagnosticReportClaim.BasedOn]: 'ServiceRequest/sr-1',
      [DiagnosticReportClaim.Performer]: 'Organization/lab-1',
      [DiagnosticReportClaim.Result]: 'Observation/o1,Observation/o2',
      [DiagnosticReportClaim.ResultsInterpreter]: 'Practitioner/p1',
      [DiagnosticReportClaim.Specimen]: 'Specimen/s1',
      [DiagnosticReportClaim.Media]: 'Media/m1',
      [DiagnosticReportClaim.PresentedFormContentType]: 'application/pdf',
      [DiagnosticReportClaim.PresentedFormData]: 'JVBERi0xLjc=',
      [DiagnosticReportClaim.PresentedFormUrl]: 'https://example.org/report.pdf',
    };

    expect(diagnosticReportFhirR4ToFlat(diagnosticReportFlatToFhirR4(flat))).toEqual({
      ...flat,
      [DiagnosticReportClaim.Patient]: 'Patient/p1',
    });
  });

  it('roundtrips the editable Observation result fields flat -> FHIR -> flat', () => {
    const flat = {
      [ObservationClaim.Identifier]: 'OBS-1',
      [ObservationClaim.Subject]: 'Patient/p1',
      [ObservationClaim.Status]: 'final',
      [ObservationClaim.Category]: 'http://terminology.hl7.org/CodeSystem/observation-category|laboratory',
      [ObservationClaim.Code]: 'http://loinc.org|718-7',
      [ObservationClaim.CodeSystem]: 'http://loinc.org',
      [ObservationClaim.CodeValue]: '718-7',
      [ObservationClaim.CodeText]: 'Hemoglobina',
      [ObservationClaim.CodeDisplay]: 'Hemoglobin',
      [ObservationClaim.EffectiveDateTime]: '2026-08-04T08:00:00Z',
      [ObservationClaim.ValueQuantityNumber]: '13.7',
      [ObservationClaim.ValueQuantityUnit]: 'http://unitsofmeasure.org|g/dL',
      [ObservationClaim.ValueQuantityComparator]: '>=',
      [ObservationClaim.Performer]: 'Practitioner/p1',
      [ObservationClaim.Encounter]: 'Encounter/e1',
      [ObservationClaim.Specimen]: 'Specimen/s1',
      [ObservationClaim.Note]: 'Fasting sample.',
    };

    expect(observationToFlatFhirR4(observationFromFlatToFhirR4(flat))).toMatchObject({
      ...flat,
      [ObservationClaim.Date]: '2026-08-04T08:00:00Z',
      [ObservationClaim.Patient]: 'Patient/p1',
    });
  });

  it('roundtrips DeviceUseStatement flat -> FHIR -> flat', () => {
    const flat = {
      [DeviceUseStatementClaim.Identifier]: 'DUS-1',
      [DeviceUseStatementClaim.Subject]: 'Patient/p1',
      [DeviceUseStatementClaim.Device]: 'Device/d1',
      [DeviceUseStatementClaim.DeviceDisplay]: 'Hip prosthesis',
      [DeviceUseStatementClaim.Status]: 'active',
      [DeviceUseStatementClaim.RecordedOn]: '2026-05-17T08:00:00Z',
      [DeviceUseStatementClaim.TimingDateTime]: '2026-05-16T08:00:00Z',
    };

    expect(deviceUseStatementFhirR4ToFlat(deviceUseStatementFlatToFhirR4(flat))).toEqual(flat);
  });

  it('roundtrips DocumentReference flat -> FHIR -> flat', () => {
    const flat = {
      [DocumentReferenceClaim.Identifier]: EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      [DocumentReferenceClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [DocumentReferenceClaim.Description]: EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
      [DocumentReferenceClaim.Date]: EXAMPLE_DOCUMENT_REFERENCE_DATE,
      [DocumentReferenceClaim.ContentType]: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
      [DocumentReferenceClaim.ContentData]: EXAMPLE_CONSENT_ATTACHMENT_DATA_BASE64,
      [DocumentReferenceClaim.Location]: EXAMPLE_DOCUMENT_REFERENCE_URL,
      [DocumentReferenceClaim.ContentHash]: EXAMPLE_DOCUMENT_REFERENCE_CONTENT_HASH,
      [DocumentReferenceClaim.Language]: EXAMPLE_DOCUMENT_REFERENCE_LANGUAGE,
    };

    expect(documentReferenceFhirR4ToFlat(documentReferenceFlatToFhirR4(flat))).toEqual(flat);
  });

  it('roundtrips Organization flat -> FHIR -> flat', () => {
    const flat = {
      [OrganizationClaim.Identifier]: 'dept-cardiology-001',
      [OrganizationClaim.Active]: 'true',
      [OrganizationClaim.Type]: 'http://terminology.hl7.org/CodeSystem/organization-type|dept',
      [OrganizationClaim.Name]: 'Cardiology Department',
      [OrganizationClaim.Alias]: 'Cardiology,Heart Clinic',
      [OrganizationClaim.PartOf]: 'Organization/hospital-1',
      [OrganizationClaim.Telecom]: 'tel:+16045550101,mailto:cardiology@example.org',
      [OrganizationClaim.Address]: '123 Main St, Vancouver',
    };

    expect(organizationFhirR4ToFlat(organizationFlatToFhirR4(flat))).toEqual(flat);
  });

  it('roundtrips Location flat -> FHIR -> flat', () => {
    const flat = {
      [LocationClaim.Identifier]: 'room-201',
      [LocationClaim.Status]: 'active',
      [LocationClaim.Name]: 'Consultation Room 201',
      [LocationClaim.Description]: 'Second floor consultation room',
      [LocationClaim.Type]: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode|OF',
      [LocationClaim.Mode]: 'instance',
      [LocationClaim.Telecom]: 'tel:+16045550102',
      [LocationClaim.Address]: '123 Main St, Vancouver',
      [LocationClaim.PhysicalType]: 'http://terminology.hl7.org/CodeSystem/location-physical-type|ro',
      [LocationClaim.ManagingOrganization]: 'Organization/dept-cardiology-001',
      [LocationClaim.PartOf]: 'Location/building-a',
    };

    expect(locationFhirR4ToFlat(locationFlatToFhirR4(flat))).toEqual(flat);
  });

  it('fails when required claims are missing', () => {
    expect(() => medicationStatementFlatToFhirR4({})).toThrow(`Missing required claim: ${MedicationStatementClaim.Subject}`);
    expect(() => allergyIntoleranceFlatToFhirR4({})).toThrow(`Missing required claim: ${AllergyIntoleranceClaim.Subject}`);
    expect(() => conditionFlatToFhirR4({})).toThrow(`Missing required claim: ${ConditionClaim.Subject}`);
    expect(() => documentReferenceFlatToFhirR4({})).toThrow(`Missing required claim: ${DocumentReferenceClaim.Subject}`);
  });

  it('rejects invalid subject/recorder formats in AllergyIntolerance', () => {
    expect(() =>
      allergyIntoleranceFlatToFhirR4({
        [AllergyIntoleranceClaim.Subject]: 'Patient/p1',
      }),
    ).toThrow(`Invalid ${AllergyIntoleranceClaim.Subject}: expected urn:* or did:web:*`);

    expect(() =>
      allergyIntoleranceFlatToFhirR4({
        [AllergyIntoleranceClaim.Subject]: 'urn:uuid:11111111-1111-4111-8111-111111111111',
        [AllergyIntoleranceClaim.Recorder]: 'urn:uuid:22222222-2222-4222-8222-222222222222',
      }),
    ).toThrow(`Invalid ${AllergyIntoleranceClaim.Recorder}: expected did:web:*`);
  });
});
