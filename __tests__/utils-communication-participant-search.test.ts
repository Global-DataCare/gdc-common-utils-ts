import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types';
import { CommunicationCategoryCodes } from '../src/constants/communication';
import {
  buildCommunicationParticipantIndexAttributes,
  buildCommunicationParticipantSearchBundle,
  buildCommunicationParticipantSearchParameters,
  CommunicationParticipantIndexNames,
  CommunicationParticipantPrefixes,
  CommunicationParticipantSearchParameterAliases,
  CommunicationParticipantSearchParameterNames,
  matchesCommunicationParticipantSearch,
  normalizeCommunicationParticipantToken,
  paginateCommunicationParticipantMatches,
  parseCommunicationParticipantSearchCriteria,
} from '../src/utils/communication-participant-search';
import { SearchBundleTypes } from '../src/utils/fhir-search';
import {
  EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT,
  EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_USER,
  EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
  EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT,
  EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID,
  EXAMPLE_COMMUNICATION_SEARCH_CATEGORY,
  EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
} from '../src/examples/shared';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims';
import {
  buildExampleCommunicationParticipantProjection,
  buildExampleCommunicationParticipantSearchInput,
} from '../src/utils/communication-participant-search-test-data';

describe('utils/communication-participant-search', () => {
  it('normalizes did, email and tel identifiers into canonical searchable prefixes', () => {
    expect(normalizeCommunicationParticipantToken('did:web:professional.example')).toBe('did:web:professional.example');
    expect(normalizeCommunicationParticipantToken('mailto:User@Example.org')).toBe('email:user@example.org');
    expect(normalizeCommunicationParticipantToken('email:Case.Manager@Example.org')).toBe('email:case.manager@example.org');
    expect(normalizeCommunicationParticipantToken('+34 600 111 222')).toBe('tel:+34600111222');
    expect(normalizeCommunicationParticipantToken('phone:(600) 111-222')).toBe('tel:600111222');
    expect(normalizeCommunicationParticipantToken(CommunicationParticipantPrefixes.Wildcard)).toBe(CommunicationParticipantPrefixes.Wildcard);
  });

  it('builds a canonical search bundle with claims-like searchParams and shared controls', () => {
    const bundle = buildCommunicationParticipantSearchBundle(
      buildExampleCommunicationParticipantSearchInput({
        searchParams: {
          [CommunicationClaim.Sender]: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
          [CommunicationClaim.Recipient]: [
            EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT,
            EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT,
          ],
          [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.attributeValue,
          [CommunicationClaim.Topic]: EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
        },
        periodStart: '2026-06-01T00:00:00Z',
        periodEnd: '2026-06-30T23:59:59Z',
        page: 2,
        count: 10,
      }),
    );

    expect(bundle.resourceType).toBe(ResourceTypesFhirR4.Bundle);
    expect(bundle.type).toBe(SearchBundleTypes.Search);
    expect(bundle.entry[0]?.request.method).toBe('POST');
    expect(bundle.entry[0]?.request.url).toBe(`${ResourceTypesFhirR4.Communication}/_search`);
    expect(bundle.entry[0]?.resource?.parameter).toEqual(expect.arrayContaining([
      { name: CommunicationClaim.Sender, valueString: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID },
      { name: CommunicationClaim.Recipient, valueString: 'email:nurse.oncall@example.org' },
      { name: CommunicationClaim.Recipient, valueString: 'tel:+34600111222' },
      { name: CommunicationClaim.Category, valueString: EXAMPLE_COMMUNICATION_SEARCH_CATEGORY },
      { name: CommunicationClaim.Topic, valueString: EXAMPLE_COMMUNICATION_SEARCH_TOPIC },
      { name: CommunicationParticipantSearchParameterNames.PeriodStart, valueString: '2026-06-01T00:00:00Z' },
      { name: CommunicationParticipantSearchParameterNames.PeriodEnd, valueString: '2026-06-30T23:59:59Z' },
      { name: CommunicationParticipantSearchParameterNames.Page, valueInteger: 2 },
      { name: CommunicationParticipantSearchParameterNames.Count, valueInteger: 10 },
    ]));
  });

  it('parses canonical and alias search controls into normalized criteria', () => {
    const resource = buildCommunicationParticipantSearchParameters(
      buildExampleCommunicationParticipantSearchInput({
        searchParams: {
          [CommunicationClaim.Sender]: ['did:web:tenant.example'],
          [CommunicationClaim.Recipient]: ['+34 600 111 222'],
          [CommunicationClaim.Category]: EXAMPLE_COMMUNICATION_SEARCH_CATEGORY,
        },
        periodStart: undefined,
        periodEnd: undefined,
      }),
    );
    resource.parameter.push({
      name: CommunicationParticipantSearchParameterAliases.SentFrom,
      valueString: '2026-06-01T00:00:00Z',
    });
    resource.parameter.push({
      name: CommunicationParticipantSearchParameterAliases.SentTo,
      valueString: '2026-06-30T23:59:59Z',
    });

    const criteria = parseCommunicationParticipantSearchCriteria(resource);

    expect(criteria.userActorIds).toContain(EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID);
    expect(criteria.userActorIds).toContain(`email:${EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_USER}`);
    expect(criteria.targetActorIds).toContain(`tel:${EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT}`);
    expect(criteria.claimSearchParams[CommunicationClaim.Sender]).toEqual(['did:web:tenant.example']);
    expect(criteria.claimSearchParams[CommunicationClaim.Recipient]).toEqual(['tel:+34600111222']);
    expect(criteria.claimSearchParams[CommunicationClaim.Category]).toEqual([EXAMPLE_COMMUNICATION_SEARCH_CATEGORY]);
    expect(criteria.periodStart).toBe('2026-06-01T00:00:00Z');
    expect(criteria.periodEnd).toBe('2026-06-30T23:59:59Z');
  });

  it('builds subject, sender, recipient and participant index attributes without duplicates', () => {
    const attributes = buildCommunicationParticipantIndexAttributes(
      buildExampleCommunicationParticipantProjection({
        recipients: [
          'mailto:nurse.oncall@example.org',
          'tel:+34 600 111 222',
          'email:nurse.oncall@example.org',
        ],
      }),
    );

    expect(attributes.some((attribute) => attribute.name === CommunicationParticipantIndexNames.Subject)).toBe(true);
    expect(attributes.some((attribute) => attribute.name === CommunicationParticipantIndexNames.Sender)).toBe(true);
    expect(attributes.some((attribute) => attribute.name === CommunicationParticipantIndexNames.Recipient && attribute.value === 'email:nurse.oncall@example.org')).toBe(true);
    expect(attributes.some((attribute) => attribute.name === CommunicationParticipantIndexNames.Participant && attribute.value === 'tel:+34600111222')).toBe(true);
    expect(attributes.filter((attribute) => attribute.name === CommunicationParticipantIndexNames.Recipient && attribute.value === 'email:nurse.oncall@example.org')).toHaveLength(1);
  });

  it('matches 1:1, 1:n, n:1 and wildcard participant combinations', () => {
    const oneToOne = buildExampleCommunicationParticipantProjection({
      sender: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
      recipients: [EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID],
    });
    const oneToMany = buildExampleCommunicationParticipantProjection({
      sender: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
      recipients: [EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID, EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT],
    });
    const manyToOne = buildExampleCommunicationParticipantProjection({
      sender: EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID,
      recipients: [EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID],
    });

    expect(matchesCommunicationParticipantSearch(oneToOne, parseCommunicationParticipantSearchCriteria({
      [CommunicationClaim.Sender]: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
      [CommunicationClaim.Recipient]: EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID,
    }))).toBe(true);

    expect(matchesCommunicationParticipantSearch(oneToMany, parseCommunicationParticipantSearchCriteria({
      [CommunicationClaim.Sender]: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
      [CommunicationClaim.Recipient]: EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT,
    }))).toBe(true);

    expect(matchesCommunicationParticipantSearch(manyToOne, parseCommunicationParticipantSearchCriteria({
      [CommunicationClaim.Sender]: EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID,
      [CommunicationClaim.Recipient]: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
    }))).toBe(true);

    expect(matchesCommunicationParticipantSearch(oneToMany, parseCommunicationParticipantSearchCriteria({
      [CommunicationClaim.Recipient]: [
        CommunicationParticipantPrefixes.Wildcard,
        EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT,
      ],
    }))).toBe(true);
  });

  it('matches category, topic and period range using claim-keyed searchParams', () => {
    const projection = buildExampleCommunicationParticipantProjection();
    const criteria = parseCommunicationParticipantSearchCriteria({
      [CommunicationClaim.Category]: EXAMPLE_COMMUNICATION_SEARCH_CATEGORY,
      [CommunicationClaim.Topic]: EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
      [CommunicationParticipantSearchParameterNames.PeriodStart]: '2026-06-01T00:00:00Z',
      [CommunicationParticipantSearchParameterNames.PeriodEnd]: '2026-06-30T23:59:59Z',
    });

    expect(matchesCommunicationParticipantSearch(projection, criteria)).toBe(true);
    expect(matchesCommunicationParticipantSearch(
      projection,
      parseCommunicationParticipantSearchCriteria({
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Reminder.attributeValue,
      }),
    )).toBe(false);
    expect(matchesCommunicationParticipantSearch(
      projection,
      parseCommunicationParticipantSearchCriteria({
        [CommunicationParticipantSearchParameterNames.PeriodStart]: '2026-06-16T00:00:00Z',
      }),
    )).toBe(false);
  });

  it('applies deterministic pagination after filtering', () => {
    const records = [
      buildExampleCommunicationParticipantProjection({ id: 'comm-1' }),
      buildExampleCommunicationParticipantProjection({ id: 'comm-2' }),
      buildExampleCommunicationParticipantProjection({ id: 'comm-3' }),
    ];

    const pageTwo = paginateCommunicationParticipantMatches(records, { page: 2, count: 1 });
    expect(pageTwo.map((record) => record.id)).toEqual(['comm-2']);

    const unbounded = paginateCommunicationParticipantMatches(records, { page: 99, count: undefined });
    expect(unbounded.map((record) => record.id)).toEqual(['comm-1', 'comm-2', 'comm-3']);
  });
});
