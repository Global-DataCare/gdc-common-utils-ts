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
 *
 * Naming rule:
 * - `Hosting...`: host-registry and hosting-operator workflows
 * - `Organization...`: tenant/provider controller workflows
 * - `Individual...`: family/individual controller workflows
 * - `Professional...`: professional actor workflows
 * - `Consent...` / `Token...`: cross-cutting workflows
 */
export const ActorCapabilities = Object.freeze({
  HostingActivateOrganization: 'hosting.activate_organization',
  HostingConfirmOrder: 'hosting.confirm_order',
  HostingDisableHost: 'hosting.disable_host',
  HostingPurgeHost: 'hosting.purge_host',
  OrganizationCreateEmployee: 'organization.create_employee',
  OrganizationDisableEmployee: 'organization.disable_employee',
  OrganizationPurgeEmployee: 'organization.purge_employee',
  OrganizationDisableTenant: 'organization.disable_tenant',
  OrganizationPurgeTenant: 'organization.purge_tenant',
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

/**
 * Structured documentation for one actor capability.
 *
 * Frontends and backend runtimes can use this metadata to:
 * - explain why one facade method is available or blocked
 * - render help text/tooltips without hardcoded literals
 * - keep docs aligned with the shared capability vocabulary
 */
export type ActorCapabilityDoc = {
  actorKind: ActorKindsValue;
  summary: string;
  programmingHint: string;
  relatedMethods: readonly string[];
};

/**
 * Canonical per-capability documentation shared across SDK packages.
 */
export const ActorCapabilityDocs: Readonly<Record<ActorCapabilitiesValue, ActorCapabilityDoc>> = Object.freeze({
  [ActorCapabilities.HostingActivateOrganization]: {
    actorKind: ActorKinds.HostOnboarding,
    summary: 'Activates one hosted organization/provider in the host registry from ICA proof material.',
    programmingHint: 'Use this before any tenant/provider lifecycle. Supply service category/serviceType claims authorized by ICA.',
    relatedMethods: ['activateOrganizationInGatewayFromIcaProof'],
  },
  [ActorCapabilities.HostingConfirmOrder]: {
    actorKind: ActorKinds.HostOnboarding,
    summary: 'Confirms one already-paid host-side commercial order in the host registry.',
    programmingHint: 'Use this only after the external payment step has already accepted the order.',
    relatedMethods: ['confirmLegalOrganizationOrder'],
  },
  [ActorCapabilities.HostingDisableHost]: {
    actorKind: ActorKinds.HostOnboarding,
    summary: 'Disables the host publication lifecycle once no hosted tenants remain registered.',
    programmingHint: 'Expect discovery and DCAT publication to become unavailable after success.',
    relatedMethods: ['disableHost'],
  },
  [ActorCapabilities.HostingPurgeHost]: {
    actorKind: ActorKinds.HostOnboarding,
    summary: 'Purges the disabled host registration after hosted tenants have been purged.',
    programmingHint: 'Call this only after host disable and only when the hosted tenant registry is empty.',
    relatedMethods: ['purgeHost'],
  },
  [ActorCapabilities.OrganizationCreateEmployee]: {
    actorKind: ActorKinds.OrganizationController,
    summary: 'Creates one employee/professional seat under the current hosted tenant.',
    programmingHint: 'Use the organization-controller facade and pass employee identity/controller claims explicitly.',
    relatedMethods: ['createOrganizationEmployee'],
  },
  [ActorCapabilities.OrganizationDisableEmployee]: {
    actorKind: ActorKinds.OrganizationController,
    summary: 'Disables one employee without purging its audit trail.',
    programmingHint: 'Disable first when the lifecycle requires a prior non-destructive state change before purge.',
    relatedMethods: ['disableOrganizationEmployee', 'disableEmployee'],
  },
  [ActorCapabilities.OrganizationPurgeEmployee]: {
    actorKind: ActorKinds.OrganizationController,
    summary: 'Purges one disabled employee and releases the associated seat.',
    programmingHint: 'Use the explicit purge route after disable, not the legacy DELETE-in-batch semantics.',
    relatedMethods: ['purgeOrganizationEmployee', 'purgeEmployee'],
  },
  [ActorCapabilities.OrganizationDisableTenant]: {
    actorKind: ActorKinds.OrganizationController,
    summary: 'Disables one hosted tenant/provider after descendants are cleaned.',
    programmingHint: 'New individuals/employees should stop being creatable and tenant discovery publication should disappear.',
    relatedMethods: ['disableTenant'],
  },
  [ActorCapabilities.OrganizationPurgeTenant]: {
    actorKind: ActorKinds.OrganizationController,
    summary: 'Purges one disabled hosted tenant/provider after descendants are purged.',
    programmingHint: 'Expect a conflict if any employee, individual, or member lifecycle record still remains.',
    relatedMethods: ['purgeTenant'],
  },
  [ActorCapabilities.OrganizationActivateDevice]: {
    actorKind: ActorKinds.OrganizationEmployee,
    summary: 'Activates one organization employee device from an activation request or code.',
    programmingHint: 'Use this from the employee-side runtime after the controller has already issued the activation material.',
    relatedMethods: ['activateEmployeeDeviceWithActivationRequest'],
  },
  [ActorCapabilities.OrganizationIssueActivationCode]: {
    actorKind: ActorKinds.OrganizationEmployee,
    summary: 'Represents the employee-side ability to consume issued activation material.',
    programmingHint: 'Keep this aligned with the runtime activation flow even if the current facade exposes the request/consume step split.',
    relatedMethods: ['activateEmployeeDeviceWithActivationRequest'],
  },
  [ActorCapabilities.OrganizationRequestSmartToken]: {
    actorKind: ActorKinds.OrganizationController,
    summary: 'Requests a SMART token for one organization-scoped actor.',
    programmingHint: 'Pass actorDid/providerDid consistently so downstream FHIR/SMART calls stay actor-scoped.',
    relatedMethods: ['requestSmartToken'],
  },
  [ActorCapabilities.IndividualBootstrap]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Creates and confirms one hosted individual/family onboarding flow.',
    programmingHint: 'Use the same canonical individual identifiers through registration, order confirmation, and later lifecycle steps.',
    relatedMethods: ['startIndividualOrganization', 'confirmIndividualOrganizationOrder'],
  },
  [ActorCapabilities.IndividualDisable]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Disables one individual/family registration before purge.',
    programmingHint: 'Use the same subject/individual identifiers that storage and consent lifecycles use for cleanup.',
    relatedMethods: ['disableIndividualOrganization', 'disableIndividual'],
  },
  [ActorCapabilities.IndividualPurge]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Purges one disabled individual/family registration and its managed storage footprint.',
    programmingHint: 'This should include indexed sections and referenced blobs for the subject lifecycle being cleaned.',
    relatedMethods: ['purgeIndividualOrganization', 'purgeIndividual'],
  },
  [ActorCapabilities.IndividualImportIps]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Imports IPS/FHIR content into the subject index lifecycle.',
    programmingHint: 'Use the canonical subject identity and section filters expected by clinical search helpers.',
    relatedMethods: ['importIpsOrFhirAndUpdateIndex', 'getLatestIps'],
  },
  [ActorCapabilities.IndividualGenerateDigitalTwin]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Generates digital-twin material from subject data.',
    programmingHint: 'Treat this as a higher-level projection over already-indexed subject resources.',
    relatedMethods: ['generateDigitalTwinFromSubjectData'],
  },
  [ActorCapabilities.IndividualIngestCommunication]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Ingests one communication payload and updates the individual clinical index.',
    programmingHint: 'Choose the route family carefully (`api`, `didcomm-plain`, `legacy-fhir`) to match the runtime transport profile.',
    relatedMethods: ['ingestCommunicationAndUpdateIndex'],
  },
  [ActorCapabilities.IndividualUpsertRelatedPerson]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Creates or updates one related-person/member relationship for the individual scope.',
    programmingHint: 'Keep `RelatedPerson.identifier.value` canonical and do not rely on legacy identifier aliases in new code.',
    relatedMethods: ['upsertRelatedPersonAndPoll'],
  },
  [ActorCapabilities.IndividualMemberDisable]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Disables one related-person/member relationship.',
    programmingHint: 'Use the exact relationship identifier and subject reference that the upsert path stored.',
    relatedMethods: ['disableIndividualMember'],
  },
  [ActorCapabilities.IndividualMemberPurge]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Purges one disabled related-person/member relationship.',
    programmingHint: 'Purge after disable so the tenant/individual parent lifecycle can later be purged without descendant conflicts.',
    relatedMethods: ['purgeIndividualMember'],
  },
  [ActorCapabilities.ConsentGrantProfessionalAccess]: {
    actorKind: ActorKinds.IndividualController,
    summary: 'Grants one professional consent/access scope from the individual side.',
    programmingHint: 'Use explicit actor identifiers and purpose codes so later revoke/close flows can target the same consent cleanly.',
    relatedMethods: ['grantProfessionalAccess'],
  },
  [ActorCapabilities.ProfessionalMedication]: {
    actorKind: ActorKinds.Professional,
    summary: 'Allows medication-oriented professional workflows over authorized patient data.',
    programmingHint: 'Keep this distinct from administrative/provider-controller capabilities.',
    relatedMethods: ['searchClinicalBundle', 'ingestCommunicationAndUpdateIndex'],
  },
  [ActorCapabilities.ProfessionalAppointment]: {
    actorKind: ActorKinds.Professional,
    summary: 'Allows appointment-oriented professional workflows.',
    programmingHint: 'This capability remains actor-scoped even when transport and SMART token handling are shared.',
    relatedMethods: ['requestSmartToken'],
  },
  [ActorCapabilities.ProfessionalRequestSmartToken]: {
    actorKind: ActorKinds.Professional,
    summary: 'Requests a SMART token for one professional-scoped actor.',
    programmingHint: 'Use this instead of organization-scoped token requests when the actor identity is a professional/member profile.',
    relatedMethods: ['requestSmartToken'],
  },
  [ActorCapabilities.TokenRequestSmart]: {
    actorKind: ActorKinds.Professional,
    summary: 'Cross-cutting token-exchange capability used by runtimes that expose SMART token requests generically.',
    programmingHint: 'Treat this as transport/token plumbing, not as business authorization by itself.',
    relatedMethods: ['requestSmartToken'],
  },
});

/**
 * Reads the canonical documentation entry for one capability.
 */
export function getActorCapabilityDoc(capability: ActorCapabilitiesValue): ActorCapabilityDoc {
  return ActorCapabilityDocs[capability];
}
