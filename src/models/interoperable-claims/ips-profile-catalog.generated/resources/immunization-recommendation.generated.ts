// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1": {
    "resourceType": "ImmunizationRecommendation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation",
    "version": "4.0.1",
    "name": "ImmunizationRecommendation",
    "elements": [
      {
        "id": "ImmunizationRecommendation",
        "path": "ImmunizationRecommendation",
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
        "id": "ImmunizationRecommendation.id",
        "path": "ImmunizationRecommendation.id",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "http://hl7.org/fhirpath/System.String"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.meta",
        "path": "ImmunizationRecommendation.meta",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Meta"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.implicitRules",
        "path": "ImmunizationRecommendation.implicitRules",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.language",
        "path": "ImmunizationRecommendation.language",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/languages",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.text",
        "path": "ImmunizationRecommendation.text",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Narrative"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.contained",
        "path": "ImmunizationRecommendation.contained",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Resource"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.extension",
        "path": "ImmunizationRecommendation.extension",
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
        "id": "ImmunizationRecommendation.modifierExtension",
        "path": "ImmunizationRecommendation.modifierExtension",
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
        "id": "ImmunizationRecommendation.identifier",
        "path": "ImmunizationRecommendation.identifier",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Identifier"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.patient",
        "path": "ImmunizationRecommendation.patient",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.date",
        "path": "ImmunizationRecommendation.date",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "dateTime"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.authority",
        "path": "ImmunizationRecommendation.authority",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Organization"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation",
        "path": "ImmunizationRecommendation.recommendation",
        "min": 1,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.id",
        "path": "ImmunizationRecommendation.recommendation.id",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "http://hl7.org/fhirpath/System.String"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.extension",
        "path": "ImmunizationRecommendation.recommendation.extension",
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
        "id": "ImmunizationRecommendation.recommendation.modifierExtension",
        "path": "ImmunizationRecommendation.recommendation.modifierExtension",
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
        "id": "ImmunizationRecommendation.recommendation.vaccineCode",
        "path": "ImmunizationRecommendation.recommendation.vaccineCode",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/vaccine-code",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.recommendation.targetDisease",
        "path": "ImmunizationRecommendation.recommendation.targetDisease",
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
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/immunization-recommendation-target-disease",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.recommendation.contraindicatedVaccineCode",
        "path": "ImmunizationRecommendation.recommendation.contraindicatedVaccineCode",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/vaccine-code",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.recommendation.forecastStatus",
        "path": "ImmunizationRecommendation.recommendation.forecastStatus",
        "min": 1,
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
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/immunization-recommendation-status",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.recommendation.forecastReason",
        "path": "ImmunizationRecommendation.recommendation.forecastReason",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/immunization-recommendation-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.recommendation.dateCriterion",
        "path": "ImmunizationRecommendation.recommendation.dateCriterion",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.dateCriterion.id",
        "path": "ImmunizationRecommendation.recommendation.dateCriterion.id",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "http://hl7.org/fhirpath/System.String"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.dateCriterion.extension",
        "path": "ImmunizationRecommendation.recommendation.dateCriterion.extension",
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
        "id": "ImmunizationRecommendation.recommendation.dateCriterion.modifierExtension",
        "path": "ImmunizationRecommendation.recommendation.dateCriterion.modifierExtension",
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
        "id": "ImmunizationRecommendation.recommendation.dateCriterion.code",
        "path": "ImmunizationRecommendation.recommendation.dateCriterion.code",
        "min": 1,
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
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/immunization-recommendation-date-criterion",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImmunizationRecommendation.recommendation.dateCriterion.value",
        "path": "ImmunizationRecommendation.recommendation.dateCriterion.value",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "dateTime"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.description",
        "path": "ImmunizationRecommendation.recommendation.description",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.series",
        "path": "ImmunizationRecommendation.recommendation.series",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.doseNumber[x]",
        "path": "ImmunizationRecommendation.recommendation.doseNumber[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "positiveInt",
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.seriesDoses[x]",
        "path": "ImmunizationRecommendation.recommendation.seriesDoses[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "positiveInt",
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.supportingImmunization",
        "path": "ImmunizationRecommendation.recommendation.supportingImmunization",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Immunization",
          "http://hl7.org/fhir/StructureDefinition/ImmunizationEvaluation"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImmunizationRecommendation.recommendation.supportingPatientInformation",
        "path": "ImmunizationRecommendation.recommendation.supportingPatientInformation",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Resource"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "ImmunizationRecommendation",
  "supportedProfiles": [],
  "profiles": [
    "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1"
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
      "code": "information",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-information",
      "expression": "ImmunizationRecommendation.recommendation.supportingPatientInformation",
      "fhirVersions": [
        "4.0.1",
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
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-status",
      "expression": "ImmunizationRecommendation.recommendation.forecastStatus",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "support",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-support",
      "expression": "ImmunizationRecommendation.recommendation.supportingImmunization",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "target-disease",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-target-disease",
      "expression": "ImmunizationRecommendation.recommendation.targetDisease",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "vaccine-type",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImmunizationRecommendation-vaccine-type",
      "expression": "ImmunizationRecommendation.recommendation.vaccineCode",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
