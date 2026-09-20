// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1": {
    "resourceType": "DocumentReference",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/DocumentReference",
    "version": "4.0.1",
    "name": "DocumentReference",
    "elements": [
      {
        "id": "DocumentReference",
        "path": "DocumentReference",
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
        "id": "DocumentReference.id",
        "path": "DocumentReference.id",
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
        "id": "DocumentReference.meta",
        "path": "DocumentReference.meta",
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
        "id": "DocumentReference.implicitRules",
        "path": "DocumentReference.implicitRules",
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
        "id": "DocumentReference.language",
        "path": "DocumentReference.language",
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
        "id": "DocumentReference.text",
        "path": "DocumentReference.text",
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
        "id": "DocumentReference.contained",
        "path": "DocumentReference.contained",
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
        "id": "DocumentReference.extension",
        "path": "DocumentReference.extension",
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
        "id": "DocumentReference.modifierExtension",
        "path": "DocumentReference.modifierExtension",
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
        "id": "DocumentReference.masterIdentifier",
        "path": "DocumentReference.masterIdentifier",
        "min": 0,
        "max": "1",
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
        "id": "DocumentReference.identifier",
        "path": "DocumentReference.identifier",
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
        "id": "DocumentReference.status",
        "path": "DocumentReference.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/document-reference-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.docStatus",
        "path": "DocumentReference.docStatus",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/composition-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.type",
        "path": "DocumentReference.type",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/c80-doc-typecodes",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.category",
        "path": "DocumentReference.category",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/document-classcodes",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.subject",
        "path": "DocumentReference.subject",
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
          "http://hl7.org/fhir/StructureDefinition/Group",
          "http://hl7.org/fhir/StructureDefinition/Device"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "DocumentReference.date",
        "path": "DocumentReference.date",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "instant"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "DocumentReference.author",
        "path": "DocumentReference.author",
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
          "http://hl7.org/fhir/StructureDefinition/Device",
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "DocumentReference.authenticator",
        "path": "DocumentReference.authenticator",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole",
          "http://hl7.org/fhir/StructureDefinition/Organization"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "DocumentReference.custodian",
        "path": "DocumentReference.custodian",
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
        "id": "DocumentReference.relatesTo",
        "path": "DocumentReference.relatesTo",
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
        "id": "DocumentReference.relatesTo.id",
        "path": "DocumentReference.relatesTo.id",
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
        "id": "DocumentReference.relatesTo.extension",
        "path": "DocumentReference.relatesTo.extension",
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
        "id": "DocumentReference.relatesTo.modifierExtension",
        "path": "DocumentReference.relatesTo.modifierExtension",
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
        "id": "DocumentReference.relatesTo.code",
        "path": "DocumentReference.relatesTo.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/document-relationship-type|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.relatesTo.target",
        "path": "DocumentReference.relatesTo.target",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/DocumentReference"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "DocumentReference.description",
        "path": "DocumentReference.description",
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
        "id": "DocumentReference.securityLabel",
        "path": "DocumentReference.securityLabel",
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
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/security-labels",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.content",
        "path": "DocumentReference.content",
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
        "id": "DocumentReference.content.id",
        "path": "DocumentReference.content.id",
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
        "id": "DocumentReference.content.extension",
        "path": "DocumentReference.content.extension",
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
        "id": "DocumentReference.content.modifierExtension",
        "path": "DocumentReference.content.modifierExtension",
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
        "id": "DocumentReference.content.attachment",
        "path": "DocumentReference.content.attachment",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Attachment"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "DocumentReference.content.format",
        "path": "DocumentReference.content.format",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/formatcodes",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.context",
        "path": "DocumentReference.context",
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
        "id": "DocumentReference.context.id",
        "path": "DocumentReference.context.id",
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
        "id": "DocumentReference.context.extension",
        "path": "DocumentReference.context.extension",
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
        "id": "DocumentReference.context.modifierExtension",
        "path": "DocumentReference.context.modifierExtension",
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
        "id": "DocumentReference.context.encounter",
        "path": "DocumentReference.context.encounter",
        "min": 0,
        "max": "*",
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
        "id": "DocumentReference.context.event",
        "path": "DocumentReference.context.event",
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
          "valueSet": "http://terminology.hl7.org/ValueSet/v3-ActCode",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.context.period",
        "path": "DocumentReference.context.period",
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
        "id": "DocumentReference.context.facilityType",
        "path": "DocumentReference.context.facilityType",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/c80-facilitycodes",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.context.practiceSetting",
        "path": "DocumentReference.context.practiceSetting",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/c80-practice-codes",
          "additionalValueSets": []
        }
      },
      {
        "id": "DocumentReference.context.sourcePatientInfo",
        "path": "DocumentReference.context.sourcePatientInfo",
        "min": 0,
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
        "id": "DocumentReference.context.related",
        "path": "DocumentReference.context.related",
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
  "resourceType": "DocumentReference",
  "supportedProfiles": [],
  "profiles": [
    "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
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
      "code": "attester",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-attester",
      "expression": "DocumentReference.attester.party",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "authenticator",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-authenticator",
      "expression": "DocumentReference.authenticator",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "author",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-author",
      "expression": "DocumentReference.author",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "based-on",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-based-on",
      "expression": "DocumentReference.basedOn",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "bodysite",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-bodysite",
      "expression": "DocumentReference.bodySite.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "bodysite-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-bodysite-reference",
      "expression": "DocumentReference.bodySite.reference",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-category",
      "expression": "DocumentReference.category",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "contenttype",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-contenttype",
      "expression": "DocumentReference.content.attachment.contentType",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "context",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-context",
      "expression": "DocumentReference.context",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "creation",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-creation",
      "expression": "DocumentReference.content.attachment.creation",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "custodian",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-custodian",
      "expression": "DocumentReference.custodian",
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
      "code": "description",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-description",
      "expression": "DocumentReference.description",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "doc-status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-doc-status",
      "expression": "DocumentReference.docStatus",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "encounter",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-encounter",
      "expression": "Composition.encounter | DeviceRequest.encounter | DiagnosticReport.encounter | DocumentReference.context.encounter | Flag.encounter | List.encounter | NutritionOrder.encounter | Observation.encounter | Procedure.encounter | RiskAssessment.encounter | ServiceRequest.encounter | VisionPrescription.encounter",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "event",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-event",
      "expression": "DocumentReference.context.event",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "event-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-event-code",
      "expression": "DocumentReference.event.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "event-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-event-reference",
      "expression": "DocumentReference.event.reference",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "facility",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-facility",
      "expression": "DocumentReference.facilityType",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "format",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-format",
      "expression": "DocumentReference.content.format",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "format-canonical",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-format-canonical",
      "expression": "(DocumentReference.content.profile.value.ofType(canonical))",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "format-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-format-code",
      "expression": "(DocumentReference.content.profile.value.ofType(Coding))",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "format-uri",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-format-uri",
      "expression": "(DocumentReference.content.profile.value.ofType(uri))",
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
      "code": "language",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-language",
      "expression": "DocumentReference.content.attachment.language",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "location",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-location",
      "expression": "DocumentReference.content.attachment.url",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "modality",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-modality",
      "expression": "DocumentReference.modality",
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
      "code": "period",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-period",
      "expression": "DocumentReference.period",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "related",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-related",
      "expression": "DocumentReference.context.related",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "relatesto",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-relatesto",
      "expression": "DocumentReference.relatesTo.target",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "relation",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-relation",
      "expression": "DocumentReference.relatesTo.code",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "relationship",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-relationship",
      "expression": "DocumentReference.relatesTo",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "security-label",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-security-label",
      "expression": "DocumentReference.securityLabel",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "setting",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-setting",
      "expression": "DocumentReference.practiceSetting",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-status",
      "expression": "DocumentReference.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-subject",
      "expression": "DocumentReference.subject",
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
      "code": "version",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/DocumentReference-version",
      "expression": "DocumentReference.version",
      "fhirVersions": [
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
