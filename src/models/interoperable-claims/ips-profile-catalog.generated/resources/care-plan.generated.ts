// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1": {
    "resourceType": "CarePlan",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/CarePlan",
    "version": "4.0.1",
    "name": "CarePlan",
    "elements": [
      {
        "id": "CarePlan",
        "path": "CarePlan",
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
        "id": "CarePlan.id",
        "path": "CarePlan.id",
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
        "id": "CarePlan.meta",
        "path": "CarePlan.meta",
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
        "id": "CarePlan.implicitRules",
        "path": "CarePlan.implicitRules",
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
        "id": "CarePlan.language",
        "path": "CarePlan.language",
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
        "id": "CarePlan.text",
        "path": "CarePlan.text",
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
        "id": "CarePlan.contained",
        "path": "CarePlan.contained",
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
        "id": "CarePlan.extension",
        "path": "CarePlan.extension",
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
        "id": "CarePlan.modifierExtension",
        "path": "CarePlan.modifierExtension",
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
        "id": "CarePlan.identifier",
        "path": "CarePlan.identifier",
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
        "id": "CarePlan.instantiatesCanonical",
        "path": "CarePlan.instantiatesCanonical",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "canonical"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/PlanDefinition",
          "http://hl7.org/fhir/StructureDefinition/Questionnaire",
          "http://hl7.org/fhir/StructureDefinition/Measure",
          "http://hl7.org/fhir/StructureDefinition/ActivityDefinition",
          "http://hl7.org/fhir/StructureDefinition/OperationDefinition"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.instantiatesUri",
        "path": "CarePlan.instantiatesUri",
        "min": 0,
        "max": "*",
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
        "id": "CarePlan.basedOn",
        "path": "CarePlan.basedOn",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/CarePlan"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.replaces",
        "path": "CarePlan.replaces",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/CarePlan"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.partOf",
        "path": "CarePlan.partOf",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/CarePlan"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.status",
        "path": "CarePlan.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/request-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.intent",
        "path": "CarePlan.intent",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/care-plan-intent|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.category",
        "path": "CarePlan.category",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/care-plan-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.title",
        "path": "CarePlan.title",
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
        "id": "CarePlan.description",
        "path": "CarePlan.description",
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
        "id": "CarePlan.subject",
        "path": "CarePlan.subject",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/Group"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.encounter",
        "path": "CarePlan.encounter",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Encounter"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.period",
        "path": "CarePlan.period",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.created",
        "path": "CarePlan.created",
        "min": 0,
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
        "id": "CarePlan.author",
        "path": "CarePlan.author",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
          "http://hl7.org/fhir/StructureDefinition/Device",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
          "http://hl7.org/fhir/StructureDefinition/Organization",
          "http://hl7.org/fhir/StructureDefinition/CareTeam"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.contributor",
        "path": "CarePlan.contributor",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
          "http://hl7.org/fhir/StructureDefinition/Device",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
          "http://hl7.org/fhir/StructureDefinition/Organization",
          "http://hl7.org/fhir/StructureDefinition/CareTeam"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.careTeam",
        "path": "CarePlan.careTeam",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/CareTeam"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.addresses",
        "path": "CarePlan.addresses",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Condition"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.supportingInfo",
        "path": "CarePlan.supportingInfo",
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
      },
      {
        "id": "CarePlan.goal",
        "path": "CarePlan.goal",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Goal"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity",
        "path": "CarePlan.activity",
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
        "id": "CarePlan.activity.id",
        "path": "CarePlan.activity.id",
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
        "id": "CarePlan.activity.extension",
        "path": "CarePlan.activity.extension",
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
        "id": "CarePlan.activity.modifierExtension",
        "path": "CarePlan.activity.modifierExtension",
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
        "id": "CarePlan.activity.outcomeCodeableConcept",
        "path": "CarePlan.activity.outcomeCodeableConcept",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/care-plan-activity-outcome",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.activity.outcomeReference",
        "path": "CarePlan.activity.outcomeReference",
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
      },
      {
        "id": "CarePlan.activity.progress",
        "path": "CarePlan.activity.progress",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Annotation"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.reference",
        "path": "CarePlan.activity.reference",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Appointment",
          "http://hl7.org/fhir/StructureDefinition/CommunicationRequest",
          "http://hl7.org/fhir/StructureDefinition/DeviceRequest",
          "http://hl7.org/fhir/StructureDefinition/MedicationRequest",
          "http://hl7.org/fhir/StructureDefinition/NutritionOrder",
          "http://hl7.org/fhir/StructureDefinition/Task",
          "http://hl7.org/fhir/StructureDefinition/ServiceRequest",
          "http://hl7.org/fhir/StructureDefinition/VisionPrescription",
          "http://hl7.org/fhir/StructureDefinition/RequestGroup"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail",
        "path": "CarePlan.activity.detail",
        "min": 0,
        "max": "1",
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
        "id": "CarePlan.activity.detail.id",
        "path": "CarePlan.activity.detail.id",
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
        "id": "CarePlan.activity.detail.extension",
        "path": "CarePlan.activity.detail.extension",
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
        "id": "CarePlan.activity.detail.modifierExtension",
        "path": "CarePlan.activity.detail.modifierExtension",
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
        "id": "CarePlan.activity.detail.kind",
        "path": "CarePlan.activity.detail.kind",
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
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/care-plan-activity-kind|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.activity.detail.instantiatesCanonical",
        "path": "CarePlan.activity.detail.instantiatesCanonical",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "canonical"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/PlanDefinition",
          "http://hl7.org/fhir/StructureDefinition/ActivityDefinition",
          "http://hl7.org/fhir/StructureDefinition/Questionnaire",
          "http://hl7.org/fhir/StructureDefinition/Measure",
          "http://hl7.org/fhir/StructureDefinition/OperationDefinition"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.instantiatesUri",
        "path": "CarePlan.activity.detail.instantiatesUri",
        "min": 0,
        "max": "*",
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
        "id": "CarePlan.activity.detail.code",
        "path": "CarePlan.activity.detail.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/procedure-code",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.activity.detail.reasonCode",
        "path": "CarePlan.activity.detail.reasonCode",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/clinical-findings",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.activity.detail.reasonReference",
        "path": "CarePlan.activity.detail.reasonReference",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Condition",
          "http://hl7.org/fhir/StructureDefinition/Observation",
          "http://hl7.org/fhir/StructureDefinition/DiagnosticReport",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.goal",
        "path": "CarePlan.activity.detail.goal",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Goal"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.status",
        "path": "CarePlan.activity.detail.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/care-plan-activity-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.activity.detail.statusReason",
        "path": "CarePlan.activity.detail.statusReason",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.doNotPerform",
        "path": "CarePlan.activity.detail.doNotPerform",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "boolean"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.scheduled[x]",
        "path": "CarePlan.activity.detail.scheduled[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Timing",
          "Period",
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.location",
        "path": "CarePlan.activity.detail.location",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Location"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.performer",
        "path": "CarePlan.activity.detail.performer",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
          "http://hl7.org/fhir/StructureDefinition/Organization",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/CareTeam",
          "http://hl7.org/fhir/StructureDefinition/HealthcareService",
          "http://hl7.org/fhir/StructureDefinition/Device"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.product[x]",
        "path": "CarePlan.activity.detail.product[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept",
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Medication",
          "http://hl7.org/fhir/StructureDefinition/Substance"
        ],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/medication-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "CarePlan.activity.detail.dailyAmount",
        "path": "CarePlan.activity.detail.dailyAmount",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/SimpleQuantity"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.quantity",
        "path": "CarePlan.activity.detail.quantity",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/SimpleQuantity"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "CarePlan.activity.detail.description",
        "path": "CarePlan.activity.detail.description",
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
        "id": "CarePlan.note",
        "path": "CarePlan.note",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Annotation"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "CarePlan",
  "supportedProfiles": [],
  "profiles": [
    "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1"
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
      "code": "activity-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-activity-code",
      "expression": "CarePlan.activity.detail.code",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "activity-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-activity-date",
      "expression": "CarePlan.activity.detail.scheduled",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "activity-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-activity-reference",
      "expression": "CarePlan.activity.plannedActivityReference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "based-on",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-based-on",
      "expression": "CarePlan.basedOn",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "care-team",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-care-team",
      "expression": "CarePlan.careTeam",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-category",
      "expression": "CarePlan.category",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "condition",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-condition",
      "expression": "CarePlan.addresses.reference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "custodian",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-custodian",
      "expression": "CarePlan.custodian",
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
      "code": "goal",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-goal",
      "expression": "CarePlan.goal",
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
      "code": "instantiates-canonical",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-instantiates-canonical",
      "expression": "CarePlan.instantiatesCanonical",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "instantiates-uri",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-instantiates-uri",
      "expression": "CarePlan.instantiatesUri",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "intent",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-intent",
      "expression": "CarePlan.intent",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "part-of",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-part-of",
      "expression": "CarePlan.partOf",
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
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-performer",
      "expression": "CarePlan.activity.detail.performer",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "replaces",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-replaces",
      "expression": "CarePlan.replaces",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-status",
      "expression": "CarePlan.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/CarePlan-subject",
      "expression": "CarePlan.subject",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
