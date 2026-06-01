// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types.js';
import type { BundleEntry, BundleJsonApi } from '../models/bundle.js';
import { ClaimConsent } from '../models/consent-rule.js';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims.js';
import { MedicationStatementClaim } from '../models/interoperable-claims/medication-statement-claims.js';

const CONSENT_ACTOR_REFERENCE_CLAIM = 'Consent.actor-reference';
const GENERIC_CREATOR_CLAIM_SUFFIX = '.creator';
const GENERIC_PERFORMER_CLAIM_SUFFIX = '.performer';
const GENERIC_ASSERTER_CLAIM_SUFFIX = '.asserter';

export type ClinicalViewClaims = Record<string, unknown>;

export type ClinicalActorType =
  | 'actor'
  | 'actor-reference'
  | 'recipient'
  | 'sender'
  | 'source'
  | 'creator'
  | 'performer'
  | 'asserter'
  | 'subject'
  | 'unknown';

export type ClinicalResourceActorView = Readonly<{
  identifier: string;
  role?: string;
  type: ClinicalActorType;
}>;

export type ClinicalResourceCommonView = Readonly<{
  title: string;
  resourceType: string;
  identifier?: string;
  date?: string;
  periodStart?: string;
  periodEnd?: string;
  fullUrl?: string;
  actors: ClinicalResourceActorView[];
  claims: ClinicalViewClaims;
}>;

export type ClinicalResourceCardView = Readonly<{
  title: string;
  resourceType: string;
  date?: string;
  fullUrl?: string;
  actorsCount: number;
}>;

export type ClinicalResourceExpandedView = Readonly<{
  common: ClinicalResourceCommonView;
  xhtml?: string;
  notes: string[];
}>;

/**
 * Maps one bundle entry to a UI-friendly common clinical view contract.
 */
export function toClinicalResourceCommonView(entry: BundleEntry): ClinicalResourceCommonView {
  const claims = readClaims(entry);
  const resourceType = resolveResourceType(entry, claims);
  const title = resolveTitle(resourceType, claims);

  return {
    title,
    resourceType,
    identifier: resolveIdentifier(resourceType, claims),
    date: resolveDate(resourceType, claims),
    periodStart: resolvePeriodStart(resourceType, claims),
    periodEnd: resolvePeriodEnd(resourceType, claims),
    fullUrl: trimValue(entry.fullUrl),
    actors: resolveActors(resourceType, claims),
    claims,
  };
}

/**
 * Maps all entries from a Bundle into common clinical views.
 */
export function toClinicalResourceCommonViews(bundle: BundleJsonApi<BundleEntry>): ClinicalResourceCommonView[] {
  return Array.isArray(bundle?.data)
    ? bundle.data.map((entry) => toClinicalResourceCommonView(entry))
    : [];
}

/**
 * Maps one bundle entry to a minimal card view for section counters/list cards.
 */
export function toClinicalResourceCardView(entry: BundleEntry): ClinicalResourceCardView {
  const common = toClinicalResourceCommonView(entry);
  return {
    title: common.title,
    resourceType: common.resourceType,
    date: common.date,
    fullUrl: common.fullUrl,
    actorsCount: common.actors.length,
  };
}

/**
 * Maps all entries from a Bundle into minimal card views.
 */
export function toClinicalResourceCardViews(bundle: BundleJsonApi<BundleEntry>): ClinicalResourceCardView[] {
  return Array.isArray(bundle?.data)
    ? bundle.data.map((entry) => toClinicalResourceCardView(entry))
    : [];
}

/**
 * Maps one bundle entry to an expanded view that includes XHTML and notes array.
 */
export function toClinicalResourceExpandedView(entry: BundleEntry): ClinicalResourceExpandedView {
  const common = toClinicalResourceCommonView(entry);
  return {
    common,
    xhtml: resolveXhtml(entry, common.claims),
    notes: resolveNotes(entry, common.resourceType, common.claims),
  };
}

/**
 * Maps all entries from a Bundle into expanded views.
 */
export function toClinicalResourceExpandedViews(bundle: BundleJsonApi<BundleEntry>): ClinicalResourceExpandedView[] {
  return Array.isArray(bundle?.data)
    ? bundle.data.map((entry) => toClinicalResourceExpandedView(entry))
    : [];
}

function readClaims(entry: BundleEntry): ClinicalViewClaims {
  const resourceClaims = asRecord(entry?.resource?.meta?.claims);
  const legacyClaims = asRecord(entry?.meta?.claims);
  return {
    ...legacyClaims,
    ...resourceClaims,
  };
}

function resolveResourceType(entry: BundleEntry, claims: ClinicalViewClaims): string {
  const fromClaim = trimValue(claims[ClaimConsent.resourceType]);
  if (fromClaim) {
    return fromClaim;
  }

  const fromResource = trimValue(entry?.resource?.resourceType);
  if (fromResource) {
    return fromResource;
  }

  return 'Unknown';
}

function resolveTitle(resourceType: string, claims: ClinicalViewClaims): string {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return (
      trimValue(claims[CommunicationClaim.ContentAttachmentTitle])
      || trimValue(claims[CommunicationClaim.Text])
      || trimValue(claims[CommunicationClaim.NoteText])
      || resourceType
    );
  }

  if (resourceType === ResourceTypesFhirR4.Consent) {
    const firstCategory = splitCsv(claims[ClaimConsent.category])[0];
    const firstAction = splitCsv(claims[ClaimConsent.action])[0];
    const firstPurpose = splitCsv(claims[ClaimConsent.purpose])[0];
    return firstCategory || firstAction || firstPurpose || resourceType;
  }

  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    const text = trimValue(claims[MedicationStatementClaim.MedicationText]);
    const firstCode = splitCsv(claims[MedicationStatementClaim.Code])[0];
    return text || firstCode || resourceType;
  }

  return resourceType;
}

function resolveIdentifier(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return trimValue(claims[CommunicationClaim.Identifier]);
  }
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.identifier]);
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return trimValue(claims[MedicationStatementClaim.Identifier]);
  }
  return undefined;
}

function resolveDate(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Communication) {
    return trimValue(claims[CommunicationClaim.Sent]);
  }
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.date]);
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    return trimValue(claims[MedicationStatementClaim.Effective]);
  }

  const genericDate = findBySuffix(claims, '.date');
  return genericDate || undefined;
}

function resolvePeriodStart(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.periodStart]);
  }
  return findBySuffix(claims, '.period-start') || undefined;
}

function resolvePeriodEnd(resourceType: string, claims: ClinicalViewClaims): string | undefined {
  if (resourceType === ResourceTypesFhirR4.Consent) {
    return trimValue(claims[ClaimConsent.periodEnd]);
  }
  return findBySuffix(claims, '.period-end') || undefined;
}

function resolveActors(resourceType: string, claims: ClinicalViewClaims): ClinicalResourceActorView[] {
  const out: ClinicalResourceActorView[] = [];

  if (resourceType === ResourceTypesFhirR4.Consent) {
    const identifiers = splitCsv(claims[ClaimConsent.actorIdentifier]);
    const roles = splitCsv(claims[ClaimConsent.actorRole]);
    const references = splitCsv(claims[CONSENT_ACTOR_REFERENCE_CLAIM]);

    identifiers.forEach((identifier, index) => {
      pushActor(out, {
        identifier,
        role: roles[index] || roles[0],
        type: 'actor',
      });
    });

    references.forEach((identifier, index) => {
      pushActor(out, {
        identifier,
        role: roles[index] || roles[0],
        type: 'actor-reference',
      });
    });
  }

  if (resourceType === ResourceTypesFhirR4.Communication) {
    splitCsv(claims[CommunicationClaim.Sender]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'sender' });
    });

    splitCsv(claims[CommunicationClaim.Recipient]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'recipient' });
    });
  }

  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    splitCsv(claims[MedicationStatementClaim.Source]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'source' });
    });

    splitCsv(claims[MedicationStatementClaim.Subject]).forEach((identifier) => {
      pushActor(out, { identifier, type: 'subject' });
    });
  }

  appendGenericActorType(out, claims, GENERIC_CREATOR_CLAIM_SUFFIX, 'creator');
  appendGenericActorType(out, claims, GENERIC_PERFORMER_CLAIM_SUFFIX, 'performer');
  appendGenericActorType(out, claims, GENERIC_ASSERTER_CLAIM_SUFFIX, 'asserter');

  return out;
}

function resolveXhtml(entry: BundleEntry, claims: ClinicalViewClaims): string | undefined {
  const fromFhirNarrative = trimValue(asRecord(entry?.resource?.text).div);
  if (fromFhirNarrative) {
    return fromFhirNarrative;
  }

  const fromSpecificClaim = findBySuffix(claims, '.xhtml')
    || findBySuffix(claims, '.text-div');
  return fromSpecificClaim || undefined;
}

function resolveNotes(entry: BundleEntry, resourceType: string, claims: ClinicalViewClaims): string[] {
  const notesFromResource = readFhirNoteArray(entry);
  const notesFromClaims = readNotesFromClaims(resourceType, claims);
  return uniqueTokens([...notesFromResource, ...notesFromClaims]);
}

function readFhirNoteArray(entry: BundleEntry): string[] {
  const rawNotes = entry?.resource?.note;
  if (!Array.isArray(rawNotes)) {
    return [];
  }

  return uniqueTokens(
    rawNotes
      .map((item) => trimValue(asRecord(item).text))
      .filter(Boolean),
  );
}

function readNotesFromClaims(resourceType: string, claims: ClinicalViewClaims): string[] {
  const out: string[] = [];

  if (resourceType === ResourceTypesFhirR4.Communication) {
    out.push(...splitCsv(claims[CommunicationClaim.NoteText]));
  }
  if (resourceType === ResourceTypesFhirR4.MedicationStatement) {
    out.push(...splitCsv(claims[MedicationStatementClaim.Note]));
  }

  for (const [key, value] of Object.entries(claims)) {
    if (String(key || '').toLowerCase().endsWith('.note')) {
      out.push(...splitCsv(value));
    }
  }

  return uniqueTokens(out);
}

function appendGenericActorType(
  out: ClinicalResourceActorView[],
  claims: ClinicalViewClaims,
  keySuffix: string,
  actorType: ClinicalActorType,
): void {
  for (const [key, value] of Object.entries(claims)) {
    if (!String(key || '').toLowerCase().endsWith(keySuffix)) {
      continue;
    }
    splitCsv(value).forEach((identifier) => {
      pushActor(out, {
        identifier,
        type: actorType,
      });
    });
  }
}

function findBySuffix(claims: ClinicalViewClaims, keySuffix: string): string | undefined {
  for (const [key, value] of Object.entries(claims)) {
    if (String(key || '').toLowerCase().endsWith(keySuffix)) {
      const normalized = trimValue(value);
      if (normalized) {
        return normalized;
      }
    }
  }
  return undefined;
}

function pushActor(out: ClinicalResourceActorView[], actor: ClinicalResourceActorView): void {
  const identifier = trimValue(actor.identifier);
  if (!identifier) {
    return;
  }

  const role = trimValue(actor.role);
  const candidate: ClinicalResourceActorView = {
    identifier,
    role: role || undefined,
    type: actor.type,
  };

  const dedupeKey = `${candidate.type}|${candidate.identifier}|${candidate.role || ''}`;
  const exists = out.some((item) => `${item.type}|${item.identifier}|${item.role || ''}` === dedupeKey);
  if (!exists) {
    out.push(candidate);
  }
}

function splitCsv(value: unknown): string[] {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueTokens(values: readonly string[]): string[] {
  return [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))];
}

function trimValue(value: unknown): string {
  return String(value || '').trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}