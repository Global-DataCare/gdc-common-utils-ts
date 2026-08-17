import {
  ActivationCredentialTypes,
  EnvironmentCredentialTypes,
  W3cCredentialContexts,
  W3cCredentialTypes,
} from '../constants/verifiable-credentials';
import type { VerifiableCredentialV2 } from '../models/verifiable-credential';
import { buildStableActorIdentifier } from './actor-identifier';

export const TestNetworkOrganizationCredentialTypes = Object.freeze([
  ActivationCredentialTypes.OrganizationCredential,
  ActivationCredentialTypes.LegalRepresentativeCredential,
  ActivationCredentialTypes.ServiceControllerCredential,
] as const);

export type TestNetworkOrganizationCredentialSet = readonly [
  VerifiableCredentialV2,
  VerifiableCredentialV2,
  VerifiableCredentialV2,
];

export type BuildTestNetworkOrganizationCredentialSetInput = Readonly<{
  issuerDid: string;
  organizationDid: string;
  applicationId: string;
  validFrom: string;
  validUntil: string;
  pdfSha256: string;
  documentVersion: string;
  legalName: string;
  organizationIdentifier: string;
  identifierType: string;
  addressCountry: string;
  serviceCategory: string;
  legalRepresentativeEmail: string;
  legalRepresentativeFullName: string;
  controllerEmail: string;
  controllerKeyMaterial: string;
}>;

function required(value: unknown, name: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) throw new Error(`Test Network organization credentials require ${name}.`);
  return normalized;
}

/**
 * Builds the three schema.org credentials used by organization activation in
 * both environments. In this profile the reviewer/host-provider DID is the
 * issuer, every subject is restricted to `test-network`, and the immutable PDF
 * digest is common evidence. The function creates drafts; a reviewer proof
 * must still be added to every returned credential.
 */
export function buildTestNetworkOrganizationCredentialSet(
  input: BuildTestNetworkOrganizationCredentialSetInput,
): TestNetworkOrganizationCredentialSet {
  const issuer = required(input.issuerDid, 'issuerDid');
  const organizationDid = required(input.organizationDid, 'organizationDid');
  const applicationId = required(input.applicationId, 'applicationId');
  const validFrom = required(input.validFrom, 'validFrom');
  const validUntil = required(input.validUntil, 'validUntil');
  const legalName = required(input.legalName, 'legalName');
  const organizationIdentifier = required(input.organizationIdentifier, 'organizationIdentifier');
  const identifierType = required(input.identifierType, 'identifierType');
  const addressCountry = required(input.addressCountry, 'addressCountry').toUpperCase();
  const serviceCategory = required(input.serviceCategory, 'serviceCategory');
  const legalRepresentativeEmail = required(input.legalRepresentativeEmail, 'legalRepresentativeEmail').toLowerCase();
  const legalRepresentativeFullName = required(input.legalRepresentativeFullName, 'legalRepresentativeFullName');
  const controllerEmail = required(input.controllerEmail, 'controllerEmail').toLowerCase();
  const evidence = [{
    type: 'DocumentVerification',
    id: `urn:sha256:${required(input.pdfSha256, 'pdfSha256')}`,
    documentVersion: required(input.documentVersion, 'documentVersion'),
    applicationId,
    targetNetwork: 'test-network',
  }] as any;
  const base: Pick<VerifiableCredentialV2, '@context' | 'issuer' | 'validFrom' | 'validUntil' | 'evidence'> = {
    '@context': [W3cCredentialContexts.V2, 'https://schema.org'],
    issuer,
    validFrom,
    validUntil,
    evidence,
  };
  const organization: VerifiableCredentialV2 = {
    ...base,
    id: `urn:uuid:${applicationId}:organization`,
    type: [
      W3cCredentialTypes.VerifiableCredential,
      ActivationCredentialTypes.OrganizationCredential,
      EnvironmentCredentialTypes.TestNetworkCredential,
    ],
    credentialSubject: {
      id: organizationDid,
      '@type': 'Organization',
      legalName,
      identifier: { additionalType: identifierType, value: organizationIdentifier },
      ...(identifierType === 'taxID' ? { taxID: organizationIdentifier } : {}),
      address: { '@type': 'PostalAddress', addressCountry },
      makesOffer: { '@type': 'Offer', category: serviceCategory },
      targetNetwork: 'test-network',
    },
  };
  const representative: VerifiableCredentialV2 = {
    ...base,
    id: `urn:uuid:${applicationId}:legal-representative`,
    type: [
      W3cCredentialTypes.VerifiableCredential,
      ActivationCredentialTypes.PersonCredential,
      ActivationCredentialTypes.LegalRepresentativeCredential,
      EnvironmentCredentialTypes.TestNetworkCredential,
    ],
    credentialSubject: {
      id: buildStableActorIdentifier({ contactKind: 'email', contact: legalRepresentativeEmail }),
      '@type': 'Person',
      name: legalRepresentativeFullName,
      sameAs: buildStableActorIdentifier({ contactKind: 'email', contact: legalRepresentativeEmail }),
      hasOccupation: { '@type': 'Occupation', occupationalCategory: 'ISCO-08|1120' },
      memberOf: {
        '@type': 'Organization',
        legalName,
        ...(identifierType === 'taxID'
          ? { taxID: organizationIdentifier }
          : { identifier: { additionalType: identifierType, value: organizationIdentifier } }),
      },
      targetNetwork: 'test-network',
    },
  };
  const controller: VerifiableCredentialV2 = {
    ...base,
    id: `urn:uuid:${applicationId}:service-controller`,
    type: [
      W3cCredentialTypes.VerifiableCredential,
      'ServiceCredential',
      ActivationCredentialTypes.ServiceControllerCredential,
      EnvironmentCredentialTypes.TestNetworkCredential,
    ],
    credentialSubject: {
      id: organizationDid,
      '@type': 'Service',
      serviceType: 'OrganizationControllerService',
      provider: {
        '@type': 'Organization',
        legalName,
        ...(identifierType === 'taxID'
          ? { taxID: organizationIdentifier }
          : { identifier: { additionalType: identifierType, value: organizationIdentifier } }),
      },
      owner: {
        '@type': 'Person',
        additionalType: 'RESPRSN',
        sameAs: buildStableActorIdentifier({ contactKind: 'email', contact: controllerEmail }),
        hasOccupation: { '@type': 'Occupation', occupationalCategory: 'ISCO-08|1330' },
        hasCredential: { material: required(input.controllerKeyMaterial, 'controllerKeyMaterial') },
      },
      targetNetwork: 'test-network',
    },
  };
  return [organization, representative, controller];
}

function canonicalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalizeValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'proof')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalizeValue(nested)]),
  );
}

/** Deterministic detached-proof payload for one of the three Test Network VCs. */
export function canonicalizeTestNetworkOrganizationCredential(
  credential: VerifiableCredentialV2,
): string {
  if (!TestNetworkOrganizationCredentialTypes.some(type => credential.type.includes(type))) {
    throw new Error('Credential is not a Test Network organization credential.');
  }
  if (credential.credentialSubject?.targetNetwork !== 'test-network') {
    throw new Error('Test Network organization credential requires targetNetwork=test-network.');
  }
  return JSON.stringify(canonicalizeValue(credential));
}
