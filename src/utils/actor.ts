// src/utils/actor.ts

export type ParsedActor = {
  /**
   * The token subject / authenticated actor identifier (as provided in the token request).
   * Examples:
   * - did:web:api.acme.org:employee:doctor1@acme.org:role:ISCO-08|2211
   * - doctor1@acme.org
   */
  sub: string;
  /** The employee email if present (either from did:web employee DID or raw email). */
  email?: string;
  /** The employee role code if present (e.g. "ISCO-08|2211"). */
  role?: string;
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

    // Extract email and role from the canonical employee DID shape:
    // did:web:<host>:employee:<email>:role:<roleCode>[:device:<uuid>]
    const parts = after.split(':');
    const employeeIdx = parts.indexOf('employee');
    if (employeeIdx >= 0 && parts.length > employeeIdx + 1) {
      const email = parts[employeeIdx + 1];
      if (email && email.includes('@')) parsed.email = email.toLowerCase();
    }
    const roleIdx = parts.indexOf('role');
    if (roleIdx >= 0 && parts.length > roleIdx + 1) {
      parsed.role = parts[roleIdx + 1];
    }
    return parsed;
  }

  // Raw email actor identifier
  if (trimmed.includes('@') && !/\s/.test(trimmed)) {
    parsed.email = trimmed.toLowerCase();
  }
  return parsed;
}

