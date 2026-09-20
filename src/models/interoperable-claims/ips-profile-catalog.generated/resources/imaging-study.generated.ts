// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1": {
    "resourceType": "ImagingStudy",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips",
    "version": "2.0.1",
    "name": "ImagingStudyUvIps",
    "elements": [
      {
        "id": "ImagingStudy.identifier",
        "path": "ImagingStudy.identifier",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Identifier"
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
        "id": "ImagingStudy.status",
        "path": "ImagingStudy.status",
        "min": 1,
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
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/imaging-study-status-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImagingStudy.subject",
        "path": "ImagingStudy.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1",
          "http://hl7.org/fhir/StructureDefinition/Group|4.0.1"
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
        "id": "ImagingStudy.subject.reference",
        "path": "ImagingStudy.subject.reference",
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
        "id": "ImagingStudy.started",
        "path": "ImagingStudy.started",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime"
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
        "id": "ImagingStudy.procedureCode",
        "path": "ImagingStudy.procedureCode",
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
          "valueSet": "http://www.rsna.org/RadLex_Playbook.aspx",
          "additionalValueSets": [
            "http://hl7.org/fhir/uv/ips/ValueSet/results-radiology-observations-uv-ips|2.0.1"
          ]
        }
      },
      {
        "id": "ImagingStudy.reasonCode",
        "path": "ImagingStudy.reasonCode",
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
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/procedure-reason|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImagingStudy.series",
        "path": "ImagingStudy.series",
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
        "id": "ImagingStudy.series.uid",
        "path": "ImagingStudy.series.uid",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "id"
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
        "id": "ImagingStudy.series.modality",
        "path": "ImagingStudy.series.modality",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
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
          "strength": "extensible",
          "valueSet": "http://dicom.nema.org/medical/dicom/current/output/chtml/part16/sect_CID_29.html",
          "additionalValueSets": []
        }
      },
      {
        "id": "ImagingStudy.series.performer.actor",
        "path": "ImagingStudy.series.performer.actor",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Practitioner|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Organization|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/CareTeam|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Patient|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Device|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "ImagingStudy.series.instance",
        "path": "ImagingStudy.series.instance",
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
        "id": "ImagingStudy.series.instance.uid",
        "path": "ImagingStudy.series.instance.uid",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "id"
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
        "id": "ImagingStudy.series.instance.sopClass",
        "path": "ImagingStudy.series.instance.sopClass",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
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
          "strength": "extensible",
          "valueSet": "http://dicom.nema.org/medical/dicom/current/output/chtml/part04/sect_B.5.html#table_B.5-1",
          "additionalValueSets": []
        }
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "ImagingStudy",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1"
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
      "code": "based-on",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-based-on",
      "expression": "ImagingStudy.basedOn",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "basedon",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-basedon",
      "expression": "ImagingStudy.basedOn",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "body-site",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-body-site",
      "expression": "ImagingStudy.series.bodySite.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "body-structure",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-body-structure",
      "expression": "ImagingStudy.series.bodySite.reference",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "bodysite",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-bodysite",
      "expression": "ImagingStudy.series.bodySite",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "dicom-class",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-dicom-class",
      "expression": "ImagingStudy.series.instance.sopClass",
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
      "code": "endpoint",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-endpoint",
      "expression": "ImagingStudy.endpoint | ImagingStudy.series.endpoint",
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
      "code": "instance",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-instance",
      "expression": "ImagingStudy.series.instance.uid",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "interpreter",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-interpreter",
      "expression": "ImagingStudy.interpreter",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "modality",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-modality",
      "expression": "ImagingStudy.series.modality",
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
      "code": "performer",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-performer",
      "expression": "ImagingStudy.series.performer.actor",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "reason",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-reason",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "referrer",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-referrer",
      "expression": "ImagingStudy.referrer",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "series",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-series",
      "expression": "ImagingStudy.series.uid",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "started",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-started",
      "expression": "ImagingStudy.started",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-status",
      "expression": "ImagingStudy.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/ImagingStudy-subject",
      "expression": "ImagingStudy.subject",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
