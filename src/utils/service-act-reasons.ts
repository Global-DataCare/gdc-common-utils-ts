// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { FhirCodeSystems } from '../constants/fhir-code-systems';

export const HL7_ACT_REASON_CODE_SYSTEM = FhirCodeSystems.ActReason;

export type ServiceActReasonCoding = Readonly<{
  system: string;
  code: string;
}>;

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCoding(input: Partial<ServiceActReasonCoding> | undefined): ServiceActReasonCoding | undefined {
  const system = normalizeText(input?.system);
  const code = normalizeText(input?.code).toUpperCase();
  if (!system || !code) return undefined;
  return { system, code };
}

/**
 * Parses the compact CSV form used by flat GDC claims for `Service.additionalType`.
 *
 * Accepted examples:
 * - `http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,HRESCH`
 * - `http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,http://terminology.hl7.org/CodeSystem/v3-ActReason|HRESCH`
 */
export function parseServiceActReasonCodings(value: unknown): ServiceActReasonCoding[] {
  const raw = normalizeText(value);
  if (!raw) return [];

  let currentSystem = '';
  const codings: ServiceActReasonCoding[] = [];

  for (const token of raw.split(',')) {
    const normalizedToken = normalizeText(token);
    if (!normalizedToken) continue;

    const pipeIndex = normalizedToken.indexOf('|');
    if (pipeIndex >= 0) {
      currentSystem = normalizeText(normalizedToken.slice(0, pipeIndex));
      const coding = normalizeCoding({
        system: currentSystem,
        code: normalizedToken.slice(pipeIndex + 1),
      });
      if (coding) codings.push(coding);
      continue;
    }

    const coding = normalizeCoding({
      system: currentSystem,
      code: normalizedToken,
    });
    if (coding) codings.push(coding);
  }

  return Array.from(new Map(
    codings.map((coding) => [`${coding.system}|${coding.code}`, coding]),
  ).values());
}

export function parseServiceActReasonCodes(value: unknown): string[] {
  return parseServiceActReasonCodings(value).map((coding) => coding.code);
}

export function serializeServiceActReasonCodings(values: ReadonlyArray<ServiceActReasonCoding | undefined | null>): string | undefined {
  const normalized = values
    .map((value) => normalizeCoding(value || undefined))
    .filter((value): value is ServiceActReasonCoding => Boolean(value));
  if (!normalized.length) return undefined;

  const unique = Array.from(new Map(
    normalized.map((coding) => [`${coding.system}|${coding.code}`, coding]),
  ).values());
  const firstSystem = unique[0]?.system || '';

  if (firstSystem && unique.every((coding) => coding.system === firstSystem)) {
    return `${firstSystem}|${unique.map((coding) => coding.code).join(',')}`;
  }

  return unique.map((coding) => `${coding.system}|${coding.code}`).join(',');
}

export function serializeServiceActReasonCodes(
  codes: ReadonlyArray<string | undefined | null>,
  system: string = HL7_ACT_REASON_CODE_SYSTEM,
): string | undefined {
  return serializeServiceActReasonCodings(
    codes.map((code) => ({ system, code: normalizeText(code).toUpperCase() })),
  );
}
