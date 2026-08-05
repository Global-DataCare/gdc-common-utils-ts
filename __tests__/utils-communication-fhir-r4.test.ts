// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.
import { CommunicationCategoryCodes } from '../src/constants/communication';
import { HealthcareBasicSections } from '../src/constants/healthcare';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims';
import {
  extractCommunicationClaimsFromResourceFhirR4,
  transformCommunicationClaimsToResourceFhirR4,
} from '../src/utils/communication-fhir-r4';

describe('utils/communication-fhir-r4', () => {
  // Good practice note:
  // reusable `Communication.*` claim keys must be imported from
  // `CommunicationClaim`, not re-hardcoded in tests.
  it('transforms claims 1:1 and preserves resource.meta.claims', () => {
    const claims = [
      {
        '@context': 'org.hl7.fhir.api',
        [CommunicationClaim.Identifier]: 'comm-001',
        [CommunicationClaim.Subject]: 'did:web:subject.example',
        [CommunicationClaim.Recipient]: 'did:web:recipient.example',
        [CommunicationClaim.Sender]: 'did:web:sender.example',
        [CommunicationClaim.PartOf]: 'urn:uuid:thread-001',
        [CommunicationClaim.Topic]: HealthcareBasicSections.VitalSigns.attributeValue,
        [CommunicationClaim.NoteText]: 'hello',
        [CommunicationClaim.ContentReference]: 'DocumentReference/doc-1',
      },
    ];

    const result = transformCommunicationClaimsToResourceFhirR4(claims, { mode: 'strict' });
    expect(result.resources).toHaveLength(1);
    expect(result.warnings).toHaveLength(0);
    expect(result.resources[0].resourceType).toBe('Communication');
    expect((result.resources[0] as any).meta.claims[CommunicationClaim.Identifier]).toBe('comm-001');
    expect((result.resources[0] as any).partOf[0].reference).toBe('urn:uuid:thread-001');
    expect((result.resources[0] as any).topic.coding[0]).toEqual({
      system: HealthcareBasicSections.VitalSigns.system,
      code: HealthcareBasicSections.VitalSigns.code,
    });
  });

  it('strict mode rejects conflicting payload kinds', () => {
    expect(() =>
      transformCommunicationClaimsToResourceFhirR4(
        [
          {
            [CommunicationClaim.ContentReference]: 'DocumentReference/doc-1',
            [CommunicationClaim.ContentCode]: 'http://loinc.org|LP173418-7',
          },
        ],
        { mode: 'strict' },
      ),
    ).toThrow(/more than one payload kind/i);
  });

  it('keeps the operation reference and attached FHIR Parameters as separate native payloads', () => {
    const result = transformCommunicationClaimsToResourceFhirR4([
      {
        [CommunicationClaim.ContentReference]: 'Subject/$summary',
        [CommunicationClaim.ContentAttachmentType]: 'application/fhir+json',
        [CommunicationClaim.ContentAttachmentData]: 'eyJyZXNvdXJjZVR5cGUiOiJQYXJhbWV0ZXJzIn0=',
      },
    ], { mode: 'strict' });

    expect((result.resources[0] as any).payload).toEqual([
      { contentReference: { reference: 'Subject/$summary' } },
      {
        contentAttachment: {
          contentType: 'application/fhir+json',
          data: 'eyJyZXNvdXJjZVR5cGUiOiJQYXJhbWV0ZXJzIn0=',
        },
      },
    ]);
  });

  it('normalize mode keeps deterministic payload and note', () => {
    const result = transformCommunicationClaimsToResourceFhirR4(
      [
        {
          [CommunicationClaim.ContentAttachmentType]: 'text/plain',
          [CommunicationClaim.ContentCode]: 'http://loinc.org|LP173418-7',
          [CommunicationClaim.NoteText]: ['first', 'second'],
        },
      ],
      { mode: 'normalize' },
    );
    expect((result.resources[0] as any).payload[0].contentAttachment.contentType).toBe('text/plain');
    expect((result.resources[0] as any).note[0].text).toBe('first');
    expect(result.warnings.length).toBeGreaterThanOrEqual(2);
  });

  it('extracts canonical claims from FHIR resource when meta.claims is absent', () => {
    const resource = {
      resourceType: 'Communication',
      status: 'completed',
      identifier: [{ value: 'comm-777' }],
      subject: { reference: 'did:web:subject.example' },
      recipient: [{ reference: 'did:web:recipient.example' }],
      sender: { reference: 'did:web:sender.example' },
      sent: '2026-05-15T12:00:00Z',
      category: [
        {
          coding: [{
            system: CommunicationCategoryCodes.Reminder.system,
            code: CommunicationCategoryCodes.Reminder.code,
          }],
        },
      ],
      topic: {
        coding: [{
          system: HealthcareBasicSections.VitalSigns.system,
          code: HealthcareBasicSections.VitalSigns.code,
        }],
      },
      partOf: [{ reference: 'urn:uuid:thread-777' }],
      payload: [{ contentReference: { reference: 'Appointment/appt-777' } }],
      note: [{ text: 'Reminder text' }],
    };

    const claims = extractCommunicationClaimsFromResourceFhirR4(resource);
    expect(claims[CommunicationClaim.Identifier]).toBe('comm-777');
    expect(claims[CommunicationClaim.Subject]).toBe('did:web:subject.example');
    expect(claims[CommunicationClaim.PartOf]).toBe('urn:uuid:thread-777');
    expect(claims[CommunicationClaim.ContentReference]).toBe('Appointment/appt-777');
    expect(claims[CommunicationClaim.Category]).toBe(CommunicationCategoryCodes.Reminder.claim);
    expect(claims[CommunicationClaim.Topic]).toBe(HealthcareBasicSections.VitalSigns.attributeValue);
    expect(claims[CommunicationClaim.Text]).toBe('Reminder text');
    expect(claims[CommunicationClaim.NoteText]).toBe('Reminder text');
  });

  it('returns existing meta.claims as canonical source by default', () => {
    const resource = {
      resourceType: 'Communication',
      status: 'completed',
      meta: {
        claims: {
          '@context': 'org.hl7.fhir.api',
          [CommunicationClaim.Identifier]: 'from-meta',
        },
      },
      identifier: [{ value: 'from-resource' }],
    };
    const claims = extractCommunicationClaimsFromResourceFhirR4(resource as any);
    expect(claims[CommunicationClaim.Identifier]).toBe('from-meta');
  });
});
