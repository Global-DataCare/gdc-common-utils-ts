// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Computes the Damm check digit for one decimal payload.
 *
 * Canonical input:
 * - decimal digits only
 *
 * Algorithm:
 * - Damm check digit over the full normalized sequence
 *
 * Compatibility:
 * - this helper is intentionally strict about the normalized payload so the
 *   same digits always produce the same digit, regardless of presentation
 */
export function computeDammCheckDigit(payloadDigits: string): string {
  const normalized = normalizeDigitsOnly(payloadDigits, 'payloadDigits');
  const table = [
    [0, 3, 1, 7, 5, 9, 8, 6, 4, 2],
    [7, 0, 9, 2, 1, 5, 4, 8, 6, 3],
    [4, 2, 0, 6, 8, 7, 1, 3, 5, 9],
    [1, 7, 5, 0, 9, 8, 3, 4, 2, 6],
    [6, 1, 2, 3, 0, 4, 5, 9, 7, 8],
    [3, 6, 7, 4, 2, 0, 9, 5, 8, 1],
    [5, 8, 6, 9, 7, 2, 0, 1, 3, 4],
    [8, 9, 4, 5, 3, 6, 2, 0, 1, 7],
    [9, 4, 3, 8, 6, 1, 7, 2, 0, 5],
    [2, 5, 8, 1, 4, 3, 6, 7, 9, 0],
  ] as const;

  let interim = 0;
  for (const digit of normalized) {
    interim = table[interim][Number(digit)];
  }
  return String(interim);
}

/**
 * Computes the provider-scoped Unified Health ID control digit.
 *
 * Canonical input:
 * - `providerId` normalized to digits only
 * - `personalIdWithoutCheckDigit` normalized to digits only
 * - the check digit is computed over `providerId + personalIdWithoutCheckDigit`
 *
 * Algorithm:
 * - Damm check digit over the concatenated normalized digits
 *
 * Compatibility:
 * - separators such as `:` and `-` are ignored
 * - the same personal payload can produce a different digit in another
 *   provider because the provider digits are part of the normalized sequence
 *
 * @param providerId Provider-scoped numeric identifier. Presentation separators are ignored.
 * @param personalIdWithoutCheckDigit Personal identifier payload without its final control digit.
 * @returns One decimal check digit as a string.
 */
export function computeUnifiedHealthIdCheckDigit(
  providerId: string,
  personalIdWithoutCheckDigit: string,
): string {
  const normalizedProviderId = normalizeDigitsOnly(providerId, 'providerId');
  const normalizedPersonalId = normalizeDigitsOnly(
    personalIdWithoutCheckDigit,
    'personalIdWithoutCheckDigit',
  );

  return computeDammCheckDigit(`${normalizedProviderId}${normalizedPersonalId}`);
}

/**
 * Builds the provider-scoped Unified Health ID personal digits including the
 * final control digit.
 *
 * Canonical input:
 * - `providerId` normalized to digits only
 * - `personalIdWithoutCheckDigit` normalized to digits only
 *
 * Output:
 * - the normalized personal digits followed by the computed control digit
 *
 * @param providerId Provider-scoped numeric identifier. Presentation separators are ignored.
 * @param personalIdWithoutCheckDigit Personal identifier payload without its final control digit.
 * @returns The normalized personal digits plus the final control digit.
 */
export function buildUnifiedHealthIdPersonalDigits(
  providerId: string,
  personalIdWithoutCheckDigit: string,
): string {
  const normalizedPersonalId = normalizeDigitsOnly(
    personalIdWithoutCheckDigit,
    'personalIdWithoutCheckDigit',
  );
  return `${normalizedPersonalId}${computeUnifiedHealthIdCheckDigit(providerId, normalizedPersonalId)}`;
}

function normalizeDigitsOnly(value: string, name: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) {
    throw new Error(`${name} must not be empty`);
  }

  if (!/^[0-9:\-\s]+$/.test(normalized)) {
    throw new Error(`${name} must contain only digits, spaces, colons, or hyphens`);
  }

  const digits = normalized.replace(/\D/g, '');
  if (!digits) {
    throw new Error(`${name} must contain at least one digit`);
  }

  return digits;
}
