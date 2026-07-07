/**
 * 101 note:
 * - Read `CONTRIBUTING.md` first. The shared test rules there are part of this file.
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - This file bridges bundle authoring and the profile/wallet runtime path.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Do not introduce inline literals when a shared type, constant, fixture, or
 *   validation issue already exists in `src/constants/*`, `src/models/*`, or
 *   `src/examples/*`.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 * - The unlocked user profile runtime is the next layer above this file; a
 *   separate proxy/service wallet is optional infrastructure, not the default.
 */

import { describe, expect, it } from '@jest/globals';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
  EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
  EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
  EXAMPLE_DIDCOMM_COMMUNICATION_THID,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import {
  buildExampleLiveMedicationCases,
  buildExampleMedicationIpsDocumentBundle,
} from '../src/examples/shared.js';
import { validateBundleDocumentBasic } from '../src/utils/bundle-document-builder.js';
import { CommunicationEditor, CommunicationReader } from '../src/utils/communication-editor.js';
import {
  buildDidcommPayloadFromCommunicationClaims,
} from '../src/utils/communication-didcomm-payload.js';

describe('101: communication bundle through profile manager and wallet', () => {
  it('teaches the transport and readback path for one already-built document bundle', async () => {
    /**
     * Teaching goal:
     * - start from one finished clinical document bundle
     * - wrap it in one delivery Communication through communication-level setters
     * - show that the unlocked profile wallet, not raw claims, is the normal
     *   transport owner
     * - stop before queue/outbox plumbing and runtime orchestration
     *
     * Scope:
     * - canonical bundle authoring: `101-ips-bundle-editor.test.ts`
     * - this file: transport/readback around one finished document bundle
     * - next layers: `gdc-sdk-core-ts` and `gdc-sdk-node-ts`
     *
     * Runtime ownership rule:
     * - normal case: the unlocked user profile runtime later encrypts this
     *   payload for transport and decrypts the reply
     * - that runtime may live inside a BFF, web shell, or Expo app
     * - a separate proxy/service wallet is optional infrastructure, not the
     *   default path taught here
     */

    // Step 1: load one shared document bundle fixture from the bundle-authoring tutorial.
    //
    // What happens here:
    // - we reuse the shared IPS example fixture instead of rebuilding the
    //   document by hand in this transport-focused test
    //
    // What the newbie should remember:
    // - the authoring walkthrough itself lives in `101-ips-bundle-editor.test.ts`
    // - the claims-aggregator helper stays secondary, not canonical
    const medication = buildExampleLiveMedicationCases(101)[0]!;
    const clinicalDocumentBundle = buildExampleMedicationIpsDocumentBundle({
      subjectDid: EXAMPLE_SUBJECT_DID,
      medication,
    }) as Record<string, unknown>;

    expect(validateBundleDocumentBasic(clinicalDocumentBundle)).toEqual({ ok: true, issues: [] });

    // Step 2: build one delivery Communication and attach that finished bundle.
    //
    // What happens here:
    // - we author one outer Communication through communication-level setters
    // - we attach the already-built bundle to that Communication
    //
    // What the newbie should remember:
    // - for individual index data, the current shared payload is:
    //   `document Bundle inside Communication`
    // - the public editor name is `CommunicationEditor`
    const deliverCommunication = new CommunicationEditor()
      .setCommunicationIdentifier(EXAMPLE_COMMUNICATION_IDENTIFIER)
      .setCommunicationSubject(EXAMPLE_SUBJECT_DID)
      .setCommunicationCategory(CommunicationCategoryCodes.Notification.claim)
      .setCommunicationTopic('medication-document')
      .setCommunicationText('Transport-only example for one ready-made document bundle.')
      .setAttachedBundle(clinicalDocumentBundle as any);

    expect(deliverCommunication.getCommunicationIdentifier()).toBe(EXAMPLE_COMMUNICATION_IDENTIFIER);
    expect(deliverCommunication.getCommunicationSubject()).toBe(EXAMPLE_SUBJECT_DID);
    expect(deliverCommunication.getCommunicationCategoryList()).toEqual([CommunicationCategoryCodes.Notification.claim]);
    expect((deliverCommunication.getAttachedBundle() as any).type).toBe('document');
    expect((deliverCommunication.getAttachedBundle() as any).entry?.[0]?.resource?.resourceType).toBe(ResourceTypesFhirR4.Composition);

    // Step 3: convert the finished Communication into the transport payload that will travel.
    //
    // What happens here:
    // - we wrap that Communication in one DIDComm-style plaintext payload
    //
    // What the newbie should remember:
    // - after Step 1 we had one document clinical bundle
    // - after Step 2 we had one Communication carrying that bundle
    // - after Step 3 we have plaintext transport content, still not encrypted
    //
    // Semantics:
    // - first: the current shared document bundle lives inside `Communication`
    // - second: `Communication` lives inside DIDComm/plain `body.data[]`
    const didcommPayload = buildDidcommPayloadFromCommunicationClaims({
      communicationClaims: deliverCommunication.getCommunicationClaims(),
      iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
      aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
      jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
      thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
    });

    // Step 4: read that DIDComm/plain payload back as one Communication.
    //
    // What happens here:
    // - we read the first delivery Communication from the transport payload
    // - we open the attached clinical bundle again through reader APIs
    //
    // What the frontend/BFF should remember:
    // - Step 3 gave us transport content
    // - the app first decodes that payload into one Communication
    // - it then reads Communication metadata that a chat list/card would show
    // - it then opens the attached business payload
    // - backend searches are a different story:
    //   they are expressed with FHIR search params such as
    //   `Composition.section=loinc-1,loinc-2`
    // - do not copy local bundle-navigation code from this test and mistake
    //   it for GW search semantics
    //
    // Transport runtime is still out of scope here:
    // - profile queue/send/poll lives in `101-profile-manager-mem.test.ts`
    // - higher SDK/BFF orchestration lives in `sdk-node` / `sdk-front`
    // - full document teaching with `Composition` first entry should use a
    //   dedicated public document editor path, which is not the public 101
    //   surface yet
    const receivedCommunication = CommunicationReader.fromDidcommPayload(didcommPayload);
    const receivedClinicalBundleReader = receivedCommunication.getAttachedBundleReader();
    const medicationEntryIndex = receivedClinicalBundleReader.getEntryIndexByIdentifier(medication.identifier);
    const documentSections = receivedClinicalBundleReader.getDocumentSections();

    expect(didcommPayload.thid).toBe(EXAMPLE_DIDCOMM_COMMUNICATION_THID);
    expect(receivedCommunication.getCommunicationIdentifier()).toBe(EXAMPLE_COMMUNICATION_IDENTIFIER);
    expect(receivedCommunication.getCommunicationSubject()).toBe(EXAMPLE_SUBJECT_DID);
    expect(receivedCommunication.getCommunicationCategoryList()).toEqual([CommunicationCategoryCodes.Notification.claim]);
    expect(receivedCommunication.getAttachmentContentType()).toBe('application/fhir+json');
    expect(receivedCommunication.getAttachmentDataBase64()).toBeTruthy();
    expect(receivedClinicalBundleReader.getResourceType()).toBe(ResourceTypesFhirR4.Bundle);
    expect(receivedClinicalBundleReader.getBundleType()).toBe('document');
    expect(receivedClinicalBundleReader.getTotalOperations()).toBeGreaterThanOrEqual(3);
    expect(documentSections).toHaveLength(1);
    expect(documentSections[0].entryReferences).toEqual([
      `MedicationStatement/${medication.identifier}`,
    ]);
    // TODO: show the authoring-side document constraints required by the
    // European/FHIR-like exchange profile once the public document authoring
    // surface exposes them directly:
    // - document identifiers/version metadata
    // - document authors/attesters/custodian participants
    //   (`Composition.author` may need one claims-first CSV/list surface)
    // - encounter/context references
    // - narrative/title/language and other profile-required document fields
    // - section-level multi-resource examples beyond one medication
    // - resource-specific provenance/author fields that differ by resource,
    //   for example:
    //   `MedicationStatement.source`
    //   `AllergyIntolerance.recorder`
    //   `Condition.recorder`
    //   `DiagnosticReport.performer` / `DiagnosticReport.results-interpreter`
    //   `DocumentReference.author`
    expect((receivedCommunication.getAttachedBundle() as any).entry?.[0]?.resource?.resourceType).toBe(ResourceTypesFhirR4.Composition);
    expect((receivedCommunication.getAttachedBundle() as any).entry?.[0]?.resource?.status).toBe('final');
    expect(medicationEntryIndex).toBeDefined();
    // TODO: extend this readback example with a second medication and one
    // linked DocumentReference once the public tutorial surface for
    // `MedicationStatement.user-selected` / `DocumentReference.user-selected`
    // is available through dedicated setters instead of raw claim patching.
    // TODO: add one focused assertion for the resolved resource id and
    // user-facing summary data the frontend would render in a medication list
    // card after opening the document section.
    expect(
      receivedClinicalBundleReader.getEntryClaimsByArrayIndex(medicationEntryIndex as number)[MedicationStatementClaim.Identifier],
    ).toBe(medication.identifier);
  });
});
