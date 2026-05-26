import { ClaimsOrganizationSchemaorg, ClaimsPersonSchemaorg } from '../constants/schemaorg';

/**
 * Flat map of PDF form field names to their raw values as extracted from the form.
 *
 * The caller can pass strings, booleans, `undefined`, or `null` because PDF tooling
 * often returns untyped values depending on the widget type.
 */
export type IndividualFormPdfFieldMap = Record<string, string | boolean | undefined | null>;

/**
 * Input required to derive normalized `org.schema` claims from an individual onboarding PDF.
 *
 * `fields` contains the raw PDF form values.
 * `signerSubjectDn` is the RFC2253-style certificate subject of the natural person who signed the PDF.
 */
export type IndividualFormPdfClaimsOptions = {
  fields: IndividualFormPdfFieldMap;
  signerSubjectDn: string;
};

/**
 * Result of the PDF-to-claims normalization.
 *
 * `claims` is the flattened `org.schema` payload to feed downstream onboarding flows.
 * `resolved` exposes the effective values chosen after applying the `self` and `subject*` rules.
 */
export type IndividualFormPdfClaimsResult = {
  claims: Record<string, string>;
  resolved: {
    selfDeclared: boolean;
    organizationAlternateName: string;
    organizationEmail?: string;
    organizationTelephone?: string;
    personName?: string;
    personGivenName?: string;
    personFamilyName?: string;
    personIdentifier?: string;
  };
};

/** Normalizes unknown input into a trimmed string, or an empty string when not present. */
function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Interprets common PDF checkbox/string variants as booleans. */
function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  const normalized = normalizeText(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on' || normalized === 'checked';
}

/** Lowercases and trims an email-like field, returning `undefined` when empty. */
function normalizeEmail(value: unknown): string | undefined {
  const email = normalizeText(value).toLowerCase();
  return email || undefined;
}

/** Trims a phone-like field, returning `undefined` when empty. */
function normalizePhone(value: unknown): string | undefined {
  const phone = normalizeText(value);
  return phone || undefined;
}

/** Filters placeholder values from the gender selector while preserving the original value. */
function normalizeGender(value: unknown): string | undefined {
  const raw = normalizeText(value);
  if (!raw) return undefined;
  const normalized = raw.toLowerCase();
  if (normalized === '(seleccionar)' || normalized === 'seleccionar' || normalized === 'select') return undefined;
  return raw;
}

/** Returns the first non-empty string from the candidate list. */
function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return undefined;
}

/** Chooses the preferred contact channel, prioritizing email over phone. */
function firstContact(
  emailValues: Array<string | undefined>,
  phoneValues: Array<string | undefined>,
): { email?: string; telephone?: string } {
  const email = emailValues.find(Boolean);
  if (email) return { email };
  const telephone = phoneValues.find(Boolean);
  if (telephone) return { telephone };
  return {};
}

/** Normalizes DN keys so `serialNumber`, `SERIALNUMBER`, and spaced variants collapse to one key. */
function normalizeDnKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Parses an RFC2253-like distinguished name into a key/value map.
 *
 * The function is tolerant of escaped commas and repeated continuation tokens,
 * which is enough for the certificate subjects used in the onboarding flows.
 */
export function parseDistinguishedName(dn: string): Record<string, string> {
  const output: Record<string, string> = {};
  const trimmed = normalizeText(dn);
  if (!trimmed) return output;

  const tokens = trimmed
    .split(/(?<!\\),/)
    .map((token) => token.trim())
    .filter(Boolean);

  let lastKey: string | undefined;
  for (const token of tokens) {
    const separator = token.indexOf('=');
    if (separator <= 0) {
      if (lastKey && output[lastKey]) {
        output[lastKey] = `${output[lastKey]}, ${token.trim()}`;
      }
      continue;
    }
    const key = normalizeDnKey(token.slice(0, separator));
    const value = token.slice(separator + 1).trim().replace(/\\,/g, ',').replace(/\\\\/g, '\\');
    if (!key || !value) continue;
    if (!(key in output)) output[key] = value;
    lastKey = key;
  }

  return output;
}

/**
 * Extracts the person identity data that CORE can safely derive from the signer certificate.
 *
 * This is intentionally limited to values that belong to the natural-person certificate subject:
 * full name, given name, family name, legal identifier, and country.
 */
function derivePersonName(subjectDn: Record<string, string>): {
  name?: string;
  givenName?: string;
  familyName?: string;
  identifier?: string;
  country?: string;
} {
  const givenName = firstDefined(subjectDn.GN, subjectDn.GIVENNAME);
  const familyName = firstDefined(subjectDn.SN, subjectDn.SURNAME);
  const cn = firstDefined(subjectDn.CN);
  const nameFromParts = [givenName, familyName].filter(Boolean).join(' ').trim();
  const name = nameFromParts || cn?.split(' - ')[0]?.trim() || undefined;
  return {
    ...(name ? { name } : {}),
    ...(givenName ? { givenName } : {}),
    ...(familyName ? { familyName } : {}),
    ...(firstDefined(subjectDn.SERIALNUMBER, subjectDn['OID.2.5.4.5']) ? { identifier: firstDefined(subjectDn.SERIALNUMBER, subjectDn['OID.2.5.4.5']) } : {}),
    ...(firstDefined(subjectDn.C, subjectDn.COUNTRYNAME) ? { country: firstDefined(subjectDn.C, subjectDn.COUNTRYNAME) } : {}),
  };
}

/**
 * Builds normalized `org.schema` claims from an individual onboarding PDF plus the signer certificate subject.
 *
 * Business rules:
 * - `self=true`: representative and subject are the same person, so top-level fields are used.
 * - `self=false` and any `subject*` field is present: the individual Organization uses `subject*` values.
 * - The controller Person identity is always derived from the signer certificate when available.
 * - `Organization.owner.identifier.value` is the signer certificate `SERIALNUMBER`, never email or phone.
 *
 * @throws When the PDF does not provide the required alternate name or any contact channel.
 */
export function buildClaimsFromIndividualFormPdf(
  options: IndividualFormPdfClaimsOptions,
): IndividualFormPdfClaimsResult {
  const subjectDn = parseDistinguishedName(options.signerSubjectDn);
  const personIdentity = derivePersonName(subjectDn);
  const fields = options.fields || {};

  const selfDeclared = normalizeBoolean(fields.self);
  const mainAlternateName = firstDefined(normalizeText(fields.alternateName));
  const subjectAlternateName = firstDefined(normalizeText(fields.subjectAlternateName));
  const mainEmail = normalizeEmail(fields.email);
  const subjectEmail = normalizeEmail(fields.subjectEmail);
  const mainPhone = normalizePhone(fields.phone);
  const subjectPhone = normalizePhone(fields.subjectPhone);

  const hasExplicitSubjectFields = Boolean(subjectAlternateName || subjectEmail || subjectPhone);
  const useSubjectValues = !selfDeclared && hasExplicitSubjectFields;

  const organizationAlternateName = firstDefined(
    useSubjectValues ? subjectAlternateName : undefined,
    mainAlternateName,
    subjectAlternateName,
  );
  if (!organizationAlternateName) {
    throw new Error('Individual PDF form requires alternateName or subjectAlternateName.');
  }

  const resolvedContact = useSubjectValues
    ? (() => {
      const subjectContact = firstContact([subjectEmail], [subjectPhone]);
      if (subjectContact.email || subjectContact.telephone) return subjectContact;
      return firstContact([mainEmail], [mainPhone]);
    })()
    : firstContact(
      [mainEmail, subjectEmail],
      [mainPhone, subjectPhone],
    );
  if (!resolvedContact.email && !resolvedContact.telephone) {
    throw new Error('Individual PDF form requires email/subjectEmail or phone/subjectPhone.');
  }

  const personAlternateName = firstDefined(mainAlternateName, organizationAlternateName);
  const gender = firstDefined(
    normalizeGender(fields.sexPicker),
    normalizeGender(fields.gender),
  );
  const birthDate = firstDefined(normalizeText(fields.dateOfBirth));

  const claims: Record<string, string> = {
    '@context': 'org.schema',
    [ClaimsOrganizationSchemaorg.alternateName]: organizationAlternateName,
    ...(personIdentity.identifier ? {
      [ClaimsOrganizationSchemaorg.ownerIdentifierValue]: personIdentity.identifier,
    } : {}),
    ...(resolvedContact.email ? {
      [ClaimsOrganizationSchemaorg.ownerEmail]: resolvedContact.email,
      [ClaimsPersonSchemaorg.email]: resolvedContact.email,
    } : {}),
    ...(resolvedContact.telephone ? {
      [ClaimsOrganizationSchemaorg.ownerTelephone]: resolvedContact.telephone,
      [ClaimsPersonSchemaorg.telephone]: resolvedContact.telephone,
    } : {}),
    ...(personAlternateName ? { [ClaimsPersonSchemaorg.alternateName]: personAlternateName } : {}),
    ...(personIdentity.name ? { [ClaimsPersonSchemaorg.name]: personIdentity.name } : {}),
    ...(personIdentity.givenName ? { [ClaimsPersonSchemaorg.givenName]: personIdentity.givenName } : {}),
    ...(personIdentity.familyName ? { [ClaimsPersonSchemaorg.familyName]: personIdentity.familyName } : {}),
    ...(personIdentity.identifier ? {
      [ClaimsPersonSchemaorg.identifierValue]: personIdentity.identifier,
      [ClaimsPersonSchemaorg.identifier]: `urn:person:identifier:${personIdentity.identifier}`,
    } : {}),
    ...(personIdentity.country ? { [ClaimsOrganizationSchemaorg.addressCountry]: personIdentity.country } : {}),
    ...(gender ? { [ClaimsPersonSchemaorg.gender]: gender } : {}),
    ...(birthDate ? { [ClaimsPersonSchemaorg.birthDate]: birthDate } : {}),
  };

  return {
    claims,
    resolved: {
      selfDeclared,
      organizationAlternateName,
      ...(resolvedContact.email ? { organizationEmail: resolvedContact.email } : {}),
      ...(resolvedContact.telephone ? { organizationTelephone: resolvedContact.telephone } : {}),
      ...(personIdentity.name ? { personName: personIdentity.name } : {}),
      ...(personIdentity.givenName ? { personGivenName: personIdentity.givenName } : {}),
      ...(personIdentity.familyName ? { personFamilyName: personIdentity.familyName } : {}),
      ...(personIdentity.identifier ? { personIdentifier: personIdentity.identifier } : {}),
    },
  };
}
