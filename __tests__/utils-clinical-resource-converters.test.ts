// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims';
import { DeviceUseStatementClaim } from '../src/models/interoperable-claims/device-use-statement-claims';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims';
import { LocationClaim } from '../src/models/interoperable-claims/location-claims';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims';
import { OrganizationClaim } from '../src/models/interoperable-claims/organization-claims';
import {
  allergyIntoleranceFhirR4ToFlat,
  allergyIntoleranceFlatToFhirR4,
  conditionFhirR4ToFlat,
  conditionFlatToFhirR4,
  deviceUseStatementFhirR4ToFlat,
  deviceUseStatementFlatToFhirR4,
  documentReferenceFhirR4ToFlat,
  documentReferenceFlatToFhirR4,
  locationFhirR4ToFlat,
  locationFlatToFhirR4,
  medicationStatementFhirR4ToFlat,
  medicationStatementFlatToFhirR4,
  organizationFhirR4ToFlat,
  organizationFlatToFhirR4,
} from '../src/utils/clinical-resource-converters';

describe('clinical-resource-converters', () => {
  // Reusable clinical claim keys must be imported from interoperable-claims, never duplicated inline in tests.
  it('roundtrips MedicationStatement flat -> FHIR -> flat', () => {
    const flat = {
      [MedicationStatementClaim.Identifier]: 'MED-1',
      [MedicationStatementClaim.Subject]: 'Patient/p1',
      [MedicationStatementClaim.Status]: 'active',
      [MedicationStatementClaim.Effective]: '2026-05-17T08:00:00Z',
      [MedicationStatementClaim.Code]: 'http://rxnorm|123',
      [MedicationStatementClaim.MedicationText]: 'Paracetamol 500mg capsule',
      [MedicationStatementClaim.Note]: 'captured by voice assistant',
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
      [MedicationStatementClaim.MedicationText]: 'Ibuprofen 400mg tablet',
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
      [AllergyIntoleranceClaim.Recorder]: undefined,
    });
  });

  it('roundtrips Condition flat -> FHIR -> flat', () => {
    const flat = {
      [ConditionClaim.Identifier]: 'COND-1',
      [ConditionClaim.Subject]: 'Patient/p1',
      [ConditionClaim.Code]: 'http://snomed.info/sct|44054006',
      [ConditionClaim.ClinicalStatus]: 'active',
      [ConditionClaim.VerificationStatus]: 'confirmed',
    };

    expect(conditionFhirR4ToFlat(conditionFlatToFhirR4(flat))).toEqual(flat);
  });

  it('roundtrips DeviceUseStatement flat -> FHIR -> flat', () => {
    const flat = {
      [DeviceUseStatementClaim.Identifier]: 'DUS-1',
      [DeviceUseStatementClaim.Subject]: 'Patient/p1',
      [DeviceUseStatementClaim.Device]: 'Device/d1',
      [DeviceUseStatementClaim.Status]: 'active',
      [DeviceUseStatementClaim.RecordedOn]: '2026-05-17T08:00:00Z',
      [DeviceUseStatementClaim.TimingDateTime]: '2026-05-16T08:00:00Z',
    };

    expect(deviceUseStatementFhirR4ToFlat(deviceUseStatementFlatToFhirR4(flat))).toEqual(flat);
  });

  it('roundtrips DocumentReference flat -> FHIR -> flat', () => {
    const flat = {
      [DocumentReferenceClaim.Identifier]: 'DOC-1',
      [DocumentReferenceClaim.Subject]: 'Patient/p1',
      [DocumentReferenceClaim.Description]: 'Discharge summary',
      [DocumentReferenceClaim.Date]: '2026-05-17T10:00:00Z',
      [DocumentReferenceClaim.ContentType]: 'application/pdf',
      [DocumentReferenceClaim.ContentData]: 'UERG',
      [DocumentReferenceClaim.Location]: 'https://example.org/Binary/b1',
      [DocumentReferenceClaim.ContentHash]: 'zcid',
      [DocumentReferenceClaim.Language]: 'en',
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
