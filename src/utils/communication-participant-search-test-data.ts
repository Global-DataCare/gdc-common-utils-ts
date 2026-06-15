import {
  EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT,
  EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_USER,
  EXAMPLE_COMMUNICATION_SEARCH_CATEGORY,
  EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
  EXAMPLE_COMMUNICATION_PARTICIPANT_SEARCH_SUBJECT_DID,
  EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
  EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT,
  EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID,
  EXAMPLE_COMMUNICATION_THREAD_ID,
} from '../examples/shared';
import { CommunicationClaim } from '../models/interoperable-claims/communication-claims.js';
import type { CommunicationParticipantProjection, CommunicationParticipantSearchInput } from './communication-participant-search';

/**
 * Shared communication-participant search input fixture reused across GW/SDK
 * tests.
 */
export function buildExampleCommunicationParticipantSearchInput(
  overrides: Partial<CommunicationParticipantSearchInput> = {},
): CommunicationParticipantSearchInput {
  return {
    subject: EXAMPLE_COMMUNICATION_PARTICIPANT_SEARCH_SUBJECT_DID,
    userActorId: [EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID, EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_USER],
    targetActorId: [EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT, EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT],
    searchParams: {
      [CommunicationClaim.Category]: EXAMPLE_COMMUNICATION_SEARCH_CATEGORY,
      [CommunicationClaim.Topic]: EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
    },
    ...overrides,
  };
}

/**
 * Shared stored projection fixture that mirrors the shape persisted by GW
 * communication-channel projections.
 */
export function buildExampleCommunicationParticipantProjection(
  overrides: Partial<CommunicationParticipantProjection & { id?: string; thid?: string }> = {},
): CommunicationParticipantProjection & { id: string; thid: string } {
  return {
    id: 'communication-participant-record-001',
    thid: EXAMPLE_COMMUNICATION_THREAD_ID,
    subject: EXAMPLE_COMMUNICATION_PARTICIPANT_SEARCH_SUBJECT_DID,
    sender: EXAMPLE_COMMUNICATION_PARTICIPANT_SENDER_DID,
    sent: '2026-06-15T10:00:00Z',
    category: EXAMPLE_COMMUNICATION_SEARCH_CATEGORY,
    topic: EXAMPLE_COMMUNICATION_SEARCH_TOPIC,
    recipients: [
      EXAMPLE_COMMUNICATION_PARTICIPANT_USER_DID,
      EXAMPLE_COMMUNICATION_PARTICIPANT_EMAIL_RECIPIENT,
      EXAMPLE_COMMUNICATION_PARTICIPANT_TEL_RECIPIENT,
    ],
    ...overrides,
  };
}
