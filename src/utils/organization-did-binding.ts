import type { BundleJsonApi } from '../models/bundle';

export const OrganizationDidBindingEntryTypes = Object.freeze({
  Request: 'Organization-did-binding-request-v1.0',
  Response: 'Organization-did-binding-response-v1.0',
} as const);

export type OrganizationDidBindingErrorCode =
  | 'MISSING_ORGANIZATION_URL'
  | 'UNSUPPORTED_ORGANIZATION_LOCATOR';

export type OrganizationDidBindingValidationError = Readonly<{
  code: OrganizationDidBindingErrorCode;
  message: string;
  claimPaths: string[];
}>;

export type OrganizationDidBindingControllerInput = Readonly<{
  sameAs?: string;
}>;

export type OrganizationDidBindingOrganizationInput = Readonly<{
  url: string | string[];
  taxID?: string;
  taxId?: string;
  identifier?: string;
}>;

export type OrganizationDidBindingInput = Readonly<{
  organization: OrganizationDidBindingOrganizationInput;
  controller?: OrganizationDidBindingControllerInput;
}>;

export type ValidateOrganizationDidBindingInputResult = Readonly<{
  ok: boolean;
  errors: OrganizationDidBindingValidationError[];
  normalizedInput: Readonly<{
    organization: {
      url: string[];
    };
    controller?: OrganizationDidBindingControllerInput;
  }>;
}>;

function normalizeOptionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function normalizeOrganizationUrls(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const urls = value
      .map((item) => normalizeOptionalText(item))
      .filter((item): item is string => Boolean(item));
    return urls.length ? urls : undefined;
  }
  const raw = normalizeOptionalText(value);
  if (!raw) return undefined;
  const urls = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return urls.length ? urls : undefined;
}

/**
 * Validates the tenant-scoped organization DID binding request.
 *
 * Canonical contract:
 * - the organization is already identified by the tenant path in GW CORE
 * - callers send one or more public aliases in `organization.url`
 * - `controller.sameAs` is optional additional evidence, not a new key-binding
 *   bootstrap step
 *
 * Current version limits:
 * - no `taxID` / `identifier` locator is required
 * - sending those legacy locator fields is rejected so callers do not mix path
 *   identity with payload identity
 */
export function validateOrganizationDidBindingInput(
  input: OrganizationDidBindingInput,
): ValidateOrganizationDidBindingInputResult {
  const errors: OrganizationDidBindingValidationError[] = [];
  const normalizedUrls = normalizeOrganizationUrls(input?.organization?.url);
  const taxID = normalizeOptionalText(input?.organization?.taxID || input?.organization?.taxId);
  const identifier = normalizeOptionalText(input?.organization?.identifier);
  const controllerSameAs = normalizeOptionalText(input?.controller?.sameAs);

  if (!normalizedUrls?.length) {
    errors.push({
      code: 'MISSING_ORGANIZATION_URL',
      message: 'Organization DID binding requires at least one organization.url value.',
      claimPaths: ['organization.url'],
    });
  }

  if (taxID || identifier) {
    errors.push({
      code: 'UNSUPPORTED_ORGANIZATION_LOCATOR',
      message: 'Organization DID binding in GW CORE uses the tenant path as locator and does not accept organization.taxID or organization.identifier in this version.',
      claimPaths: ['organization.taxID', 'organization.identifier'],
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    normalizedInput: {
      organization: {
        url: normalizedUrls || [],
      },
      ...(controllerSameAs ? { controller: { sameAs: controllerSameAs } } : {}),
    },
  };
}

/**
 * Builds the canonical bundle payload for one tenant-scoped DID binding
 * request.
 *
 * Result contract:
 * - `resource.organization.url` carries the public alias replacement list
 * - `resource.controller.sameAs` is optional corroborating identity material
 * - organization identity is resolved from the tenant path, not from payload
 *   locators
 */
export function buildOrganizationDidBindingBundle(
  input: OrganizationDidBindingInput,
): BundleJsonApi {
  const validation = validateOrganizationDidBindingInput(input);
  if (!validation.ok) {
    throw new Error(validation.errors.map((item) => item.message).join(' '));
  }

  return {
    resourceType: 'Bundle',
    type: 'collection',
    total: 1,
    data: [{
      type: OrganizationDidBindingEntryTypes.Request,
      resource: {
        organization: {
          url: validation.normalizedInput.organization.url,
        },
        ...(validation.normalizedInput.controller
          ? { controller: validation.normalizedInput.controller }
          : {}),
      },
    }],
  } as BundleJsonApi;
}
