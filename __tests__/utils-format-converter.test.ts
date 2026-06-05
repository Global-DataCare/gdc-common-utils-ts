import {
  IssueSeverity,
  IssueType,
  convertFhirErrorBundleToJsonApiError,
  convertPrimaryDocToBundleFHIR,
  convertResourceDataToArrayOfDataEntries,
  convertResourceOrBundleToPrimaryDoc,
} from '../src';

describe('format-converter', () => {
  it('normalizes a FHIR resource into entries', () => {
    const resource = { resourceType: 'Patient', id: '123', name: [{ given: ['A'] }] };
    const entries = convertResourceDataToArrayOfDataEntries(resource, '/fhir', 'https://example.com');
    expect(entries).toEqual([
      {
        fullUrl: 'https://example.com/fhir/123',
        resource,
      },
    ]);
  });

  it('passes through bundle entries', () => {
    const bundle = { resourceType: 'Bundle', entry: [{ resource: { id: '1' } }] };
    const entries = convertResourceDataToArrayOfDataEntries(bundle, '/fhir', 'https://example.com');
    expect(entries).toEqual(bundle.entry);
  });

  it('returns input when already JSON:API-like', () => {
    const input = { id: 'abc', type: 'test', attributes: { a: 1 } };
    const entries = convertResourceDataToArrayOfDataEntries(input, '/fhir', 'https://example.com');
    expect(entries).toEqual([input]);
  });

  it('converts resource or bundle to primary document', () => {
    const resource = { resourceType: 'Patient', id: '123', name: [{ given: ['A'] }] };
    const doc = convertResourceOrBundleToPrimaryDoc(resource, 'spec', 'https://example.com', '/fhir');
    expect(doc).toEqual({
      data: [
        {
          type: 'spec.Patient',
          id: '123',
          attributes: resource,
        },
      ],
    });
  });

  it('converts primary doc with data and errors to FHIR bundle', () => {
    const primaryDoc = {
      data: [{ id: '1', attributes: { resourceType: 'Patient', id: '1' } }],
      errors: [{ id: 'e1', status: '400', detail: 'Bad' }],
    };
    const bundle = convertPrimaryDocToBundleFHIR(primaryDoc, 'transaction');
    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.total).toBe(1);
    expect(bundle.type).toBe('transaction');
    expect(bundle.entry.length).toBe(2);
    expect(bundle.entry[0].resource.resourceType).toBe('Patient');
    expect(bundle.entry[1].resource.resourceType).toBe('OperationOutcome');
  });

  it('converts error bundles to JSON:API errors', () => {
    const errorBundle = {
      entry: [
        {
          resource: {
            id: 'err-1',
            issue: [{ code: IssueType.Invalid, severity: IssueSeverity.Error, details: { text: 'Bad' }, diagnostics: 'Oops' }],
          },
          response: { status: 400 },
        },
      ],
    };
    const jsonApiError = convertFhirErrorBundleToJsonApiError(errorBundle);
    expect(jsonApiError.errors[0]).toEqual({
      id: 'err-1',
      status: '400',
      code: IssueType.Invalid,
      title: 'Bad',
      detail: 'Oops',
      meta: { severity: IssueSeverity.Error },
    });
  });

  it('returns default error for empty bundles', () => {
    const jsonApiError = convertFhirErrorBundleToJsonApiError({});
    expect(jsonApiError.errors[0].status).toBe('500');
  });
});
