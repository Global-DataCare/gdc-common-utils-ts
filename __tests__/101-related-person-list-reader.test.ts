import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_EMAIL_RELATED_PERSON,
  EXAMPLE_RELATED_PERSON_ACTIVE_NAME,
  EXAMPLE_RELATED_PERSON_LIST_RECORD_ACTIVE,
  EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE,
  EXAMPLE_RELATED_PERSON_LIST_RESPONSE_BODY,
  EXAMPLE_RELATED_PERSON_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_SUBJECT_DID,
  findRelatedPersonListRecord,
  readRelatedPersonListRecords,
} from '../src';

describe('101: related person list reader', () => {
  it('reads related-person search/list results into one neutral frontend-oriented list', () => {
    const inactiveClaims = EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE.resource.meta.claims as Record<string, string>;

    const records = readRelatedPersonListRecords(EXAMPLE_RELATED_PERSON_LIST_RESPONSE_BODY);

    expect(records[0]).toEqual({
      identifier: EXAMPLE_RELATED_PERSON_IDENTIFIER,
      patient: EXAMPLE_SUBJECT_DID,
      relationship: EXAMPLE_RELATED_PERSON_ROLE,
      name: EXAMPLE_RELATED_PERSON_ACTIVE_NAME,
      telecom: `mailto:${EXAMPLE_EMAIL_RELATED_PERSON}`,
      active: 'true',
      status: EXAMPLE_RELATED_PERSON_LIST_RECORD_ACTIVE.meta.status,
      resourceId: EXAMPLE_RELATED_PERSON_LIST_RECORD_ACTIVE.resource.id,
      claims: EXAMPLE_RELATED_PERSON_LIST_RECORD_ACTIVE.resource.meta.claims,
    });

    expect(records[1]).toEqual({
      identifier: inactiveClaims['RelatedPerson.identifier.value'] || inactiveClaims['RelatedPerson.identifier'],
      patient: inactiveClaims['RelatedPerson.patient'],
      relationship: inactiveClaims['RelatedPerson.relationship'],
      name: inactiveClaims['RelatedPerson.name'],
      telecom: inactiveClaims['RelatedPerson.telecom'],
      active: inactiveClaims['RelatedPerson.active'],
      status: EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE.meta.status,
      resourceId: EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE.resource.id,
      claims: EXAMPLE_RELATED_PERSON_LIST_RECORD_INACTIVE.resource.meta.claims,
    });

    expect(findRelatedPersonListRecord(
      EXAMPLE_RELATED_PERSON_LIST_RESPONSE_BODY,
      EXAMPLE_RELATED_PERSON_IDENTIFIER,
    )).toEqual(records[0]);
  });
});
