import {
  extractCommunicationClaimsFromResourceFhirR4,
  transformCommunicationClaimsToResourceFhirR4,
} from '../src/utils/communication-fhir-r4';

describe('utils/communication-fhir-r4', () => {
  it('transforms claims 1:1 and preserves resource.meta.claims', () => {
    const claims = [
      {
        '@context': 'org.hl7.fhir.r4',
        'Communication.identifier': 'comm-001',
        'Communication.subject': 'did:web:subject.example',
        'Communication.recipient': 'did:web:recipient.example',
        'Communication.sender': 'did:web:sender.example',
        'Communication.part-of': 'urn:uuid:thread-001',
        'Communication.note': 'hello',
        'Communication.content-reference': 'DocumentReference/doc-1',
      },
    ];

    const result = transformCommunicationClaimsToResourceFhirR4(claims, { mode: 'strict' });
    expect(result.resources).toHaveLength(1);
    expect(result.warnings).toHaveLength(0);
    expect(result.resources[0].resourceType).toBe('Communication');
    expect((result.resources[0] as any).meta.claims['Communication.identifier']).toBe('comm-001');
    expect((result.resources[0] as any).partOf[0].reference).toBe('urn:uuid:thread-001');
  });

  it('strict mode rejects conflicting payload kinds', () => {
    expect(() =>
      transformCommunicationClaimsToResourceFhirR4(
        [
          {
            'Communication.content-reference': 'DocumentReference/doc-1',
            'Communication.content-code': 'http://loinc.org|LP173418-7',
          },
        ],
        { mode: 'strict' },
      ),
    ).toThrow(/more than one payload kind/i);
  });

  it('normalize mode keeps deterministic payload and note', () => {
    const result = transformCommunicationClaimsToResourceFhirR4(
      [
        {
          'Communication.content-attachment-type': 'text/plain',
          'Communication.content-reference': 'DocumentReference/doc-1',
          'Communication.note': ['first', 'second'],
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
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/communication-category', code: 'appointment-reminder' }],
        },
      ],
      partOf: [{ reference: 'urn:uuid:thread-777' }],
      payload: [{ contentReference: { reference: 'Appointment/appt-777' } }],
      note: [{ text: 'Reminder text' }],
    };

    const claims = extractCommunicationClaimsFromResourceFhirR4(resource);
    expect(claims['Communication.identifier']).toBe('comm-777');
    expect(claims['Communication.subject']).toBe('did:web:subject.example');
    expect(claims['Communication.part-of']).toBe('urn:uuid:thread-777');
    expect(claims['Communication.content-reference']).toBe('Appointment/appt-777');
    expect(claims['Communication.text']).toBe('Reminder text');
    expect(claims['Communication.note']).toBe('Reminder text');
  });

  it('returns existing meta.claims as canonical source by default', () => {
    const resource = {
      resourceType: 'Communication',
      status: 'completed',
      meta: {
        claims: {
          '@context': 'org.hl7.fhir.r4',
          'Communication.identifier': 'from-meta',
        },
      },
      identifier: [{ value: 'from-resource' }],
    };
    const claims = extractCommunicationClaimsFromResourceFhirR4(resource as any);
    expect(claims['Communication.identifier']).toBe('from-meta');
  });
});
