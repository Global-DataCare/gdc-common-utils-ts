/**
 * Canonical registry of supported clinical document sections (e.g., IPS Composition sections).
 *
 * Design goals:
 * - Use stable codes (LOINC) for interoperability.
 * - Provide a reverse-DNS i18n key for consistent UI translations across apps.
 * - Keep this in `gdc-common-utils-ts` so both backend and frontend can share it.
 */

import { clinicalSectionTitleEn } from './clinical-sections.en';

export const LOINC_SYSTEM_URL = 'http://loinc.org' as const;
export const LOINC_SYSTEM_REVERSE_DNS = 'org.loinc' as const;

export type ClinicalSectionDescriptor = {
  /** Canonical coding system URL (FHIR-style). */
  system: string;
  /** Code within the coding system (e.g., a LOINC code). */
  code: string;
  /**
   * Reverse-DNS translation key, intended for i18n resources.
   * Example: `org.loinc.48765-2`.
   */
  i18nKey: string;
  /**
   * English fallback label (documentation/UI fallback).
   *
   * Prefer rendering a UI label via `i18nKey` (e.g., `org.loinc.<CODE>`) rather than relying on this.
   */
  titleEn?: string;
  /** True when this is an IPS-aligned section code. */
  ips?: boolean;
};

export function loincI18nKey(code: string): string {
  return `${LOINC_SYSTEM_REVERSE_DNS}.${code}`;
}

export type SupportedClinicalSectionCode = keyof typeof clinicalSectionTitleEn;

export const supportedClinicalSectionCodes = Object.freeze(
  Object.keys(clinicalSectionTitleEn) as SupportedClinicalSectionCode[]
);

export const clinicalSectionRegistry: Readonly<Record<string, ClinicalSectionDescriptor>> = (() => {
  const entries = Object.entries(clinicalSectionTitleEn).map(([code, titleEn]) => {
    const descriptor: ClinicalSectionDescriptor = {
      system: LOINC_SYSTEM_URL,
      code,
      i18nKey: loincI18nKey(code),
      titleEn,
      ips: true,
    };
    return [code, descriptor] as const;
  });

  return Object.freeze(Object.fromEntries(entries));
})();

export { clinicalSectionTitleEn };

export function getClinicalSectionByCode(code: string): ClinicalSectionDescriptor | undefined {
  return clinicalSectionRegistry[code];
}
