import { describe, expect, it } from '@jest/globals';
import {
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
} from '../src/examples/shared.js';
import {
  addConditionContainedDocumentIdentifierList,
  getConditionContainedDocumentIdentifierList,
  removeConditionContainedDocumentIdentifierList,
  setConditionContainedDocumentIdentifierList,
} from '../src/utils/claims-helpers-condition.js';

describe('condition claim helpers', () => {
  it('stores linked document reference identifiers as canonical csv', () => {
    let claims: Record<string, unknown> = {};

    claims = setConditionContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    claims = addConditionContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);

    expect(getConditionContainedDocumentIdentifierList(claims)).toEqual([
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
      EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY,
    ]);

    claims = removeConditionContainedDocumentIdentifierList(claims, [EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER]);
    expect(getConditionContainedDocumentIdentifierList(claims)).toEqual([EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER_SECONDARY]);
  });
});
