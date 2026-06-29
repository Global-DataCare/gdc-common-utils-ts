import { ClaimsOfferSchemaorg, ClaimsOrderSchemaorg } from '../constants/schemaorg';

/**
 * Canonical GW CORE onboarding/reissue flow identifiers for commercial
 * expectations.
 *
 * These identifiers are intentionally flow-level, not transport-level:
 * - they describe whether one GW response is expected to mint a commercial
 *   Offer and whether a follow-up `Order/_batch` step is part of the contract
 * - they do not describe how the caller reached the flow (PDF, ICA proof,
 *   signed bundle, SDK facade, etc.)
 */
export const GwCoreCommercialFlow = Object.freeze({
  LegalOrganizationTransaction: 'legal-organization-transaction',
  LegalOrganizationActivateLegacy: 'legal-organization-activate-legacy',
  LegalOrganizationIssueReissue: 'legal-organization-issue-reissue',
  IndividualOrganizationCommercial: 'individual-organization-commercial',
  IndividualOrganizationEmbeddedRegistration: 'individual-organization-embedded-registration',
} as const);

export type GwCoreCommercialFlow =
  typeof GwCoreCommercialFlow[keyof typeof GwCoreCommercialFlow];

export type GwCoreCommercialContract = Readonly<{
  flow: GwCoreCommercialFlow;
  mintsOffer: boolean;
  requiresOrderConfirmation: boolean;
  offerClaim?: typeof ClaimsOfferSchemaorg.identifier;
  orderClaim?: typeof ClaimsOrderSchemaorg.acceptedOfferIdentifier;
  programmingHint: string;
}>;

/**
 * Shared commercial contract table for the GW CORE onboarding/reissue flows
 * that currently matter to SDKs, BFFs and route-level tests.
 *
 * Reading guide:
 * - `mintsOffer=true` means the response is expected to expose the canonical
 *   commercial claim in `meta.claims['org.schema.Offer.identifier']`
 * - `requiresOrderConfirmation=true` means the caller must later submit
 *   `Order.acceptedOffer.identifier` through `Order/_batch`
 * - `mintsOffer=false` means the flow is not expected to create a new
 *   commercial Offer, even if it returns activation material or other claims
 */
export const GW_CORE_COMMERCIAL_CONTRACTS: Readonly<Record<GwCoreCommercialFlow, GwCoreCommercialContract>> = Object.freeze({
  [GwCoreCommercialFlow.LegalOrganizationTransaction]: {
    flow: GwCoreCommercialFlow.LegalOrganizationTransaction,
    mintsOffer: true,
    requiresOrderConfirmation: true,
    offerClaim: ClaimsOfferSchemaorg.identifier,
    orderClaim: ClaimsOrderSchemaorg.acceptedOfferIdentifier,
    programmingHint: 'Use this for first-time legal organization onboarding; read meta.claims[org.schema.Offer.identifier] and then confirm Order/_batch.',
  },
  [GwCoreCommercialFlow.LegalOrganizationActivateLegacy]: {
    flow: GwCoreCommercialFlow.LegalOrganizationActivateLegacy,
    mintsOffer: true,
    requiresOrderConfirmation: true,
    offerClaim: ClaimsOfferSchemaorg.identifier,
    orderClaim: ClaimsOrderSchemaorg.acceptedOfferIdentifier,
    programmingHint: 'Legacy ICA-proof activation still mints one commercial Offer and still requires Order/_batch confirmation.',
  },
  [GwCoreCommercialFlow.LegalOrganizationIssueReissue]: {
    flow: GwCoreCommercialFlow.LegalOrganizationIssueReissue,
    mintsOffer: false,
    requiresOrderConfirmation: false,
    programmingHint: 'Use this only to reissue controller activation material for an already existing tenant; do not expect a new Offer or Order step.',
  },
  [GwCoreCommercialFlow.IndividualOrganizationCommercial]: {
    flow: GwCoreCommercialFlow.IndividualOrganizationCommercial,
    mintsOffer: true,
    requiresOrderConfirmation: true,
    offerClaim: ClaimsOfferSchemaorg.identifier,
    orderClaim: ClaimsOrderSchemaorg.acceptedOfferIdentifier,
    programmingHint: 'Use this for the family/individual commercial bootstrap facade that returns one Offer and then requires Order/_batch.',
  },
  [GwCoreCommercialFlow.IndividualOrganizationEmbeddedRegistration]: {
    flow: GwCoreCommercialFlow.IndividualOrganizationEmbeddedRegistration,
    mintsOffer: false,
    requiresOrderConfirmation: false,
    programmingHint: 'Use this only for embedded legacy subject registration inside an already active tenant; it signals status but does not mint a commercial Offer.',
  },
});

export function readGwCoreCommercialContract(
  flow: GwCoreCommercialFlow,
): GwCoreCommercialContract {
  return GW_CORE_COMMERCIAL_CONTRACTS[flow];
}
