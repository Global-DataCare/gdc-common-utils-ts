// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1": {
    "resourceType": "AllergyIntolerance",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips",
    "version": "2.0.1",
    "name": "AllergyIntoleranceUvIps",
    "elements": [
      {
        "id": "AllergyIntolerance",
        "path": "AllergyIntolerance",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "AllergyIntolerance.extension",
        "path": "AllergyIntolerance.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "AllergyIntolerance.extension:abatement",
        "path": "AllergyIntolerance.extension",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/allergyintolerance-abatement|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "AllergyIntolerance.clinicalStatus",
        "path": "AllergyIntolerance.clinicalStatus",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/CodeableConcept-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/allergyintolerance-clinical|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "AllergyIntolerance.verificationStatus",
        "path": "AllergyIntolerance.verificationStatus",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/allergyintolerance-verification|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "AllergyIntolerance.type",
        "path": "AllergyIntolerance.type",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/allergy-intolerance-type|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "AllergyIntolerance.code",
        "path": "AllergyIntolerance.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/CodeableConcept-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips|2.0.1",
          "additionalValueSets": [
            "http://hl7.org/fhir/uv/ips/ValueSet/whoatc-uv-ips|2.0.1"
          ]
        }
      },
      {
        "id": "AllergyIntolerance.patient",
        "path": "AllergyIntolerance.patient",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "AllergyIntolerance.patient.reference",
        "path": "AllergyIntolerance.patient.reference",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle"
        ]
      },
      {
        "id": "AllergyIntolerance.onset[x]",
        "path": "AllergyIntolerance.onset[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime",
          "Age",
          "Period",
          "Range",
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "AllergyIntolerance.onset[x]:onsetDateTime",
        "path": "AllergyIntolerance.onset[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:able-to-populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "AllergyIntolerance.reaction",
        "path": "AllergyIntolerance.reaction",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "AllergyIntolerance.reaction.manifestation",
        "path": "AllergyIntolerance.reaction.manifestation",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/CodeableConcept-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/allergy-reaction-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "AllergyIntolerance.reaction.severity",
        "path": "AllergyIntolerance.reaction.severity",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/reaction-event-severity|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "AllergyIntolerance",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1"
  ],
  "interactions": [],
  "searchParameters": [
    {
      "code": "_content",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-content",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_filter",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-filter",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_has",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-has",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "_id",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-id",
      "expression": "Resource.id",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_in",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-in",
      "expression": "Resource.id",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "_language",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-language",
      "expression": "Resource.language",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "_lastUpdated",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-lastUpdated",
      "expression": "Resource.meta.lastUpdated",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_list",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-list",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "_profile",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-profile",
      "expression": "Resource.meta.profile",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_query",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-query",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_security",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-security",
      "expression": "Resource.meta.security",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_source",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-source",
      "expression": "Resource.meta.source",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_tag",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-tag",
      "expression": "Resource.meta.tag",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_text",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/DomainResource-text",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "_type",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Resource-type",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "asserter",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-asserter",
      "expression": "AllergyIntolerance.asserter",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-category",
      "expression": "AllergyIntolerance.category",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "clinical-status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-clinical-status",
      "expression": "AllergyIntolerance.clinicalStatus",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-code",
      "expression": "AdverseEvent.code | AllergyIntolerance.code | AllergyIntolerance.reaction.substance | AuditEvent.code | Basic.code | ChargeItem.code | Condition.code | DetectedIssue.code | DeviceRequest.code.concept | DiagnosticReport.code | FamilyMemberHistory.condition.code | ImagingSelection.status | List.code | Medication.code | MedicationAdministration.medication.concept | MedicationDispense.medication.concept | MedicationRequest.medication.concept | MedicationStatement.medication.concept | NutritionIntake.code | Observation.code | Procedure.code | RequestOrchestration.code | Task.code",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "criticality",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-criticality",
      "expression": "AllergyIntolerance.criticality",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-date",
      "expression": "AdverseEvent.occurrence.ofType(dateTime) | AdverseEvent.occurrence.ofType(Period) | AdverseEvent.occurrence.ofType(Timing) | AllergyIntolerance.recordedDate | (start | requestedPeriod.start).first() | AuditEvent.recorded | CarePlan.period | ClinicalImpression.date | Composition.date | Consent.date | DiagnosticReport.effective.ofType(dateTime) | DiagnosticReport.effective.ofType(Period) | DocumentReference.date | Encounter.actualPeriod | EpisodeOfCare.period | FamilyMemberHistory.date | Flag.period | (Immunization.occurrence.ofType(dateTime)) | ImmunizationEvaluation.date | ImmunizationRecommendation.date | Invoice.date | List.date | MeasureReport.date | NutritionIntake.occurrence.ofType(dateTime) | NutritionIntake.occurrence.ofType(Period) | Observation.effective.ofType(dateTime) | Observation.effective.ofType(Period) | Observation.effective.ofType(Timing) | Observation.effective.ofType(instant) | Procedure.occurrence.ofType(dateTime) | Procedure.occurrence.ofType(Period) | Procedure.occurrence.ofType(Timing) | ResearchSubject.period | (RiskAssessment.occurrence.ofType(dateTime)) | SupplyRequest.authoredOn",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "identifier",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-identifier",
      "expression": "Account.identifier | AdverseEvent.identifier | AllergyIntolerance.identifier | Appointment.identifier | AppointmentResponse.identifier | Basic.identifier | BodyStructure.identifier | CarePlan.identifier | CareTeam.identifier | ChargeItem.identifier | Claim.identifier | ClaimResponse.identifier | ClinicalImpression.identifier | Communication.identifier | CommunicationRequest.identifier | Composition.identifier | Condition.identifier | Consent.identifier | Contract.identifier | Coverage.identifier | CoverageEligibilityRequest.identifier | CoverageEligibilityResponse.identifier | DetectedIssue.identifier | DeviceRequest.identifier | DeviceUsage.identifier | DiagnosticReport.identifier | DocumentReference.identifier | Encounter.identifier | EnrollmentRequest.identifier | EpisodeOfCare.identifier | ExplanationOfBenefit.identifier | FamilyMemberHistory.identifier | Flag.identifier | Goal.identifier | GuidanceResponse.identifier | ImagingSelection.identifier | ImagingStudy.identifier | Immunization.identifier | ImmunizationEvaluation.identifier | ImmunizationRecommendation.identifier | Invoice.identifier | List.identifier | MeasureReport.identifier | Medication.identifier | MedicationAdministration.identifier | MedicationDispense.identifier | MedicationRequest.identifier | MedicationStatement.identifier | MolecularSequence.identifier | NutritionIntake.identifier | NutritionOrder.identifier | Observation.identifier | Person.identifier | Procedure.identifier | QuestionnaireResponse.identifier | RelatedPerson.identifier | RequestOrchestration.identifier | ResearchSubject.identifier | RiskAssessment.identifier | ServiceRequest.identifier | Specimen.identifier | SupplyDelivery.identifier | SupplyRequest.identifier | Task.identifier | VisionPrescription.identifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "last-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-last-date",
      "expression": "AllergyIntolerance.lastOccurrence",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "manifestation",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-manifestation",
      "expression": "AllergyIntolerance.reaction.manifestation",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "manifestation-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-manifestation-code",
      "expression": "AllergyIntolerance.reaction.manifestation.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "manifestation-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-manifestation-reference",
      "expression": "AllergyIntolerance.reaction.manifestation.reference",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "onset",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-onset",
      "expression": "AllergyIntolerance.reaction.onset",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "participant",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-participant",
      "expression": "AllergyIntolerance.participant.actor",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "patient",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-patient",
      "expression": "Account.subject.where(resolve() is Patient) | AdverseEvent.subject.where(resolve() is Patient) | AllergyIntolerance.patient | Appointment.participant.actor.where(resolve() is Patient) | Appointment.subject.where(resolve() is Patient) | AppointmentResponse.actor.where(resolve() is Patient) | AuditEvent.patient | Basic.subject.where(resolve() is Patient) | BodyStructure.patient | CarePlan.subject.where(resolve() is Patient) | CareTeam.subject.where(resolve() is Patient) | ChargeItem.subject.where(resolve() is Patient) | Claim.patient | ClaimResponse.patient | ClinicalImpression.subject.where(resolve() is Patient) | Communication.subject.where(resolve() is Patient) | CommunicationRequest.subject.where(resolve() is Patient) | Composition.subject.where(resolve() is Patient) | Condition.subject.where(resolve() is Patient) | Consent.subject.where(resolve() is Patient) | Contract.subject.where(resolve() is Patient) | Coverage.beneficiary | CoverageEligibilityRequest.patient | CoverageEligibilityResponse.patient | DetectedIssue.subject.where(resolve() is Patient) | DeviceRequest.subject.where(resolve() is Patient) | DeviceUsage.patient | DiagnosticReport.subject.where(resolve() is Patient) | DocumentReference.subject.where(resolve() is Patient) | Encounter.subject.where(resolve() is Patient) | EnrollmentRequest.candidate | EpisodeOfCare.patient | ExplanationOfBenefit.patient | FamilyMemberHistory.patient | Flag.subject.where(resolve() is Patient) | Goal.subject.where(resolve() is Patient) | GuidanceResponse.subject.where(resolve() is Patient) | ImagingSelection.subject.where(resolve() is Patient) | ImagingStudy.subject.where(resolve() is Patient) | Immunization.patient | ImmunizationEvaluation.patient | ImmunizationRecommendation.patient | Invoice.subject.where(resolve() is Patient) | List.subject.where(resolve() is Patient) | MeasureReport.subject.where(resolve() is Patient) | MedicationAdministration.subject.where(resolve() is Patient) | MedicationDispense.subject.where(resolve() is Patient) | MedicationRequest.subject.where(resolve() is Patient) | MedicationStatement.subject.where(resolve() is Patient) | MolecularSequence.subject.where(resolve() is Patient) | NutritionIntake.subject.where(resolve() is Patient) | NutritionOrder.subject.where(resolve() is Patient) | Observation.subject.where(resolve() is Patient) | Person.link.target.where(resolve() is Patient) | Procedure.subject.where(resolve() is Patient) | Provenance.patient | QuestionnaireResponse.subject.where(resolve() is Patient) | RelatedPerson.patient | RequestOrchestration.subject.where(resolve() is Patient) | ResearchSubject.subject.where(resolve() is Patient) | RiskAssessment.subject.where(resolve() is Patient) | ServiceRequest.subject.where(resolve() is Patient) | Specimen.subject.where(resolve() is Patient) | SupplyDelivery.patient | SupplyRequest.deliverFor | Task.for.where(resolve() is Patient) | VisionPrescription.patient",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "recorder",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-recorder",
      "expression": "AllergyIntolerance.recorder",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "route",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-route",
      "expression": "AllergyIntolerance.reaction.exposureRoute",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "severity",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-severity",
      "expression": "AllergyIntolerance.reaction.severity",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "type",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-type",
      "expression": "Account.type | AllergyIntolerance.type | Composition.type | Coverage.type | DocumentReference.type | Encounter.type | EpisodeOfCare.type | Invoice.type | MedicationDispense.type | MolecularSequence.type | Specimen.type",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "verification-status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/AllergyIntolerance-verification-status",
      "expression": "AllergyIntolerance.verificationStatus",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
