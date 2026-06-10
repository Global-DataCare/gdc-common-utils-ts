import {
  CompactKycGender,
  normalizeKycGenderToCompact,
} from '../constants/kyc-gender';

import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../constants/schemaorg';
import {
  IndividualOrganizationKycPayload,
  IndividualOrganizationKycProfile,
} from '../models/individual-onboarding';


/**
 * Input used to derive canonical `org.schema` claims for the current
 * individual-organization onboarding flow.
 *
 * Semantic split:
 * - `individual*` fields belong to the indexed subject (the individual)
 * - `profile` belongs to the responsible person/controller validated by KYC
 * - controller email can be provided out of band because the current KYC
 *   payload does not expose it
 */
export type IndividualOrganizationKycClaimsOptions = Readonly<
  Required<Pick<IndividualOrganizationKycPayload, 'profile'>>
  & Pick<IndividualOrganizationKycPayload, 'individualBirthDate' | 'controllerEmail'>
  & {
    individualAlternateName: string;
  }
>;

/**
 * Result returned by the KYC-to-claims mapper.
 */
export type IndividualOrganizationKycClaimsResult = Readonly<{
  claims: Record<string, string>;
  resolved: Readonly<{
    organizationAlternateName: string;
    controllerGivenName?: string;
    controllerFamilyName?: string;
    controllerIdentifier?: string;
    controllerEmail?: string;
    controllerTelephone?: string;
    controllerBirthYear?: string;
    subjectBirthYear?: string;
  }>;
}>;

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeLowerText(value: unknown): string | undefined {
  const normalized = normalizeText(value).toLowerCase();
  return normalized || undefined;
}

function normalizeDisplayText(value: unknown): string | undefined {
  const normalized = normalizeText(value);
  return normalized || undefined;
}

function normalizeUpperText(value: unknown): string | undefined {
  const normalized = normalizeText(value).toUpperCase();
  return normalized || undefined;
}

function normalizeEmail(value: unknown): string | undefined {
  return normalizeLowerText(value);
}

function normalizeBirthYear(value: unknown): string | undefined {
  const raw = normalizeText(value);
  if (!raw) return undefined;
  const match = raw.match(/^(\d{4})/);
  return match?.[1];
}

/**
 * Normalizes heterogeneous KYC gender values to the compact values already used
 * by the current `org.schema.Person.gender` tests and onboarding claims.
 */
export function normalizeKycGender(value: unknown): CompactKycGender | undefined {
  return normalizeKycGenderToCompact(value);
}



/**
 * Converts the current web KYC profile plus the subject seed fields into the
 * canonical `org.schema` claims expected by individual onboarding flows.
 *
 * Current contract:
 * - the individual Organization uses `individualAlternateName`
 * - controller identity comes from the KYC profile
 * - the controller email may be supplied externally because the example KYC
 *   payload does not currently include an email field
 * - birth date is stored as year-only because that is the current lightweight
 *   requirement for the individual demos
 */
export function buildClaimsFromIndividualOrganizationKyc(
  options: IndividualOrganizationKycClaimsOptions,
): IndividualOrganizationKycClaimsResult {
  const profile = options.profile || {};
  const organizationAlternateName = normalizeDisplayText(options.individualAlternateName);
  if (!organizationAlternateName) {
    throw new Error('KYC individual onboarding requires individualAlternateName.');
  }

  const givenName = normalizeUpperText(profile.first_name);
  const familyName = normalizeUpperText(profile.last_name);
  const controllerName = [givenName, familyName].filter(Boolean).join(' ').trim() || undefined;
  const controllerIdentifier = normalizeText(profile.id_number) || undefined;
  const controllerEmail = normalizeEmail(options.controllerEmail);
  const controllerTelephone = normalizeText(profile.phone_number) || undefined;
  const controllerBirthYear = normalizeBirthYear(profile.birthdate);
  const subjectBirthYear = normalizeBirthYear(options.individualBirthDate);
  const gender = normalizeKycGender(profile.gender);

  const claims: Record<string, string> = {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.alternateName]: organizationAlternateName,
  };

  if (controllerIdentifier) {
    claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue] = controllerIdentifier;
    claims[ClaimsPersonSchemaorg.identifierValue] = controllerIdentifier;
    claims[ClaimsPersonSchemaorg.identifier] = `urn:person:identifier:${controllerIdentifier}`;
  }
  claims[ClaimsOrganizationSchemaorg.ownerAlternateName] = organizationAlternateName;
  if (controllerEmail) {
    claims[ClaimsOrganizationSchemaorg.ownerEmail] = controllerEmail;
  }
  if (controllerTelephone) {
    claims[ClaimsOrganizationSchemaorg.ownerTelephone] = controllerTelephone;
  }
  if (givenName) claims[ClaimsPersonSchemaorg.givenName] = givenName;
  if (familyName) claims[ClaimsPersonSchemaorg.familyName] = familyName;
  if (controllerName) claims[ClaimsPersonSchemaorg.name] = controllerName;
  claims[ClaimsOrganizationSchemaorg.memberRole] = 'ONESELF';
  if (normalizeUpperText(profile.country)) claims[ClaimsOrganizationSchemaorg.addressCountry] = normalizeUpperText(profile.country) as string;
  if (normalizeText(profile.city)) claims[ClaimsOrganizationSchemaorg.addressLocality] = normalizeText(profile.city);
  if (normalizeText(profile.address)) claims[ClaimsOrganizationSchemaorg.streetAddress] = normalizeText(profile.address);
  if (normalizeText(profile.postal_code)) claims[ClaimsOrganizationSchemaorg.postalCode] = normalizeText(profile.postal_code);
  if (gender) claims[ClaimsPersonSchemaorg.gender] = gender;
  if (controllerBirthYear) claims[ClaimsPersonSchemaorg.birthDate] = controllerBirthYear;
  if (subjectBirthYear) claims[ClaimsOrganizationSchemaorg.memberBirthDate] = subjectBirthYear;

  return {
    claims,
    resolved: {
      organizationAlternateName,
      ...(givenName ? { controllerGivenName: givenName } : {}),
      ...(familyName ? { controllerFamilyName: familyName } : {}),
      ...(controllerIdentifier ? { controllerIdentifier } : {}),
      ...(controllerEmail ? { controllerEmail } : {}),
      ...(controllerTelephone ? { controllerTelephone } : {}),
      ...(controllerBirthYear ? { controllerBirthYear } : {}),
      ...(subjectBirthYear ? { subjectBirthYear } : {}),
    },
  };
}
