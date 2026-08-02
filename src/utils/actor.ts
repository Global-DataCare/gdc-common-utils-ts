// src/utils/actor.ts

export type ParsedActor = {
  /**
   * The token subject / authenticated actor identifier (as provided in the token request).
   * Examples:
   * - did:web:api.acme.org:member:z6MksExampleHashedMemberId:ISCO-08|2211
   * - did:web:api.acme.org:employee:z6MksExampleHashedEmployeeId:ISCO-08|2211
   * - did:web:api.acme.org:employee:z6MksExampleHashedEmployeeId:ISCO-08|2211:<device-uuid>
   * - did:web:api.acme.org:employee:doctor1@acme.org:ISCO-08|2211
   * - did:web:api.acme.org:employee:doctor1@acme.org:ISCO-08|2211:<device-uuid>
   * - did:web:api.acme.org:family:<id>:v3-RoleCode|ONESELF
   * - did:web:api.acme.org:family:<id>:v3-RoleCode|CHILD:<device-uuid>
   */
  sub: string;
  /** The terminal member identifier (hashed email/phone, family id, or raw email). */
  identifier?: string;
  /** The employee role code if present (e.g. "ISCO-08|2211"). */
  role?: string;
  /**
   * Membership domain inferred from the terminal role contract, not from a
   * provider-specific `member`/`employee` path label.
   */
  memberKind?: 'organization' | 'individual';
  /** The base organization did:web if `sub` is did:web (e.g. "did:web:api.acme.org"). */
  organization?: string;
};

export function parseActorFromSub(sub: string): ParsedActor {
  const trimmed = (sub || '').trim();
  const parsed: ParsedActor = { sub: trimmed };
  if (!trimmed) return parsed;

  if (trimmed.startsWith('did:web:')) {
    // Base org DID is always the first component after did:web:
    // did:web:<host>[:...]
    const after = trimmed.replace(/^did:web:/, '');
    const host = after.split(':')[0];
    if (host) parsed.organization = `did:web:${host}`;

    // Member vocabulary is provider-specific (`member`, `employee`, `family`,
    // `individual-member`, ...). The interoperable identity tuple is the
    // terminal `<identifier>:<role-system>|<role-code>` pair, optionally
    // followed by a device id. Do not make consent matching depend on a path
    // label chosen by a hosted or external DID provider.
    const parts = after.split(':');
    const roleIdx = parts.findIndex((part) => {
      try {
        return decodeURIComponent(part).includes('|');
      } catch {
        return part.includes('|');
      }
    });
    const hasRoleLabel = roleIdx > 0 && parts[roleIdx - 1].toLowerCase() === 'role';
    const idIdx = roleIdx > 0 ? roleIdx - (hasRoleLabel ? 2 : 1) : -1;
    const identifier = idIdx >= 0 ? parts[idIdx] : undefined;
    if (identifier) {
      parsed.identifier = identifier.includes('@') ? identifier.toLowerCase() : identifier;
    }

    if (roleIdx >= 0) {
      const encodedRole = parts[roleIdx];
      try {
        parsed.role = decodeURIComponent(encodedRole);
      } catch {
        parsed.role = encodedRole;
      }
      const normalizedRole = String(parsed.role || '').trim().toLowerCase();
      const pathLabels = parts.slice(1, Math.max(1, idIdx)).map((part) => part.toLowerCase());
      parsed.memberKind = normalizedRole.startsWith('v3-rolecode|')
        || pathLabels.some((part) => part === 'family' || part === 'related-person' || part === 'individual-member')
        ? 'individual'
        : 'organization';
    }
    return parsed;
  }

  // Raw email actor identifier
  if (trimmed.includes('@') && !/\s/.test(trimmed)) {
    parsed.identifier = trimmed.toLowerCase();
  }
  return parsed;
}
