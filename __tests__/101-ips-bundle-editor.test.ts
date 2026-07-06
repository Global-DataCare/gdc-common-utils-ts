/**
 * 101 note:
 * - Read `CONTRIBUTING.md` first. The shared test rules there are part of this file.
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - Do not make raw `meta.claims`, `upsert*`, or pack/unpack the main path unless this file is itself about transport.
 * - Do not introduce inline literals when a shared type, constant, fixture, or
 *   validation issue already exists in `src/constants/*`, `src/models/*`, or
 *   `src/examples/*`.
 * - Read `docs/101-README.md` for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.
 */

import { describe, expect, it } from '@jest/globals';

import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { HealthcareBasicSections } from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
  EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
  EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
  EXAMPLE_DIDCOMM_COMMUNICATION_THID,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_COMMUNICATION_UUID,
  EXAMPLE_MEDICATION_DOSE_UNIT_MG,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_IBUPROFEN_NOTE,
  EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_CODE,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_UUID,
  EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import { BundleEditableResourceTypes, BundleEditor } from '../src/utils/bundle-editor.js';
import { CommunicationEditor, CommunicationReader } from '../src/utils/communication-editor.js';
import { buildDidcommPayloadFromCommunicationClaims } from '../src/utils/communication-didcomm-payload.js';
import { EmployeeBundleOperations } from '../src/utils/employee.js';

describe('101: IPS bundle editor', () => {
  it('creates one IPS-style Communication bundle with one MedicationStatement step by step', () => {
    /*
     * Teaching goal:
     * - show the frontend editing story one layer at a time
     * - stage one entry through the public `BundleEditor` / typed entry editor
     * - reopen the same entry to adjust one field instead of rebuilding it
     * - attach the finished bundle to one outer `Communication` only after the
     *   bundle itself is ready
     *
     * This file is the canonical step-by-step path for bundle authoring in the
     * communication/IPS story. Use the claims-aggregator helper only as a
     * secondary setup shortcut in older transport examples.
     */

    // Step 1.
    // Build one MedicationStatement entry through the public bundle editor.
    const bundleEditor = new BundleEditor()
      .setBundleOperation(EmployeeBundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.medicationStatement)
      .newEntry(EXAMPLE_MEDICATION_STATEMENT_UUID)
      .asMedicationStatement()
      .setIdentifier(EXAMPLE_MEDICATION_STATEMENT_UUID)
      .setSubject(EXAMPLE_SUBJECT_DID)
      .setStatus(EXAMPLE_MEDICATION_STATEMENT_STATUS)
      .setEffective(EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE)
      .setCode(EXAMPLE_MEDICATION_STATEMENT_CODE)
      .setMedicationText(EXAMPLE_MEDICATION_IBUPROFEN_TEXT)
      .setNote(EXAMPLE_MEDICATION_IBUPROFEN_NOTE)
      .setCategoryList([HealthcareBasicSections.HistoryOfMedicationUse.attributeValue])
      .setDoseQuantityValue(400)
      .setDoseQuantityUnit(EXAMPLE_MEDICATION_DOSE_UNIT_MG)
      .setTimingFrequency(1)
      .setTimingPeriod(8)
      .setTimingPeriodUnit(EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS)
      .setDosageAsNeeded(true)
      .doneEntry();

    // Step 2.
    // Reopen the same entry and adjust one field before saving.
    const reopenedMedicationEntry = bundleEditor
      .openEntry(EXAMPLE_MEDICATION_STATEMENT_UUID)
      .asMedicationStatement()
      .setMedicationText(`${EXAMPLE_MEDICATION_IBUPROFEN_TEXT} - edited once`);

    expect(reopenedMedicationEntry.getIdentifier()).toBe(EXAMPLE_MEDICATION_STATEMENT_UUID);
    expect(reopenedMedicationEntry.getSubject()).toBe(EXAMPLE_SUBJECT_DID);
    expect(reopenedMedicationEntry.getStatus()).toBe(EXAMPLE_MEDICATION_STATEMENT_STATUS);
    expect(reopenedMedicationEntry.getMedicationText()).toBe(
      `${EXAMPLE_MEDICATION_IBUPROFEN_TEXT} - edited once`,
    );
    expect(reopenedMedicationEntry.getNote()).toBe(EXAMPLE_MEDICATION_IBUPROFEN_NOTE);
    expect(reopenedMedicationEntry.getCategoryList()).toEqual([
      HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    ]);

    // Step 3.
    // Saving the entry materializes the bundle that will travel inside Communication.
    const built = bundleEditor.build();
    const builtMedicationEntry = built.entry[0] as {
      resource: { resourceType: string; meta?: { claims?: Record<string, unknown> } };
    };

    expect(built.entry).toHaveLength(1);
    expect(builtMedicationEntry.resource.resourceType).toBe(ResourceTypesFhirR4.MedicationStatement);
    expect(builtMedicationEntry.resource.meta?.claims?.[MedicationStatementClaim.Identifier]).toBe(
      EXAMPLE_MEDICATION_STATEMENT_UUID,
    );
    expect(builtMedicationEntry.resource.meta?.claims?.[MedicationStatementClaim.MedicationText]).toBe(
      `${EXAMPLE_MEDICATION_IBUPROFEN_TEXT} - edited once`,
    );

    // Step 4.
    // Attach the finished bundle to the outer Communication and render transport.
    const deliverCommunication = new CommunicationEditor()
      .setCommunicationIdentifier(EXAMPLE_COMMUNICATION_UUID)
      .setCommunicationSubject(EXAMPLE_SUBJECT_DID)
      .setCommunicationCategory(CommunicationCategoryCodes.Notification.claim)
      .setCommunicationTopic('medication-document')
      .setCommunicationText('One MedicationStatement entry authored through BundleEditor and wrapped in Communication.')
      .setAttachedBundle(built as any);

    const didcommPayload = buildDidcommPayloadFromCommunicationClaims({
      communicationClaims: deliverCommunication.getCommunicationClaims(),
      iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
      aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
      jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
      thid: EXAMPLE_DIDCOMM_COMMUNICATION_THID,
    });

    // Step 5.
    // Read the payload back and verify the bundle + entry through reader APIs.
    const receivedCommunication = CommunicationReader.fromDidcommPayload(didcommPayload);
    const receivedBundleReader = receivedCommunication.getAttachedBundleReader();
    const reopenedEntryIndex = receivedBundleReader.getEntryIndexByIdentifier(EXAMPLE_MEDICATION_STATEMENT_UUID);
    expect(reopenedEntryIndex).toBe(0);
    const reopenedEntryClaims = receivedBundleReader
      .openEntry(reopenedEntryIndex as number)
      .getActiveEntryClaims();

    expect(didcommPayload.thid).toBe(EXAMPLE_DIDCOMM_COMMUNICATION_THID);
    expect(receivedCommunication.getCommunicationIdentifier()).toBe(EXAMPLE_COMMUNICATION_UUID);
    expect(receivedCommunication.getCommunicationSubject()).toBe(EXAMPLE_SUBJECT_DID);
    expect(receivedCommunication.getCommunicationCategoryList()).toEqual([
      CommunicationCategoryCodes.Notification.claim,
    ]);
    expect(receivedCommunication.getAttachmentContentType()).toBe('application/fhir+json');
    expect(receivedBundleReader.getBundleType()).toBe('batch');
    expect(receivedBundleReader.getEntries()).toHaveLength(1);
    expect(reopenedEntryClaims[MedicationStatementClaim.Identifier]).toBe(
      EXAMPLE_MEDICATION_STATEMENT_UUID,
    );
    expect(reopenedEntryClaims[MedicationStatementClaim.MedicationText]).toBe(
      `${EXAMPLE_MEDICATION_IBUPROFEN_TEXT} - edited once`,
    );
  });
});
