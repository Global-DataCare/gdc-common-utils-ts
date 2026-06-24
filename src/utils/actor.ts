// src/utils/actor.ts

export type ParsedActor = {
  /**
   * The token subject / authenticated actor identifier (as provided in the token request).
   * Examples:
   * - did:web:api.acme.org:employee:z6MksExampleHashedEmployeeId:ISCO-08|2211
   * - did:web:api.acme.org:employee:z6MksExampleHashedEmployeeId:ISCO-08|2211:<device-uuid>
   * - did:web:api.acme.org:employee:doctor1@acme.org:ISCO-08|2211
   * - did:web:api.acme.org:employee:doctor1@acme.org:ISCO-08|2211:<device-uuid>
   * - did:web:api.acme.org:family:<id>:v3-RoleCode|ONESELF
   * - did:web:api.acme.org:family:<id>:v3-RoleCode|CHILD:<device-uuid>
   */
  sub: string;
  /** The actor identifier (employee hashed-id/email token, familyId, or raw email). */
  identifier?: string;
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

    // Extract email and role from endpoint-style DID shapes:
    // did:web:<host>:(employee|family):<id>:<roleSystem>|<roleCode>[:<uuid>]
    const parts = after.split(':');
    const employeeIdx = parts.indexOf('employee');
    const familyIdx = parts.indexOf('family');
    const idIdx = employeeIdx >= 0 ? employeeIdx + 1 : familyIdx >= 0 ? familyIdx + 1 : -1;
    const identifier = idIdx >= 0 ? parts[idIdx] : undefined;
    if (identifier) {
      parsed.identifier = identifier.includes('@') ? identifier.toLowerCase() : identifier;
    }

    if (idIdx >= 0 && parts.length > idIdx + 1) {
      const roleCandidate = parts[idIdx + 1];
      if (roleCandidate && roleCandidate.includes('|')) parsed.role = roleCandidate;
    }
    return parsed;
  }

  // Raw email actor identifier
  if (trimmed.includes('@') && !/\s/.test(trimmed)) {
    parsed.identifier = trimmed.toLowerCase();
  }
  return parsed;
}
