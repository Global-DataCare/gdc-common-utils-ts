// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import {
  ClinicalResourceReplacementDecision,
  HealthcareActorRoles,
  evaluateClinicalResourceReplacement,
  resolveClinicalDocumentAuthorOrganization,
} from '../src';
import fs from 'node:fs';
import path from 'node:path';

describe('101 clinical provenance successor policy', () => {
  const existing = {
    resourceId: 'observation-example',
    authorOwnerIdentifier: 'did:web:provider.example:organization:taxid:EXAMPLE-A',
    documentDate: '2026-09-01T10:00:00.000Z',
  };

  it('recognizes the governed veterinary technician and assistant ISCO role', () => {
    expect(HealthcareActorRoles.VeterinaryTechnicianOrAssistant).toBe('ISCO-08|3240');
  });

  it('resolves the author organization from the shared IPS document graph', () => {
    const bundle = JSON.parse(fs.readFileSync(
      path.resolve(process.cwd(), 'fixtures/fhir-ips-bundle-all-sections.json'),
      'utf8',
    ));
    const composition = bundle.entry.find((entry: any) => entry.resource?.resourceType === 'Composition').resource;
    expect(resolveClinicalDocumentAuthorOrganization(bundle)).toEqual({
      authorReference: composition.author[0].reference,
      organizationReference: composition.author[0].reference,
      documentDate: composition.date,
    });

    const roleAuthoredBundle = structuredClone(bundle);
    const roleReference = composition.attester[0].party.reference;
    const role = roleAuthoredBundle.entry.find((entry: any) =>
      entry.resource?.resourceType === 'PractitionerRole'
      && `PractitionerRole/${entry.resource.id}` === roleReference);
    role.resource.organization = { reference: composition.author[0].reference };
    roleAuthoredBundle.entry[0].resource.author = [{ reference: roleReference }];
    expect(resolveClinicalDocumentAuthorOrganization(roleAuthoredBundle)).toEqual({
      authorReference: roleReference,
      organizationReference: composition.author[0].reference,
      documentDate: composition.date,
    });
  });

  it('allows a later version of the same resource from the same author organization', () => {
    expect(evaluateClinicalResourceReplacement({
      existing,
      incoming: {
        ...existing,
        documentDate: '2026-09-01T10:01:00.000Z',
      },
    })).toBe(ClinicalResourceReplacementDecision.AllowOrganizationSuccessor);
  });

  it.each([
    ['different resource', { ...existing, resourceId: 'observation-other', documentDate: '2026-09-01T10:01:00.000Z' }],
    ['different organization', { ...existing, authorOwnerIdentifier: 'did:web:provider.example:organization:taxid:EXAMPLE-B', documentDate: '2026-09-01T10:01:00.000Z' }],
    ['same date', { ...existing }],
    ['older date', { ...existing, documentDate: '2026-09-01T09:59:00.000Z' }],
    ['invalid date', { ...existing, documentDate: 'not-a-date' }],
  ])('rejects a successor with %s', (_label, incoming) => {
    expect(evaluateClinicalResourceReplacement({ existing, incoming }))
      .toBe(ClinicalResourceReplacementDecision.Deny);
  });
});
