import { HL7_DEFAULT_ROLE_HEALTH } from '../constants/hl7-roles';
import {
  ClaimsOrderSchemaorg,
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../constants/schemaorg';
import { ClaimConsent } from '../models/consent-rule';
import type {
  IndividualIndexServiceFormFields,
  IndividualOrganizationKycPayload,
} from '../models/individual-onboarding';
import { buildClaimsFromIndividualOrganizationKyc } from './individual-organization-kyc';

export type IndividualOrganizationResolvedContact = Readonly<{
  email?: string;
  telephone?: string;
}>;

export type IndividualOrganizationClaimsBuildResult = Readonly<{
  claims: Record<string, string>;
  resolved: Readonly<{
    controllerAlternateName?: string;
    organizationAlternateName?: string;
    controllerContact: IndividualOrganizationResolvedContact;
    memberContact: IndividualOrganizationResolvedContact;
    self: boolean;
  }>;
}>;

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalText(value: unknown): string | undefined {
  const normalized = normalizeText(value);
  return normalized || undefined;
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function normalizeEmail(value: unknown): string | undefined {
  const normalized = normalizeText(value).toLowerCase();
  return normalized || undefined;
}

function normalizePhone(value: unknown): string | undefined {
  return normalizeOptionalText(value);
}

function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

function buildClaimsFromIndividualOrganizationFormFields(
  formFields: IndividualIndexServiceFormFields,
): IndividualOrganizationClaimsBuildResult {
  const self = normalizeOptionalBoolean(formFields.controllerIsSubject) ?? true;

  const controllerAlternateName = normalizeOptionalText(formFields.controllerAlternateName);
  const organizationAlternateName = firstDefined(
    normalizeOptionalText(formFields.subjectAlternateName),
    self ? controllerAlternateName : undefined,
  );
  const controllerEmail = normalizeEmail(formFields.controllerEmail);
  const controllerTelephone = normalizePhone(formFields.controllerPhone);
  const memberEmail = firstDefined(normalizeEmail(formFields.subjectEmail), self ? controllerEmail : undefined);
  const memberTelephone = firstDefined(normalizePhone(formFields.subjectPhone), self ? controllerTelephone : undefined);

  const claims: Record<string, string> = {
    '@context': 'org.schema',
  };

  if (organizationAlternateName) claims[ClaimsOrganizationSchemaorg.alternateName] = organizationAlternateName;

  if (controllerAlternateName) claims[ClaimsOrganizationSchemaorg.ownerAlternateName] = controllerAlternateName;
  if (controllerEmail) claims[ClaimsOrganizationSchemaorg.ownerEmail] = controllerEmail;
  if (controllerTelephone) claims[ClaimsOrganizationSchemaorg.ownerTelephone] = controllerTelephone;
  if (normalizeOptionalText(formFields.controllerIdValue)) claims[ClaimsOrganizationSchemaorg.ownerIdentifierValue] = normalizeText(formFields.controllerIdValue);

  if (normalizeOptionalText(formFields.subjectGivenName) || (self && normalizeOptionalText(formFields.controllerGivenName))) {
    claims[ClaimsOrganizationSchemaorg.memberGivenName] = firstDefined(
      normalizeOptionalText(formFields.subjectGivenName),
      self ? normalizeOptionalText(formFields.controllerGivenName) : undefined,
    ) as string;
  }
  if (normalizeOptionalText(formFields.subjectFamilyName) || (self && normalizeOptionalText(formFields.controllerFamilyName))) {
    claims[ClaimsOrganizationSchemaorg.memberFamilyName] = firstDefined(
      normalizeOptionalText(formFields.subjectFamilyName),
      self ? normalizeOptionalText(formFields.controllerFamilyName) : undefined,
    ) as string;
  }
  if (normalizeOptionalText(formFields.subjectDateOfBirth) || (self && normalizeOptionalText(formFields.controllerDateOfBirth))) {
    claims[ClaimsOrganizationSchemaorg.memberBirthDate] = firstDefined(
      normalizeOptionalText(formFields.subjectDateOfBirth),
      self ? normalizeOptionalText(formFields.controllerDateOfBirth) : undefined,
    ) as string;
  }
  if (normalizeOptionalText(formFields.subjectGender) || (self && normalizeOptionalText(formFields.controllerGender))) {
    claims[ClaimsOrganizationSchemaorg.memberGender] = firstDefined(
      normalizeOptionalText(formFields.subjectGender),
      self ? normalizeOptionalText(formFields.controllerGender) : undefined,
    ) as string;
  }
  if (normalizeOptionalText(formFields.subjectIdType) || (self && normalizeOptionalText(formFields.controllerIdType))) {
    claims[ClaimsOrganizationSchemaorg.memberIdentifierType] = firstDefined(
      normalizeOptionalText(formFields.subjectIdType),
      self ? normalizeOptionalText(formFields.controllerIdType) : undefined,
    ) as string;
  }
  if (normalizeOptionalText(formFields.subjectIdValue) || (self && normalizeOptionalText(formFields.controllerIdValue))) {
    claims[ClaimsOrganizationSchemaorg.memberIdentifierValue] = firstDefined(
      normalizeOptionalText(formFields.subjectIdValue),
      self ? normalizeOptionalText(formFields.controllerIdValue) : undefined,
    ) as string;
  }
  claims[ClaimsOrganizationSchemaorg.memberRole] = HL7_DEFAULT_ROLE_HEALTH;

  if (normalizeOptionalText(formFields.serviceProviderDomain)) {
    claims[ClaimsOrderSchemaorg.orderedItemServiceType] = normalizeText(formFields.serviceProviderDomain);
    claims[ClaimsServiceSchemaorg.serviceType] = normalizeText(formFields.serviceProviderDomain);
  }
  if (normalizeOptionalText(formFields.docDate)) {
    claims[ClaimConsent.date] = normalizeText(formFields.docDate);
  }

  if (normalizeOptionalText(formFields.controllerGivenName)) claims[ClaimsPersonSchemaorg.givenName] = normalizeText(formFields.controllerGivenName);
  if (normalizeOptionalText(formFields.controllerFamilyName)) claims[ClaimsPersonSchemaorg.familyName] = normalizeText(formFields.controllerFamilyName);
  if (normalizeOptionalText(formFields.controllerGender)) claims[ClaimsPersonSchemaorg.gender] = normalizeText(formFields.controllerGender);
  if (normalizeOptionalText(formFields.controllerDateOfBirth)) claims[ClaimsPersonSchemaorg.birthDate] = normalizeText(formFields.controllerDateOfBirth);
  if (normalizeOptionalText(formFields.controllerIdType)) claims[ClaimsPersonSchemaorg.identifierType] = normalizeText(formFields.controllerIdType);
  if (normalizeOptionalText(formFields.controllerIdValue)) claims[ClaimsPersonSchemaorg.identifierValue] = normalizeText(formFields.controllerIdValue);

  return {
    claims,
    resolved: {
      ...(controllerAlternateName ? { controllerAlternateName } : {}),
      ...(organizationAlternateName ? { organizationAlternateName } : {}),
      controllerContact: {
        ...(controllerEmail ? { email: controllerEmail } : {}),
        ...(controllerTelephone ? { telephone: controllerTelephone } : {}),
      },
      memberContact: {
        ...(memberEmail ? { email: memberEmail } : {}),
        ...(memberTelephone ? { telephone: memberTelephone } : {}),
      },
      self,
    },
  };
}

export type BuildIndividualOrganizationClaimsInput = Readonly<{
  claims?: Record<string, unknown>;
  kyc?: IndividualOrganizationKycPayload;
  formFields?: IndividualIndexServiceFormFields;
}>;

export function buildClaimsFromIndividualOrganizationForm(
  formFields: IndividualIndexServiceFormFields,
): IndividualOrganizationClaimsBuildResult {
  return buildClaimsFromIndividualOrganizationFormFields(formFields || {});
}

export function mergeIndividualOrganizationClaims(
  input: BuildIndividualOrganizationClaimsInput,
): IndividualOrganizationClaimsBuildResult {
  const baseClaims: Record<string, string> = {};
  for (const [key, value] of Object.entries(input.claims || {})) {
    const normalizedKey = normalizeText(key);
    const normalizedValue = normalizeOptionalText(value);
    if (normalizedKey && normalizedValue) baseClaims[normalizedKey] = normalizedValue;
  }

  const fromKyc = input.kyc
    ? buildClaimsFromIndividualOrganizationKyc({
      profile: input.kyc.profile,
      individualAlternateName: input.kyc.individualAlternateName || '',
      individualBirthDate: input.kyc.individualBirthDate,
      controllerEmail: input.kyc.controllerEmail,
    }).claims
    : {};
  const fromForm = input.formFields
    ? buildClaimsFromIndividualOrganizationFormFields(input.formFields).claims
    : {};

  return {
    claims: {
      ...baseClaims,
      ...fromKyc,
      ...fromForm,
    },
    resolved: buildClaimsFromIndividualOrganizationFormFields(input.formFields || {}).resolved,
  };
}
