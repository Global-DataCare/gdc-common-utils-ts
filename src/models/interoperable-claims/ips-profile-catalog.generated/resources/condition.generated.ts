// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1": {
    "resourceType": "Condition",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips",
    "version": "2.0.1",
    "name": "ConditionUvIps",
    "elements": [
      {
        "id": "Condition",
        "path": "Condition",
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
        "id": "Condition.clinicalStatus",
        "path": "Condition.clinicalStatus",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/condition-clinical|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Condition.verificationStatus",
        "path": "Condition.verificationStatus",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/condition-ver-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Condition.category",
        "path": "Condition.category",
        "min": 0,
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
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/problem-type-uv-ips|2.0.1",
          "additionalValueSets": [
            "http://hl7.org/fhir/uv/ips/ValueSet/problem-type-loinc|2.0.1"
          ]
        }
      },
      {
        "id": "Condition.severity",
        "path": "Condition.severity",
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
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/condition-severity|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Condition.code",
        "path": "Condition.code",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/problems-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Condition.bodySite",
        "path": "Condition.bodySite",
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
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/body-site|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Condition.subject",
        "path": "Condition.subject",
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
        "id": "Condition.subject.reference",
        "path": "Condition.subject.reference",
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
        "id": "Condition.onset[x]",
        "path": "Condition.onset[x]",
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
        "id": "Condition.onset[x]:onsetDateTime",
        "path": "Condition.onset[x]",
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
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "Condition",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1"
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
      "code": "abatement-age",
      "type": "quantity",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-abatement-age",
      "expression": "Condition.abatement.ofType(Age) | Condition.abatement.ofType(Range)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "abatement-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-abatement-date",
      "expression": "Condition.abatement.ofType(dateTime) | Condition.abatement.ofType(Period)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "abatement-string",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-abatement-string",
      "expression": "Condition.abatement.ofType(string)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "asserter",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-asserter",
      "expression": "Condition.asserter",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "body-site",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-body-site",
      "expression": "Condition.bodySite",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-category",
      "expression": "Condition.category",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "clinical-status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-clinical-status",
      "expression": "Condition.clinicalStatus",
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
      "code": "encounter",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-encounter",
      "expression": "AuditEvent.encounter | CarePlan.encounter | ChargeItem.encounter | Claim.item.encounter | ClinicalImpression.encounter | Communication.encounter | CommunicationRequest.encounter | Composition.encounter | Condition.encounter | DeviceRequest.encounter | DiagnosticReport.encounter | EncounterHistory.encounter | ExplanationOfBenefit.item.encounter | Flag.encounter | ImagingStudy.encounter | List.encounter | MedicationDispense.encounter | MedicationStatement.encounter | NutritionIntake.encounter | NutritionOrder.encounter | Observation.encounter | Procedure.encounter | Provenance.encounter | QuestionnaireResponse.encounter | RequestOrchestration.encounter | RiskAssessment.encounter | ServiceRequest.encounter | Task.encounter | VisionPrescription.encounter",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "evidence",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-evidence",
      "expression": "Condition.evidence.concept",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "evidence-detail",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-evidence-detail",
      "expression": "Condition.evidence.reference",
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
      "code": "onset-age",
      "type": "quantity",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-onset-age",
      "expression": "Condition.onset.ofType(Age) | Condition.onset.ofType(Range)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "onset-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-onset-date",
      "expression": "Condition.onset.ofType(dateTime) | Condition.onset.ofType(Period)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "onset-info",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-onset-info",
      "expression": "Condition.onset.ofType(string)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "participant-actor",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-participant-actor",
      "expression": "Condition.participant.actor",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "participant-function",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-participant-function",
      "expression": "Condition.participant.function",
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
      "code": "recorded-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-recorded-date",
      "expression": "Condition.recordedDate",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "severity",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-severity",
      "expression": "Condition.severity",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "stage",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-stage",
      "expression": "Condition.stage.summary",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-subject",
      "expression": "Condition.subject",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "verification-status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Condition-verification-status",
      "expression": "Condition.verificationStatus",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
