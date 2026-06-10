import type {
  IndividualFormTemplateFields,
  IndividualOnboardingDraftInput,
  IndividualOnboardingDraftResult,
  IndividualOnboardingPdfDocumentReferenceInput,
  IndividualOnboardingPdfDraftBundle,
  IndividualOnboardingPdfTemplateInput,
  IndividualOnboardingValidationIssue,
  IndividualOnboardingValidationResult,
  IndividualOrganizationKycPayload,
} from '../models/individual-onboarding';
import { normalizeKycGender } from './individual-organization-kyc';
import { mergeIndividualOrganizationClaims } from './individual-organization-claims';
import {
  buildIndividualOnboardingPdfDocumentReferenceEntry,
  buildIndividualOnboardingPdfDraftBundle,
  buildIndividualOnboardingPdfDraftRequestBundle,
} from './individual-onboarding-document-reference';

export type IndividualOnboardingKycFieldOptions = Readonly<{
  self?: boolean;
  controllerAlternateName?: string | null;
  subjectAlternateName?: string | null;
  controllerIdType?: string | null;
  subjectIdType?: string | null;
  consentDate?: string | null;
  serviceProviderDomain?: string | null;
}>;

/**
 * Stateless helper API for building and validating the current individual
 * onboarding draft.
 *
 * Use this surface when callers prefer immutable functions over the chainable
 * editor wrapper.
 */
export interface IndividualOnboardingFacade {
  /** Creates a shallow copy of the draft form fields. */
  createDraft(initial?: IndividualFormTemplateFields): IndividualFormTemplateFields;
  /**
   * Maps the vendor KYC payload into the onboarding form draft.
   *
   * This pre-fills controller identity/contact values and optionally seeds the
   * subject-visible fields when the controller is not the subject.
   */
  getFormFieldsFromProfileKyc(
    kyc: IndividualOrganizationKycPayload,
    options?: IndividualOnboardingKycFieldOptions,
  ): IndividualFormTemplateFields;
  setSelf(fields: IndividualFormTemplateFields, value: boolean): IndividualFormTemplateFields;
  setControllerAlternateName(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setControllerEmail(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setControllerPhone(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setControllerGivenName(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setControllerFamilyName(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setControllerIdentifier(
    fields: IndividualFormTemplateFields,
    input: Readonly<{ value: string; type?: string }>,
  ): IndividualFormTemplateFields;
  setControllerBirthDate(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setControllerGender(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectAlternateName(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectEmail(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectPhone(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectGivenName(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectFamilyName(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectIdentifier(
    fields: IndividualFormTemplateFields,
    input: Readonly<{ value: string; type?: string }>,
  ): IndividualFormTemplateFields;
  setSubjectBirthDate(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setSubjectGender(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setConsentDate(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  setServiceProviderDomain(fields: IndividualFormTemplateFields, value: string): IndividualFormTemplateFields;
  buildPdfDocumentReference(input: IndividualOnboardingPdfDocumentReferenceInput): IndividualOnboardingDraftResult['documentReference'];
  buildPdfDraftRequestBundle(input: IndividualOnboardingPdfDocumentReferenceInput): IndividualOnboardingPdfDraftBundle;
  buildDraft(input: IndividualOnboardingDraftInput): IndividualOnboardingDraftResult;
  validate(
    fields: IndividualFormTemplateFields,
    template?: IndividualOnboardingPdfTemplateInput,
  ): IndividualOnboardingValidationResult;
  /** Creates the chainable stateful editor shown in the onboarding 101. */
  createEditor(initial?: IndividualFormTemplateFields): IndividualOnboardingEditor;
}

/**
 * Chainable editor for the individual onboarding draft used by apps, portals,
 * tests, and actor-specific SDK facades.
 *
 * Merge precedence:
 *
 * 1. base claims
 * 2. KYC-derived claims
 * 3. form-derived claims
 * 4. explicit field setters called later
 *
 * Empty strings never intentionally wipe an existing valid claim.
 */
export interface IndividualOnboardingEditor {
  /** Pre-fills the editor from the current KYC payload. */
  setKyc(kyc: IndividualOrganizationKycPayload, options?: IndividualOnboardingKycFieldOptions): IndividualOnboardingEditor;
  setSelf(value: boolean): IndividualOnboardingEditor;
  setControllerAlternateName(value: string): IndividualOnboardingEditor;
  setControllerEmail(value: string): IndividualOnboardingEditor;
  setControllerPhone(value: string): IndividualOnboardingEditor;
  setControllerGivenName(value: string): IndividualOnboardingEditor;
  setControllerFamilyName(value: string): IndividualOnboardingEditor;
  setControllerIdentifier(input: Readonly<{ value: string; type?: string }>): IndividualOnboardingEditor;
  setControllerBirthDate(value: string): IndividualOnboardingEditor;
  setControllerGender(value: string): IndividualOnboardingEditor;
  setSubjectAlternateName(value: string): IndividualOnboardingEditor;
  setSubjectEmail(value: string): IndividualOnboardingEditor;
  setSubjectPhone(value: string): IndividualOnboardingEditor;
  setSubjectGivenName(value: string): IndividualOnboardingEditor;
  setSubjectFamilyName(value: string): IndividualOnboardingEditor;
  setSubjectIdentifier(input: Readonly<{ value: string; type?: string }>): IndividualOnboardingEditor;
  setSubjectBirthDate(value: string): IndividualOnboardingEditor;
  setSubjectGender(value: string): IndividualOnboardingEditor;
  /**
   * Sets the PDF acceptance/signature date.
   *
   * Current validator expects an ISO local calendar date (`YYYY-MM-DD`) and
   * warns when the value is not today's date.
   */
  setConsentDate(value: string): IndividualOnboardingEditor;
  /**
   * Sets the provider base locator copied into onboarding compatibility claims.
   *
   * Accepted shapes:
   *
   * - public provider domain, e.g. `service.provider.example`
   * - hosted `did:web` base path without scheme, e.g.
   *   `hosting.example.com/acme-id/cds-es/v1/health-care`
   *
   * The current compatibility mapping still copies this value into
   * `Service.serviceType` and `Order.orderedItem.serviceType`, even though its
   * real semantic role is provider discovery/routing.
   */
  setServiceProviderDomain(value: string): IndividualOnboardingEditor;
  setTemplate(template: IndividualOnboardingPdfTemplateInput): IndividualOnboardingEditor;
  setBaseClaims(claims: Record<string, unknown>): IndividualOnboardingEditor;
  setPdf(input: IndividualOnboardingPdfDocumentReferenceInput): IndividualOnboardingEditor;
  getFormFields(): IndividualFormTemplateFields;
  buildClaims(): Record<string, unknown>;
  /** Runs lightweight client-side validation on the current draft state. */
  validate(): IndividualOnboardingValidationResult;
  buildDraft(): IndividualOnboardingDraftResult;
}

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

function isFourDigitYear(value: string): boolean {
  return /^\d{4}$/.test(value);
}

function isIsoLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function todayUtcIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function extractComparableDate(value: string): string | undefined {
  if (isFourDigitYear(value)) return `${value}-12-31`;
  if (isIsoLocalDate(value)) return value;
  return undefined;
}

function isFutureDateLike(value: string): boolean {
  const comparable = extractComparableDate(value);
  if (!comparable) return false;
  return comparable > todayUtcIsoDate();
}

function isServiceProviderLocator(value: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*(?:\/[a-z0-9._~-]+)*$/.test(value);
}

function cloneFields(fields?: IndividualFormTemplateFields): IndividualFormTemplateFields {
  return { ...(fields || {}) };
}

function patchFields(
  fields: IndividualFormTemplateFields,
  patch: Partial<IndividualFormTemplateFields>,
): IndividualFormTemplateFields {
  return {
    ...cloneFields(fields),
    ...patch,
  };
}

function toValidationResult(issues: IndividualOnboardingValidationIssue[]): IndividualOnboardingValidationResult {
  return {
    ok: !issues.some((issue) => issue.severity === 'error'),
    errors: issues.filter((issue) => issue.severity === 'error'),
    warnings: issues.filter((issue) => issue.severity === 'warning'),
  };
}

function resolveSubjectAlternateName(fields: IndividualFormTemplateFields): string | undefined {
  return normalizeOptionalText(fields.subjectAlternateName) || normalizeOptionalText(fields.controllerAlternateName);
}

function resolveSubjectBirthDate(fields: IndividualFormTemplateFields): string | undefined {
  return normalizeOptionalText(fields.subjectDateOfBirth) || normalizeOptionalText(fields.controllerDateOfBirth);
}

function resolveControllerEmail(
  fields: IndividualFormTemplateFields,
  kyc?: IndividualOrganizationKycPayload,
): string | undefined {
  return normalizeOptionalText(fields.controllerEmail) || normalizeOptionalText(kyc?.controllerEmail);
}

function createEditorFromFacade(
  facade: Omit<IndividualOnboardingFacade, 'createEditor'>,
  initial?: IndividualFormTemplateFields,
): IndividualOnboardingEditor {
  let formFields = facade.createDraft(initial);
  let kyc: IndividualOrganizationKycPayload | undefined;
  let template: IndividualOnboardingPdfTemplateInput | undefined;
  let claims: Record<string, unknown> | undefined;
  let pdf: IndividualOnboardingPdfDocumentReferenceInput | undefined;

  const editor: IndividualOnboardingEditor = {
    setKyc(nextKyc, options = {}) {
      kyc = nextKyc;
      formFields = patchFields(
        facade.getFormFieldsFromProfileKyc(nextKyc, options),
        formFields,
      );
      return editor;
    },
    setSelf(value) {
      formFields = facade.setSelf(formFields, value);
      return editor;
    },
    setControllerAlternateName(value) {
      formFields = facade.setControllerAlternateName(formFields, value);
      return editor;
    },
    setControllerEmail(value) {
      formFields = facade.setControllerEmail(formFields, value);
      return editor;
    },
    setControllerPhone(value) {
      formFields = facade.setControllerPhone(formFields, value);
      return editor;
    },
    setControllerGivenName(value) {
      formFields = facade.setControllerGivenName(formFields, value);
      return editor;
    },
    setControllerFamilyName(value) {
      formFields = facade.setControllerFamilyName(formFields, value);
      return editor;
    },
    setControllerIdentifier(input) {
      formFields = facade.setControllerIdentifier(formFields, input);
      return editor;
    },
    setControllerBirthDate(value) {
      formFields = facade.setControllerBirthDate(formFields, value);
      return editor;
    },
    setControllerGender(value) {
      formFields = facade.setControllerGender(formFields, value);
      return editor;
    },
    setSubjectAlternateName(value) {
      formFields = facade.setSubjectAlternateName(formFields, value);
      return editor;
    },
    setSubjectEmail(value) {
      formFields = facade.setSubjectEmail(formFields, value);
      return editor;
    },
    setSubjectPhone(value) {
      formFields = facade.setSubjectPhone(formFields, value);
      return editor;
    },
    setSubjectGivenName(value) {
      formFields = facade.setSubjectGivenName(formFields, value);
      return editor;
    },
    setSubjectFamilyName(value) {
      formFields = facade.setSubjectFamilyName(formFields, value);
      return editor;
    },
    setSubjectIdentifier(input) {
      formFields = facade.setSubjectIdentifier(formFields, input);
      return editor;
    },
    setSubjectBirthDate(value) {
      formFields = facade.setSubjectBirthDate(formFields, value);
      return editor;
    },
    setSubjectGender(value) {
      formFields = facade.setSubjectGender(formFields, value);
      return editor;
    },
    setConsentDate(value) {
      formFields = facade.setConsentDate(formFields, value);
      return editor;
    },
    setServiceProviderDomain(value) {
      formFields = facade.setServiceProviderDomain(formFields, value);
      return editor;
    },
    setTemplate(value) {
      template = value;
      return editor;
    },
    setBaseClaims(value) {
      claims = { ...(value || {}) };
      return editor;
    },
    setPdf(value) {
      pdf = value;
      return editor;
    },
    getFormFields() {
      return cloneFields(formFields);
    },
    buildClaims() {
      return facade.buildDraft({
        ...(kyc ? { kyc } : {}),
        formFields,
        ...(claims ? { claims } : {}),
      }).claims || {};
    },
    validate() {
      return facade.validate(formFields, template);
    },
    buildDraft() {
      return facade.buildDraft({
        ...(kyc ? { kyc } : {}),
        formFields,
        ...(template ? { template } : {}),
        ...(claims ? { claims } : {}),
        ...(pdf ? { pdf } : {}),
      });
    },
  };

  return editor;
}

/**
 * Creates the immutable onboarding facade.
 *
 * Prefer `createIndividualOnboardingEditor()` in application code unless a
 * caller explicitly wants pure stateless helpers.
 */
export function createIndividualOnboardingFacade(): IndividualOnboardingFacade {
  const facade: Omit<IndividualOnboardingFacade, 'createEditor'> = {
    createDraft(initial = {}) {
      return cloneFields(initial);
    },

    getFormFieldsFromProfileKyc(kyc, options = {}) {
      const self = options.self ?? true;
      const subjectAlternateName =
        normalizeOptionalText(options.subjectAlternateName)
        || normalizeOptionalText(kyc.individualAlternateName);
      const controllerAlternateName =
        normalizeOptionalText(options.controllerAlternateName)
        || (self ? subjectAlternateName : undefined);
      const controllerGender = normalizeKycGender(kyc.profile.gender);

      return {
        controllerIsSubject: self,
        ...(controllerAlternateName ? { controllerAlternateName } : {}),
        ...(normalizeOptionalText(kyc.profile.first_name) ? { controllerGivenName: normalizeText(kyc.profile.first_name).toUpperCase() } : {}),
        ...(normalizeOptionalText(kyc.profile.last_name) ? { controllerFamilyName: normalizeText(kyc.profile.last_name).toUpperCase() } : {}),
        ...(resolveControllerEmail({}, kyc) ? { controllerEmail: resolveControllerEmail({}, kyc) } : {}),
        ...(normalizeOptionalText(kyc.profile.phone_number) ? { controllerPhone: normalizeText(kyc.profile.phone_number) } : {}),
        ...(normalizeOptionalText(options.controllerIdType) ? { controllerIdType: normalizeText(options.controllerIdType) } : {}),
        ...(normalizeOptionalText(kyc.profile.id_number) ? { controllerIdValue: normalizeText(kyc.profile.id_number) } : {}),
        ...(normalizeOptionalText(kyc.profile.birthdate) ? { controllerDateOfBirth: normalizeText(kyc.profile.birthdate) } : {}),
        ...(controllerGender ? { controllerGender } : {}),
        ...(!self && subjectAlternateName ? { subjectAlternateName } : {}),
        ...(!self && normalizeOptionalText(kyc.individualBirthDate) ? { subjectDateOfBirth: normalizeText(kyc.individualBirthDate) } : {}),
        ...(!self && normalizeOptionalText(options.subjectIdType) ? { subjectIdType: normalizeText(options.subjectIdType) } : {}),
        ...(normalizeOptionalText(options.consentDate) ? { docDate: normalizeText(options.consentDate) } : {}),
        ...(normalizeOptionalText(options.serviceProviderDomain) ? { serviceProviderDomain: normalizeText(options.serviceProviderDomain) } : {}),
      };
    },

    setSelf(fields, value) {
      return patchFields(fields, { controllerIsSubject: value });
    },

    setControllerAlternateName(fields, value) {
      return patchFields(fields, { controllerAlternateName: normalizeText(value) });
    },

    setControllerEmail(fields, value) {
      return patchFields(fields, { controllerEmail: normalizeText(value).toLowerCase() });
    },

    setControllerPhone(fields, value) {
      return patchFields(fields, { controllerPhone: normalizeText(value) });
    },

    setControllerGivenName(fields, value) {
      return patchFields(fields, { controllerGivenName: normalizeText(value) });
    },

    setControllerFamilyName(fields, value) {
      return patchFields(fields, { controllerFamilyName: normalizeText(value) });
    },

    setControllerIdentifier(fields, input) {
      return patchFields(fields, {
        ...(normalizeOptionalText(input.type) ? { controllerIdType: normalizeText(input.type) } : {}),
        controllerIdValue: normalizeText(input.value),
      });
    },

    setControllerBirthDate(fields, value) {
      return patchFields(fields, { controllerDateOfBirth: normalizeText(value) });
    },

    setControllerGender(fields, value) {
      return patchFields(fields, { controllerGender: normalizeText(value) });
    },

    setSubjectAlternateName(fields, value) {
      return patchFields(fields, { subjectAlternateName: normalizeText(value) });
    },

    setSubjectEmail(fields, value) {
      return patchFields(fields, { subjectEmail: normalizeText(value).toLowerCase() });
    },

    setSubjectPhone(fields, value) {
      return patchFields(fields, { subjectPhone: normalizeText(value) });
    },

    setSubjectGivenName(fields, value) {
      return patchFields(fields, { subjectGivenName: normalizeText(value) });
    },

    setSubjectFamilyName(fields, value) {
      return patchFields(fields, { subjectFamilyName: normalizeText(value) });
    },

    setSubjectIdentifier(fields, input) {
      return patchFields(fields, {
        ...(normalizeOptionalText(input.type) ? { subjectIdType: normalizeText(input.type) } : {}),
        subjectIdValue: normalizeText(input.value),
      });
    },

    setSubjectBirthDate(fields, value) {
      return patchFields(fields, { subjectDateOfBirth: normalizeText(value) });
    },

    setSubjectGender(fields, value) {
      return patchFields(fields, { subjectGender: normalizeText(value) });
    },

    setConsentDate(fields, value) {
      return patchFields(fields, { docDate: normalizeText(value) });
    },

    setServiceProviderDomain(fields, value) {
      return patchFields(fields, { serviceProviderDomain: normalizeText(value) });
    },

    buildPdfDocumentReference(input) {
      return buildIndividualOnboardingPdfDocumentReferenceEntry(input);
    },

    buildPdfDraftRequestBundle(input) {
      return buildIndividualOnboardingPdfDraftRequestBundle(input);
    },

    buildDraft(input) {
      const fromKyc = input.kyc
        ? facade.getFormFieldsFromProfileKyc(input.kyc, {
          self: normalizeOptionalBoolean(input.formFields?.controllerIsSubject) ?? true,
          controllerAlternateName: input.formFields?.controllerAlternateName,
          subjectAlternateName: input.formFields?.subjectAlternateName,
          controllerIdType: input.formFields?.controllerIdType,
          subjectIdType: input.formFields?.subjectIdType,
          consentDate: input.formFields?.docDate,
          serviceProviderDomain: input.formFields?.serviceProviderDomain,
        })
        : {};
      const formFields = patchFields(fromKyc, input.formFields || {});
      const validation = facade.validate(formFields, input.template);
      const subjectAlternateName = resolveSubjectAlternateName(formFields);
      const subjectBirthDate = resolveSubjectBirthDate(formFields);
      const claims = (() => {
        if (!input.kyc && !input.formFields && !input.claims) return undefined;
        return mergeIndividualOrganizationClaims({
          claims: input.claims,
          ...(input.kyc && subjectAlternateName ? {
            kyc: {
              ...input.kyc,
              individualAlternateName: subjectAlternateName,
              individualBirthDate: subjectBirthDate,
              controllerEmail: resolveControllerEmail(formFields, input.kyc),
            },
          } : {}),
          formFields,
        }).claims;
      })();
      const pdfInput = input.pdf
        ? {
          ...input.pdf,
          date: normalizeOptionalText(input.pdf.date) || normalizeOptionalText(formFields.docDate),
        }
        : undefined;
      const documentReference = pdfInput
        ? buildIndividualOnboardingPdfDocumentReferenceEntry(pdfInput)
        : undefined;
      const bundle = pdfInput
        ? buildIndividualOnboardingPdfDraftBundle(pdfInput)
        : undefined;

      return {
        formFields,
        ...(input.template ? { template: input.template } : {}),
        ...(claims ? { claims } : {}),
        ...(documentReference ? { documentReference } : {}),
        ...(bundle ? { data: bundle.data, bundle } : {}),
        validation,
      };
    },

    validate(fields, template) {
      const issues: IndividualOnboardingValidationIssue[] = [];
      const self = normalizeOptionalBoolean(fields.controllerIsSubject) ?? true;
      const controllerAlternateName = normalizeOptionalText(fields.controllerAlternateName);
      const subjectAlternateName = normalizeOptionalText(fields.subjectAlternateName);
      const hasControllerContact = Boolean(normalizeOptionalText(fields.controllerEmail) || normalizeOptionalText(fields.controllerPhone));
      const hasSubjectContact = Boolean(normalizeOptionalText(fields.subjectEmail) || normalizeOptionalText(fields.subjectPhone));
      const subjectBirthDate = normalizeOptionalText(fields.subjectDateOfBirth);
      const controllerBirthDate = normalizeOptionalText(fields.controllerDateOfBirth);
      const docDate = normalizeOptionalText(fields.docDate);
      const serviceProviderDomain = normalizeOptionalText(fields.serviceProviderDomain);

      if (self) {
        if (!controllerAlternateName) {
          issues.push({
            severity: 'error',
            code: 'missing-controller-alternate-name',
            message: 'Controller alternateName is required when controllerIsSubject=true.',
            field: 'controllerAlternateName',
          });
        }
        if (subjectAlternateName) {
          issues.push({
            severity: 'warning',
            code: 'subject-fields-ignored-when-self',
            message: 'subjectAlternateName is usually unnecessary when controllerIsSubject=true.',
            field: 'subjectAlternateName',
          });
        }
      } else {
        if (!controllerAlternateName) {
          issues.push({
            severity: 'error',
            code: 'missing-controller-alternate-name',
            message: 'Controller alternateName is required when controllerIsSubject=false.',
            field: 'controllerAlternateName',
          });
        }
        if (!subjectAlternateName) {
          issues.push({
            severity: 'warning',
            code: 'missing-subject-alternate-name',
            message: 'Subject alternateName is recommended when self=false.',
            field: 'subjectAlternateName',
          });
        }
      }

      if (!hasControllerContact && !hasSubjectContact) {
        issues.push({
          severity: 'error',
          code: 'missing-contact-channel',
          message: 'At least one controller or subject contact channel is required.',
          field: 'controllerEmail',
        });
      }

      if (controllerBirthDate) {
        if (!isFourDigitYear(controllerBirthDate) && !isIsoLocalDate(controllerBirthDate)) {
          issues.push({
            severity: 'error',
            code: 'invalid-controller-birth-date-format',
            message: 'controllerDateOfBirth must use YYYY or YYYY-MM-DD.',
            field: 'controllerDateOfBirth',
          });
        } else if (isFutureDateLike(controllerBirthDate)) {
          issues.push({
            severity: 'error',
            code: 'controller-birth-date-in-future',
            message: 'controllerDateOfBirth cannot be in the future.',
            field: 'controllerDateOfBirth',
          });
        }
      }

      if (subjectBirthDate) {
        if (!isFourDigitYear(subjectBirthDate) && !isIsoLocalDate(subjectBirthDate)) {
          issues.push({
            severity: 'error',
            code: 'invalid-subject-birth-date-format',
            message: 'subjectDateOfBirth must use YYYY or YYYY-MM-DD.',
            field: 'subjectDateOfBirth',
          });
        } else if (isFutureDateLike(subjectBirthDate)) {
          issues.push({
            severity: 'error',
            code: 'subject-birth-date-in-future',
            message: 'subjectDateOfBirth cannot be in the future.',
            field: 'subjectDateOfBirth',
          });
        }
      }

      if (docDate) {
        if (!isIsoLocalDate(docDate)) {
          issues.push({
            severity: 'error',
            code: 'invalid-doc-date-format',
            message: 'docDate must use YYYY-MM-DD.',
            field: 'docDate',
          });
        } else {
          if (docDate > todayUtcIsoDate()) {
            issues.push({
              severity: 'error',
              code: 'doc-date-in-future',
              message: 'docDate cannot be in the future.',
              field: 'docDate',
            });
          } else if (docDate !== todayUtcIsoDate()) {
            issues.push({
              severity: 'warning',
              code: 'doc-date-not-today',
              message: 'docDate is not today. Some production flows may require the acceptance date to match the current day.',
              field: 'docDate',
            });
          }
        }
      }

      if (serviceProviderDomain && !isServiceProviderLocator(serviceProviderDomain)) {
        issues.push({
          severity: 'error',
          code: 'invalid-service-provider-domain',
          message: 'serviceProviderDomain must be a public provider domain or hosted did:web base without scheme.',
          field: 'serviceProviderDomain',
        });
      }

      if (template) {
        if (!normalizeOptionalText(template.sector)) {
          issues.push({
            severity: 'error',
            code: 'missing-template-sector',
            message: 'Template sector is required.',
            field: 'template',
          });
        }
        if (!normalizeOptionalText(template.language)) {
          issues.push({
            severity: 'error',
            code: 'missing-template-language',
            message: 'Template language is required.',
            field: 'template',
          });
        }
        if (!normalizeOptionalText(template.version)) {
          issues.push({
            severity: 'error',
            code: 'missing-template-version',
            message: 'Template version is required.',
            field: 'template',
          });
        }
      }

      return toValidationResult(issues);
    },
  };

  return {
    ...facade,
    createEditor(initial = {}) {
      return createEditorFromFacade(facade, initial);
    },
  };
}

/**
 * Creates the chainable onboarding editor used in the 101 examples.
 */
export function createIndividualOnboardingEditor(
  initial: IndividualFormTemplateFields = {},
): IndividualOnboardingEditor {
  return createIndividualOnboardingFacade().createEditor(initial);
}
