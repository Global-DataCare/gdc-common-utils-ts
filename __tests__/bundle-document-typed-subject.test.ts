// Flow contract: a Composition subject keeps its explicit FHIR resource type; document building never rewrites a research twin as a Patient.
import { describe, expect, it } from '@jest/globals';

import { HealthcareDocumentTypes } from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { BundleEditor, BundleTypes } from '../src/utils/bundle-editor.js';

const subjectId = '19740b0b-9413-47fa-a99c-f607ac784ad8';
const conditionId = 'a7ee78a3-dbd6-4d98-b2bb-e2a9f0d06a55';
const authorReference = 'PractitionerRole/1b7b1f02-2371-4742-8877-9b69abc9075f';
const sectionCode = 'http://loinc.org|11450-4';
const attesterReference = 'PractitionerRole/8c3e74a0-9a99-4d67-a5be-667530e50c13';

function buildDocument(subjectReference: string) {
  const editor = new BundleEditor()
    .setBundleType(BundleTypes.document)
    .setCompositionSubject(subjectReference)
    .setCompositionType(HealthcareDocumentTypes.IPS.attributeValue)
    .setCompositionTitle(HealthcareDocumentTypes.IPS.titleEn ?? HealthcareDocumentTypes.IPS.id)
    .setCompositionDate('2026-10-07T00:00:00Z')
    .setCompositionAuthorList([authorReference])
    .setCompositionAttesterList([{
      reference: attesterReference,
      mode: 'professional',
      time: '2026-10-07T00:01:00Z',
    }]);

  editor.newEntryAs(ResourceTypesFhirR4.Condition, conditionId)
    .setClaim(ConditionClaim.Identifier, conditionId)
    .setClaim(ConditionClaim.Subject, subjectReference)
    .asCondition()
    .setSectionList([sectionCode]);

  return editor.buildDocument() as {
    entry: Array<{ resource: { resourceType: string; id?: string; subject?: { reference: string } } }>;
  };
}

describe('Bundle document typed subject', () => {
  it('materializes an explicit ResearchSubject reference without inventing a Patient', () => {
    const document = buildDocument(`${ResourceTypesFhirR4.ResearchSubject}/${subjectId}`);

    expect(document.entry[0]?.resource.subject?.reference).toBe(`ResearchSubject/${subjectId}`);
    expect(document.entry[0]?.resource).toMatchObject({
      author: [{ reference: authorReference }],
      attester: [{
        party: { reference: attesterReference },
        mode: 'professional',
        time: '2026-10-07T00:01:00Z',
      }],
    });
    expect(document.entry).toContainEqual({
      resource: { resourceType: ResourceTypesFhirR4.ResearchSubject, id: subjectId },
    });
    expect(document.entry.some(({ resource }) => resource.resourceType === ResourceTypesFhirR4.Patient)).toBe(false);
  });

  it('rejects a malformed typed subject reference instead of emitting an invalid resource id', () => {
    expect(() => buildDocument('ResearchSubject/')).toThrow('bundle_document_subject_reference_invalid');
  });

  it('preserves the legacy untyped subject as a Patient compatibility stub', () => {
    const document = buildDocument(subjectId);

    expect(document.entry).toContainEqual({
      resource: { resourceType: ResourceTypesFhirR4.Patient, id: subjectId },
    });
  });
});
