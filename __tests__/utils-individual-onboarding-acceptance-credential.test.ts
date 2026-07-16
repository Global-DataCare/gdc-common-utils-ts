import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_CONTROLLER_DID,
  EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
} from '../src/examples/shared';
import {
  EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
} from '../src/examples/ica-activation-proof';
import { ClaimsPersonSchemaorg } from '../src/constants/schemaorg';
import {
  buildIndividualOnboardingAcceptanceCredential,
} from '../src/utils/individual-onboarding-acceptance-credential';

describe('individual onboarding acceptance credential', () => {
  it('builds the canonical VC shape for onboarding acceptance', () => {
    const credential = buildIndividualOnboardingAcceptanceCredential({
      issuerDid: EXAMPLE_CONTROLLER_DID,
      subjectDid: EXAMPLE_CONTROLLER_DID,
      organizationTaxId: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
      profileKeyMaterial: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
      validFrom: '2026-07-07T00:00:00Z',
      representativeIdentifier: 'IDCES-TEST1234',
      representativeRoleCode: 'RESPRSN',
    });

    expect(credential).toMatchObject({
      '@context': ['https://www.w3.org/ns/credentials/v2', 'https://schema.org'],
      type: ['VerifiableCredential', 'LegalRepresentativeCredential'],
      issuer: EXAMPLE_CONTROLLER_DID,
      credentialSubject: {
        id: EXAMPLE_CONTROLLER_DID,
        memberOf: { taxID: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID },
        hasOccupation: { identifier: { value: 'RESPRSN' } },
        hasCredential: { material: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID },
        [ClaimsPersonSchemaorg.identifierValue]: 'IDCES-TEST1234',
      },
      validFrom: '2026-07-07T00:00:00Z',
    });
  });

  it('rejects missing required VC inputs', () => {
    expect(() => buildIndividualOnboardingAcceptanceCredential({
      issuerDid: ' ',
      subjectDid: EXAMPLE_CONTROLLER_DID,
      organizationTaxId: EXAMPLE_LEGAL_ORGANIZATION_TAX_ID,
      profileKeyMaterial: EXAMPLE_ORG_CONTROLLER_SIGNING_KEY_ID,
      validFrom: '2026-07-07T00:00:00Z',
    })).toThrow('issuerDid');
  });
});