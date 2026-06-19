import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
  ClaimsServiceSchemaorg,
} from '../constants/schemaorg';
import type {
  LegalOrganizationVerificationRouting,
  LegalOrganizationVerificationTransactionController,
  LegalOrganizationVerificationTransactionInput,
  LegalOrganizationVerificationTransactionOrganization,
  LegalOrganizationVerificationRepresentativePayload,
} from './legal-organization-verification-transaction';
import {
  validateLegalOrganizationOnboardingClaims,
  type ValidateLegalOrganizationOnboardingClaimsOptions,
} from './legal-organization-onboarding';

export type LegalOrganizationFormTemplateFields = Readonly<{
  legalName?: string;
  legalIdentifierType?: string;
  legalIdentifierValue?: string;
  taxId?: string;
  addressCountry?: string;
  controllerEmail?: string;
  controllerRole?: string;
  serviceCategory?: string;
  serviceIdentifier?: string;
  serviceUrl?: string;
  tenantAlias?: string;
}>;

export type LegalOrganizationOnboardingValidationIssue = Readonly<{
  severity: 'error' | 'warning';
  code: string;
  message: string;
  field?: keyof LegalOrganizationFormTemplateFields | 'claims' | string;
}>;

export type LegalOrganizationOnboardingValidationResult = Readonly<{
  ok: boolean;
  errors: LegalOrganizationOnboardingValidationIssue[];
  warnings: LegalOrganizationOnboardingValidationIssue[];
  normalizedClaims: Record<string, unknown>;
}>;

export type LegalOrganizationOnboardingDraftResult = Readonly<{
  formFields: LegalOrganizationFormTemplateFields;
  claims: Record<string, unknown>;
  validation: LegalOrganizationOnboardingValidationResult;
}>;

export type LegalOrganizationGatewayVerificationSignatureFlow = 'certificate' | 'otp';

export type LegalOrganizationGatewayVerificationRequestInput = Readonly<{
  controller: LegalOrganizationVerificationTransactionController;
  signatureFlow?: LegalOrganizationGatewayVerificationSignatureFlow;
  representativeSameAs?: string;
  verificationResourceType?: string;
  signedTermsAttachmentId?: string;
  signedTermsPdfUrl?: string;
  validationOptions?: ValidateLegalOrganizationOnboardingClaimsOptions;
}>;

export type LegalOrganizationGatewayActivationRequestInput = Readonly<{
  vpToken: string;
  controller?: LegalOrganizationVerificationTransactionController;
  serviceCapabilities?: ReadonlyArray<string>;
  additionalClaims?: Record<string, unknown>;
  validationOptions?: ValidateLegalOrganizationOnboardingClaimsOptions;
}>;

export type LegalOrganizationGatewayActivationRequest = Readonly<{
  vpToken: string;
  controller?: LegalOrganizationVerificationTransactionController;
  service?: Readonly<{
    url?: string;
    capabilities?: ReadonlyArray<string>;
  }>;
  additionalClaims?: Record<string, unknown>;
}>;

export interface LegalOrganizationOnboardingFacade {
  /** Creates a shallow copy of the legal-organization form draft. */
  createDraft(initial?: LegalOrganizationFormTemplateFields): LegalOrganizationFormTemplateFields;
  setLegalName(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getLegalName(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setLegalIdentifierType(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getLegalIdentifierType(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setLegalIdentifierValue(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getLegalIdentifierValue(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setTaxId(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getTaxId(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setAddressCountry(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getAddressCountry(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setControllerEmail(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getControllerEmail(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setControllerRole(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getControllerRole(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setServiceCategory(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getServiceCategory(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setServiceIdentifier(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getServiceIdentifier(fields: LegalOrganizationFormTemplateFields): string | undefined;
  setServiceUrl(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getServiceUrl(fields: LegalOrganizationFormTemplateFields): string | undefined;
  /**
   * Optional explicit tenant alias.
   *
   * By default validation will only accept a value equal to the canonical
   * legal identifier unless `allowExplicitAlternateNameForTenantId=true`.
   */
  setTenantAlias(fields: LegalOrganizationFormTemplateFields, value: string): LegalOrganizationFormTemplateFields;
  getTenantAlias(fields: LegalOrganizationFormTemplateFields): string | undefined;
  buildClaims(
    fields: LegalOrganizationFormTemplateFields,
    options?: ValidateLegalOrganizationOnboardingClaimsOptions,
  ): Record<string, unknown>;
  buildDraft(
    fields: LegalOrganizationFormTemplateFields,
    options?: ValidateLegalOrganizationOnboardingClaimsOptions,
  ): LegalOrganizationOnboardingDraftResult;
  validate(
    fields: LegalOrganizationFormTemplateFields,
    options?: ValidateLegalOrganizationOnboardingClaimsOptions,
  ): LegalOrganizationOnboardingValidationResult;
  buildVerificationTransactionInput(
    fields: LegalOrganizationFormTemplateFields,
    input: Readonly<{
      controller: LegalOrganizationVerificationTransactionController;
      organization?: LegalOrganizationVerificationTransactionOrganization;
      legalRepresentativePayload?: LegalOrganizationVerificationRepresentativePayload;
      verification?: LegalOrganizationVerificationRouting;
      attachments?: unknown[];
      validationOptions?: ValidateLegalOrganizationOnboardingClaimsOptions;
    }>,
  ): LegalOrganizationVerificationTransactionInput;
  buildGatewayVerificationRequest(
    fields: LegalOrganizationFormTemplateFields,
    input: LegalOrganizationGatewayVerificationRequestInput,
  ): LegalOrganizationVerificationTransactionInput;
  buildGatewayActivationRequest(
    fields: LegalOrganizationFormTemplateFields,
    input: LegalOrganizationGatewayActivationRequestInput,
  ): LegalOrganizationGatewayActivationRequest;
  /** Creates the chainable editor shown in the onboarding 101. */
  createEditor(initial?: LegalOrganizationFormTemplateFields): LegalOrganizationOnboardingEditor;
}

export interface LegalOrganizationOnboardingEditor {
  setLegalName(value: string): LegalOrganizationOnboardingEditor;
  getLegalName(): string | undefined;
  setLegalIdentifierType(value: string): LegalOrganizationOnboardingEditor;
  getLegalIdentifierType(): string | undefined;
  setLegalIdentifierValue(value: string): LegalOrganizationOnboardingEditor;
  getLegalIdentifierValue(): string | undefined;
  setTaxId(value: string): LegalOrganizationOnboardingEditor;
  getTaxId(): string | undefined;
  setAddressCountry(value: string): LegalOrganizationOnboardingEditor;
  getAddressCountry(): string | undefined;
  setControllerEmail(value: string): LegalOrganizationOnboardingEditor;
  getControllerEmail(): string | undefined;
  setControllerRole(value: string): LegalOrganizationOnboardingEditor;
  getControllerRole(): string | undefined;
  setServiceCategory(value: string): LegalOrganizationOnboardingEditor;
  getServiceCategory(): string | undefined;
  setServiceIdentifier(value: string): LegalOrganizationOnboardingEditor;
  getServiceIdentifier(): string | undefined;
  setServiceUrl(value: string): LegalOrganizationOnboardingEditor;
  getServiceUrl(): string | undefined;
  setTenantAlias(value: string): LegalOrganizationOnboardingEditor;
  getTenantAlias(): string | undefined;
  getFormFields(): LegalOrganizationFormTemplateFields;
  buildClaims(options?: ValidateLegalOrganizationOnboardingClaimsOptions): Record<string, unknown>;
  validate(options?: ValidateLegalOrganizationOnboardingClaimsOptions): LegalOrganizationOnboardingValidationResult;
  buildDraft(options?: ValidateLegalOrganizationOnboardingClaimsOptions): LegalOrganizationOnboardingDraftResult;
  buildVerificationTransactionInput(input: Readonly<{
    controller: LegalOrganizationVerificationTransactionController;
    organization?: LegalOrganizationVerificationTransactionOrganization;
    legalRepresentativePayload?: LegalOrganizationVerificationRepresentativePayload;
    verification?: LegalOrganizationVerificationRouting;
    attachments?: unknown[];
    validationOptions?: ValidateLegalOrganizationOnboardingClaimsOptions;
  }>): LegalOrganizationVerificationTransactionInput;
  buildGatewayVerificationRequest(input: LegalOrganizationGatewayVerificationRequestInput): LegalOrganizationVerificationTransactionInput;
  buildGatewayActivationRequest(input: LegalOrganizationGatewayActivationRequestInput): LegalOrganizationGatewayActivationRequest;
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalText(value: unknown): string | undefined {
  const normalized = normalizeText(value);
  return normalized || undefined;
}

function cloneFields(fields?: LegalOrganizationFormTemplateFields): LegalOrganizationFormTemplateFields {
  return { ...(fields || {}) };
}

function patchFields(
  fields: LegalOrganizationFormTemplateFields,
  patch: Partial<LegalOrganizationFormTemplateFields>,
): LegalOrganizationFormTemplateFields {
  return {
    ...cloneFields(fields),
    ...patch,
  };
}

function toValidationResult(
  normalizedClaims: Record<string, unknown>,
  issues: LegalOrganizationOnboardingValidationIssue[],
): LegalOrganizationOnboardingValidationResult {
  return {
    ok: !issues.some((issue) => issue.severity === 'error'),
    errors: issues.filter((issue) => issue.severity === 'error'),
    warnings: issues.filter((issue) => issue.severity === 'warning'),
    normalizedClaims,
  };
}

function normalizeCapabilityList(values?: ReadonlyArray<string>): string[] {
  return [...(values || [])]
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function createEditorFromFacade(
  facade: Omit<LegalOrganizationOnboardingFacade, 'createEditor'>,
  initial?: LegalOrganizationFormTemplateFields,
): LegalOrganizationOnboardingEditor {
  let formFields = facade.createDraft(initial);

  const editor: LegalOrganizationOnboardingEditor = {
    setLegalName(value) { formFields = facade.setLegalName(formFields, value); return editor; },
    getLegalName() { return facade.getLegalName(formFields); },
    setLegalIdentifierType(value) { formFields = facade.setLegalIdentifierType(formFields, value); return editor; },
    getLegalIdentifierType() { return facade.getLegalIdentifierType(formFields); },
    setLegalIdentifierValue(value) { formFields = facade.setLegalIdentifierValue(formFields, value); return editor; },
    getLegalIdentifierValue() { return facade.getLegalIdentifierValue(formFields); },
    setTaxId(value) { formFields = facade.setTaxId(formFields, value); return editor; },
    getTaxId() { return facade.getTaxId(formFields); },
    setAddressCountry(value) { formFields = facade.setAddressCountry(formFields, value); return editor; },
    getAddressCountry() { return facade.getAddressCountry(formFields); },
    setControllerEmail(value) { formFields = facade.setControllerEmail(formFields, value); return editor; },
    getControllerEmail() { return facade.getControllerEmail(formFields); },
    setControllerRole(value) { formFields = facade.setControllerRole(formFields, value); return editor; },
    getControllerRole() { return facade.getControllerRole(formFields); },
    setServiceCategory(value) { formFields = facade.setServiceCategory(formFields, value); return editor; },
    getServiceCategory() { return facade.getServiceCategory(formFields); },
    setServiceIdentifier(value) { formFields = facade.setServiceIdentifier(formFields, value); return editor; },
    getServiceIdentifier() { return facade.getServiceIdentifier(formFields); },
    setServiceUrl(value) { formFields = facade.setServiceUrl(formFields, value); return editor; },
    getServiceUrl() { return facade.getServiceUrl(formFields); },
    setTenantAlias(value) { formFields = facade.setTenantAlias(formFields, value); return editor; },
    getTenantAlias() { return facade.getTenantAlias(formFields); },
    getFormFields() { return cloneFields(formFields); },
    buildClaims(options = {}) { return facade.buildClaims(formFields, options); },
    validate(options = {}) { return facade.validate(formFields, options); },
    buildDraft(options = {}) { return facade.buildDraft(formFields, options); },
    buildVerificationTransactionInput(input) { return facade.buildVerificationTransactionInput(formFields, input); },
    buildGatewayVerificationRequest(input) { return facade.buildGatewayVerificationRequest(formFields, input); },
    buildGatewayActivationRequest(input) { return facade.buildGatewayActivationRequest(formFields, input); },
  };

  return editor;
}

/**
 * Stateless helper API for building and validating the current
 * legal-organization onboarding draft.
 *
 * Use this surface when callers prefer immutable functions over the chainable
 * editor wrapper.
 */
export function createLegalOrganizationOnboardingFacade(): LegalOrganizationOnboardingFacade {
  const facade: Omit<LegalOrganizationOnboardingFacade, 'createEditor'> = {
    createDraft(initial = {}) {
      return cloneFields(initial);
    },

    setLegalName(fields, value) {
      return patchFields(fields, { legalName: normalizeText(value) });
    },

    getLegalName(fields) {
      return normalizeOptionalText(fields.legalName);
    },

    setLegalIdentifierType(fields, value) {
      return patchFields(fields, { legalIdentifierType: normalizeText(value) });
    },

    getLegalIdentifierType(fields) {
      return normalizeOptionalText(fields.legalIdentifierType);
    },

    setLegalIdentifierValue(fields, value) {
      return patchFields(fields, { legalIdentifierValue: normalizeText(value) });
    },

    getLegalIdentifierValue(fields) {
      return normalizeOptionalText(fields.legalIdentifierValue);
    },

    setTaxId(fields, value) {
      return patchFields(fields, { taxId: normalizeText(value) });
    },

    getTaxId(fields) {
      return normalizeOptionalText(fields.taxId);
    },

    setAddressCountry(fields, value) {
      return patchFields(fields, { addressCountry: normalizeText(value).toUpperCase() });
    },

    getAddressCountry(fields) {
      const value = normalizeOptionalText(fields.addressCountry);
      return value ? value.toUpperCase() : undefined;
    },

    setControllerEmail(fields, value) {
      return patchFields(fields, { controllerEmail: normalizeText(value).toLowerCase() });
    },

    getControllerEmail(fields) {
      const value = normalizeOptionalText(fields.controllerEmail);
      return value ? value.toLowerCase() : undefined;
    },

    setControllerRole(fields, value) {
      return patchFields(fields, { controllerRole: normalizeText(value) });
    },

    getControllerRole(fields) {
      return normalizeOptionalText(fields.controllerRole);
    },

    setServiceCategory(fields, value) {
      return patchFields(fields, { serviceCategory: normalizeText(value) });
    },

    getServiceCategory(fields) {
      return normalizeOptionalText(fields.serviceCategory);
    },

    setServiceIdentifier(fields, value) {
      return patchFields(fields, { serviceIdentifier: normalizeText(value) });
    },

    getServiceIdentifier(fields) {
      return normalizeOptionalText(fields.serviceIdentifier);
    },

    setServiceUrl(fields, value) {
      return patchFields(fields, { serviceUrl: normalizeText(value) });
    },

    getServiceUrl(fields) {
      return normalizeOptionalText(fields.serviceUrl);
    },

    setTenantAlias(fields, value) {
      return patchFields(fields, { tenantAlias: normalizeText(value) });
    },

    getTenantAlias(fields) {
      return normalizeOptionalText(fields.tenantAlias);
    },

    buildClaims(fields, options = {}) {
      const claims: Record<string, unknown> = {
        '@context': 'org.schema',
      };

      if (normalizeOptionalText(fields.legalName)) {
        claims[ClaimsOrganizationSchemaorg.legalName] = normalizeText(fields.legalName);
      }
      if (normalizeOptionalText(fields.legalIdentifierType)) {
        claims[ClaimsOrganizationSchemaorg.identifierType] = normalizeText(fields.legalIdentifierType);
      }
      if (normalizeOptionalText(fields.legalIdentifierValue)) {
        claims[ClaimsOrganizationSchemaorg.identifierValue] = normalizeText(fields.legalIdentifierValue);
      }
      if (normalizeOptionalText(fields.taxId)) {
        claims[ClaimsOrganizationSchemaorg.taxId] = normalizeText(fields.taxId);
      }
      if (normalizeOptionalText(fields.addressCountry)) {
        claims[ClaimsOrganizationSchemaorg.addressCountry] = normalizeText(fields.addressCountry).toUpperCase();
      }
      if (normalizeOptionalText(fields.controllerEmail)) {
        claims[ClaimsPersonSchemaorg.email] = normalizeText(fields.controllerEmail).toLowerCase();
      }
      if (normalizeOptionalText(fields.controllerRole)) {
        claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue] = normalizeText(fields.controllerRole);
      }
      if (normalizeOptionalText(fields.serviceCategory)) {
        claims[ClaimsServiceSchemaorg.category] = normalizeText(fields.serviceCategory);
      }
      if (normalizeOptionalText(fields.serviceIdentifier)) {
        claims[ClaimsServiceSchemaorg.identifier] = normalizeText(fields.serviceIdentifier);
      }
      if (normalizeOptionalText(fields.serviceUrl)) {
        claims[ClaimsServiceSchemaorg.url] = normalizeText(fields.serviceUrl);
      }
      if (normalizeOptionalText(fields.tenantAlias)) {
        claims[ClaimsOrganizationSchemaorg.alternateName] = normalizeText(fields.tenantAlias);
      }

      return validateLegalOrganizationOnboardingClaims(claims, options).normalizedClaims;
    },

    buildDraft(fields, options = {}) {
      const validation = facade.validate(fields, options);
      return {
        formFields: cloneFields(fields),
        claims: validation.normalizedClaims,
        validation,
      };
    },

    validate(fields, options = {}) {
      const issues: LegalOrganizationOnboardingValidationIssue[] = [];
      const normalizedClaims = facade.buildClaims(fields, options);
      const sharedValidation = validateLegalOrganizationOnboardingClaims(normalizedClaims, options);

      if (!normalizeOptionalText(fields.legalName)) {
        issues.push({
          severity: 'error',
          code: 'missing-legal-name',
          message: 'legalName is required for legal-organization onboarding.',
          field: 'legalName',
        });
      }
      if (!normalizeOptionalText(fields.legalIdentifierType)) {
        issues.push({
          severity: 'error',
          code: 'missing-legal-identifier-type',
          message: 'legalIdentifierType is required for legal-organization onboarding.',
          field: 'legalIdentifierType',
        });
      }
      if (!normalizeOptionalText(fields.addressCountry)) {
        issues.push({
          severity: 'error',
          code: 'missing-address-country',
          message: 'addressCountry is required for legal-organization onboarding.',
          field: 'addressCountry',
        });
      }
      if (!normalizeOptionalText(fields.controllerEmail)) {
        issues.push({
          severity: 'error',
          code: 'missing-controller-email',
          message: 'controllerEmail is required for legal-organization onboarding.',
          field: 'controllerEmail',
        });
      }
      if (!normalizeOptionalText(fields.serviceCategory)) {
        issues.push({
          severity: 'error',
          code: 'missing-service-category',
          message: 'serviceCategory is required for legal-organization onboarding.',
          field: 'serviceCategory',
        });
      }
      if (!normalizeOptionalText(fields.controllerRole)) {
        issues.push({
          severity: 'warning',
          code: 'missing-controller-role',
          message: 'controllerRole is recommended so the onboarding example stays aligned with representative-role flows.',
          field: 'controllerRole',
        });
      }
      if (!normalizeOptionalText(fields.serviceUrl)) {
        issues.push({
          severity: 'warning',
          code: 'missing-service-url',
          message: 'serviceUrl is recommended when the same draft later feeds tenant activation/publication examples.',
          field: 'serviceUrl',
        });
      }

      for (const error of sharedValidation.errors) {
        issues.push({
          severity: 'error',
          code: error.code.toLowerCase(),
          message: error.message,
          field: error.claimPaths[0] || 'claims',
        });
      }

      return toValidationResult(sharedValidation.normalizedClaims, issues);
    },

    buildVerificationTransactionInput(fields, input) {
      return {
        claims: facade.buildClaims(fields, input.validationOptions),
        controller: input.controller,
        ...(input.organization ? { organization: input.organization } : {}),
        ...(input.legalRepresentativePayload
          ? { legalRepresentativePayload: input.legalRepresentativePayload }
          : {}),
        ...(input.verification ? { verification: input.verification } : {}),
        ...(Array.isArray(input.attachments) ? { attachments: input.attachments } : {}),
      };
    },

    buildGatewayVerificationRequest(fields, input) {
      const controllerEmail = facade.getControllerEmail(fields);
      const serviceIdentifier = facade.getServiceIdentifier(fields);
      const serviceUrl = facade.getServiceUrl(fields);
      const signatureFlow = normalizeText(input.signatureFlow || 'certificate').toLowerCase();
      const representativeSameAs = normalizeOptionalText(input.representativeSameAs || controllerEmail);
      const signedTermsPdfUrl = normalizeOptionalText(input.signedTermsPdfUrl);

      return facade.buildVerificationTransactionInput(fields, {
        controller: input.controller,
        organization: serviceIdentifier || serviceUrl
          ? {
              ...(serviceIdentifier ? { did: serviceIdentifier } : {}),
              ...(serviceUrl ? { url: serviceUrl } : {}),
            }
          : undefined,
        legalRepresentativePayload: signatureFlow === 'otp'
          ? {
              ...(controllerEmail ? { email: controllerEmail } : {}),
              ...(representativeSameAs ? { sameAs: representativeSameAs } : {}),
            }
          : controllerEmail
            ? { email: controllerEmail }
            : undefined,
        verification: {
          resourceType: normalizeOptionalText(input.verificationResourceType) || 'contract',
        },
        attachments: signatureFlow === 'otp' || !signedTermsPdfUrl
          ? undefined
          : [{
              id: normalizeOptionalText(input.signedTermsAttachmentId) || 'signed-terms-pdf-001',
              media_type: 'application/pdf',
              data: {
                links: [signedTermsPdfUrl],
              },
            }],
        validationOptions: input.validationOptions,
      });
    },

    buildGatewayActivationRequest(fields, input) {
      const serviceUrl = facade.getServiceUrl(fields);
      const capabilities = normalizeCapabilityList(input.serviceCapabilities);
      const draft = facade.buildDraft(fields, input.validationOptions);
      const additionalClaims = {
        ...draft.claims,
        ...(input.additionalClaims || {}),
      };

      return {
        vpToken: normalizeText(input.vpToken),
        ...(input.controller ? { controller: input.controller } : {}),
        ...((serviceUrl || capabilities.length > 0)
          ? {
              service: {
                ...(serviceUrl ? { url: serviceUrl } : {}),
                ...(capabilities.length > 0 ? { capabilities } : {}),
              },
            }
          : {}),
        ...(Object.keys(additionalClaims).length > 0 ? { additionalClaims } : {}),
      };
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
 * Creates the chainable editor used in legal-organization onboarding 101
 * flows.
 */
export function createLegalOrganizationOnboardingEditor(
  initial: LegalOrganizationFormTemplateFields = {},
): LegalOrganizationOnboardingEditor {
  return createLegalOrganizationOnboardingFacade().createEditor(initial);
}
