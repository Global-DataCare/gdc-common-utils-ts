// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1": {
    "resourceType": "Consent",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/Consent",
    "version": "4.0.1",
    "name": "Consent",
    "elements": [
      {
        "id": "Consent",
        "path": "Consent",
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
        "id": "Consent.id",
        "path": "Consent.id",
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
        "id": "Consent.meta",
        "path": "Consent.meta",
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
        "id": "Consent.implicitRules",
        "path": "Consent.implicitRules",
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
        "id": "Consent.language",
        "path": "Consent.language",
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
        "id": "Consent.text",
        "path": "Consent.text",
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
        "id": "Consent.contained",
        "path": "Consent.contained",
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
        "id": "Consent.extension",
        "path": "Consent.extension",
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
        "id": "Consent.modifierExtension",
        "path": "Consent.modifierExtension",
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
        "id": "Consent.identifier",
        "path": "Consent.identifier",
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
        "id": "Consent.status",
        "path": "Consent.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-state-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.scope",
        "path": "Consent.scope",
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
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-scope",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.category",
        "path": "Consent.category",
        "min": 1,
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
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.patient",
        "path": "Consent.patient",
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
        "id": "Consent.dateTime",
        "path": "Consent.dateTime",
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
        "id": "Consent.performer",
        "path": "Consent.performer",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Organization",
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Consent.organization",
        "path": "Consent.organization",
        "min": 0,
        "max": "*",
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
        "id": "Consent.source[x]",
        "path": "Consent.source[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Attachment",
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Consent",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference",
          "http://hl7.org/fhir/StructureDefinition/Contract",
          "http://hl7.org/fhir/StructureDefinition/QuestionnaireResponse"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Consent.policy",
        "path": "Consent.policy",
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
        "id": "Consent.policy.id",
        "path": "Consent.policy.id",
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
        "id": "Consent.policy.extension",
        "path": "Consent.policy.extension",
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
        "id": "Consent.policy.modifierExtension",
        "path": "Consent.policy.modifierExtension",
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
        "id": "Consent.policy.authority",
        "path": "Consent.policy.authority",
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
        "id": "Consent.policy.uri",
        "path": "Consent.policy.uri",
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
        "id": "Consent.policyRule",
        "path": "Consent.policyRule",
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
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-policy",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.verification",
        "path": "Consent.verification",
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
        "id": "Consent.verification.id",
        "path": "Consent.verification.id",
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
        "id": "Consent.verification.extension",
        "path": "Consent.verification.extension",
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
        "id": "Consent.verification.modifierExtension",
        "path": "Consent.verification.modifierExtension",
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
        "id": "Consent.verification.verified",
        "path": "Consent.verification.verified",
        "min": 1,
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
        "id": "Consent.verification.verifiedWith",
        "path": "Consent.verification.verifiedWith",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Consent.verification.verificationDate",
        "path": "Consent.verification.verificationDate",
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
        "id": "Consent.provision",
        "path": "Consent.provision",
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
        "id": "Consent.provision.id",
        "path": "Consent.provision.id",
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
        "id": "Consent.provision.extension",
        "path": "Consent.provision.extension",
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
        "id": "Consent.provision.modifierExtension",
        "path": "Consent.provision.modifierExtension",
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
        "id": "Consent.provision.type",
        "path": "Consent.provision.type",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-provision-type|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.period",
        "path": "Consent.provision.period",
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
        "id": "Consent.provision.actor",
        "path": "Consent.provision.actor",
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
        "id": "Consent.provision.actor.id",
        "path": "Consent.provision.actor.id",
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
        "id": "Consent.provision.actor.extension",
        "path": "Consent.provision.actor.extension",
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
        "id": "Consent.provision.actor.modifierExtension",
        "path": "Consent.provision.actor.modifierExtension",
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
        "id": "Consent.provision.actor.role",
        "path": "Consent.provision.actor.role",
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
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/security-role-type",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.actor.reference",
        "path": "Consent.provision.actor.reference",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Device",
          "http://hl7.org/fhir/StructureDefinition/Group",
          "http://hl7.org/fhir/StructureDefinition/CareTeam",
          "http://hl7.org/fhir/StructureDefinition/Organization",
          "http://hl7.org/fhir/StructureDefinition/Patient",
          "http://hl7.org/fhir/StructureDefinition/Practitioner",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Consent.provision.action",
        "path": "Consent.provision.action",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-action",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.securityLabel",
        "path": "Consent.provision.securityLabel",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
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
        "id": "Consent.provision.purpose",
        "path": "Consent.provision.purpose",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://terminology.hl7.org/ValueSet/v3-PurposeOfUse",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.class",
        "path": "Consent.provision.class",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-content-class",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.code",
        "path": "Consent.provision.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-content-code",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.dataPeriod",
        "path": "Consent.provision.dataPeriod",
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
        "id": "Consent.provision.data",
        "path": "Consent.provision.data",
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
        "id": "Consent.provision.data.id",
        "path": "Consent.provision.data.id",
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
        "id": "Consent.provision.data.extension",
        "path": "Consent.provision.data.extension",
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
        "id": "Consent.provision.data.modifierExtension",
        "path": "Consent.provision.data.modifierExtension",
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
        "id": "Consent.provision.data.meaning",
        "path": "Consent.provision.data.meaning",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/consent-data-meaning|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Consent.provision.data.reference",
        "path": "Consent.provision.data.reference",
        "min": 1,
        "max": "1",
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
        "id": "Consent.provision.provision",
        "path": "Consent.provision.provision",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "contentReference": "#Consent.provision"
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "Consent",
  "supportedProfiles": [],
  "profiles": [
    "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1"
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
      "code": "action",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-action",
      "expression": "Consent.provision.action",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "actor",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-actor",
      "expression": "Consent.provision.actor.reference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-category",
      "expression": "Consent.category",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "consentor",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-consentor",
      "expression": "Consent.performer",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "controller",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-controller",
      "expression": "Consent.controller",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "data",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-data",
      "expression": "Consent.provision.data.reference",
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
      "code": "grantee",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-grantee",
      "expression": "Consent.grantee",
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
      "code": "manager",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-manager",
      "expression": "Consent.manager",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "organization",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-organization",
      "expression": "Consent.organization",
      "fhirVersions": [
        "4.0.1"
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
      "url": "http://hl7.org/fhir/SearchParameter/Consent-period",
      "expression": "Consent.provision.period",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "purpose",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-purpose",
      "expression": "Consent.provision.purpose",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "scope",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-scope",
      "expression": "Consent.scope",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "security-label",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-security-label",
      "expression": "Consent.provision.securityLabel",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "source-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-source-reference",
      "expression": "Consent.sourceReference",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-status",
      "expression": "Consent.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-subject",
      "expression": "Consent.subject",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "verified",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-verified",
      "expression": "Consent.verification.verified",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "verified-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Consent-verified-date",
      "expression": "Consent.verification.verificationDate",
      "fhirVersions": [
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
