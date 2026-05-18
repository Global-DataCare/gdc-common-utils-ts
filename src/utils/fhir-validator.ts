export type FhirVersion = 'r4' | 'r5' | string;

export type FhirValidationIssue = {
  severity: 'error' | 'warning';
  code: string;
  diagnostics: string;
  expression?: string;
};

export type FhirValidationResult = {
  ok: boolean;
  issues: FhirValidationIssue[];
};

export type FhirValidatorAdapter = {
  /**
   * Stable adapter id for observability/configuration.
   * Example: `basic`, `hl7-official-cli`, `hapi`.
   */
  id: string;
  /**
   * Returns true when this adapter can validate the requested FHIR version.
   */
  supports(version: FhirVersion): boolean;
  /**
   * Validates one resource and returns OperationOutcome-like issues.
   */
  validate(resource: Record<string, unknown>, version: FhirVersion): Promise<FhirValidationResult> | FhirValidationResult;
};

const validators: FhirValidatorAdapter[] = [];

/**
 * Registers a custom FHIR validator adapter.
 * Adapters are checked in registration order.
 */
export function registerFhirValidatorAdapter(adapter: FhirValidatorAdapter): void {
  validators.push(adapter);
}

/**
 * Clears all registered adapters.
 * Intended for tests or explicit runtime reconfiguration.
 */
export function clearFhirValidatorAdapters(): void {
  validators.length = 0;
}

/**
 * Returns currently registered adapters (read-only copy).
 */
export function listFhirValidatorAdapters(): FhirValidatorAdapter[] {
  return [...validators];
}

/**
 * Validates a FHIR resource using the first registered adapter that supports the requested version.
 * Falls back to built-in structural validation when no adapter matches.
 *
 * This utility is intentionally adapter-based so SDK/GW can share one validation entrypoint while
 * keeping the formal validator implementation pluggable per deployment.
 */
export async function validateFhirResource(
  resource: Record<string, unknown>,
  version: FhirVersion = 'r4',
): Promise<FhirValidationResult> {
  const adapter = validators.find((item) => item.supports(version));
  if (adapter) return adapter.validate(resource, version);
  return validateFhirResourceBasic(resource, version);
}

/**
 * Minimal built-in structural validation.
 * This does not replace a formal HL7 profile validator; it provides a safe baseline
 * and deterministic checks for common gateway constraints.
 */
export function validateFhirResourceBasic(
  resource: Record<string, unknown>,
  _version: FhirVersion = 'r4',
): FhirValidationResult {
  const issues: FhirValidationIssue[] = [];
  const resourceType = String(resource?.resourceType || '').trim();
  if (!resourceType) {
    issues.push({
      severity: 'error',
      code: 'required',
      diagnostics: 'Missing required field: resourceType.',
      expression: 'resourceType',
    });
  }

  if (resourceType === 'Communication') {
    const status = String(resource?.status || '').trim();
    if (!status) {
      issues.push({
        severity: 'error',
        code: 'required',
        diagnostics: 'Communication.status is required.',
        expression: 'Communication.status',
      });
    }

    const payload = resource?.payload;
    if (Array.isArray(payload) && payload.length > 1) {
      issues.push({
        severity: 'warning',
        code: 'business-rule',
        diagnostics: 'Gateway convention recommends one payload per Communication.',
        expression: 'Communication.payload',
      });
    }

    const note = resource?.note;
    if (Array.isArray(note) && note.length > 1) {
      issues.push({
        severity: 'warning',
        code: 'business-rule',
        diagnostics: 'Gateway convention recommends one note per Communication.',
        expression: 'Communication.note',
      });
    }
  }

  return {
    ok: issues.every((issue) => issue.severity !== 'error'),
    issues,
  };
}
