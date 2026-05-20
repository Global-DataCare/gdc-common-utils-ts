import {
  allergyIntoleranceFhirToFlat,
  allergyIntoleranceFlatToFhir,
  conditionFhirToFlat,
  conditionFlatToFhir,
  deviceUseStatementFhirToFlat,
  deviceUseStatementFlatToFhir,
  documentReferenceFhirToFlat,
  documentReferenceFlatToFhir,
  medicationStatementFhirToFlat,
  medicationStatementFlatToFhir,
} from '../src/utils/clinical-resource-converters';

describe('clinical-resource-converters', () => {
  it('roundtrips MedicationStatement flat -> FHIR -> flat', () => {
    const flat = {
      'MedicationStatement.identifier': 'MED-1',
      'MedicationStatement.subject': 'Patient/p1',
      'MedicationStatement.status': 'active',
      'MedicationStatement.effective': '2026-05-17T08:00:00Z',
      'MedicationStatement.code': 'http://rxnorm|123',
      'MedicationStatement.medication-text': 'Paracetamol 500mg capsule',
      'MedicationStatement.note': 'captured by voice assistant',
      'MedicationStatement.dosage-instruction': '1 capsule every 8 hours',
      'MedicationStatement.medication-identifier': '08470001234567',
      'MedicationStatement.medication-serial-number': 'LOT-2026-01',
      'MedicationStatement.medication-expiration-date': '2027-12-31',
    };

    expect(medicationStatementFhirToFlat(medicationStatementFlatToFhir(flat))).toEqual(flat);
  });

  it('maps MedicationStatement.medication-* claims to contained Medication in FHIR R4', () => {
    const flat = {
      'MedicationStatement.subject': 'Patient/p2',
      'MedicationStatement.status': 'active',
      'MedicationStatement.medication-text': 'Ibuprofen 400mg tablet',
      'MedicationStatement.medication-identifier': '05550001112222',
      'MedicationStatement.medication-serial-number': 'LOT-IBU-9',
      'MedicationStatement.medication-expiration-date': '2028-01-01',
    };

    const fhir = medicationStatementFlatToFhir(flat);
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
      'AllergyIntolerance.identifier': 'ALG-1',
      'AllergyIntolerance.subject': 'urn:uuid:11111111-1111-4111-8111-111111111111',
      'AllergyIntolerance.code': 'http://snomed.info/sct|227493005',
      'AllergyIntolerance.clinical-status': 'active',
      'AllergyIntolerance.verification-status': 'confirmed',
      'AllergyIntolerance.recorder': 'did:web:example.com:organization:taxid:123456789:member:987:MD',
    };

    expect(allergyIntoleranceFhirToFlat(allergyIntoleranceFlatToFhir(flat))).toEqual({
      ...flat,
      'AllergyIntolerance.patient': 'urn:uuid:11111111-1111-4111-8111-111111111111',
    });
  });

  it('accepts deprecated AllergyIntolerance.patient alias as input', () => {
    const flat = {
      'AllergyIntolerance.identifier': 'ALG-2',
      'AllergyIntolerance.patient': 'did:web:example.com:individual:22b8d5d5-52f6-44a0-b047-feb5fdbbe1a0',
      'AllergyIntolerance.code': 'http://snomed.info/sct|91936005',
    };

    expect(allergyIntoleranceFhirToFlat(allergyIntoleranceFlatToFhir(flat))).toEqual({
      'AllergyIntolerance.identifier': 'ALG-2',
      'AllergyIntolerance.subject': 'did:web:example.com:individual:22b8d5d5-52f6-44a0-b047-feb5fdbbe1a0',
      'AllergyIntolerance.patient': 'did:web:example.com:individual:22b8d5d5-52f6-44a0-b047-feb5fdbbe1a0',
      'AllergyIntolerance.code': 'http://snomed.info/sct|91936005',
      'AllergyIntolerance.clinical-status': undefined,
      'AllergyIntolerance.verification-status': undefined,
      'AllergyIntolerance.recorder': undefined,
    });
  });

  it('roundtrips Condition flat -> FHIR -> flat', () => {
    const flat = {
      'Condition.identifier': 'COND-1',
      'Condition.subject': 'Patient/p1',
      'Condition.code': 'http://snomed.info/sct|44054006',
      'Condition.clinical-status': 'active',
      'Condition.verification-status': 'confirmed',
    };

    expect(conditionFhirToFlat(conditionFlatToFhir(flat))).toEqual(flat);
  });

  it('roundtrips DeviceUseStatement flat -> FHIR -> flat', () => {
    const flat = {
      'DeviceUseStatement.identifier': 'DUS-1',
      'DeviceUseStatement.subject': 'Patient/p1',
      'DeviceUseStatement.device': 'Device/d1',
      'DeviceUseStatement.status': 'active',
      'DeviceUseStatement.recordedon': '2026-05-17T08:00:00Z',
      'DeviceUseStatement.timing-datetime': '2026-05-16T08:00:00Z',
    };

    expect(deviceUseStatementFhirToFlat(deviceUseStatementFlatToFhir(flat))).toEqual(flat);
  });

  it('roundtrips DocumentReference flat -> FHIR -> flat', () => {
    const flat = {
      'DocumentReference.identifier': 'DOC-1',
      'DocumentReference.subject': 'Patient/p1',
      'DocumentReference.description': 'Discharge summary',
      'DocumentReference.date': '2026-05-17T10:00:00Z',
      'DocumentReference.contenttype': 'application/pdf',
      'DocumentReference.contentdata': 'UERG',
      'DocumentReference.location': 'https://example.org/Binary/b1',
      'DocumentReference.contenthash': 'zcid',
      'DocumentReference.language': 'en',
    };

    expect(documentReferenceFhirToFlat(documentReferenceFlatToFhir(flat))).toEqual(flat);
  });

  it('fails when required claims are missing', () => {
    expect(() => medicationStatementFlatToFhir({})).toThrow('Missing required claim: MedicationStatement.subject');
    expect(() => allergyIntoleranceFlatToFhir({})).toThrow('Missing required claim: AllergyIntolerance.subject');
    expect(() => conditionFlatToFhir({})).toThrow('Missing required claim: Condition.subject');
    expect(() => documentReferenceFlatToFhir({})).toThrow('Missing required claim: DocumentReference.subject');
  });

  it('rejects invalid subject/recorder formats in AllergyIntolerance', () => {
    expect(() =>
      allergyIntoleranceFlatToFhir({
        'AllergyIntolerance.subject': 'Patient/p1',
      }),
    ).toThrow('Invalid AllergyIntolerance.subject: expected urn:* or did:web:*');

    expect(() =>
      allergyIntoleranceFlatToFhir({
        'AllergyIntolerance.subject': 'urn:uuid:11111111-1111-4111-8111-111111111111',
        'AllergyIntolerance.recorder': 'urn:uuid:22222222-2222-4222-8222-222222222222',
      }),
    ).toThrow('Invalid AllergyIntolerance.recorder: expected did:web:*');
  });
});
