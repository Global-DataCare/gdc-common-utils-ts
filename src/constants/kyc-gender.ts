import { BirthSex, GenderIdentity } from './identity-gender';

/**
 * Centralized, typed fixtures and contract helpers for KYC gender.
 *
 * Goal:
 * - tests must never hardcode gender strings
 * - production mapping must reuse the same canonical tokens
 * - normalize input values that come from KYC providers / UI forms
 *
 * Contract note:
 * - output values match the compact values already used by
 *   `org.schema.Person.gender` claim tests and onboarding flows.
 */

/**
 * Canonical compact gender used by onboarding claims.
 *
 * This is intentionally aligned with the current `org.schema.Person.gender`
 * contract in tests (values `'M'` / `'F'`).
 */
export type CompactKycGender = BirthSex.Female | BirthSex.Male;

/** Canonical compact gender token: male. */
export const KYC_COMPACT_GENDER_MALE = BirthSex.Male;

/** Canonical compact gender token: female. */
export const KYC_COMPACT_GENDER_FEMALE = BirthSex.Female;

/**
 * Provider/UI gender inputs supported by normalization.
 *
 * These variants are expected to be already in English (as per your rules).
 * If new languages appear, they should go through a dedicated
 * intermediate normalization layer.
 */
export type EnglishKycGenderInput =
  | 'female'
  | 'female' /* kept for clarity */
  | 'mujer'
  | 'woman'
  | 'male'
  | 'man'
  | 'hombre'
  | 'F'
  | 'M';

/** Provider/UI inputs mapped to compact gender (female). */
export const KYC_GENDER_INPUT_FEMALE = 'female' as const;
export const KYC_GENDER_INPUT_WOMAN = GenderIdentity.Woman;
export const KYC_GENDER_INPUT_MUJER = 'mujer' as const;

/** Provider/UI inputs mapped to compact gender (male). */
export const KYC_GENDER_INPUT_MALE = 'male' as const;
export const KYC_GENDER_INPUT_MAN = GenderIdentity.Man;
export const KYC_GENDER_INPUT_HOMBRE = 'hombre' as const;

/** Direct compact inputs (already normalized by some providers). */
export const KYC_GENDER_INPUT_COMPACT_FEMALE = BirthSex.Female;
export const KYC_GENDER_INPUT_COMPACT_MALE = BirthSex.Male;

/**
 * Normalizes heterogeneous KYC gender values to the compact contract.
 *
 * Implementation mirrors the previous behavior from
 * `src/utils/individual-organization-kyc.ts`, but centralized.
 */
export function normalizeKycGenderToCompact(value: unknown): CompactKycGender | undefined {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return undefined;
  const normalized = raw.toLowerCase();

  if (
    normalized === 'f'
    || normalized === 'female'
    || normalized === 'woman'
    || normalized === 'mujer'
  ) {
    return KYC_COMPACT_GENDER_FEMALE;
  }

  if (
    normalized === 'm'
    || normalized === 'male'
    || normalized === 'man'
    || normalized === 'hombre'
  ) {
    return KYC_COMPACT_GENDER_MALE;
  }

  // Fallback preserves unknown provider tokens by uppercasing; this keeps
  // the previous contract where unmapped values become uppercased tokens.
  return raw.toUpperCase() as CompactKycGender;
}
