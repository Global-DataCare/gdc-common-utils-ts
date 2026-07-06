import { ClaimsPersonSchemaorg } from '../constants/schemaorg';
import {
  IndividualCredentialTypes,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import { normalizeSameAsHashCsv, normalizeSameAsHashList, normalizeTelephoneHash } from './same-as';
import { buildUnsignedVpJwt } from './jwt';

export type IndividualActorIdentityCredentialInput = Readonly<{
  actorDid: string;
  subjectDid?: string;
  relationship?: string;
  authorityBasis?: string;
  email?: string;
  sameAs?: string | readonly string[];
  telephone?: string;
  credentialMaterial?: string;
  evidence?: readonly Record<string, unknown>[];
  additionalCredentialSubject?: Record<string, unknown>;
  additionalCredential?: Record<string, unknown>;
}>;

export type IndividualActorIdentityVpPayloadInput = Readonly<{
  clientId: string;
  actorDid: string;
  subjectDid?: string;
  relationship?: string;
  authorityBasis?: string;
  email?: string;
  sameAs?: string | readonly string[];
  telephone?: string;
  credentialMaterial?: string;
  evidence?: readonly Record<string, unknown>[];
  verifiableCredential?: string | Record<string, unknown> | ReadonlyArray<string | Record<string, unknown>>;
  additionalVp?: Record<string, unknown>;
  additionalPayload?: Record<string, unknown>;
}>;

export type IndividualSubjectCredentialInput = Readonly<{
  subjectDid: string;
  sameAs?: string | readonly string[];
  telephone?: string;
  evidence?: readonly Record<string, unknown>[];
  additionalCredentialSubject?: Record<string, unknown>;
  additionalCredential?: Record<string, unknown>;
}>;

function getIndividualIdentitySameAs(
  input: Readonly<Pick<IndividualActorIdentityCredentialInput, 'sameAs' | 'email'>>,
): string[] {
  const sameAsCandidates: string[] = [];
  if (input.sameAs) {
    sameAsCandidates.push(...normalizeSameAsHashList(input.sameAs));
  }
  if (input.email) {
    sameAsCandidates.push(...normalizeSameAsHashList(input.email));
  }
  return [...new Set(sameAsCandidates)];
}

function getIndividualIdentityTelephone(
  input: Readonly<Pick<IndividualActorIdentityCredentialInput, 'telephone'>>,
): string | undefined {
  const normalized = normalizeTelephoneHash(String(input.telephone || ''));
  return normalized || undefined;
}

function buildIndividualIdentityVC(
  input: IndividualActorIdentityCredentialInput,
  credentialType: string,
): Record<string, unknown> {
  const normalizedSameAs = getIndividualIdentitySameAs(input);
  const normalizedTelephone = getIndividualIdentityTelephone(input);
  const normalizedCredentialMaterial = String(input.credentialMaterial || '').trim();
  const normalizedSubjectDid = String(input.subjectDid || '').trim();
  const normalizedRelationship = String(input.relationship || '').trim();
  const normalizedAuthorityBasis = String(input.authorityBasis || '').trim();

  return {
    type: [
      W3cCredentialTypes.VerifiableCredential,
      credentialType,
    ],
    credentialSubject: {
      id: String(input.actorDid || '').trim(),
      ...(normalizedSubjectDid ? { subject: normalizedSubjectDid } : {}),
      ...(normalizedRelationship ? { relationship: normalizedRelationship } : {}),
      ...(normalizedAuthorityBasis ? { authorityBasis: normalizedAuthorityBasis } : {}),
      ...(normalizedSameAs.length
        ? { sameAs: normalizeSameAsHashCsv(normalizedSameAs) }
        : {}),
      ...(normalizedTelephone
        ? { [ClaimsPersonSchemaorg.telephone]: normalizedTelephone }
        : {}),
      ...(normalizedCredentialMaterial
        ? { [ClaimsPersonSchemaorg.hasCredentialMaterial]: normalizedCredentialMaterial }
        : {}),
      ...(input.additionalCredentialSubject || {}),
    },
    ...(Array.isArray(input.evidence) && input.evidence.length
      ? { evidence: [...input.evidence] }
      : {}),
    ...(input.additionalCredential || {}),
  };
}

function buildIndividualIdentityVpPayload(
  input: IndividualActorIdentityVpPayloadInput,
  credentialType: string,
): Record<string, unknown> {
  const credentials = Array.isArray(input.verifiableCredential)
    ? [...input.verifiableCredential]
    : input.verifiableCredential
      ? [input.verifiableCredential]
      : [buildIndividualIdentityVC({
        actorDid: input.actorDid,
        subjectDid: input.subjectDid,
        relationship: input.relationship,
        authorityBasis: input.authorityBasis,
        email: input.email,
        sameAs: input.sameAs,
        telephone: input.telephone,
        credentialMaterial: input.credentialMaterial,
        evidence: input.evidence,
      }, credentialType)];

  return {
    ...(input.additionalPayload || {}),
    vp: {
      holder: String(input.clientId || '').trim(),
      verifiableCredential: credentials,
      ...(input.additionalVp || {}),
    },
  };
}

export type IndividualControllerCredentialInput = IndividualActorIdentityCredentialInput;
export type IndividualControllerVpPayloadInput = IndividualActorIdentityVpPayloadInput;
export type IndividualMemberCredentialInput = IndividualActorIdentityCredentialInput;
export type IndividualMemberVpPayloadInput = IndividualActorIdentityVpPayloadInput;

export function getIndividualControllerIdentitySameAs(
  input: Readonly<Pick<IndividualControllerCredentialInput, 'sameAs' | 'email'>>,
): string[] {
  return getIndividualIdentitySameAs(input);
}

export function getIndividualControllerIdentityTelephone(
  input: Readonly<Pick<IndividualControllerCredentialInput, 'telephone'>>,
): string | undefined {
  return getIndividualIdentityTelephone(input);
}

export function getIndividualControllerIdentityVC(
  input: IndividualControllerCredentialInput,
): Record<string, unknown> {
  return buildIndividualIdentityVC(input, IndividualCredentialTypes.IndividualControllerCredential);
}

export function buildIndividualControllerIdentityVpPayload(
  input: IndividualControllerVpPayloadInput,
): Record<string, unknown> {
  return buildIndividualIdentityVpPayload(input, IndividualCredentialTypes.IndividualControllerCredential);
}

export function buildUnsignedIndividualControllerIdentityVpJwt(
  input: IndividualControllerVpPayloadInput,
  options: Readonly<{ nowSeconds?: number; ttlSeconds?: number; nonce?: string }> = {},
): string {
  return buildUnsignedVpJwt(buildIndividualControllerIdentityVpPayload(input), options);
}

export function getIndividualSubjectVC(
  input: IndividualSubjectCredentialInput,
): Record<string, unknown> {
  const normalizedSameAs = getIndividualIdentitySameAs({
    sameAs: input.sameAs,
  });
  const normalizedTelephone = getIndividualIdentityTelephone({
    telephone: input.telephone,
  });

  return {
    type: [
      W3cCredentialTypes.VerifiableCredential,
      IndividualCredentialTypes.IndividualSubjectCredential,
    ],
    credentialSubject: {
      id: String(input.subjectDid || '').trim(),
      ...(normalizedSameAs.length
        ? { sameAs: normalizeSameAsHashCsv(normalizedSameAs) }
        : {}),
      ...(normalizedTelephone
        ? { [ClaimsPersonSchemaorg.telephone]: normalizedTelephone }
        : {}),
      ...(input.additionalCredentialSubject || {}),
    },
    ...(Array.isArray(input.evidence) && input.evidence.length
      ? { evidence: [...input.evidence] }
      : {}),
    ...(input.additionalCredential || {}),
  };
}

export function getIndividualMemberIdentitySameAs(
  input: Readonly<Pick<IndividualMemberCredentialInput, 'sameAs' | 'email'>>,
): string[] {
  return getIndividualIdentitySameAs(input);
}

export function getIndividualMemberIdentityTelephone(
  input: Readonly<Pick<IndividualMemberCredentialInput, 'telephone'>>,
): string | undefined {
  return getIndividualIdentityTelephone(input);
}

export function getIndividualMemberIdentityVC(
  input: IndividualMemberCredentialInput,
): Record<string, unknown> {
  return buildIndividualIdentityVC(input, IndividualCredentialTypes.IndividualMemberCredential);
}

export function buildIndividualMemberIdentityVpPayload(
  input: IndividualMemberVpPayloadInput,
): Record<string, unknown> {
  return buildIndividualIdentityVpPayload(input, IndividualCredentialTypes.IndividualMemberCredential);
}

export function buildUnsignedIndividualMemberIdentityVpJwt(
  input: IndividualMemberVpPayloadInput,
  options: Readonly<{ nowSeconds?: number; ttlSeconds?: number; nonce?: string }> = {},
): string {
  return buildUnsignedVpJwt(buildIndividualMemberIdentityVpPayload(input), options);
}
