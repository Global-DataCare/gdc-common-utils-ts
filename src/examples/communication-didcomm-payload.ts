// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import {
  DidcommAckBodyKeys,
  DidcommMessageTypes,
} from '../constants/didcomm';
import { Format } from '../constants/Schemas';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_GATEWAY_PUBLIC_ORIGIN,
  EXAMPLE_IPS_BUNDLE_NOTE_TEXT,
  EXAMPLE_PROFESSIONAL_DID,
  EXAMPLE_SUBJECT_DID,
} from './shared';
import {
  AppointmentClaim,
  AppointmentParticipantStatus,
  AppointmentStatus,
} from '../models/interoperable-claims/appointment-claims';
import { CommunicationDidcommEntryTypes } from '../utils/communication-didcomm-payload';

/**
 * Shared synthetic DIDComm fixtures for Communication-attached bundle tests.
 */
export const EXAMPLE_DIDCOMM_COMMUNICATION_ISS = 'did:web:portal.example.org' as const;
export const EXAMPLE_DIDCOMM_COMMUNICATION_AUD = `${EXAMPLE_GATEWAY_PUBLIC_ORIGIN}/request` as const;
export const EXAMPLE_DIDCOMM_COMMUNICATION_JTI = 'didcomm-communication-jti-001' as const;
export const EXAMPLE_DIDCOMM_COMMUNICATION_THID = 'didcomm-communication-thread-001' as const;
export const EXAMPLE_DIDCOMM_COMMUNICATION_ENTRY_TYPE = CommunicationDidcommEntryTypes.AttachedBundle;
export const EXAMPLE_DIDCOMM_COMMUNICATION_TEXT = EXAMPLE_IPS_BUNDLE_NOTE_TEXT;
export const EXAMPLE_DIDCOMM_COMMUNICATION_ID = EXAMPLE_COMMUNICATION_IDENTIFIER;
export const EXAMPLE_DIDCOMM_COMMUNICATION_SUBJECT = EXAMPLE_SUBJECT_DID;
export const EXAMPLE_DIDCOMM_COMMUNICATION_ATTACHMENT_CONTEXT = Format.FHIR_R4;
export const EXAMPLE_DIDCOMM_BUNDLE_ENTRY_CONTEXT = Format.FHIR_API;
export const EXAMPLE_DIDCOMM_REPLY_AUD = `${EXAMPLE_GATEWAY_PUBLIC_ORIGIN}/reply` as const;
export const EXAMPLE_DIDCOMM_REPLY_JTI = 'didcomm-communication-reply-jti-001' as const;
export const EXAMPLE_DIDCOMM_ACK_TYPE = DidcommMessageTypes.CommunicationAck;
export const EXAMPLE_DIDCOMM_ACK_BODY_OK_KEY = DidcommAckBodyKeys.Ok;
export const EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_MEDICATION_IDENTIFIER_KEY =
  DidcommAckBodyKeys.ReceivedMedicationIdentifier;
export const EXAMPLE_DIDCOMM_ACK_BODY_RECEIVED_DOCUMENT_IDENTIFIER_KEY =
  DidcommAckBodyKeys.ReceivedDocumentIdentifier;
export const EXAMPLE_APPOINTMENT_IDENTIFIER = 'appointment-001' as const;
export const EXAMPLE_APPOINTMENT_START = '2026-07-01T09:00:00Z' as const;
export const EXAMPLE_APPOINTMENT_END = '2026-07-01T09:30:00Z' as const;
export const EXAMPLE_APPOINTMENT_DESCRIPTION = 'Medication follow-up visit.' as const;
export const EXAMPLE_APPOINTMENT_PARTICIPANT_STATUS = AppointmentParticipantStatus.Accepted;
export const EXAMPLE_APPOINTMENT_CLAIMS = {
  '@context': EXAMPLE_DIDCOMM_BUNDLE_ENTRY_CONTEXT,
  [AppointmentClaim.Identifier]: EXAMPLE_APPOINTMENT_IDENTIFIER,
  [AppointmentClaim.Status]: AppointmentStatus.Booked,
  [AppointmentClaim.Description]: EXAMPLE_APPOINTMENT_DESCRIPTION,
  [AppointmentClaim.Start]: EXAMPLE_APPOINTMENT_START,
  [AppointmentClaim.End]: EXAMPLE_APPOINTMENT_END,
  [AppointmentClaim.ParticipantActor]: `${EXAMPLE_SUBJECT_DID},${EXAMPLE_PROFESSIONAL_DID}`,
  [AppointmentClaim.ParticipantStatus]: EXAMPLE_APPOINTMENT_PARTICIPANT_STATUS,
} as const;
