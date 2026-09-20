// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1": {
    "resourceType": "MedicationAdministration",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/MedicationAdministration",
    "version": "4.0.1",
    "name": "MedicationAdministration",
    "elements": [
      {
        "id": "MedicationAdministration",
        "path": "MedicationAdministration",
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
        "id": "MedicationAdministration.id",
        "path": "MedicationAdministration.id",
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
        "id": "MedicationAdministration.meta",
        "path": "MedicationAdministration.meta",
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
        "id": "MedicationAdministration.implicitRules",
        "path": "MedicationAdministration.implicitRules",
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
        "id": "MedicationAdministration.language",
        "path": "MedicationAdministration.language",
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
        "id": "MedicationAdministration.text",
        "path": "MedicationAdministration.text",
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
        "id": "MedicationAdministration.contained",
        "path": "MedicationAdministration.contained",
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
        "id": "MedicationAdministration.extension",
        "path": "MedicationAdministration.extension",
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
        "id": "MedicationAdministration.modifierExtension",
        "path": "MedicationAdministration.modifierExtension",
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
        "id": "MedicationAdministration.identifier",
        "path": "MedicationAdministration.identifier",
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
        "id": "MedicationAdministration.instantiates",
        "path": "MedicationAdministration.instantiates",
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
        "id": "MedicationAdministration.partOf",
        "path": "MedicationAdministration.partOf",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/MedicationAdministration",
          "http://hl7.org/fhir/StructureDefinition/Procedure"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.status",
        "path": "MedicationAdministration.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/medication-admin-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.statusReason",
        "path": "MedicationAdministration.statusReason",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/reason-medication-not-given-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.category",
        "path": "MedicationAdministration.category",
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
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/medication-admin-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.medication[x]",
        "path": "MedicationAdministration.medication[x]",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept",
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Medication"
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
        "id": "MedicationAdministration.subject",
        "path": "MedicationAdministration.subject",
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
        "id": "MedicationAdministration.context",
        "path": "MedicationAdministration.context",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Encounter",
          "http://hl7.org/fhir/StructureDefinition/EpisodeOfCare"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.supportingInformation",
        "path": "MedicationAdministration.supportingInformation",
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
        "id": "MedicationAdministration.effective[x]",
        "path": "MedicationAdministration.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.performer",
        "path": "MedicationAdministration.performer",
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
        "id": "MedicationAdministration.performer.id",
        "path": "MedicationAdministration.performer.id",
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
        "id": "MedicationAdministration.performer.extension",
        "path": "MedicationAdministration.performer.extension",
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
        "id": "MedicationAdministration.performer.modifierExtension",
        "path": "MedicationAdministration.performer.modifierExtension",
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
        "id": "MedicationAdministration.performer.function",
        "path": "MedicationAdministration.performer.function",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/med-admin-perform-function",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.performer.actor",
        "path": "MedicationAdministration.performer.actor",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
          "http://hl7.org/fhir/StructureDefinition/Device"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.reasonCode",
        "path": "MedicationAdministration.reasonCode",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/reason-medication-given-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.reasonReference",
        "path": "MedicationAdministration.reasonReference",
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
          "http://hl7.org/fhir/StructureDefinition/DiagnosticReport"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.request",
        "path": "MedicationAdministration.request",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/MedicationRequest"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.device",
        "path": "MedicationAdministration.device",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Device"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "MedicationAdministration.note",
        "path": "MedicationAdministration.note",
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
        "id": "MedicationAdministration.dosage",
        "path": "MedicationAdministration.dosage",
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
        "id": "MedicationAdministration.dosage.id",
        "path": "MedicationAdministration.dosage.id",
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
        "id": "MedicationAdministration.dosage.extension",
        "path": "MedicationAdministration.dosage.extension",
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
        "id": "MedicationAdministration.dosage.modifierExtension",
        "path": "MedicationAdministration.dosage.modifierExtension",
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
        "id": "MedicationAdministration.dosage.text",
        "path": "MedicationAdministration.dosage.text",
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
        "id": "MedicationAdministration.dosage.site",
        "path": "MedicationAdministration.dosage.site",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/approach-site-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.dosage.route",
        "path": "MedicationAdministration.dosage.route",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/route-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.dosage.method",
        "path": "MedicationAdministration.dosage.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/administration-method-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "MedicationAdministration.dosage.dose",
        "path": "MedicationAdministration.dosage.dose",
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
        "id": "MedicationAdministration.dosage.rate[x]",
        "path": "MedicationAdministration.dosage.rate[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Ratio",
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
        "id": "MedicationAdministration.eventHistory",
        "path": "MedicationAdministration.eventHistory",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Provenance"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "MedicationAdministration",
  "supportedProfiles": [],
  "profiles": [
    "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1"
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
      "code": "context",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-context",
      "expression": "MedicationAdministration.context",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/medications-date",
      "expression": "MedicationAdministration.occurence.ofType(dateTime) | MedicationAdministration.occurence.ofType(Period)",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "device",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-device",
      "expression": "MedicationAdministration.device.reference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "effective-time",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-effective-time",
      "expression": "MedicationAdministration.effective",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "encounter",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/medications-encounter",
      "expression": "MedicationAdministration.encounter | MedicationRequest.encounter",
      "fhirVersions": [
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
      "code": "medication",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/medications-medication",
      "expression": "MedicationAdministration.medication.reference | MedicationDispense.medication.reference | MedicationRequest.medication.reference | MedicationStatement.medication.reference",
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
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-performer",
      "expression": "MedicationAdministration.performer.actor.reference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "performer-device-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-performer-device-code",
      "expression": "MedicationAdministration.performer.actor.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "reason-given",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-reason-given",
      "expression": "MedicationAdministration.reason.reference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "reason-given-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-reason-given-code",
      "expression": "MedicationAdministration.reason.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "reason-not-given",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-reason-not-given",
      "expression": "MedicationAdministration.statusReason",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "request",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-request",
      "expression": "MedicationAdministration.request",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/medications-status",
      "expression": "MedicationAdministration.status | MedicationDispense.status | MedicationRequest.status | MedicationStatement.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/MedicationAdministration-subject",
      "expression": "MedicationAdministration.subject",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
