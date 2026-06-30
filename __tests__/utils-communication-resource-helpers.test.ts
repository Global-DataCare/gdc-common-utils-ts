import { describe, expect, it } from '@jest/globals';
import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { Format } from '../src/constants/Schemas.js';
import { AppointmentResponseClaim } from '../src/models/interoperable-claims/appointment-response-claims.js';
import { CarePlanClaim } from '../src/models/interoperable-claims/care-plan-claims.js';
import { ClinicalImpressionClaim } from '../src/models/interoperable-claims/clinical-impression-claims.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';
import { CompositionClaim } from '../src/models/interoperable-claims/composition-claims.js';
import { CoverageClaim } from '../src/models/interoperable-claims/coverage-claims.js';
import { DeviceClaim } from '../src/models/interoperable-claims/device-claims.js';
import { DeviceUseStatementClaim } from '../src/models/interoperable-claims/device-use-statement-claims.js';
import { EncounterClaim } from '../src/models/interoperable-claims/encounter-claims.js';
import { FlagClaim } from '../src/models/interoperable-claims/flag-claims.js';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims.js';
import { LocationClaim } from '../src/models/interoperable-claims/location-claims.js';
import { OrganizationClaim } from '../src/models/interoperable-claims/organization-claims.js';
import { ProcedureClaim } from '../src/models/interoperable-claims/procedure-claims.js';
import { RelatedPersonClaim } from '../src/models/interoperable-claims/related-person-claims.js';
import {
  EXAMPLE_APPOINTMENT_IDENTIFIER,
  EXAMPLE_APPOINTMENT_PARTICIPANT_STATUS,
} from '../src/examples/communication-didcomm-payload.js';
import {
  EXAMPLE_APPOINTMENT_RESPONSE_IDENTIFIER,
  EXAMPLE_CARE_PLAN_CATEGORY,
  EXAMPLE_CARE_PLAN_DATE,
  EXAMPLE_CARE_PLAN_ENCOUNTER_REFERENCE,
  EXAMPLE_CARE_PLAN_IDENTIFIER,
  EXAMPLE_CARE_PLAN_INTENT_PLAN,
  EXAMPLE_CARE_PLAN_NOTE,
  EXAMPLE_CARE_PLAN_STATUS_ACTIVE,
  EXAMPLE_CLINICAL_IMPRESSION_ASSESSOR_REFERENCE,
  EXAMPLE_CLINICAL_IMPRESSION_DESCRIPTION,
  EXAMPLE_CLINICAL_IMPRESSION_EFFECTIVE_DATE_TIME,
  EXAMPLE_CLINICAL_IMPRESSION_ENCOUNTER_REFERENCE,
  EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER,
  EXAMPLE_CLINICAL_IMPRESSION_STATUS_COMPLETED,
  EXAMPLE_CLINICAL_IMPRESSION_SUMMARY,
  EXAMPLE_COMMUNICATION_IDENTIFIER,
  EXAMPLE_COVERAGE_IDENTIFIER,
  EXAMPLE_COVERAGE_PAYOR_REFERENCE,
  EXAMPLE_COVERAGE_PERIOD_END,
  EXAMPLE_COVERAGE_PERIOD_START,
  EXAMPLE_COVERAGE_POLICY_HOLDER_REFERENCE,
  EXAMPLE_COVERAGE_RELATIONSHIP,
  EXAMPLE_COVERAGE_STATUS_ACTIVE,
  EXAMPLE_COVERAGE_SUBSCRIBER_REFERENCE,
  EXAMPLE_COVERAGE_TYPE,
  EXAMPLE_DEVICE_IDENTIFIER,
  EXAMPLE_DEVICE_LOCATION_REFERENCE,
  EXAMPLE_DEVICE_MANUFACTURER,
  EXAMPLE_DEVICE_MODEL,
  EXAMPLE_DEVICE_NAME,
  EXAMPLE_DEVICE_NOTE,
  EXAMPLE_DEVICE_ORGANIZATION_REFERENCE,
  EXAMPLE_DEVICE_SERIAL_NUMBER,
  EXAMPLE_DEVICE_STATUS_ACTIVE,
  EXAMPLE_DEVICE_TYPE,
  EXAMPLE_DEVICE_URL,
  EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER,
  EXAMPLE_DEVICE_USE_STATEMENT_REASON_CODE,
  EXAMPLE_DEVICE_USE_STATEMENT_RECORDED_ON,
  EXAMPLE_DEVICE_USE_STATEMENT_SOURCE,
  EXAMPLE_DEVICE_USE_STATEMENT_STATUS_ACTIVE,
  EXAMPLE_DEVICE_USE_STATEMENT_TIMING_DATE_TIME,
  EXAMPLE_ENCOUNTER_CLASS,
  EXAMPLE_ENCOUNTER_IDENTIFIER,
  EXAMPLE_ENCOUNTER_PARTICIPANT_REFERENCE,
  EXAMPLE_ENCOUNTER_PERIOD_END,
  EXAMPLE_ENCOUNTER_PERIOD_START,
  EXAMPLE_ENCOUNTER_REASON_CODE,
  EXAMPLE_ENCOUNTER_SERVICE_PROVIDER_REFERENCE,
  EXAMPLE_ENCOUNTER_STATUS_FINISHED,
  EXAMPLE_ENCOUNTER_TYPE,
  EXAMPLE_FLAG_CATEGORY,
  EXAMPLE_FLAG_CODE,
  EXAMPLE_FLAG_DATE,
  EXAMPLE_FLAG_ENCOUNTER_REFERENCE,
  EXAMPLE_FLAG_IDENTIFIER,
  EXAMPLE_FLAG_PERIOD_END,
  EXAMPLE_FLAG_PERIOD_START,
  EXAMPLE_FLAG_STATUS_ACTIVE,
  EXAMPLE_IMMUNIZATION_DATE,
  EXAMPLE_IMMUNIZATION_DOSE_SEQUENCE,
  EXAMPLE_IMMUNIZATION_IDENTIFIER,
  EXAMPLE_IMMUNIZATION_LOCATION_REFERENCE,
  EXAMPLE_IMMUNIZATION_LOT_NUMBER,
  EXAMPLE_IMMUNIZATION_MANUFACTURER_REFERENCE,
  EXAMPLE_IMMUNIZATION_NOTE,
  EXAMPLE_IMMUNIZATION_PERFORMER_REFERENCE,
  EXAMPLE_IMMUNIZATION_REASON_CODE,
  EXAMPLE_IMMUNIZATION_REACTION_DATE,
  EXAMPLE_IMMUNIZATION_SERIES,
  EXAMPLE_IMMUNIZATION_STATUS_COMPLETED,
  EXAMPLE_IMMUNIZATION_STATUS_REASON,
  EXAMPLE_IMMUNIZATION_TARGET_DISEASE,
  EXAMPLE_IMMUNIZATION_VACCINE_CODE,
  EXAMPLE_IPS_COMPOSITION_IDENTIFIER,
  EXAMPLE_ORGANIZATION_LEGAL_NAME,
  EXAMPLE_PROCEDURE_BASED_ON_REFERENCE,
  EXAMPLE_PROCEDURE_CODE,
  EXAMPLE_PROCEDURE_DATE,
  EXAMPLE_PROCEDURE_ENCOUNTER_REFERENCE,
  EXAMPLE_PROCEDURE_IDENTIFIER,
  EXAMPLE_PROCEDURE_LOCATION_REFERENCE,
  EXAMPLE_PROCEDURE_NOTE,
  EXAMPLE_PROCEDURE_PERFORMER_REFERENCE,
  EXAMPLE_PROCEDURE_REASON_CODE,
  EXAMPLE_PROCEDURE_REASON_REFERENCE,
  EXAMPLE_PROCEDURE_STATUS_COMPLETED,
  EXAMPLE_PROVIDER_ORGANIZATION_URL,
  EXAMPLE_RELATED_PERSON_ACTIVE_NAME,
  EXAMPLE_RELATED_PERSON_IDENTIFIER,
  EXAMPLE_RELATED_PERSON_ROLE,
  EXAMPLE_SUBJECT_DID,
} from '../src/examples/shared.js';
import { CommunicationAttachedBundleSession } from '../src/utils/communication-attached-bundle-session.js';

describe('utils/communication resource helpers', () => {
  it('supports additional clinical resource helpers carried inside Communication', () => {
    /**
     * Hint:
     * - the outer `Communication` envelope uses `FHIR_R4` because it is shaped
     *   as one FHIR resource container
     * - every inner `resource.meta.claims` payload uses `FHIR_API` because the
     *   stored claims must stay version-agnostic and reusable across runtimes
     */
    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        // Newbie hint:
        // this is the transport/container layer. We are still describing one
        // FHIR `Communication`, so the outer context stays `FHIR_R4`.
        '@context': Format.FHIR_R4,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    session.upsertActiveCarePlanEntry({
      claims: {
        // Newbie hint:
        // inside the attached bundle we store neutral canonical claims, not
        // one version-locked FHIR JSON resource snapshot. That is why these
        // inner claim rows use `FHIR_API`.
        '@context': Format.FHIR_API,
        [CarePlanClaim.Identifier]: EXAMPLE_CARE_PLAN_IDENTIFIER,
        [CarePlanClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CarePlanClaim.Status]: EXAMPLE_CARE_PLAN_STATUS_ACTIVE,
        [CarePlanClaim.Intent]: EXAMPLE_CARE_PLAN_INTENT_PLAN,
        [CarePlanClaim.Category]: EXAMPLE_CARE_PLAN_CATEGORY,
        [CarePlanClaim.Date]: EXAMPLE_CARE_PLAN_DATE,
        [CarePlanClaim.Encounter]: EXAMPLE_CARE_PLAN_ENCOUNTER_REFERENCE,
        [CarePlanClaim.Note]: EXAMPLE_CARE_PLAN_NOTE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_CARE_PLAN_IDENTIFIER}`,
    });
    session.upsertActiveProcedureEntry({
      claims: {
        '@context': Format.FHIR_API,
        [ProcedureClaim.Identifier]: EXAMPLE_PROCEDURE_IDENTIFIER,
        [ProcedureClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [ProcedureClaim.Status]: EXAMPLE_PROCEDURE_STATUS_COMPLETED,
        [ProcedureClaim.Date]: EXAMPLE_PROCEDURE_DATE,
        [ProcedureClaim.Code]: EXAMPLE_PROCEDURE_CODE,
        [ProcedureClaim.Encounter]: EXAMPLE_PROCEDURE_ENCOUNTER_REFERENCE,
        [ProcedureClaim.Location]: EXAMPLE_PROCEDURE_LOCATION_REFERENCE,
        [ProcedureClaim.ReasonCode]: EXAMPLE_PROCEDURE_REASON_CODE,
        [ProcedureClaim.ReasonReference]: EXAMPLE_PROCEDURE_REASON_REFERENCE,
        [ProcedureClaim.Performer]: EXAMPLE_PROCEDURE_PERFORMER_REFERENCE,
        [ProcedureClaim.BasedOn]: EXAMPLE_PROCEDURE_BASED_ON_REFERENCE,
        [ProcedureClaim.Note]: EXAMPLE_PROCEDURE_NOTE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_PROCEDURE_IDENTIFIER}`,
    });
    session.upsertActiveImmunizationEntry({
      claims: {
        '@context': Format.FHIR_API,
        [ImmunizationClaim.Identifier]: EXAMPLE_IMMUNIZATION_IDENTIFIER,
        [ImmunizationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [ImmunizationClaim.Status]: EXAMPLE_IMMUNIZATION_STATUS_COMPLETED,
        [ImmunizationClaim.Date]: EXAMPLE_IMMUNIZATION_DATE,
        [ImmunizationClaim.VaccineCode]: EXAMPLE_IMMUNIZATION_VACCINE_CODE,
        [ImmunizationClaim.Location]: EXAMPLE_IMMUNIZATION_LOCATION_REFERENCE,
        [ImmunizationClaim.Manufacturer]: EXAMPLE_IMMUNIZATION_MANUFACTURER_REFERENCE,
        [ImmunizationClaim.LotNumber]: EXAMPLE_IMMUNIZATION_LOT_NUMBER,
        [ImmunizationClaim.Performer]: EXAMPLE_IMMUNIZATION_PERFORMER_REFERENCE,
        [ImmunizationClaim.ReasonCode]: EXAMPLE_IMMUNIZATION_REASON_CODE,
        [ImmunizationClaim.StatusReason]: EXAMPLE_IMMUNIZATION_STATUS_REASON,
        [ImmunizationClaim.TargetDisease]: EXAMPLE_IMMUNIZATION_TARGET_DISEASE,
        [ImmunizationClaim.DoseSequence]: EXAMPLE_IMMUNIZATION_DOSE_SEQUENCE,
        [ImmunizationClaim.Series]: EXAMPLE_IMMUNIZATION_SERIES,
        [ImmunizationClaim.ReactionDate]: EXAMPLE_IMMUNIZATION_REACTION_DATE,
        [ImmunizationClaim.Note]: EXAMPLE_IMMUNIZATION_NOTE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_IMMUNIZATION_IDENTIFIER}`,
    });
    session.upsertActiveEncounterEntry({
      claims: {
        '@context': Format.FHIR_API,
        [EncounterClaim.Identifier]: EXAMPLE_ENCOUNTER_IDENTIFIER,
        [EncounterClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [EncounterClaim.Status]: EXAMPLE_ENCOUNTER_STATUS_FINISHED,
        [EncounterClaim.Class]: EXAMPLE_ENCOUNTER_CLASS,
        [EncounterClaim.Type]: EXAMPLE_ENCOUNTER_TYPE,
        [EncounterClaim.Participant]: EXAMPLE_ENCOUNTER_PARTICIPANT_REFERENCE,
        [EncounterClaim.ServiceProvider]: EXAMPLE_ENCOUNTER_SERVICE_PROVIDER_REFERENCE,
        [EncounterClaim.PeriodStart]: EXAMPLE_ENCOUNTER_PERIOD_START,
        [EncounterClaim.PeriodEnd]: EXAMPLE_ENCOUNTER_PERIOD_END,
        [EncounterClaim.ReasonCode]: EXAMPLE_ENCOUNTER_REASON_CODE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_ENCOUNTER_IDENTIFIER}`,
    });
    session.upsertActiveFlagEntry({
      claims: {
        '@context': Format.FHIR_API,
        [FlagClaim.Identifier]: EXAMPLE_FLAG_IDENTIFIER,
        [FlagClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [FlagClaim.Status]: EXAMPLE_FLAG_STATUS_ACTIVE,
        [FlagClaim.Category]: EXAMPLE_FLAG_CATEGORY,
        [FlagClaim.Code]: EXAMPLE_FLAG_CODE,
        [FlagClaim.Date]: EXAMPLE_FLAG_DATE,
        [FlagClaim.Encounter]: EXAMPLE_FLAG_ENCOUNTER_REFERENCE,
        [FlagClaim.PeriodStart]: EXAMPLE_FLAG_PERIOD_START,
        [FlagClaim.PeriodEnd]: EXAMPLE_FLAG_PERIOD_END,
      },
      fullUrl: `urn:uuid:${EXAMPLE_FLAG_IDENTIFIER}`,
    });
    session.upsertActiveClinicalImpressionEntry({
      claims: {
        '@context': Format.FHIR_API,
        [ClinicalImpressionClaim.Identifier]: EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER,
        [ClinicalImpressionClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [ClinicalImpressionClaim.Status]: EXAMPLE_CLINICAL_IMPRESSION_STATUS_COMPLETED,
        [ClinicalImpressionClaim.Description]: EXAMPLE_CLINICAL_IMPRESSION_DESCRIPTION,
        [ClinicalImpressionClaim.Encounter]: EXAMPLE_CLINICAL_IMPRESSION_ENCOUNTER_REFERENCE,
        [ClinicalImpressionClaim.EffectiveDateTime]: EXAMPLE_CLINICAL_IMPRESSION_EFFECTIVE_DATE_TIME,
        [ClinicalImpressionClaim.Assessor]: EXAMPLE_CLINICAL_IMPRESSION_ASSESSOR_REFERENCE,
        [ClinicalImpressionClaim.Summary]: EXAMPLE_CLINICAL_IMPRESSION_SUMMARY,
      },
      fullUrl: `urn:uuid:${EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER}`,
    });
    session.upsertActiveCoverageEntry({
      claims: {
        '@context': Format.FHIR_API,
        [CoverageClaim.Identifier]: EXAMPLE_COVERAGE_IDENTIFIER,
        [CoverageClaim.Status]: EXAMPLE_COVERAGE_STATUS_ACTIVE,
        [CoverageClaim.Type]: EXAMPLE_COVERAGE_TYPE,
        [CoverageClaim.PolicyHolder]: EXAMPLE_COVERAGE_POLICY_HOLDER_REFERENCE,
        [CoverageClaim.Subscriber]: EXAMPLE_COVERAGE_SUBSCRIBER_REFERENCE,
        [CoverageClaim.Beneficiary]: EXAMPLE_SUBJECT_DID,
        [CoverageClaim.Relationship]: EXAMPLE_COVERAGE_RELATIONSHIP,
        [CoverageClaim.PeriodStart]: EXAMPLE_COVERAGE_PERIOD_START,
        [CoverageClaim.PeriodEnd]: EXAMPLE_COVERAGE_PERIOD_END,
        [CoverageClaim.Payor]: EXAMPLE_COVERAGE_PAYOR_REFERENCE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_COVERAGE_IDENTIFIER}`,
    });

    session.saveAndReleaseActiveEntry();

    // The outer `Communication.subject` is synchronized from the active entry
    // subject so the transport envelope still points to the same patient.
    expect(session.getCommunicationClaims()[CommunicationClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
    // These assertions prove that the helper names map to the expected bundle
    // resource types and stable identifiers after save/release.
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.CarePlan] })).toEqual([EXAMPLE_CARE_PLAN_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Procedure] })).toEqual([EXAMPLE_PROCEDURE_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Immunization] })).toEqual([EXAMPLE_IMMUNIZATION_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Encounter] })).toEqual([EXAMPLE_ENCOUNTER_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Flag] })).toEqual([EXAMPLE_FLAG_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.ClinicalImpression] })).toEqual([EXAMPLE_CLINICAL_IMPRESSION_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Coverage] })).toEqual([EXAMPLE_COVERAGE_IDENTIFIER]);
  });

  it('supports operational/schedule/directory resource helpers carried inside Communication', () => {
    /**
     * Hint:
     * - resource helpers below still write `FHIR_API` claims even when the
     *   business resource is not strictly "clinical"
     * - this keeps the inner bundle rows neutral while the outer
     *   `Communication` stays the transport-compatible FHIR R4 shell
     */
    const session = new CommunicationAttachedBundleSession({
      communicationClaims: {
        // Outer transport shell: still one `Communication`.
        '@context': Format.FHIR_R4,
        [CommunicationClaim.Identifier]: EXAMPLE_COMMUNICATION_IDENTIFIER,
        [CommunicationClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CommunicationClaim.Category]: CommunicationCategoryCodes.Notification.claim,
      },
    });

    session.upsertActiveDeviceEntry({
      claims: {
        '@context': Format.FHIR_API,
        [DeviceClaim.Identifier]: EXAMPLE_DEVICE_IDENTIFIER,
        [DeviceClaim.Patient]: EXAMPLE_SUBJECT_DID,
        [DeviceClaim.Status]: EXAMPLE_DEVICE_STATUS_ACTIVE,
        [DeviceClaim.Type]: EXAMPLE_DEVICE_TYPE,
        [DeviceClaim.Manufacturer]: EXAMPLE_DEVICE_MANUFACTURER,
        [DeviceClaim.Model]: EXAMPLE_DEVICE_MODEL,
        [DeviceClaim.DeviceName]: EXAMPLE_DEVICE_NAME,
        [DeviceClaim.SerialNumber]: EXAMPLE_DEVICE_SERIAL_NUMBER,
        [DeviceClaim.Organization]: EXAMPLE_DEVICE_ORGANIZATION_REFERENCE,
        [DeviceClaim.Location]: EXAMPLE_DEVICE_LOCATION_REFERENCE,
        [DeviceClaim.Url]: EXAMPLE_DEVICE_URL,
        [DeviceClaim.Note]: EXAMPLE_DEVICE_NOTE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_DEVICE_IDENTIFIER}`,
    });
    session.upsertActiveDeviceUseStatementEntry({
      claims: {
        '@context': Format.FHIR_API,
        [DeviceUseStatementClaim.Identifier]: EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER,
        [DeviceUseStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [DeviceUseStatementClaim.Status]: EXAMPLE_DEVICE_USE_STATEMENT_STATUS_ACTIVE,
        [DeviceUseStatementClaim.Device]: EXAMPLE_DEVICE_IDENTIFIER,
        [DeviceUseStatementClaim.RecordedOn]: EXAMPLE_DEVICE_USE_STATEMENT_RECORDED_ON,
        [DeviceUseStatementClaim.TimingDateTime]: EXAMPLE_DEVICE_USE_STATEMENT_TIMING_DATE_TIME,
        [DeviceUseStatementClaim.ReasonCode]: EXAMPLE_DEVICE_USE_STATEMENT_REASON_CODE,
        [DeviceUseStatementClaim.Source]: EXAMPLE_DEVICE_USE_STATEMENT_SOURCE,
      },
      fullUrl: `urn:uuid:${EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER}`,
    });
    session.upsertActiveAppointmentResponseEntry({
      claims: {
        '@context': Format.FHIR_API,
        [AppointmentResponseClaim.Identifier]: EXAMPLE_APPOINTMENT_RESPONSE_IDENTIFIER,
        [AppointmentResponseClaim.Appointment]: EXAMPLE_APPOINTMENT_IDENTIFIER,
        [AppointmentResponseClaim.Actor]: EXAMPLE_SUBJECT_DID,
        [AppointmentResponseClaim.Patient]: EXAMPLE_SUBJECT_DID,
        [AppointmentResponseClaim.ParticipantStatus]: EXAMPLE_APPOINTMENT_PARTICIPANT_STATUS,
      },
      fullUrl: `urn:uuid:${EXAMPLE_APPOINTMENT_RESPONSE_IDENTIFIER}`,
    });
    session.upsertActiveCompositionEntry({
      claims: {
        '@context': Format.FHIR_API,
        [CompositionClaim.Identifier]: EXAMPLE_IPS_COMPOSITION_IDENTIFIER,
        [CompositionClaim.Subject]: EXAMPLE_SUBJECT_DID,
        [CompositionClaim.Title]: EXAMPLE_ORGANIZATION_LEGAL_NAME,
      },
      fullUrl: `urn:uuid:${EXAMPLE_IPS_COMPOSITION_IDENTIFIER}`,
    });
    session.upsertActiveLocationEntry({
      claims: {
        '@context': Format.FHIR_API,
        [LocationClaim.Identifier]: EXAMPLE_DEVICE_LOCATION_REFERENCE,
        [LocationClaim.Name]: EXAMPLE_PROVIDER_ORGANIZATION_URL,
      },
      fullUrl: `urn:uuid:${EXAMPLE_DEVICE_LOCATION_REFERENCE}`,
    });
    session.upsertActiveOrganizationEntry({
      claims: {
        '@context': Format.FHIR_API,
        [OrganizationClaim.Identifier]: EXAMPLE_DEVICE_ORGANIZATION_REFERENCE,
        [OrganizationClaim.Name]: EXAMPLE_ORGANIZATION_LEGAL_NAME,
      },
      fullUrl: `urn:uuid:${EXAMPLE_DEVICE_ORGANIZATION_REFERENCE}`,
    });
    session.upsertActiveRelatedPersonEntry({
      claims: {
        '@context': Format.FHIR_API,
        /**
         * Hint:
         * - identity/directory resources may expose a legacy search-style
         *   `Identifier` plus one exact storage/business value
         *   `IdentifierValue`
         * - when both exist, `IdentifierValue` is the preferred stable value
         *   for storage/upsert identity in this low-level session
         * - clinical resources usually only expose one canonical
         *   `*.identifier`, so this duality appears mostly in identity-like
         *   catalogs such as `RelatedPerson`
         */
        // Newbie hint:
        // `IdentifierValue` here is not "just another field". It is the exact
        // stable business/storage value we want the low-level session to use
        // for upsert identity. This is why the test asserts the resulting
        // resource id with that value, not with some separate search alias.
        [RelatedPersonClaim.IdentifierValue]: EXAMPLE_RELATED_PERSON_IDENTIFIER,
        [RelatedPersonClaim.Patient]: EXAMPLE_SUBJECT_DID,
        [RelatedPersonClaim.Relationship]: EXAMPLE_RELATED_PERSON_ROLE,
        [RelatedPersonClaim.Name]: EXAMPLE_RELATED_PERSON_ACTIVE_NAME,
      },
      fullUrl: `urn:uuid:${EXAMPLE_RELATED_PERSON_IDENTIFIER}`,
    });

    session.saveAndReleaseActiveEntry();

    // The transport envelope still follows the business subject resolved from
    // the inner entries, even for mixed directory/operational payloads.
    expect(session.getCommunicationClaims()[CommunicationClaim.Subject]).toBe(EXAMPLE_SUBJECT_DID);
    // The bundle ids below demonstrate which claim is treated as the canonical
    // entry identity for each helper. In the identity-like `RelatedPerson`
    // case that means `IdentifierValue`.
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Device] })).toEqual([EXAMPLE_DEVICE_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.DeviceUseStatement] })).toEqual([EXAMPLE_DEVICE_USE_STATEMENT_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.AppointmentResponse] })).toEqual([EXAMPLE_APPOINTMENT_RESPONSE_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Composition] })).toEqual([EXAMPLE_IPS_COMPOSITION_IDENTIFIER]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Location] })).toEqual([EXAMPLE_DEVICE_LOCATION_REFERENCE]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.Organization] })).toEqual([EXAMPLE_DEVICE_ORGANIZATION_REFERENCE]);
    expect(session.getResourceIds({ resourceTypes: [ResourceTypesFhirR4.RelatedPerson] })).toEqual([EXAMPLE_RELATED_PERSON_IDENTIFIER]);
  });
});
