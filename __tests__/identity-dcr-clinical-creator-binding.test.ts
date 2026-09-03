// Flow contract: DCR carries one canonical protected creator-binding field without deriving identity from device aliases.
import { IdentityDcrMetadataFields } from '../src/constants/identity-auth.js';

describe('clinical creator DCR metadata', () => {
  it('publishes the canonical field shared by SDK and gateway', () => {
    expect(IdentityDcrMetadataFields.ClinicalCreatorBinding).toBe('clinical_creator_binding');
  });
});
