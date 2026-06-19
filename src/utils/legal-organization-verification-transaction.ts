import type { BundleJsonApi } from '../models/bundle';
import type { ClaimsRecord } from '../models/resource-document';
import { ClaimsServiceSchemaorg } from '../constants/schemaorg';

/**
 * Canonical business entry type for the first host-side onboarding step that
 * asks GW CORE to forward a legal-organization verification request to ICA.
 *
 * Responsibilities of this transaction:
 * - carry the signed PDF evidence or PDF URL attachment
 * - carry the controller business binding key
 * - optionally carry the organization VC-signing public key chosen by the host
 * - carry the legal organization claims that GW CORE should keep through the
 *   verification/onboarding pipeline
 *
 * Non-responsibilities:
 * - it is not the same thing as host `_activate`
 * - it does not model Fabric/CSR enrollment
 */
export const LegalOrganizationVerificationTransactionEntryTypes = Object.freeze({
  Request: 'Organization-verification-transaction-request-v1.0',
  Response: 'Organization-verification-transaction-response-v1.0',
} as const);

export type LegalOrganizationVerificationTransactionEntryType =
  typeof LegalOrganizationVerificationTransactionEntryTypes[keyof typeof LegalOrganizationVerificationTransactionEntryTypes];

/**
 * Explicit controller binding material that ICA should project into the legal
 * representative VC.
 */
export type LegalOrganizationVerificationTransactionController = Readonly<{
  did?: string;
  sameAs?: string;
  publicKeyJwk?: Record<string, unknown>;
  jwks?: { keys: Array<Record<string, unknown>> };
}>;

/**
 * Optional organization-side public key material that the hosting operator may
 * already know before the final activation/publication step.
 */
export type LegalOrganizationVerificationTransactionOrganization = Readonly<{
  did?: string;
  url?: string;
  publicKeyJwk?: Record<string, unknown>;
  jwks?: { keys: Array<Record<string, unknown>> };
}>;

/**
 * Additional legal-representative payload fields forwarded to ICA `_verify`.
 *
 * These values help ICA derive `sameAs` when the signed document itself does
 * not expose that contact value in a directly reusable way.
 */
export type LegalOrganizationVerificationRepresentativePayload = Readonly<{
  email?: string;
  sameAs?: string;
}>;

/**
 * Optional verification routing hints for ICA.
 *
 * `resourceType` defaults to `contract`, which matches the current
 * legal-organization terms flow in ICA.
 */
export type LegalOrganizationVerificationRouting = Readonly<{
  resourceType?: string;
}>;

/**
 * Canonical input accepted by shared SDK/GW helpers when building the first
 * host onboarding transaction that wraps an ICA `_verify` request.
 */
export type LegalOrganizationVerificationTransactionInput = Readonly<{
  claims: ClaimsRecord;
  controller: LegalOrganizationVerificationTransactionController;
  organization?: LegalOrganizationVerificationTransactionOrganization;
  legalRepresentativePayload?: LegalOrganizationVerificationRepresentativePayload;
  verification?: LegalOrganizationVerificationRouting;
  attachments?: unknown[];
}>;

export type LegalOrganizationVerificationTransactionEntry = Readonly<{
  type?: string;
  meta?: {
    claims?: ClaimsRecord;
    [key: string]: unknown;
  };
  resource?: {
    controller?: LegalOrganizationVerificationTransactionController;
    organization?: LegalOrganizationVerificationTransactionOrganization;
    legalRepresentativePayload?: LegalOrganizationVerificationRepresentativePayload;
    legalRepresentative?: LegalOrganizationVerificationRepresentativePayload;
    verification?: LegalOrganizationVerificationRouting;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}>;

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

/**
 * Builds the canonical Bundle payload for host-side legal organization
 * verification transactions.
 *
 * Contract notes:
 * - business claims remain in `meta.claims`
 * - controller binding material remains in `resource.controller.*`
 * - organization signing material remains in `resource.organization.*`
 * - PDF evidence or URL attachments stay at the DIDComm-message level
 * - `Service.category` is the canonical business-sector input later used by GW
 *   to target the appropriate ICA verification route
 */
export function buildLegalOrganizationVerificationTransactionBundle(
  input: LegalOrganizationVerificationTransactionInput,
): BundleJsonApi {
  const businessSector = normalizeText(input.claims?.[ClaimsServiceSchemaorg.category]);
  if (!businessSector) {
    throw new Error(
      `buildLegalOrganizationVerificationTransactionBundle requires ${ClaimsServiceSchemaorg.category}.`,
    );
  }

  return {
    resourceType: 'Bundle',
    type: 'collection',
    total: 1,
    data: [{
      type: LegalOrganizationVerificationTransactionEntryTypes.Request,
      meta: {
        claims: input.claims,
      },
      resource: {
        controller: input.controller,
        ...(input.organization ? { organization: input.organization } : {}),
        ...(input.legalRepresentativePayload
          ? { legalRepresentativePayload: input.legalRepresentativePayload }
          : {}),
        verification: {
          resourceType: normalizeText(input.verification?.resourceType) || 'contract',
        },
      },
    }],
    ...(Array.isArray(input.attachments) && input.attachments.length > 0
      ? { attachments: input.attachments }
      : {}),
  } as BundleJsonApi;
}

/**
 * Returns the first bundle entry when the payload matches the canonical
 * legal-organization verification transaction shape.
 *
 * This helper accepts either:
 * - the raw bundle itself
 * - or a DIDComm/API wrapper object whose `body` contains that bundle
 */
export function getFirstLegalOrganizationVerificationTransactionEntry(
  value: unknown,
): LegalOrganizationVerificationTransactionEntry | undefined {
  const root = asRecord(value);
  const bundle = asRecord(root?.body) || root;
  const data = Array.isArray(bundle?.data) ? bundle.data : [];
  const first = data[0];
  return asRecord(first) as LegalOrganizationVerificationTransactionEntry | undefined;
}

/**
 * Returns the normalized controller binding payload from the first legal
 * organization verification transaction entry when present.
 */
export function getLegalOrganizationVerificationController(
  value: unknown,
): LegalOrganizationVerificationTransactionController | undefined {
  const entry = getFirstLegalOrganizationVerificationTransactionEntry(value);
  const controller = asRecord(entry?.resource?.controller);
  return controller
    ? controller as LegalOrganizationVerificationTransactionController
    : undefined;
}

/**
 * Returns the normalized legal representative contact payload from the first
 * legal-organization verification transaction entry when present.
 *
 * Compatibility note:
 * - GW/SDK request builders use `resource.legalRepresentativePayload`
 * - the ICA forwarding payload currently uses `resource.legalRepresentative`
 * - this helper intentionally accepts both shapes
 */
export function getLegalOrganizationVerificationRepresentativePayload(
  value: unknown,
): LegalOrganizationVerificationRepresentativePayload | undefined {
  const entry = getFirstLegalOrganizationVerificationTransactionEntry(value);
  const candidate = asRecord(entry?.resource?.legalRepresentativePayload)
    || asRecord(entry?.resource?.legalRepresentative);
  if (!candidate) return undefined;

  const email = normalizeText(candidate.email);
  const sameAs = normalizeText(candidate.sameAs);
  return {
    ...(email ? { email } : {}),
    ...(sameAs ? { sameAs } : {}),
  };
}
