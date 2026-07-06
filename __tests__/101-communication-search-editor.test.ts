/**
 * 101 note:
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import {
  CommunicationRetentionDecisions,
  CommunicationRetentionEnv,
  CommunicationSearchEditor,
  CommunicationSearchEntryTypes,
  CommunicationSearchOperationTypes,
  isCommunicationRetentionDisabled,
  resolveCommunicationRetentionDecision,
  SearchBundleTypes,
} from '../src/utils';
import { CommunicationCategoryCodes } from '../src/constants/communication';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types';
import {
  EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT,
  EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
  EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
} from '../src/examples/shared';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims';

describe('101: communication search editor step by step', () => {
  it('builds request, entry, bundle and retention policy decisions explicitly', () => {
    // Step 1.
    // Build the search editor with high-level Communication semantics instead
    // of hand-authoring raw Parameters rows.
    const editor = new CommunicationSearchEditor()
      .setSearchParamSender(EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID)
      .setSearchParamRecipient([EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT])
      .setSearchParamCategory(CommunicationCategoryCodes.Notification.attributeValue)
      .setSearchParamTopic(EXAMPLE_COMMUNICATION_SEARCH_TOPIC)
      .setPeriodStart('2026-06-01T00:00:00Z')
      .setPeriodEnd('2026-06-30T23:59:59Z')
      .setPaginationCount(25)
      .setPageNumber(2);

    // Step 2.
    // Freeze the high-level filters into the canonical request payload that GW
    // accepts for Communication/_search.
    const request = editor.buildRequest();

    // Step 3.
    // Wrap that request into one search entry carrying explicit operation
    // metadata for upstream orchestrators or docs/examples.
    const entry = editor.buildEntry();

    // Step 4.
    // Materialize the full bundle that runtime layers can submit directly.
    const bundle = editor.buildBundle();

    // Step 5.
    // Resolve the retention policy that lifecycle/purge logic should apply to
    // communication records.
    const retainDecision = resolveCommunicationRetentionDecision({
      [CommunicationRetentionEnv.Disabled]: 'false',
    });
    const deleteDecision = resolveCommunicationRetentionDecision({
      [CommunicationRetentionEnv.Disabled]: 'true',
    });

    expect(editor.getSearchParams()).toEqual({
      [CommunicationClaim.Sender]: [EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID],
      [CommunicationClaim.Recipient]: ['email:nurse.oncall@example.org'],
      [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.attributeValue,
      [CommunicationClaim.Topic]: EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
    });

    expect(request.resourceType).toBe('Parameters');
    expect(request.parameter).toEqual(expect.arrayContaining([
      { name: CommunicationClaim.Sender, valueString: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID },
      { name: CommunicationClaim.Recipient, valueString: 'email:nurse.oncall@example.org' },
      { name: CommunicationClaim.Category, valueString: CommunicationCategoryCodes.Notification.attributeValue },
      { name: CommunicationClaim.Topic, valueString: EXAMPLE_COMMUNICATION_SEARCH_TOPIC },
      { name: 'period-start', valueString: '2026-06-01T00:00:00Z' },
      { name: 'period-end', valueString: '2026-06-30T23:59:59Z' },
      { name: 'count', valueInteger: 25 },
      { name: 'page', valueInteger: 2 },
    ]));

    expect(entry.type).toBe(CommunicationSearchEntryTypes.Search);
    expect(entry.meta.operationType).toBe(CommunicationSearchOperationTypes.Search);
    expect(entry.request).toEqual({
      method: 'POST',
      url: `${ResourceTypesFhirR4.Communication}/_search`,
    });
    expect(entry.resource).toEqual(request);

    expect(bundle.resourceType).toBe(ResourceTypesFhirR4.Bundle);
    expect(bundle.type).toBe(SearchBundleTypes.Search);
    expect(bundle.entry[0]?.request.url).toBe(`${ResourceTypesFhirR4.Communication}/_search`);

    expect(isCommunicationRetentionDisabled({
      [CommunicationRetentionEnv.Disabled]: 'false',
    })).toBe(false);
    expect(isCommunicationRetentionDisabled({
      [CommunicationRetentionEnv.Disabled]: 'true',
    })).toBe(true);
    expect(retainDecision).toBe(CommunicationRetentionDecisions.SkipPurge);
    expect(deleteDecision).toBe(CommunicationRetentionDecisions.AllowPurge);
  });
});
