/**
 * 101 note:
 * - Read `CONTRIBUTING.md` first. The shared test rules there are part of this file.
 * - Teach the highest-level public `common-utils` helper available for this topic.
 * - This file is the canonical orchestration story for the current
 *   medication-document path.
 * - Each `it(...)` is one user-facing step in the same end-to-end story.
 * - Do not introduce inline literals when a shared type, constant, fixture, or
 *   validation issue already exists in `src/constants/*`, `src/models/*`, or
 *   `src/examples/*`.
 * - Precondition: the real profile unlock / PIN / signing / encryption story
 *   lives upstream in `sdk-front` / `sdk-node` runtime tests; this file starts
 *   at the shared authoring layer that the unlocked profile will use.
 */

import { describe, expect, it } from '@jest/globals';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { MedicationStatementStatuses } from '../src/constants/clinical-statuses.js';
import { HealthcareBasicSections, HealthcareCoreSections } from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { HealthcareDocumentTypes } from '../src/constants/healthcare.js';
import {
  EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
  EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
  EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
  EXAMPLE_DIDCOMM_COMMUNICATION_THID,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_COMMUNICATION_TEXT_MEDICATION_DOCUMENT_READY,
  EXAMPLE_COMMUNICATION_TOPIC_MEDICATION_DOCUMENT,
  EXAMPLE_COMPOSITION_DATE_MEDICATION_DOCUMENT,
  EXAMPLE_COMPOSITION_IDENTIFIER_MEDICATION_DOCUMENT,
  EXAMPLE_COMPOSITION_TITLE_MEDICATION_DOCUMENT,
  EXAMPLE_CONTENT_TYPE_FHIR_JSON,
  EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION,
  EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
  EXAMPLE_DOCUMENT_REFERENCE_DATA_BASE64,
  EXAMPLE_DOCUMENT_REFERENCE_IDENTIFIER,
  EXAMPLE_DOCUMENT_REFERENCE_LANGUAGE,
  EXAMPLE_DOCUMENT_REFERENCE_TYPE,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_STATEMENT_CODE,
  EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER,
  EXAMPLE_MEDICATION_STATEMENT_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_TEXT_CORRECTED,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import {
  BundleEditableResourceTypes,
  BundleEditor,
  BundleEditorValidationIssues,
  BundleTypes,
} from '../src/utils/bundle-editor.js';
import { BundleReader } from '../src/utils/bundle-reader.js';
import { CommunicationEditor, CommunicationReader } from '../src/utils/communication-editor.js';
import { buildDidcommPayloadFromCommunicationClaims } from '../src/utils/communication-didcomm-payload.js';
import { EmployeeBundleOperations } from '../src/utils/employee.js';

describe('101: medication document communication orchestration', () => {
  describe('success path: create, correct, wrap, send, and read back one medication document', () => {
    const scenario: {
      medicationDocumentEditor?: BundleEditor;
      medicationStatementIdentifier?: string;
      documentReferenceIdentifier?: string;
      medicationDocumentBundle?: Record<string, unknown>;
      deliverCommunication?: CommunicationEditor;
      didcommPayload?: Record<string, unknown>;
      receivedCommunication?: CommunicationReader;
      receivedDocumentBundleReader?: BundleReader;
    } = {};

    it('step 1: the frontend creates one medication entry through BundleEditor', () => {
      // This is the first thing the frontend user story must teach:
      // one entry at a time, through one high-level typed editor.
      //
      // Real app story around this step:
      // - the web/native app has already unlocked the self-managed profile
      //   with the user PIN
      // - that unlocked profile will later sign/encrypt the outbound message
      // - but the authoring surface itself starts here, with one entry editor
      const createdMedication = new BundleEditor()
        .setBundleOperation(EmployeeBundleOperations.create)
        .setBundleType(BundleTypes.document)
        .setCompositionIdentifier(EXAMPLE_COMPOSITION_IDENTIFIER_MEDICATION_DOCUMENT)
        .setCompositionSubject(EXAMPLE_SUBJECT_DID)
        .setCompositionType(HealthcareDocumentTypes.IPS.attributeValue)
        .setCompositionTitle(EXAMPLE_COMPOSITION_TITLE_MEDICATION_DOCUMENT)
        .setCompositionDate(EXAMPLE_COMPOSITION_DATE_MEDICATION_DOCUMENT)
        .setCompositionAuthorList([EXAMPLE_SUBJECT_DID])
        .newEntryAs(BundleEditableResourceTypes.medicationStatement);

      // Teaching point:
      // - if no id is passed to `newEntryAs(...)`, the editor seeds one internal
      //   canonical `urn:uuid:*`
      // - for the current public API, the safe onboarding story is to call
      //   `ensureIdentifier()` immediately and keep one canonical identifier
      //   aligned across claim + `resource.id` + `fullUrl`
      // - do not teach `setIdentifier(...)` as the default 101 path; keep it
      //   for explicit import/migration overrides where the caller really wants
      //   to replace the canonical value
      scenario.medicationStatementIdentifier = createdMedication.ensureIdentifier();

      scenario.medicationDocumentEditor = createdMedication
        .setSubject(EXAMPLE_SUBJECT_DID)
        .setStatus(MedicationStatementStatuses.Active)
        .setCode(EXAMPLE_MEDICATION_STATEMENT_CODE)
        .setMedicationText(EXAMPLE_MEDICATION_STATEMENT_TEXT)
        .setEffective(EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE)
        .setUserSelected(true)
        .setCategoryList([HealthcareBasicSections.HistoryOfMedicationUse.attributeValue])
        .doneEntry();

      const medicationDocumentEditor = scenario.medicationDocumentEditor!;
      medicationDocumentEditor.openEntry(scenario.medicationStatementIdentifier!);
      const stagedMedicationDraftBundle = medicationDocumentEditor.buildJsonApi();
      const stagedMedicationReader = new BundleReader(stagedMedicationDraftBundle as unknown as Record<string, unknown>);

      expect(stagedMedicationReader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Identifier]).toBe(
        scenario.medicationStatementIdentifier,
      );
      expect(stagedMedicationReader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
      expect(stagedMedicationReader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Code]).toBe(EXAMPLE_MEDICATION_STATEMENT_CODE);
      expect(scenario.medicationStatementIdentifier).toMatch(/^urn:uuid:/);
    });

    it('step 2: the frontend reopens that same medication and corrects one field', () => {
      // This is the second thing the frontend story must teach:
      // reopen the existing entry instead of rebuilding raw claims from scratch.
      const reopenedMedication = scenario.medicationDocumentEditor!
        .openEntry(scenario.medicationStatementIdentifier!)
        .asResourceType(BundleEditableResourceTypes.medicationStatement)
        .setMedicationText(EXAMPLE_MEDICATION_STATEMENT_TEXT_CORRECTED);

      expect(reopenedMedication.getIdentifier()).toBe(scenario.medicationStatementIdentifier);
      expect(reopenedMedication.getMedicationText()).toBe(EXAMPLE_MEDICATION_STATEMENT_TEXT_CORRECTED);
    });

    it('step 3: the frontend can also add one linked document entry before finalizing the document', () => {
      // Attachments are not taught as loose files here.
      // The current health/document story keeps them as DocumentReference
      // resources that will later live inside the same document bundle.
      //
      // Typical example:
      // - PDF leaflet from the pharmacy
      // - photo of the medication box taken with the mobile camera
      //
      // The file can therefore be `application/pdf`, `image/png`,
      // `image/jpeg`, etc. The teaching point is the wrapper shape:
      // the attachment becomes one DocumentReference resource in the same
      // document section, not one loose top-level file.
      //
      // Important teaching rule:
      // - do not build the new resource as one raw claims object first
      // - let `BundleEditor` open the sibling resource slot
      // - then fill that resource through its typed editor surface
      // - again, `ensureIdentifier()` is the default path after creation; do
      //   not teach `setIdentifier(...)` here unless one special import/migrate
      //   flow really needs to replace the canonical identifier
      const addedDocumentReference = scenario.medicationDocumentEditor!
        .openEntry(scenario.medicationStatementIdentifier!)
        .asResourceType(BundleEditableResourceTypes.medicationStatement)
        .newContainedResourceAs(BundleEditableResourceTypes.documentReference);

      scenario.documentReferenceIdentifier = addedDocumentReference.ensureIdentifier();

      addedDocumentReference
        .setSubject(EXAMPLE_SUBJECT_DID)
        .setType(EXAMPLE_DOCUMENT_REFERENCE_TYPE)
        .setDescription(EXAMPLE_DOCUMENT_REFERENCE_DESCRIPTION)
        .setContentType(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF)
        .setContentData(EXAMPLE_DOCUMENT_REFERENCE_DATA_BASE64)
        .setAuthor(EXAMPLE_SUBJECT_DID)
        .setUserSelected(true)
        .setCategory(HealthcareBasicSections.HistoryOfMedicationUse.attributeValue)
        .setClaim(
          DocumentReferenceClaim.RelatesTo,
          `MedicationStatement/${scenario.medicationStatementIdentifier}`,
        )
        .setLanguage(EXAMPLE_DOCUMENT_REFERENCE_LANGUAGE)
        .doneEntry()
        .openEntry(scenario.documentReferenceIdentifier!)
        .asResourceType(BundleEditableResourceTypes.documentReference);

      const documentReferenceDraftBundleBuilt = scenario.medicationDocumentEditor!.buildJsonApi();
      const documentReferenceReader = new BundleReader(documentReferenceDraftBundleBuilt as unknown as Record<string, unknown>);

      expect(addedDocumentReference.getIdentifier()).toBe(scenario.documentReferenceIdentifier);
      expect(documentReferenceReader.getEntryClaimsByArrayIndex(0)[MedicationStatementClaim.Identifier]).toBe(
        scenario.medicationStatementIdentifier,
      );
      expect(documentReferenceReader.getEntryClaimsByArrayIndex(1)[DocumentReferenceClaim.Identifier]).toBe(
        scenario.documentReferenceIdentifier,
      );
      expect(documentReferenceReader.getEntryClaimsByArrayIndex(1)[DocumentReferenceClaim.ContentType]).toBe(
        EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF,
      );
      expect(scenario.documentReferenceIdentifier).toMatch(/^urn:uuid:/);
      expect(documentReferenceReader.getEntryCount()).toBe(2);
      expect(documentReferenceReader.getVisibleResourceCount({
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      })).toBe(2);
    });

    it('step 4: the frontend closes the current document section into one document bundle', () => {
      scenario.medicationDocumentBundle = scenario.medicationDocumentEditor!.buildDocument() as Record<string, unknown>;

      expect((scenario.medicationDocumentBundle as any).type).toBe(BundleTypes.document);
      expect((scenario.medicationDocumentBundle as any).entry?.[0]?.resource?.resourceType).toBe(
        ResourceTypesFhirR4.Composition,
      );
      expect((scenario.medicationDocumentBundle as any).entry?.[0]?.resource?.author).toEqual([
        { reference: EXAMPLE_SUBJECT_DID },
      ]);
      expect((scenario.medicationDocumentBundle as any).entry?.[0]?.resource?.section?.[0]?.entry).toEqual([
        { reference: `MedicationStatement/${scenario.medicationStatementIdentifier}` },
        { reference: `DocumentReference/${scenario.documentReferenceIdentifier}` },
      ]);
    });

    it('step 5: the frontend wraps the finished document in one delivery Communication', () => {
      scenario.deliverCommunication = new CommunicationEditor()
        .setCommunicationIdentifier(`${EXAMPLE_COMMUNICATION_IDENTIFIER}-medication-document`)
        .setCommunicationSubject(EXAMPLE_SUBJECT_DID)
        .setCommunicationCategory(CommunicationCategoryCodes.Notification.claim)
        .setCommunicationTopic(EXAMPLE_COMMUNICATION_TOPIC_MEDICATION_DOCUMENT)
        .setCommunicationText(EXAMPLE_COMMUNICATION_TEXT_MEDICATION_DOCUMENT_READY)
        .setAttachedBundle(scenario.medicationDocumentBundle as any);

      expect(scenario.deliverCommunication.getCommunicationIdentifier()).toBe(
        `${EXAMPLE_COMMUNICATION_IDENTIFIER}-medication-document`,
      );
      expect((scenario.deliverCommunication.getAttachedBundle() as any).type).toBe(BundleTypes.document);
    });

    it('step 6: the runtime/BFF renders that Communication into one DIDComm/plain payload', () => {
      // This is the boundary with runtime/BFF concerns:
      // the business payload is already finished before this step starts.
      //
      // In the real app/BFF story:
      // - the unlocked user profile wallet signs the DIDComm message
      // - the unlocked user profile wallet encrypts it for delivery
      // - the BFF or app runtime then places it on its outbox / queue
      // - in tests we stop here at DIDComm/plain because signing/encryption and
      //   queue adapters belong to `sdk-front`, `sdk-node`, and runtime
      //   adapters such as QueueMem / QueueSqlite, not to `common-utils`
      scenario.didcommPayload = buildDidcommPayloadFromCommunicationClaims({
        communicationClaims: scenario.deliverCommunication!.getCommunicationClaims(),
        iss: EXAMPLE_DIDCOMM_COMMUNICATION_ISS,
        aud: EXAMPLE_DIDCOMM_COMMUNICATION_AUD,
        jti: EXAMPLE_DIDCOMM_COMMUNICATION_JTI,
        thid: `${EXAMPLE_DIDCOMM_COMMUNICATION_THID}-medication-document`,
      }) as unknown as Record<string, unknown>;

      expect((scenario.didcommPayload as any).thid).toBe(
        `${EXAMPLE_DIDCOMM_COMMUNICATION_THID}-medication-document`,
      );
    });

    it('step 7: the frontend/BFF reads the same payload back and reopens the corrected medication', () => {
      scenario.receivedCommunication = CommunicationReader.fromDidcommPayload(
        scenario.didcommPayload as any,
      );
      scenario.receivedDocumentBundleReader = scenario.receivedCommunication.getAttachedBundleReader();

      const medicationEntryIndex = scenario.receivedDocumentBundleReader.getEntryIndexByIdentifier(
        scenario.medicationStatementIdentifier!,
      );
      const documentReferenceEntryIndex = scenario.receivedDocumentBundleReader.getEntryIndexByIdentifier(
        scenario.documentReferenceIdentifier!,
      );
      const visibleClinicalEntryIndexes = scenario.receivedDocumentBundleReader.getVisibleEntryIndexes({
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      });
      const sortedVisibleClinicalEntryIndexes = [...visibleClinicalEntryIndexes].sort((a, b) => a - b);
      const firstVisibleClinicalEntryIndex = sortedVisibleClinicalEntryIndexes[0];
      const secondVisibleClinicalEntryIndex = sortedVisibleClinicalEntryIndexes[1];

      expect(scenario.receivedCommunication.getCommunicationSubject()).toBe(EXAMPLE_SUBJECT_DID);
      expect(scenario.receivedCommunication.getAttachmentContentType()).toBe(EXAMPLE_CONTENT_TYPE_FHIR_JSON);
      expect(scenario.receivedDocumentBundleReader.getBundleType()).toBe(BundleTypes.document);
      expect(scenario.receivedDocumentBundleReader.getEntryCount()).toBeGreaterThan(2);
      expect(scenario.receivedDocumentBundleReader.getDocumentSectionCount()).toBe(1);
      expect(
        scenario.receivedDocumentBundleReader.getDocumentSectionResourceCount(
          HealthcareCoreSections.HistoryOfMedicationUse.attributeValue,
        ),
      ).toBe(2);
      expect(
        scenario.receivedDocumentBundleReader.getDocumentSectionResourceReferences(
          HealthcareCoreSections.HistoryOfMedicationUse.attributeValue,
        ),
      ).toEqual([
        `MedicationStatement/${scenario.medicationStatementIdentifier}`,
        `DocumentReference/${scenario.documentReferenceIdentifier}`,
      ]);
      const medicationIdsInSection =
        scenario.receivedDocumentBundleReader.getDocumentSectionResourceIds(
          HealthcareCoreSections.HistoryOfMedicationUse.attributeValue,
          {
            resourceTypes: [ResourceTypesFhirR4.MedicationStatement],
            dateFrom: EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
            dateTo: EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
          },
        );
      const medicationsInSection =
        scenario.receivedDocumentBundleReader.getDocumentSectionResourceEntries(
          HealthcareCoreSections.HistoryOfMedicationUse.attributeValue,
          {
            resourceTypes: [ResourceTypesFhirR4.MedicationStatement],
            dateFrom: EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
            dateTo: EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
          },
        );
      expect(medicationIdsInSection).toEqual([scenario.medicationStatementIdentifier]);
      expect(medicationsInSection).toHaveLength(1);
      expect(
        (medicationsInSection[0]?.resource as Record<string, unknown> | undefined)?.resourceType,
      ).toBe(
        ResourceTypesFhirR4.MedicationStatement,
      );
      expect(visibleClinicalEntryIndexes).toHaveLength(2);
      expect(scenario.receivedDocumentBundleReader.getVisibleResourceCount({
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      })).toBe(2);
      expect(scenario.receivedDocumentBundleReader.getEntryCount()).toBeGreaterThan(
        scenario.receivedDocumentBundleReader.getVisibleResourceCount({
          resourceTypes: [
            ResourceTypesFhirR4.MedicationStatement,
            ResourceTypesFhirR4.DocumentReference,
          ],
        }),
      );
      expect(scenario.receivedDocumentBundleReader.getVisibleEntryIndexByPosition(0, {
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      })).toBe(firstVisibleClinicalEntryIndex);
      expect(scenario.receivedDocumentBundleReader.getVisibleEntryIndexByPosition(1, {
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      })).toBe(secondVisibleClinicalEntryIndex);
      expect(scenario.receivedDocumentBundleReader.getNextVisibleEntryIndex(firstVisibleClinicalEntryIndex, {
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      })).toBe(secondVisibleClinicalEntryIndex);
      expect(scenario.receivedDocumentBundleReader.getPreviousVisibleEntryIndex(secondVisibleClinicalEntryIndex, {
        resourceTypes: [
          ResourceTypesFhirR4.MedicationStatement,
          ResourceTypesFhirR4.DocumentReference,
        ],
      })).toBe(firstVisibleClinicalEntryIndex);
      expect(medicationEntryIndex).toBeDefined();
      expect(visibleClinicalEntryIndexes).toContain(medicationEntryIndex as number);
      expect(
        scenario.receivedDocumentBundleReader.isContainedResourceEntryByArrayIndex(
          medicationEntryIndex as number,
        ),
      ).toBe(false);
      expect(
        scenario.receivedDocumentBundleReader.getEntryClaimsByArrayIndex(
          medicationEntryIndex as number,
        )[MedicationStatementClaim.MedicationText],
      ).toBe(EXAMPLE_MEDICATION_STATEMENT_TEXT_CORRECTED);
      expect(
        scenario.receivedDocumentBundleReader.getEntryClaimsByArrayIndex(
          medicationEntryIndex as number,
        )[MedicationStatementClaim.ContainedReferenceList],
      ).toBe(`DocumentReference/${scenario.documentReferenceIdentifier}`);
      expect(
        scenario.receivedDocumentBundleReader.getEntryClaimsByArrayIndex(
          medicationEntryIndex as number,
        )[MedicationStatementClaim.UserSelected],
      ).toBe(true);
      expect(documentReferenceEntryIndex).toBeDefined();
      expect(visibleClinicalEntryIndexes).toContain(documentReferenceEntryIndex as number);
      expect(
        scenario.receivedDocumentBundleReader.isContainedResourceEntryByArrayIndex(
          documentReferenceEntryIndex as number,
        ),
      ).toBe(false);
      expect(
        scenario.receivedDocumentBundleReader.getEntryClaimsByArrayIndex(
          documentReferenceEntryIndex as number,
        )[DocumentReferenceClaim.ContentType],
      ).toBe(EXAMPLE_DOCUMENT_REFERENCE_CONTENT_TYPE_PDF);
      expect(
        scenario.receivedDocumentBundleReader.getEntryClaimsByArrayIndex(
          documentReferenceEntryIndex as number,
        )[DocumentReferenceClaim.Author],
      ).toBe(EXAMPLE_SUBJECT_DID);
      expect(
        scenario.receivedDocumentBundleReader.getEntryClaimsByArrayIndex(
          documentReferenceEntryIndex as number,
        )[DocumentReferenceClaim.UserSelected],
      ).toBe(true);
    });
  });

  describe('error path: document authoring constraints are incomplete', () => {
    it('shows how the frontend/runtime should stop before transport when the document bundle misses required Composition-level data', () => {
      const incompleteDocumentEditor = new BundleEditor()
        .setBundleOperation(EmployeeBundleOperations.create)
        .setBundleType(BundleTypes.document)
        .setCompositionSubject(EXAMPLE_SUBJECT_DID)
        .setCompositionType(HealthcareDocumentTypes.IPS.attributeValue)
        .newEntryAs(BundleEditableResourceTypes.medicationStatement, EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER)
        .setIdentifier(EXAMPLE_MEDICATION_STATEMENT_IDENTIFIER)
        .setSubject(EXAMPLE_SUBJECT_DID)
        .setStatus(MedicationStatementStatuses.Active)
        .setCode(EXAMPLE_MEDICATION_STATEMENT_CODE)
        .setMedicationText(EXAMPLE_MEDICATION_STATEMENT_TEXT)
        .doneEntry();

      expect(incompleteDocumentEditor.validateDocumentAuthoring()).toEqual({
        ok: false,
        issues: [
          BundleEditorValidationIssues.CompositionTitleRequired,
          BundleEditorValidationIssues.CompositionDateRequired,
          BundleEditorValidationIssues.CompositionAuthorRequired,
        ],
      });
      expect(() => incompleteDocumentEditor.buildDocument()).toThrow(
        'BundleEditor cannot build document:',
      );
    });
  });
});
