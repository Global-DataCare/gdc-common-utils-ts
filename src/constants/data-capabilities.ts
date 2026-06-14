// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.
// Always create JSDoc, do not use strings inline in keys nor values, use types instead, and reuse the data test examples.

/**
 * Canonical operation vocabulary for data authorization.
 *
 * This axis answers:
 * - what the actor wants to do with the data
 *
 * Keep this separate from actor/workflow capabilities such as
 * `HostingDisableHost` or `IndividualBootstrap`.
 */
export const DataCapabilityActions = Object.freeze({
  View: 'View',
  Create: 'Create',
  Update: 'Update',
  Send: 'Send',
  Search: 'Search',
  Index: 'Index',
  Purge: 'Purge',
} as const);

/**
 * Canonical semantic domains for data authorization.
 *
 * This axis answers:
 * - which business or clinical domain the data belongs to
 *
 * Important modeling rule:
 * - a `Bundle` of `Appointment` data is not equivalent to a `Bundle` of
 *   `Health`, `Veterinary`, `Research`, or `Insurance` data
 * - the real authorization decision depends on the semantic domain carried by
 *   the payload, not just on the FHIR envelope or transport shape
 */
export const DataCapabilityDomains = Object.freeze({
  Appointment: 'Appointment',
  Health: 'Health',
  Veterinary: 'Veterinary',
  Research: 'Research',
  Insurance: 'Insurance',
  Billing: 'Billing',
  Identity: 'Identity',
  Consent: 'Consent',
} as const);

/**
 * Canonical representation or transport vocabulary for data authorization.
 *
 * This axis answers:
 * - how the data is represented or exchanged technically
 *
 * A `Bundle` is only the FHIR container or exchange envelope.
 * Authorization must still look at the semantic domain of the contained data.
 */
export const DataCapabilityRepresentations = Object.freeze({
  Bundle: 'Bundle',
  Resource: 'Resource',
  DocumentReference: 'DocumentReference',
  Attachment: 'Attachment',
  Claims: 'Claims',
  Invoice: 'Invoice',
  Communication: 'Communication',
} as const);

export type DataCapabilityAction =
  typeof DataCapabilityActions[keyof typeof DataCapabilityActions];

export type DataCapabilityDomain =
  typeof DataCapabilityDomains[keyof typeof DataCapabilityDomains];

export type DataCapabilityRepresentation =
  typeof DataCapabilityRepresentations[keyof typeof DataCapabilityRepresentations];

/**
 * Structured data-authorization capability.
 *
 * Preferred for policy engines and role matrices because each axis remains
 * queryable independently.
 */
export type DataCapability = {
  action: DataCapabilityAction;
  representation: DataCapabilityRepresentation;
  domain: DataCapabilityDomain;
};

/**
 * Canonical string form for one data capability.
 *
 * Example:
 * - `Create.Bundle.Appointment`
 * - `Send.DocumentReference.Insurance`
 * - `View.Invoice.Billing`
 */
export type DataCapabilityKey =
  `${DataCapabilityAction}.${DataCapabilityRepresentation}.${DataCapabilityDomain}`;

/**
 * Builds the canonical string key for one data capability descriptor.
 */
export function buildDataCapabilityKey(input: DataCapability): DataCapabilityKey {
  return `${input.action}.${input.representation}.${input.domain}`;
}

/**
 * Parses one canonical string capability back into its structured form.
 */
export function parseDataCapabilityKey(input: string): DataCapability | undefined {
  const [action, representation, domain, ...rest] = String(input || '').trim().split('.');
  if (rest.length > 0) return undefined;
  if (!Object.values(DataCapabilityActions).includes(action as DataCapabilityAction)) return undefined;
  if (!Object.values(DataCapabilityRepresentations).includes(representation as DataCapabilityRepresentation)) return undefined;
  if (!Object.values(DataCapabilityDomains).includes(domain as DataCapabilityDomain)) return undefined;
  return {
    action: action as DataCapabilityAction,
    representation: representation as DataCapabilityRepresentation,
    domain: domain as DataCapabilityDomain,
  };
}

/**
 * Reference examples kept in code so authorization discussions do not get lost
 * in docs or chat history.
 */
export const ExampleDataCapabilities = Object.freeze({
  CreateBundleAppointment: buildDataCapabilityKey({
    action: DataCapabilityActions.Create,
    representation: DataCapabilityRepresentations.Bundle,
    domain: DataCapabilityDomains.Appointment,
  }),
  SendBundleAppointment: buildDataCapabilityKey({
    action: DataCapabilityActions.Send,
    representation: DataCapabilityRepresentations.Bundle,
    domain: DataCapabilityDomains.Appointment,
  }),
  ViewResourceHealth: buildDataCapabilityKey({
    action: DataCapabilityActions.View,
    representation: DataCapabilityRepresentations.Resource,
    domain: DataCapabilityDomains.Health,
  }),
  ViewBundleHealth: buildDataCapabilityKey({
    action: DataCapabilityActions.View,
    representation: DataCapabilityRepresentations.Bundle,
    domain: DataCapabilityDomains.Health,
  }),
  SendDocumentReferenceInsurance: buildDataCapabilityKey({
    action: DataCapabilityActions.Send,
    representation: DataCapabilityRepresentations.DocumentReference,
    domain: DataCapabilityDomains.Insurance,
  }),
  ViewInvoiceBilling: buildDataCapabilityKey({
    action: DataCapabilityActions.View,
    representation: DataCapabilityRepresentations.Invoice,
    domain: DataCapabilityDomains.Billing,
  }),
  SearchBundleResearch: buildDataCapabilityKey({
    action: DataCapabilityActions.Search,
    representation: DataCapabilityRepresentations.Bundle,
    domain: DataCapabilityDomains.Research,
  }),
} as const);
