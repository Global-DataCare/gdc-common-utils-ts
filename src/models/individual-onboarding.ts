import type { BundleEntry, BundleJsonApi } from './bundle';
import type { DocumentReferenceClaimKey } from './interoperable-claims/document-reference-claims';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { IdKindValue } from '../constants/identity-identifiers';
import type { BirthSex, GenderIdentity } from '../constants/identity-gender';

/**
 * Canonical field names currently used by the individual onboarding PDF form.
 *
 * These values belong to the PDF layer, before normalization into `org.schema`
 * claims. Keeping them typed avoids stringly-typed access in downstream repos.
 */
export enum IndividualFormPdfFieldName {
  docDate = 'docDate',
  serviceProviderDomain = 'serviceProviderDomain',
  controllerAlternateName = 'controllerAlternateName',
  controllerDateOfBirth = 'controllerDateOfBirth',
  controllerEmail = 'controllerEmail',
  controllerFamilyName = 'controllerFamilyName',
  controllerGender = 'controllerGender',
  controllerGivenName = 'controllerGivenName',
  controllerIdType = 'controllerIdType',
  controllerIdValue = 'controllerIdValue',
  controllerPhone = 'controllerPhone',
  controllerSexAtBirth = 'controllerSexAtBirth',
  controllerIsSubject = 'controllerIsSubject',
  subjectAlternateName = 'subjectAlternateName',
  subjectGivenName = 'subjectGivenName',
  subjectFamilyName = 'subjectFamilyName',
  subjectEmail = 'subjectEmail',
  subjectPhone = 'subjectPhone',
  subjectIdType = 'subjectIdType',
  subjectIdValue = 'subjectIdValue',
  subjectDateOfBirth = 'subjectDateOfBirth',
  subjectGender = 'subjectGender',
  subjectSexAtBirth = 'subjectSexAtBirth',
}

export const IndividualFormPdfFieldNames = Object.freeze([
  IndividualFormPdfFieldName.docDate,
  IndividualFormPdfFieldName.serviceProviderDomain,
  IndividualFormPdfFieldName.controllerAlternateName,
  IndividualFormPdfFieldName.controllerDateOfBirth,
  IndividualFormPdfFieldName.controllerEmail,
  IndividualFormPdfFieldName.controllerFamilyName,
  IndividualFormPdfFieldName.controllerGender,
  IndividualFormPdfFieldName.controllerGivenName,
  IndividualFormPdfFieldName.controllerIdType,
  IndividualFormPdfFieldName.controllerIdValue,
  IndividualFormPdfFieldName.controllerPhone,
  IndividualFormPdfFieldName.controllerSexAtBirth,
  IndividualFormPdfFieldName.controllerIsSubject,
  IndividualFormPdfFieldName.subjectAlternateName,
  IndividualFormPdfFieldName.subjectGivenName,
  IndividualFormPdfFieldName.subjectFamilyName,
  IndividualFormPdfFieldName.subjectEmail,
  IndividualFormPdfFieldName.subjectPhone,
  IndividualFormPdfFieldName.subjectIdType,
  IndividualFormPdfFieldName.subjectIdValue,
  IndividualFormPdfFieldName.subjectDateOfBirth,
  IndividualFormPdfFieldName.subjectGender,
  IndividualFormPdfFieldName.subjectSexAtBirth,
] as const);

export type IndividualFormPdfFieldValue = string | boolean | undefined | null;

/**
 * Full typed shape of the known fields currently present in the onboarding PDF.
 *
 * This models the form surface exactly as published in the PDF, even when the
 * current mapper does not yet consume some of the fields.
 *
 * Validation and semantics:
 *
 * - `docDate` is the document signature / acceptance date shown in the PDF
 * - `serviceProviderDomain` is the provider base locator selected during
 *   autodiscovery, without `http://` or `https://`
 * - it may be a public provider domain such as `service.provider.example`
 * - it may also be a hosted `did:web` base path such as
 *   `hosting.example.com/acme-id/cds-es/v1/health-care`
 * - the current onboarding compatibility mapping still copies it into
 *   `org.schema.Service.serviceType` and `org.schema.Order.orderedItem.serviceType`
 *   even though semantically it is a provider locator, not a service purpose
 * - `controller*` fields belong to the controller / legal representative
 * - `subject*` fields belong to the indexed subject
 * - `controllerIsSubject=true` means the controller and the subject are the
 *   same natural person for the current onboarding flow
 */
export interface IndividualFormTemplateFields {
  docDate?: string;
  serviceProviderDomain?: string;
  controllerAlternateName?: string;
  controllerDateOfBirth?: string;
  controllerEmail?: string;
  controllerFamilyName?: string;
  controllerGender?: GenderIdentity | string;
  controllerGivenName?: string;
  controllerIdType?: IdKindValue | string;
  controllerIdValue?: string;
  controllerPhone?: string;
  controllerSexAtBirth?: BirthSex | string;
  controllerIsSubject?: boolean;
  subjectAlternateName?: string;
  subjectDateOfBirth?: string;
  subjectEmail?: string;
  subjectFamilyName?: string;
  subjectGender?: GenderIdentity | string;
  subjectGivenName?: string;
  subjectIdType?: IdKindValue | string;
  subjectIdValue?: string;
  subjectPhone?: string;
  subjectSexAtBirth?: BirthSex | string;
}

/** @deprecated Use `IndividualFormTemplateFields`. */
export type IndividualIndexServiceFormFields = IndividualFormTemplateFields;

/**
 * Typed raw field map as extracted from the onboarding PDF.
 *
 * It remains open to unknown keys because real PDF tooling may expose stale
 * widgets, vendor-specific technical field names, or broken form artifacts
 * that are intentionally excluded from the canonical interface.
 */
export type IndividualFormPdfFieldMap = Readonly<
  Omit<IndividualFormTemplateFields, 'controllerIsSubject'>
  & {
    controllerIsSubject?: IndividualFormPdfFieldValue;
  }
  & Partial<Record<IndividualFormPdfFieldName, IndividualFormPdfFieldValue>>
  & Record<string, IndividualFormPdfFieldValue>
>;

/**
 * Minimal profile shape returned by the current web KYC integration for
 * natural persons. The mapper intentionally models only the fields that are
 * consumed by the current individual/controller onboarding contract.
 */
export type IndividualOrganizationKycProfile = Readonly<{
  uuid?: string | null;
  user_uuid?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  nationality?: string | null;
  country?: string | null;
  ip_country?: string | null;
  city?: string | null;
  address?: string | null;
  id_number?: string | null;
  postal_code?: string | null;
  phone_number?: string | null;
  birthdate?: string | null;
  kyc_verified_at?: string | null;
  gender?: string | null;
  language?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  primary_wallet_address?: string | null;
  primary_wallet?: string | null;
}>;

/**
 * Provider-facing KYC payload accepted by the current onboarding flow.
 *
 * `profile` is the natural-person controller data validated by the KYC vendor.
 * The remaining fields are onboarding-specific subject/controller seed values
 * that may travel alongside the KYC profile.
 */
export type IndividualOrganizationKycPayload = Readonly<{
  profile: IndividualOrganizationKycProfile;
  individualAlternateName?: string | null;
  individualBirthDate?: string | null;
  controllerEmail?: string | null;
}>;

export type IndividualOnboardingPdfTemplateRef = Readonly<{
  sector: string;
  language: string;
  version: string;
  templateUrl?: string | null;
  templateSha256?: string | null;
}>;

export type IndividualOnboardingPdfTemplateInput = Readonly<
  IndividualOnboardingPdfTemplateRef
  & {
    templateBytesBase64?: string | null;
  }
>;

export type IndividualOnboardingPdfDocumentReferenceInput = Readonly<{
  subject: string;
  contentData: string;
  identifier?: string | null;
  contentType?: string | null;
  description?: string | null;
  date?: string | null;
  location?: string | null;
  contentHash?: string | null;
  language?: string | null;
  claims?: Record<string, unknown>;
}>;

export type IndividualOnboardingPdfDocumentReferenceClaims = Readonly<
  Partial<Record<DocumentReferenceClaimKey, string>>
  & Record<string, unknown>
>;

export type IndividualOnboardingPdfDocumentReferenceResource = Readonly<{
  resourceType: typeof ResourceTypesFhirR4.DocumentReference;
  meta: Readonly<{
    claims: IndividualOnboardingPdfDocumentReferenceClaims;
  }>;
}>;

export type IndividualOnboardingPdfDocumentReferenceEntry = Readonly<
  Omit<BundleEntry, 'resource' | 'type'>
  & {
    type: typeof ResourceTypesFhirR4.DocumentReference;
    resource: IndividualOnboardingPdfDocumentReferenceResource;
  }
>;

export type IndividualOnboardingPdfDraftBundle = Readonly<
  Omit<BundleJsonApi<IndividualOnboardingPdfDocumentReferenceEntry>, 'resourceType' | 'type' | 'data'>
  & {
    resourceType: 'Bundle';
    type: 'collection';
    data: IndividualOnboardingPdfDocumentReferenceEntry[];
  }
>;

export type IndividualOnboardingValidationIssue = Readonly<{
  severity: 'error' | 'warning';
  code: string;
  message: string;
  field?: keyof IndividualFormTemplateFields | 'template' | 'claims' | 'kyc' | string;
}>;

/**
 * Result of the lightweight client-side validation performed by the onboarding
 * editor/facade before a request is sent to GW CORE.
 *
 * Current scope:
 *
 * - required/optional field presence
 * - basic date syntax and obvious temporal errors
 * - service provider token syntax
 *
 * It is intentionally not the final business validation authority. Tenants may
 * still apply stricter rules in GW CORE or in the portal/backend.
 */
export type IndividualOnboardingValidationResult = Readonly<{
  ok: boolean;
  errors: IndividualOnboardingValidationIssue[];
  warnings: IndividualOnboardingValidationIssue[];
}>;

export type IndividualOnboardingDraftInput = Readonly<{
  template?: IndividualOnboardingPdfTemplateInput;
  kyc?: IndividualOrganizationKycPayload;
  formFields?: IndividualFormTemplateFields;
  claims?: Record<string, unknown>;
  pdf?: IndividualOnboardingPdfDocumentReferenceInput;
}>;

export type IndividualOnboardingDraftResult = Readonly<{
  formFields: IndividualFormTemplateFields;
  claims?: Record<string, unknown>;
  template?: IndividualOnboardingPdfTemplateInput;
  documentReference?: IndividualOnboardingPdfDocumentReferenceEntry;
  data?: IndividualOnboardingPdfDraftBundle['data'];
  bundle?: IndividualOnboardingPdfDraftBundle;
  validation: IndividualOnboardingValidationResult;
}>;
