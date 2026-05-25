// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * Relationship-enrollment channels shared by portal, app, and phone flows.
 *
 * `app` describes the client relationship channel itself, not reminder
 * delivery.
 */
export type RelationshipEnrollmentChannel = 'phone' | 'email' | 'app';
export const RelationshipEnrollmentChannels = Object.freeze({
  Phone: 'phone',
  Email: 'email',
  App: 'app',
} as const);

/**
 * Subject categories used to generalize person and animal flows.
 */
export type RelationshipSubjectKind = 'person' | 'animal';
export const RelationshipSubjectKinds = Object.freeze({
  Person: 'person',
  Animal: 'animal',
} as const);

/**
 * High-level actor kinds that can be bound to a subject relationship.
 */
export type RelationshipAccessActorKind =
  | 'controller'
  | 'caregiver'
  | 'professional'
  | 'related-person';
export const RelationshipAccessActorKinds = Object.freeze({
  Controller: 'controller',
  Caregiver: 'caregiver',
  Professional: 'professional',
  RelatedPerson: 'related-person',
} as const);

/**
 * Relationship invitation lifecycle used by shared enrollment flows.
 */
export type RelationshipInvitationStatus =
  | 'pending'
  | 'otp_pending'
  | 'otp_verified'
  | 'pin_required'
  | 'pin_set'
  | 'active'
  | 'expired'
  | 'revoked';

/**
 * Delivery mechanisms available for OTP challenges.
 */
export type RelationshipOtpDeliveryChannel = 'sms' | 'call' | 'email';
export const RelationshipOtpDeliveryChannels = Object.freeze({
  Sms: 'sms',
  Call: 'call',
  Email: 'email',
} as const);

/**
 * Supported KDF labels for wrapping a relationship-local key with a PIN-derived
 * key. The PIN never acts as the primary encryption key by itself.
 */
export type RelationshipPinKdf = 'argon2id' | 'scrypt' | 'pbkdf2-sha256';

/**
 * Shared invitation contract for non-employee access to a subject through
 * phone, email, or app channels.
 */
export type RelationshipChannelInvitationInput = Readonly<{
  tenantId: string;
  jurisdiction: string;
  sector: string;
  subjectId: string;
  subjectKind?: RelationshipSubjectKind;
  actorKind: RelationshipAccessActorKind;
  actorIdentifier: string;
  actorRole?: string;
  deliveryChannel: RelationshipEnrollmentChannel;
  deliveryTarget: string;
  purpose?: string;
  relationshipLabel?: string;
  expiresAt?: string;
  phonePinOptional?: boolean;
}>;

/**
 * Runtime-neutral summary returned after creating or retrieving a relationship
 * invitation.
 */
export type RelationshipChannelInvitationSummary = Readonly<{
  invitationId: string;
  tenantId: string;
  subjectId: string;
  subjectKind: RelationshipSubjectKind;
  actorKind: RelationshipAccessActorKind;
  actorIdentifier: string;
  actorRole?: string;
  deliveryChannel: RelationshipEnrollmentChannel;
  deliveryTargetMasked?: string;
  status: RelationshipInvitationStatus;
  purpose?: string;
  relationshipLabel?: string;
  expiresAt?: string;
  phonePinOptional?: boolean;
}>;

/**
 * Generic OTP challenge start contract that portal, mobile, and IVR can share.
 */
export type RelationshipChannelOtpStartInput = Readonly<{
  invitationId: string;
  deliveryChannel: RelationshipOtpDeliveryChannel;
  locale?: string;
}>;

/**
 * OTP confirmation payload reused by portal, Expo, and IVR consumers.
 */
export type RelationshipChannelOtpConfirmInput = Readonly<{
  invitationId: string;
  challengeId: string;
  code: string;
}>;

/**
 * Runtime-neutral challenge state returned by OTP-capable backends.
 */
export type RelationshipChannelOtpChallengeSummary = Readonly<{
  invitationId: string;
  challengeId: string;
  deliveryChannel: RelationshipOtpDeliveryChannel;
  status: 'pending' | 'verified' | 'expired' | 'blocked';
  expiresAt?: string;
  attemptsRemaining?: number;
}>;

/**
 * Relationship/channel-scoped PIN policy.
 */
export type RelationshipPinPolicy = Readonly<{
  minLength?: number;
  maxLength?: number;
  maxAttempts?: number;
  lockMinutes?: number;
  numericOnly?: boolean;
  optional?: boolean;
}>;

/**
 * PIN setup payload for a verified relationship invitation.
 */
export type RelationshipPinSetInput = Readonly<{
  invitationId: string;
  challengeId: string;
  channel: RelationshipEnrollmentChannel;
  pin: string;
  pinConfirmation?: string;
  policy?: RelationshipPinPolicy;
}>;

/**
 * PIN verification payload for an already-active relationship channel.
 */
export type RelationshipPinVerifyInput = Readonly<{
  relationshipId: string;
  channel: RelationshipEnrollmentChannel;
  pin: string;
}>;

/**
 * Portable envelope used to persist a relationship-local symmetric key for
 * offline-first subject caches.
 */
export type RelationshipLocalKeyEnvelope = Readonly<{
  relationshipId: string;
  actorIdentifier: string;
  subjectId: string;
  subjectKind: RelationshipSubjectKind;
  channel: RelationshipEnrollmentChannel;
  wrappedLocalAccessKey: string;
  kdfSalt: string;
  kdf: RelationshipPinKdf;
  scope: 'relationship-local-cache';
}>;
