// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1": {
    "resourceType": "Practitioner",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips",
    "version": "2.0.1",
    "name": "PractitionerUvIps",
    "elements": [
      {
        "id": "Practitioner.name",
        "path": "Practitioner.name",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "HumanName"
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
        "id": "Practitioner.name.family",
        "path": "Practitioner.name.family",
        "min": 0,
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
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Practitioner.name.given",
        "path": "Practitioner.name.given",
        "min": 0,
        "max": "*",
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
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Practitioner.telecom",
        "path": "Practitioner.telecom",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "ContactPoint"
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
        "id": "Practitioner.address",
        "path": "Practitioner.address",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Address"
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
        "id": "Practitioner.qualification.code",
        "path": "Practitioner.qualification.code",
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
          "valueSet": "http://terminology.hl7.org/ValueSet/v2-2.7-0360|0360",
          "additionalValueSets": []
        }
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "Practitioner",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1"
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
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-active",
      "expression": "Practitioner.active",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "address",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-address",
      "expression": "Patient.address | Person.address | Practitioner.address | RelatedPerson.address",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "address-city",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-address-city",
      "expression": "Patient.address.city | Person.address.city | Practitioner.address.city | RelatedPerson.address.city",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "address-country",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-address-country",
      "expression": "Patient.address.country | Person.address.country | Practitioner.address.country | RelatedPerson.address.country",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "address-postalcode",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-address-postalcode",
      "expression": "Patient.address.postalCode | Person.address.postalCode | Practitioner.address.postalCode | RelatedPerson.address.postalCode",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "address-state",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-address-state",
      "expression": "Patient.address.state | Person.address.state | Practitioner.address.state | RelatedPerson.address.state",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "address-use",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/individual-address-use",
      "expression": "Patient.address.use | Person.address.use | Practitioner.address.use | RelatedPerson.address.use",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "communication",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-communication",
      "expression": "Practitioner.communication.language",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "death-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-death-date",
      "expression": "(Practitioner.deceased.ofType(dateTime))",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "deceased",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-deceased",
      "expression": "Practitioner.deceased.exists() and Practitioner.deceased != false",
      "fhirVersions": [
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
      "code": "family",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-family",
      "expression": "Patient.name.family | Practitioner.name.family",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "gender",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/individual-gender",
      "expression": "Patient.gender | Person.gender | Practitioner.gender | RelatedPerson.gender",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "given",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-given",
      "expression": "Patient.name.given | Practitioner.name.given",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "identifier",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-identifier",
      "expression": "Practitioner.identifier | Practitioner.qualification.identifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "name",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-name",
      "expression": "Practitioner.name",
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
      "code": "phonetic",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/individual-phonetic",
      "expression": "Patient.name | Person.name | Practitioner.name | RelatedPerson.name",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "qualification-period",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Practitioner-qualification-period",
      "expression": "Practitioner.qualification.period",
      "fhirVersions": [
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
