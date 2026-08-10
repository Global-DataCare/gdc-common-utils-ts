import { normalizePhone } from './consent.js';
import { multibase58MultihashSha3_256 } from './same-as.js';

/** Cross-portal actor classes. These are intentionally broader than job roles. */
export const StableActorRoles = Object.freeze({
  Professional: 'professional',
  Personal: 'personal',
} as const);

export type StableActorRole = typeof StableActorRoles[keyof typeof StableActorRoles];
export type StableActorContactKind = 'email' | 'phone';

/**
 * Builds the private, stable actor identifier shared by independent portals.
 *
 * Wire format: `urn:multibase:<multibase(multihash(SHA3-256, normalized-contact))>:<role>`.
 * Examples end in `:professional` or `:personal`; the clear email/phone is
 * never embedded. A portal-specific `did:web`, IdP `sub`, wallet and DCR
 * `client_id` are bindings to this identifier, not replacements for it.
 *
 * Email is trimmed, stripped of `mailto:` and lower-cased. Phone is stripped
 * of `tel:` and formatting while preserving an E.164 leading `+`.
 */
export function buildStableActorIdentifier(input: {
  contactKind: StableActorContactKind;
  contact: string;
  role: StableActorRole;
}): string {
  const role = String(input.role || '').trim() as StableActorRole;
  if (!Object.values(StableActorRoles).includes(role)) {
    throw new Error('Stable actor role must be professional or personal.');
  }

  const rawContact = String(input.contact || '').trim();
  const normalizedContact = input.contactKind === 'email'
    ? rawContact.replace(/^mailto:/i, '').replace(/\s+/g, '').toLowerCase()
    : normalizePhone(rawContact.replace(/^tel:/i, ''));
  if (!normalizedContact) {
    throw new Error(`Stable actor ${input.contactKind} is required.`);
  }

  return `urn:multibase:${multibase58MultihashSha3_256(normalizedContact)}:${role}`;
}

/**
 * Builds a portal-specific DID binding that carries the stable actor payload.
 * The portal root can change while the final actor payload remains identical.
 */
export function buildPortalActorDidWeb(input: {
  portalDidWeb: string;
  actorIdentifier: string;
}): string {
  const portalDidWeb = String(input.portalDidWeb || '').trim();
  const match = /^urn:multibase:(z[^:]+):(professional|personal)$/.exec(
    String(input.actorIdentifier || '').trim(),
  );
  if (!portalDidWeb.startsWith('did:web:')) {
    throw new Error('Portal actor binding requires a did:web root.');
  }
  if (!match) {
    throw new Error('Portal actor binding requires a stable actor URN.');
  }
  return `${portalDidWeb}:actor:multibase:${match[1]}:${match[2]}`;
}

/**
 * Extracts the stable actor URN from a canonical GDC portal actor DID.
 * This is extraction, not reversal of the contact hash.
 */
export function stableActorIdentifierFromDidWeb(didWeb: string): string {
  const match = /:actor:multibase:(z[^:]+):(professional|personal)(?::|$)/.exec(
    String(didWeb || '').trim(),
  );
  if (!match) {
    throw new Error('DID does not contain a canonical GDC actor binding.');
  }
  return `urn:multibase:${match[1]}:${match[2]}`;
}
