import { IssueSeverity, IssueType } from '../src';
import {
  clearFhirValidatorAdapters,
  registerFhirValidatorAdapter,
  validateFhirResource,
  validateFhirResourceBasic,
} from '../src/utils/fhir-validator';

describe('utils/fhir-validator', () => {
  afterEach(() => {
    clearFhirValidatorAdapters();
  });

  it('basic validator reports missing resourceType', () => {
    const result = validateFhirResourceBasic({});
    expect(result.ok).toBe(false);
    expect(result.issues.some((item) => item.code === IssueType.Required)).toBe(true);
  });

  it('basic validator accepts minimal Communication with status', () => {
    const result = validateFhirResourceBasic({
      resourceType: 'Communication',
      status: 'completed',
      payload: [{ contentReference: { reference: 'Appointment/appt-1' } }],
      note: [{ text: 'Reminder' }],
    });
    expect(result.ok).toBe(true);
  });

  it('validateFhirResource prefers registered adapter for version', async () => {
    registerFhirValidatorAdapter({
      id: 'test-adapter',
      supports(version) {
        return version === 'r4';
      },
      validate() {
        return {
          ok: true,
          issues: [{ severity: IssueSeverity.Warning, code: 'adapter', diagnostics: 'adapter-called' }],
        };
      },
    });

    const result = await validateFhirResource({ resourceType: 'Communication', status: 'completed' }, 'r4');
    expect(result.ok).toBe(true);
    expect(result.issues[0]?.code).toBe('adapter');
  });
});
