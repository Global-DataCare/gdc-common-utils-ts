// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1": {
    "resourceType": "PractitionerRole",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips",
    "version": "2.0.1",
    "name": "PractitionerRoleUvIps",
    "elements": [
      {
        "id": "PractitionerRole.practitioner",
        "path": "PractitionerRole.practitioner",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "PractitionerRole.organization",
        "path": "PractitionerRole.organization",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Organization-uv-ips|2.0.1"
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
        "id": "PractitionerRole.code",
        "path": "PractitionerRole.code",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/healthcare-professional-roles-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "PractitionerRole.notAvailable.description",
        "path": "PractitionerRole.notAvailable.description",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "string"
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
  "resourceType": "PractitionerRole",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1"
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
      "code": "active",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-active",
      "expression": "PractitionerRole.active",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "characteristic",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-characteristic",
      "expression": "PractitionerRole.characteristic",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "communication",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-communication",
      "expression": "PractitionerRole.communication",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-date",
      "expression": "PractitionerRole.period",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "email",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/individual-email",
      "expression": "Patient.telecom.where(system='email') | Person.telecom.where(system='email') | Practitioner.telecom.where(system='email') | PractitionerRole.contact.telecom.where(system='email') | RelatedPerson.telecom.where(system='email')",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "endpoint",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-endpoint",
      "expression": "PractitionerRole.endpoint",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "identifier",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-identifier",
      "expression": "PractitionerRole.identifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "location",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-location",
      "expression": "PractitionerRole.location",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "organization",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-organization",
      "expression": "PractitionerRole.organization",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "phone",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/individual-phone",
      "expression": "Patient.telecom.where(system='phone') | Person.telecom.where(system='phone') | Practitioner.telecom.where(system='phone') | PractitionerRole.contact.telecom.where(system='phone') | RelatedPerson.telecom.where(system='phone')",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "practitioner",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-practitioner",
      "expression": "PractitionerRole.practitioner",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "role",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-role",
      "expression": "PractitionerRole.code",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "service",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-service",
      "expression": "PractitionerRole.healthcareService",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "specialty",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/PractitionerRole-specialty",
      "expression": "PractitionerRole.specialty",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "telecom",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/individual-telecom",
      "expression": "Patient.telecom | Person.telecom | Practitioner.telecom | PractitionerRole.contact.telecom | RelatedPerson.telecom",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
