/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import {
  buildFhirParametersResourceFromSearchParams,
  EXAMPLE_RELATED_PERSON_DISABLE_SEARCH_PARAMS,
  EXAMPLE_RELATED_PERSON_DISABLE_REQUEST_TYPE,
  EXAMPLE_RELATED_PERSON_FHIR_RESOURCE,
  EXAMPLE_RELATED_PERSON_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_INACTIVE_STATUS,
  EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID,
  EXAMPLE_RELATED_PERSON_PURGE_REQUEST_TYPE,
  EXAMPLE_RELATED_PERSON_PURGED_STATUS,
  EXAMPLE_RELATED_PERSON_RESOURCE_TYPE,
  EXAMPLE_RELATED_PERSON_SEARCH_URL,
  InteroperableOperationMethods,
  createInteroperableResourceOperationEditor,
  getPrimaryFhirIdentifierValue,
} from '../src';
import { RelatedPersonClaim } from '../src/models/interoperable-claims/related-person-claims.js';

describe('101: interoperable resource operation contract', () => {
  it('treats resource.identifier as the interoperable locator, resource.id as internal metadata, and meta.claims as the canonical processing shape', () => {
    // Teaching goal:
    // - FHIR resources enter with resource.identifier as the business locator
    // - the helper normalizes the input into canonical claims for processing
    // - disable/purge use lifecycle status in resource.meta without overloading
    //   resource-specific fields such as `active`
    // - search uses POST + Parameters instead of query-string GET as the target contract

    // Step 1.
    // Start from one FHIR resource exactly as a browser/backend integration
    // would submit it.
    expect(getPrimaryFhirIdentifierValue(EXAMPLE_RELATED_PERSON_FHIR_RESOURCE)).toBe(
      EXAMPLE_RELATED_PERSON_IDENTIFIER,
    );

    // Step 2.
    // Import the FHIR resource into the chainable editor. The editor keeps
    // resource.identifier as the public locator and also prepares the internal
    // claims-first representation used by managers and SDK helpers.
    const editor = createInteroperableResourceOperationEditor()
      .setResourceType(EXAMPLE_RELATED_PERSON_RESOURCE_TYPE)
      .setIdentifierClaimKey(RelatedPersonClaim.Identifier)
      .importFhirResource(EXAMPLE_RELATED_PERSON_FHIR_RESOURCE);

    expect(editor.getBusinessIdentifier()).toBe(EXAMPLE_RELATED_PERSON_IDENTIFIER);
    expect(editor.getClaims()[RelatedPersonClaim.Identifier]).toBe(EXAMPLE_RELATED_PERSON_IDENTIFIER);
    expect(editor.getState().resourceId).toBe(EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID);

    // Step 3.
    // Build lifecycle entries. The operation status lives in resource.meta.status
    // and does not overwrite the resource-specific `active` field semantics.
    const disableEntry = editor.buildDisableEntry({ type: EXAMPLE_RELATED_PERSON_DISABLE_REQUEST_TYPE });
    const purgeEntry = editor.buildPurgeEntry({ type: EXAMPLE_RELATED_PERSON_PURGE_REQUEST_TYPE });

    expect(disableEntry.request.method).toBe(InteroperableOperationMethods.Post);
    expect(disableEntry.resource.identifier?.[0]?.value).toBe(EXAMPLE_RELATED_PERSON_IDENTIFIER);
    expect(disableEntry.resource.id).toBe(EXAMPLE_RELATED_PERSON_INTERNAL_RESOURCE_ID);
    expect(disableEntry.resource.meta.status).toBe(EXAMPLE_RELATED_PERSON_INACTIVE_STATUS);
    expect(disableEntry.resource.meta.claims[RelatedPersonClaim.Identifier]).toBe(EXAMPLE_RELATED_PERSON_IDENTIFIER);
    expect(disableEntry.resource.meta.claims[RelatedPersonClaim.Active]).toBe('true');

    expect(purgeEntry.request.method).toBe(InteroperableOperationMethods.Post);
    expect(purgeEntry.resource.meta.status).toBe(EXAMPLE_RELATED_PERSON_PURGED_STATUS);

    // Step 4.
    // Search uses POST + Parameters as the target contract.
    const searchEntry = editor.buildSearchEntry({
      searchParams: EXAMPLE_RELATED_PERSON_DISABLE_SEARCH_PARAMS,
    });

    // Final didactic proof:
    // the same resource can be searched, disabled, or purged with one stable
    // contract:
    // - identifier at the API boundary
    // - claims for canonical processing
    // - internal id as optional runtime metadata only
    expect(searchEntry.request).toEqual({
      method: InteroperableOperationMethods.Post,
      url: EXAMPLE_RELATED_PERSON_SEARCH_URL,
    });
    expect(searchEntry.resource).toEqual(
      buildFhirParametersResourceFromSearchParams(EXAMPLE_RELATED_PERSON_DISABLE_SEARCH_PARAMS),
    );
  });
});
