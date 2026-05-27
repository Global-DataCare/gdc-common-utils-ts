// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

/**
 * Canonical actor-kind vocabulary shared across SDK packages.
 */
export const ActorKinds = Object.freeze({
  HostOnboarding: 'host_onboarding',
  OrganizationController: 'organization_controller',
  OrganizationEmployee: 'organization_employee',
  IndividualController: 'individual_controller',
  IndividualMember: 'individual_member',
  Professional: 'professional',
} as const);

/**
 * Canonical capability vocabulary shared across SDK packages.
 */
export const ActorCapabilities = Object.freeze({
  HostActivateOrganization: 'host.activate_organization',
  HostConfirmOrder: 'host.confirm_order',
  OrganizationCreateEmployee: 'organization.create_employee',
  OrganizationDisableEmployee: 'organization.disable_employee',
  OrganizationPurgeEmployee: 'organization.purge_employee',
  OrganizationActivateDevice: 'organization.activate_device',
  OrganizationIssueActivationCode: 'organization.issue_activation_code',
  OrganizationRequestSmartToken: 'organization.request_smart_token',
  IndividualBootstrap: 'individual.bootstrap',
  IndividualDisable: 'individual.disable',
  IndividualPurge: 'individual.purge',
  IndividualImportIps: 'individual.import_ips',
  IndividualGenerateDigitalTwin: 'individual.generate_digital_twin',
  IndividualIngestCommunication: 'individual.ingest_communication',
  IndividualUpsertRelatedPerson: 'individual.upsert_related_person',
  IndividualMemberDisable: 'individual_member.disable',
  IndividualMemberPurge: 'individual_member.purge',
  ConsentGrantProfessionalAccess: 'consent.grant_professional_access',
  ProfessionalMedication: 'professional.medication',
  ProfessionalAppointment: 'professional.appointment',
  ProfessionalRequestSmartToken: 'professional.request_smart_token',
  TokenRequestSmart: 'token.request_smart',
} as const);

export type ActorKindsValue = typeof ActorKinds[keyof typeof ActorKinds];
export type ActorCapabilitiesValue = typeof ActorCapabilities[keyof typeof ActorCapabilities];
