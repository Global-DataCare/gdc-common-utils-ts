/**
 * Teaching goal:
 * - the app edits semantic resources inside a Bundle before transport exists
 * - one Bundle may contain one immediate change or several changes committed together
 * - the completed Bundle is attached to one delivery Communication
 * - submit/poll, DIDComm packing and FAPI authorization stay outside this common-utils test
 *
 * Shared fixtures come from `gdc-common-utils-ts/examples`; this test covers
 * positive single/multi-entry authoring and rejects cross-resource mixing in a
 * homogeneous batch. Low-level `upsert*` methods are not part of this 101.
 */

import { describe, expect, it } from '@jest/globals';

import {
  BundleEditableResourceTypes,
  BundleEditor,
  BundleOperations,
  BundleTypes,
  CommunicationEditor,
  ConsentDecisions,
  RelatedPersonClaim,
} from '../src/index.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER,
  EXAMPLE_CONSENT_IDENTIFIER_SECONDARY,
  EXAMPLE_CONSENT_PURPOSE_TREATMENT,
  EXAMPLE_EMAIL_PROFESSIONAL,
  EXAMPLE_EMAIL_RELATED_PERSON,
  EXAMPLE_RELATED_PERSON_ACTIVE_NAME,
  EXAMPLE_RELATED_PERSON_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_INACTIVE_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_INACTIVE_NAME,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';

describe('101: Bundle authoring before Communication and transport', () => {
  it('lets the app send one contact now or several contacts after editing finishes', () => {
    // Step 1. Start one semantic contact Bundle. Nothing has been sent.
    const contacts = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setBundleType(BundleTypes.batch)
      .setAllowedResourceType(BundleEditableResourceTypes.relatedPerson);

    // Step 2. The same typed editor can finish one contact for immediate send.
    contacts
      .newEntryAs(BundleEditableResourceTypes.relatedPerson)
      .setIdentifier(EXAMPLE_RELATED_PERSON_IDENTIFIER)
      .setActive(true)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setRelationship(EXAMPLE_RELATED_PERSON_ROLE)
      .setName(EXAMPLE_RELATED_PERSON_ACTIVE_NAME)
      .setTelecom(`mailto:${EXAMPLE_EMAIL_RELATED_PERSON}`)
      .doneEntry();

    const oneContactBundle = contacts.buildJsonApi();
    expect(oneContactBundle.data).toHaveLength(1);

    // Step 3. Or the UI keeps the Bundle open and adds another contact before send.
    contacts
      .newEntryAs(BundleEditableResourceTypes.relatedPerson)
      .setIdentifier(EXAMPLE_RELATED_PERSON_INACTIVE_IDENTIFIER)
      .setActive(true)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setRelationship(EXAMPLE_RELATED_PERSON_ROLE)
      .setName(EXAMPLE_RELATED_PERSON_INACTIVE_NAME)
      .doneEntry();

    const allContactsBundle = contacts.buildJsonApi();
    expect(allContactsBundle.data).toHaveLength(2);
    expect(allContactsBundle.data[0]?.resource?.meta?.claims?.[RelatedPersonClaim.Name])
      .toBe(EXAMPLE_RELATED_PERSON_ACTIVE_NAME);

    // Step 4. Only the finished Bundle is attached to the delivery Communication.
    const communication = new CommunicationEditor()
      .setCommunicationIdentifier(EXAMPLE_COMMUNICATION_IDENTIFIER)
      .setCommunicationSubject(EXAMPLE_SUBJECT_DID)
      .setAttachedBundle(allContactsBundle);

    expect(communication.getAttachedBundle().data).toHaveLength(2);
  });

  it('edits several permissions in one Bundle without exposing upsert plumbing', () => {
    // Step 1. The permissions screen owns one in-memory Consent Bundle.
    const permissions = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setBundleType(BundleTypes.batch)
      .setAllowedResourceType(BundleEditableResourceTypes.consent);

    // Step 2. Each UI permission becomes one typed Consent entry.
    permissions
      .newEntryAs(BundleEditableResourceTypes.consent)
      .setIdentifier(EXAMPLE_CONSENT_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDecision(ConsentDecisions.Permit)
      .setActorIdentifierList([EXAMPLE_EMAIL_PROFESSIONAL])
      .setPurposeList([EXAMPLE_CONSENT_PURPOSE_TREATMENT])
      .doneEntry()
      .newEntryAs(BundleEditableResourceTypes.consent)
      .setIdentifier(EXAMPLE_CONSENT_IDENTIFIER_SECONDARY)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setDecision(ConsentDecisions.Deny)
      .setActorIdentifierList([EXAMPLE_EMAIL_PROFESSIONAL])
      .setPurposeList([EXAMPLE_CONSENT_PURPOSE_TREATMENT])
      .doneEntry();

    // Step 3. The screen decides when the complete permission set is ready.
    expect(permissions.buildJsonApi().data).toHaveLength(2);
  });

  it('rejects accidentally mixing contacts into a homogeneous permission batch', () => {
    const permissions = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setBundleType(BundleTypes.batch)
      .setAllowedResourceType(BundleEditableResourceTypes.consent);

    expect(() => permissions.newEntryAs(BundleEditableResourceTypes.relatedPerson))
      .toThrow(/cannot mix resource types/i);
  });

  it('reopens a returned Bundle so a later screen can append before the next commit', () => {
    const firstSession = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setBundleType(BundleTypes.batch)
      .setAllowedResourceType(BundleEditableResourceTypes.relatedPerson);
    firstSession
      .newEntryAs(BundleEditableResourceTypes.relatedPerson)
      .setIdentifier(EXAMPLE_RELATED_PERSON_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setName(EXAMPLE_RELATED_PERSON_ACTIVE_NAME)
      .doneEntry();

    // Step 1. A later edit session starts from authoritative readback/cache.
    const reopened = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.relatedPerson)
      .setBundle(firstSession.buildJsonApi());

    // Step 2. The screen appends another item and commits a new whole snapshot.
    reopened
      .newEntryAs(BundleEditableResourceTypes.relatedPerson)
      .setIdentifier(EXAMPLE_RELATED_PERSON_INACTIVE_IDENTIFIER)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setName(EXAMPLE_RELATED_PERSON_INACTIVE_NAME)
      .doneEntry();

    expect(reopened.buildJsonApi().data).toHaveLength(2);
  });
});
