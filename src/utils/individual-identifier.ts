import {
  HL7_V2_0203_REVERSE_DNS_PREFIX,
  HL7_V2_0203_REVERSE_DNS_TYPES,
  type Hl7V20203IdentifierCode,
  type IdKindValue,
} from '../constants/identity-identifiers.js';
import { buildRawCidV1FromUtf8String } from './multiformat-profile.js';
import { encodeMultibaseSha3 } from './multibasehash.js';
import { UrnPrefixes } from '../constants/urn.js';

const LEGACY_HL7_V2_0203_REVERSE_DNS_PREFIX = 'org.hl7.terminology.codesystem.v2-0203';
const ISO_3166_JURISDICTION_PATTERN = /^[A-Z]{2}(?:-[A-Z0-9]{1,3})?$/;

export type IndividualIdentifierInput = Readonly<{
  type: Hl7V20203IdentifierCode | IdKindValue | string;
  jurisdiction: string;
  value: string;
}>;

/** Validates an optional FHIR Identifier.period expressed as ISO date strings. */
export function assertIndividualIdentifierPeriod(periodStart?: string, periodEnd?: string): void {
  const start = normalizeOptionalIsoDate(periodStart, 'periodStart');
  const end = normalizeOptionalIsoDate(periodEnd, 'periodEnd');
  if (start && end && start > end) {
    throw new Error('Individual identifier periodStart must not be after periodEnd');
  }
}

function normalizeOptionalIsoDate(value: string | undefined, field: string): string | undefined {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized) || Number.isNaN(Date.parse(`${normalized}T00:00:00.000Z`))) {
    throw new Error(`Invalid ISO date for ${field}: ${value}`);
  }
  return normalized;
}

/** Resolves a supported short or reverse-DNS HL7 identifier type to one canonical type. */
export function normalizeIndividualIdentifierType(type: IndividualIdentifierInput['type']): IdKindValue {
  const candidate = String(type).trim();
  const shortCode = candidate.startsWith(`${HL7_V2_0203_REVERSE_DNS_PREFIX}.`)
    ? candidate.slice(HL7_V2_0203_REVERSE_DNS_PREFIX.length + 1)
    : candidate.startsWith(`${LEGACY_HL7_V2_0203_REVERSE_DNS_PREFIX}.`)
      ? candidate.slice(LEGACY_HL7_V2_0203_REVERSE_DNS_PREFIX.length + 1)
      : candidate;
  const canonical = HL7_V2_0203_REVERSE_DNS_TYPES[shortCode as Hl7V20203IdentifierCode];
  if (!canonical) throw new Error(`Unsupported individual identifier type: ${candidate}`);
  return canonical;
}

/** Builds the sole canonical input hashed for an external individual identifier alias. */
export function buildIndividualIdentifierToken(input: IndividualIdentifierInput): string {
  const type = normalizeIndividualIdentifierType(input.type);
  const jurisdiction = input.jurisdiction.trim().toUpperCase();
  const value = input.value.trim().normalize('NFKC').toUpperCase();
  if (!ISO_3166_JURISDICTION_PATTERN.test(jurisdiction)) {
    throw new Error(`Invalid ISO 3166 jurisdiction: ${input.jurisdiction}`);
  }
  if (!value) throw new Error('Individual identifier value is required');
  return `${type}|${jurisdiction}|${value}`;
}

/** Returns the deterministic CIDv1/SHA3-384 alias stored in `Organization.sameAs`. */
export function buildIndividualIdentifierCid(input: IndividualIdentifierInput): string {
  return buildRawCidV1FromUtf8String(buildIndividualIdentifierToken(input));
}

/** Returns the SHA3-384 multihash URN used as a ledger lookup asset id. */
export function buildIndividualIdentifierLedgerAssetId(input: IndividualIdentifierInput): string {
  return `${UrnPrefixes.Multibase}${encodeMultibaseSha3(buildIndividualIdentifierToken(input))}`;
}
