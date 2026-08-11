import { normalizePhone } from './consent.js';
import { normalizeSameAsHash, normalizeTelephoneHash } from './same-as.js';

export type StableActorContactKind = 'email' | 'phone';

/**
 * Builds the private, stable actor identifier shared by independent portals.
 *
 * Wire format: `urn:multibase:<multibase(multihash(SHA3-256, normalized-contact))>`.
 * The clear email/phone and the actor role are never embedded. ISCO-08 or
 * FHIR v3 roles are persisted separately in `Person.hasOccupation` and may be
 * represented separately in an employee/member DID.
 *
 * Email is trimmed, stripped of `mailto:` and lower-cased. Phone is stripped
 * of `tel:` and formatting while preserving an E.164 leading `+`.
 */
export function buildStableActorIdentifier(input: {
  contactKind: StableActorContactKind;
  contact: string;
}): string {
  const rawContact = String(input.contact || '').trim();
  const normalizedContact = input.contactKind === 'email'
    ? rawContact.replace(/^mailto:/i, '').replace(/\s+/g, '').toLowerCase()
    : normalizePhone(rawContact.replace(/^tel:/i, ''));
  if (!normalizedContact) {
    throw new Error(`Stable actor ${input.contactKind} is required.`);
  }

  return input.contactKind === 'email'
    ? normalizeSameAsHash(normalizedContact)
    : normalizeTelephoneHash(normalizedContact);
}

/**
 * Builds a portal-specific employee DID binding. The stable actor payload and
 * the canonical ISCO-08/FHIR-v3 role remain distinct path components.
 *
 * @deprecated Use `buildProfessionalDidWeb` for organization employees.
 */
export function buildPortalActorDidWeb(input: {
  portalDidWeb: string;
  actorIdentifier: string;
  role: string;
}): string {
  const portalDidWeb = String(input.portalDidWeb || '').trim();
  const match = /^urn:multibase:(z[^:]+)$/.exec(
    String(input.actorIdentifier || '').trim(),
  );
  const role = String(input.role || '').trim();
  if (!portalDidWeb.startsWith('did:web:')) {
    throw new Error('Portal actor binding requires a did:web root.');
  }
  if (!match) {
    throw new Error('Portal actor binding requires a stable actor URN.');
  }
  if (!role) {
    throw new Error('Portal actor binding requires a canonical role.');
  }
  return `${portalDidWeb}:employee:${match[1]}:${role}`;
}

/**
 * Extracts the stable actor URN from a canonical GDC portal actor DID.
 * This is extraction, not reversal of the contact hash.
 */
export function stableActorIdentifierFromDidWeb(didWeb: string): string {
  const match = /:employee:(z[^:]+):[^:]+(?:[:]|$)/.exec(
    String(didWeb || '').trim(),
  );
  if (!match) {
    throw new Error('DID does not contain a canonical GDC actor binding.');
  }
  return `urn:multibase:${match[1]}`;
}
