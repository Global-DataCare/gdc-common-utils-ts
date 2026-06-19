import {
  ProfessionalCredentialTypes,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import { buildUnsignedVpJwt } from './jwt';

export type ProfessionalEmployeeCredentialInput = Readonly<{
  actorDid: string;
  role: string;
  additionalCredentialSubject?: Record<string, unknown>;
  additionalCredential?: Record<string, unknown>;
}>;

export type ProfessionalSmartVpPayloadInput = Readonly<{
  clientId: string;
  actorDid: string;
  role: string;
  verifiableCredential?: string | Record<string, unknown> | ReadonlyArray<string | Record<string, unknown>>;
  additionalVp?: Record<string, unknown>;
  additionalPayload?: Record<string, unknown>;
}>;

export function buildProfessionalEmployeeCredential(
  input: ProfessionalEmployeeCredentialInput,
): Record<string, unknown> {
  return {
    type: [
      W3cCredentialTypes.VerifiableCredential,
      ProfessionalCredentialTypes.EmployeeCredential,
    ],
    credentialSubject: {
      id: String(input.actorDid || '').trim(),
      hasOccupation: String(input.role || '').trim(),
      ...(input.additionalCredentialSubject || {}),
    },
    ...(input.additionalCredential || {}),
  };
}

export function buildProfessionalSmartVpPayload(
  input: ProfessionalSmartVpPayloadInput,
): Record<string, unknown> {
  const credentials = Array.isArray(input.verifiableCredential)
    ? [...input.verifiableCredential]
    : input.verifiableCredential
      ? [input.verifiableCredential]
      : [buildProfessionalEmployeeCredential({
        actorDid: input.actorDid,
        role: input.role,
      })];

  return {
    ...(input.additionalPayload || {}),
    vp: {
      holder: String(input.clientId || '').trim(),
      verifiableCredential: credentials,
      ...(input.additionalVp || {}),
    },
  };
}

export function buildUnsignedProfessionalSmartVpJwt(
  input: ProfessionalSmartVpPayloadInput,
  options: Readonly<{ nowSeconds?: number; ttlSeconds?: number; nonce?: string }> = {},
): string {
  return buildUnsignedVpJwt(buildProfessionalSmartVpPayload(input), options);
}
