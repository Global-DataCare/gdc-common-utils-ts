import { describe, expect, it } from '@jest/globals';
import {
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
} from '../src/examples/shared.js';
import {
  addAllergyIntoleranceContainedDocumentIdentifierList,
  getAllergyIntoleranceContainedDocumentIdentifierList,
  removeAllergyIntoleranceContainedDocumentIdentifierList,
  setAllergyIntoleranceContainedDocumentIdentifierList,
} from '../src/utils/allergy-intolerance-claim-helpers.js';

describe('allergy intolerance claim helpers', () => {
  it('stores linked document reference identifiers as canonical csv', () => {
    let claims: Record<string, unknown> = {};

    claims = setAllergyIntoleranceContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    claims = addAllergyIntoleranceContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);

    expect(getAllergyIntoleranceContainedDocumentIdentifierList(claims)).toEqual([
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
    ]);

    claims = removeAllergyIntoleranceContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    expect(getAllergyIntoleranceContainedDocumentIdentifierList(claims)).toEqual([EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);
  });
});
