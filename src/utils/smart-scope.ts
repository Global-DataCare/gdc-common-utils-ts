import { HealthcareBasicSections } from '../constants/healthcare';

export type SmartCompositionReadScopeOptions = {
  /**
   * Subject DID pinned by the current CORE GW root scope contract.
   */
  subjectDid: string;
  /**
   * One or more section claims such as `LOINC|60591-5`.
   *
   * When omitted, the helper defaults to the IPS patient summary document.
   */
  sections?: string | string[];
  /**
   * Read verb suffix used in the current GW SMART root scope contract.
   *
   * Defaults to `rs`.
   */
  accessVerb?: 'r' | 'rs' | 'cruds';
};

/**
 * Builds the gateway-pinned SMART root scope required by the current CORE GW
 * token contract:
 *
 * `organization/Composition.<verb>?subject=<did:web:...>&section=<code>[,<code>...]`
 *
 * This is intentionally a gateway-contract helper, not a generic SMART/FHIR
 * scope builder.
 */
export function buildSmartCompositionReadScope(
  options: SmartCompositionReadScopeOptions,
): string {
  const subjectDid = String(options.subjectDid || '').trim();
  if (!subjectDid) {
    throw new Error('buildSmartCompositionReadScope requires subjectDid.');
  }

  const sections = Array.isArray(options.sections)
    ? options.sections
    : options.sections
      ? [options.sections]
      : [HealthcareBasicSections.PatientSummaryDocument.claim];

  const normalizedSections = sections
    .map((section) => String(section || '').trim())
    .filter(Boolean);

  const query = new URLSearchParams({ subject: subjectDid });
  if (normalizedSections.length > 0) {
    query.set('section', normalizedSections.join(','));
  }

  return `organization/Composition.${options.accessVerb || 'rs'}?${query.toString()}`;
}

