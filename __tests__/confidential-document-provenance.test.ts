// Flow contract: project FHIR Composition provenance into searchable confidential-document metadata without conflating author, attester, or transport identity.
import {
  buildConfidentialDocumentIndexedAttributes,
  buildFhirIpsCreatorProvenance,
  buildHostedOrganizationDidWeb,
  CompositionAttesterModes,
  CompositionClaim,
  ConfidentialDocumentIndex,
  FhirIpsCreatorKinds,
} from '../src';
import {
  EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
  EXAMPLE_HOST_PUBLIC_HOSTNAME,
  EXAMPLE_HOSTED_PROVIDER_DID,
  EXAMPLE_KYC_CONTROLLER_USER_UUID,
  EXAMPLE_KYC_CONTROLLER_UUID,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_SECTOR,
  EXAMPLE_PROVIDER_TAX_ID,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared';

describe('confidential clinical-document provenance', () => {
  it('builds an organization author DID from its governed official identifier type and value', () => {
    expect(buildHostedOrganizationDidWeb({
      hostDomain: EXAMPLE_HOST_PUBLIC_HOSTNAME,
      sector: EXAMPLE_SECTOR,
      officialIdentifierType: 'taxID',
      officialIdentifierValue: EXAMPLE_PROVIDER_TAX_ID,
    })).toBe(
      `did:web:${EXAMPLE_HOST_PUBLIC_HOSTNAME}:${EXAMPLE_SECTOR}:organization:taxid:${EXAMPLE_PROVIDER_TAX_ID}`,
    );
  });

  it('uses the organization DID as author and the professional role as attester', () => {
    const practitionerIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`;
    const practitionerRoleIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`;

    const provenance = buildFhirIpsCreatorProvenance({
      kind: FhirIpsCreatorKinds.Professional,
      actorIdentifier: practitionerIdentifier,
      authorIdentifier: practitionerRoleIdentifier,
      organizationReference: EXAMPLE_HOSTED_PROVIDER_DID,
      role: EXAMPLE_HEALTHCARE_ACTOR_ROLE_PHYSICIAN,
    });

    expect(provenance.authorReference).toBe(EXAMPLE_HOSTED_PROVIDER_DID);
    expect(provenance.attesters).toEqual([{
      mode: CompositionAttesterModes.Professional,
      party: { reference: practitionerRoleIdentifier },
    }]);
    expect(provenance.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fullUrl: practitionerRoleIdentifier,
        resource: expect.objectContaining({
          resourceType: 'PractitionerRole',
          practitioner: { reference: practitionerIdentifier },
          organization: { reference: EXAMPLE_HOSTED_PROVIDER_DID },
        }),
      }),
    ]));
  });

  it('uses the individual as author when a member attests a dictated fact', () => {
    const memberIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`;
    const relationshipIdentifier = `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`;

    const provenance = buildFhirIpsCreatorProvenance({
      kind: FhirIpsCreatorKinds.IndividualMember,
      actorIdentifier: memberIdentifier,
      authorIdentifier: relationshipIdentifier,
      subjectReference: EXAMPLE_SUBJECT_DID,
      role: EXAMPLE_RELATED_PERSON_ROLE,
    });

    expect(provenance.authorReference).toBe(EXAMPLE_SUBJECT_DID);
    expect(provenance.attesters).toEqual([{
      mode: CompositionAttesterModes.Personal,
      party: { reference: relationshipIdentifier },
    }]);
  });

  it('emits one canonical index per CSV value and retains the deprecated aggregate during migration', () => {
    const authorReferences = [EXAMPLE_HOSTED_PROVIDER_DID, EXAMPLE_SUBJECT_DID];
    const attesterReferences = [
      `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      `urn:uuid:${EXAMPLE_KYC_CONTROLLER_USER_UUID}`,
    ];
    const attributes = buildConfidentialDocumentIndexedAttributes({
      sector: EXAMPLE_SECTOR,
      claims: {
        [CompositionClaim.Identifier]: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
        [CompositionClaim.Author]: authorReferences.join(','),
        [CompositionClaim.Attester]: attesterReferences.join(','),
        [CompositionClaim.AttesterMode]: [
          CompositionAttesterModes.Professional,
          CompositionAttesterModes.Personal,
        ].join(','),
      },
    });

    expect(attributes).toEqual(expect.arrayContaining([
      { name: ConfidentialDocumentIndex.Sector, value: EXAMPLE_SECTOR },
      ...authorReferences.map((value) => ({ name: CompositionClaim.Author, value })),
      ...attesterReferences.map((value) => ({ name: CompositionClaim.Attester, value })),
      {
        name: CompositionClaim.Author,
        value: authorReferences.join(','),
      },
      {
        name: CompositionClaim.Identifier,
        value: `urn:uuid:${EXAMPLE_KYC_CONTROLLER_UUID}`,
      },
    ]));
    expect(attributes.filter(({ name }) => name === CompositionClaim.Attester)).toHaveLength(3);
  });

  it('normalizes contextualized legacy Composition claim names without dropping their compatibility index', () => {
    const contextualName = `org.hl7.fhir.api.${CompositionClaim.Author}`;
    const attributes = buildConfidentialDocumentIndexedAttributes({
      claims: {
        [contextualName]: [EXAMPLE_HOSTED_PROVIDER_DID, EXAMPLE_SUBJECT_DID].join(','),
      },
    });

    expect(attributes).toEqual(expect.arrayContaining([
      { name: CompositionClaim.Author, value: EXAMPLE_HOSTED_PROVIDER_DID },
      { name: CompositionClaim.Author, value: EXAMPLE_SUBJECT_DID },
      {
        name: contextualName,
        value: [EXAMPLE_HOSTED_PROVIDER_DID, EXAMPLE_SUBJECT_DID].join(','),
      },
    ]));
  });
});
