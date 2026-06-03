import {
  buildFhirParametersResourceFromParameterData,
  buildFhirParametersResourceFromSearchParams,
  buildSearchQueryString,
  createSummaryOperationRequestParameters,
  createSummaryOperationRequestParametersResource,
} from '../src';

describe('FHIR search helpers', () => {
  it('builds canonical query strings from primitive search params', () => {
    const query = buildSearchQueryString({
      'org.schema.Person.email': 'employee.two@example.org',
      active: true,
      page: 2,
      role: ['ISCO-08|2211', 'ISCO-08|2221'],
    });

    expect(query).toContain('org.schema.Person.email=employee.two%40example.org');
    expect(query).toContain('active=true');
    expect(query).toContain('page=2');
    expect(query).toContain('role=ISCO-08%7C2211%2CISCO-08%7C2221');
  });

  it('builds FHIR Parameters resources from primitive search params', () => {
    const resource = buildFhirParametersResourceFromSearchParams({
      'org.schema.Person.email': 'employee.two@example.org',
      active: true,
      page: 2,
    });

    expect(resource).toEqual({
      resourceType: 'Parameters',
      parameter: [
        { name: 'org.schema.Person.email', valueString: 'employee.two@example.org' },
        { name: 'active', valueBoolean: true },
        { name: 'page', valueInteger: 2 },
      ],
    });
  });

  it('serializes summary-operation ParameterData as a FHIR Parameters resource', () => {
    const parameters = createSummaryOperationRequestParameters('did:web:subject.example.org', ['medications']);
    const resource = createSummaryOperationRequestParametersResource(parameters);

    expect(resource).toEqual({
      resourceType: 'Parameters',
      parameter: [
        { name: 'subject', valueString: 'did:web:subject.example.org' },
        { name: 'document-type', valueCoding: { system: 'http://loinc.org', code: '60591-5' } },
        { name: 'section', valueString: 'medications' },
      ],
    });
  });

  it('builds generic FHIR Parameters from ParameterData arrays', () => {
    const resource = buildFhirParametersResourceFromParameterData([
      { name: 'subject', type: 'reference', value: 'did:web:subject.example.org', reference: 'did:web:subject.example.org' } as any,
      { name: 'identifier', type: 'token', value: 'abc-123', system: 'urn:system:test' },
      { name: 'page', type: 'number', value: 3 },
    ]);

    expect(resource).toEqual({
      resourceType: 'Parameters',
      parameter: [
        { name: 'subject', valueReference: { reference: 'did:web:subject.example.org' } },
        { name: 'identifier', valueCoding: { system: 'urn:system:test', code: 'abc-123' } },
        { name: 'page', valueInteger: 3 },
      ],
    });
  });
});
