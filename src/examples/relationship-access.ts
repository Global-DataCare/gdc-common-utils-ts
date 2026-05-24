// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

import type {
  RelationshipChannelInvitationInput,
  RelationshipChannelInvitationSummary,
  RelationshipChannelOtpChallengeSummary,
  RelationshipChannelOtpConfirmInput,
  RelationshipChannelOtpStartInput,
  RelationshipLocalKeyEnvelope,
  RelationshipPinPolicy,
  RelationshipPinSetInput,
  RelationshipPinVerifyInput,
} from '../models/relationship-access';
import { HealthcareConsentPurposes } from '../constants/healthcare';
import { EXAMPLE_JURISDICTION, EXAMPLE_SECTOR } from './shared';
import {
  EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
  EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
  EXAMPLE_CONSENT_ACCESS_SUBJECT,
} from './consent-access';

export const EXAMPLE_RELATIONSHIP_CHANNEL_INVITATION_INPUT: RelationshipChannelInvitationInput = {
  tenantId: 'acme-id',
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
  subjectId: EXAMPLE_CONSENT_ACCESS_SUBJECT,
  subjectKind: 'person',
  actorKind: 'related-person',
  actorIdentifier: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
  deliveryChannel: 'email',
  deliveryTarget: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
  purpose: HealthcareConsentPurposes.CareManagement,
  relationshipLabel: 'family caregiver',
  phonePinOptional: false,
};

export const EXAMPLE_RELATIONSHIP_CHANNEL_INVITATION_SUMMARY: RelationshipChannelInvitationSummary = {
  invitationId: 'inv-rel-001',
  tenantId: 'acme-id',
  subjectId: EXAMPLE_CONSENT_ACCESS_SUBJECT,
  subjectKind: 'person',
  actorKind: 'related-person',
  actorIdentifier: EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL,
  deliveryChannel: 'email',
  deliveryTargetMasked: 'p***@example.org',
  status: 'otp_pending',
  purpose: HealthcareConsentPurposes.CareManagement,
  relationshipLabel: 'family caregiver',
  phonePinOptional: false,
};

export const EXAMPLE_RELATIONSHIP_PROFESSIONAL_INVITATION_INPUT: RelationshipChannelInvitationInput = {
  tenantId: 'acme-id',
  jurisdiction: EXAMPLE_JURISDICTION,
  sector: EXAMPLE_SECTOR,
  subjectId: EXAMPLE_CONSENT_ACCESS_SUBJECT,
  subjectKind: 'person',
  actorKind: 'professional',
  actorIdentifier: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
  actorRole: 'ISCO-08|2211',
  deliveryChannel: 'email',
  deliveryTarget: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
  purpose: HealthcareConsentPurposes.Treatment,
  relationshipLabel: 'attending physician',
  phonePinOptional: false,
};

export const EXAMPLE_RELATIONSHIP_CHANNEL_OTP_START_INPUT: RelationshipChannelOtpStartInput = {
  invitationId: 'inv-rel-001',
  deliveryChannel: 'email',
  locale: 'en',
};

export const EXAMPLE_RELATIONSHIP_CHANNEL_OTP_CONFIRM_INPUT: RelationshipChannelOtpConfirmInput = {
  invitationId: 'inv-rel-001',
  challengeId: 'challenge-rel-001',
  code: '123456',
};

export const EXAMPLE_RELATIONSHIP_CHANNEL_OTP_CHALLENGE_SUMMARY: RelationshipChannelOtpChallengeSummary = {
  invitationId: 'inv-rel-001',
  challengeId: 'challenge-rel-001',
  deliveryChannel: 'email',
  status: 'pending',
  attemptsRemaining: 3,
};

export const EXAMPLE_RELATIONSHIP_PIN_POLICY: RelationshipPinPolicy = {
  minLength: 6,
  maxLength: 10,
  maxAttempts: 5,
  lockMinutes: 15,
  numericOnly: true,
  optional: false,
};

export const EXAMPLE_RELATIONSHIP_PIN_SET_INPUT: RelationshipPinSetInput = {
  invitationId: 'inv-rel-001',
  challengeId: 'challenge-rel-001',
  channel: 'phone',
  pin: '483920',
  pinConfirmation: '483920',
  policy: EXAMPLE_RELATIONSHIP_PIN_POLICY,
};

export const EXAMPLE_RELATIONSHIP_PIN_VERIFY_INPUT: RelationshipPinVerifyInput = {
  relationshipId: 'rel-001',
  channel: 'phone',
  pin: '483920',
};

export const EXAMPLE_RELATIONSHIP_LOCAL_KEY_ENVELOPE: RelationshipLocalKeyEnvelope = {
  relationshipId: 'rel-001',
  actorIdentifier: EXAMPLE_CONSENT_ACCESS_PROVIDER_EMAIL,
  subjectId: EXAMPLE_CONSENT_ACCESS_SUBJECT,
  subjectKind: 'person',
  channel: 'app',
  wrappedLocalAccessKey: 'base64url-wrapped-local-access-key',
  kdfSalt: 'base64url-kdf-salt',
  kdf: 'argon2id',
  scope: 'relationship-local-cache',
};
