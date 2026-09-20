// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1": {
    "resourceType": "Patient",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips",
    "version": "2.0.1",
    "name": "PatientUvIps",
    "elements": [
      {
        "id": "Patient.extension",
        "path": "Patient.extension",
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
        "id": "Patient.extension:genderIdentity",
        "path": "Patient.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/individual-genderIdentity|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Patient.extension:personalPronouns",
        "path": "Patient.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/individual-pronouns|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Patient.identifier",
        "path": "Patient.identifier",
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
        "id": "Patient.name",
        "path": "Patient.name",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "HumanName"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Patient.name.use",
        "path": "Patient.name.use",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/name-use|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Patient.name.text",
        "path": "Patient.name.text",
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
        "id": "Patient.name.family",
        "path": "Patient.name.family",
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
        "id": "Patient.name.given",
        "path": "Patient.name.given",
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
        "id": "Patient.telecom",
        "path": "Patient.telecom",
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
        "id": "Patient.gender",
        "path": "Patient.gender",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Patient.birthDate",
        "path": "Patient.birthDate",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "date"
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
        "id": "Patient.address",
        "path": "Patient.address",
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
        "id": "Patient.communication.language",
        "path": "Patient.communication.language",
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
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/languages|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Patient.generalPractitioner",
        "path": "Patient.generalPractitioner",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Organization|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Practitioner|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole|4.0.1"
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
        "id": "Patient.link.other",
        "path": "Patient.link.other",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Patient.link.type",
        "path": "Patient.link.type",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/link-type|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "Patient",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
      "url": "http://hl7.org/fhir/SearchParameter/Patient-active",
      "expression": "Patient.active",
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
      "code": "age",
      "type": "number",
      "url": "http://hl7.org/fhir/SearchParameter/patient-extensions-Patient-age",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "birthdate",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/individual-birthdate",
      "expression": "Patient.birthDate | Person.birthDate | RelatedPerson.birthDate",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "birthOrderBoolean",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/patient-extensions-Patient-birthOrderBoolean",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "death-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-death-date",
      "expression": "(Patient.deceased.ofType(dateTime))",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "deceased",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-deceased",
      "expression": "Patient.deceased.exists() and Patient.deceased != false",
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
      "code": "general-practitioner",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-general-practitioner",
      "expression": "Patient.generalPractitioner",
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
      "url": "http://hl7.org/fhir/SearchParameter/Patient-identifier",
      "expression": "Patient.identifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "language",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-language",
      "expression": "Patient.communication.language",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "link",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-link",
      "expression": "Patient.link.other",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "mothersMaidenName",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/patient-extensions-Patient-mothersMaidenName",
      "expression": "Patient.extension('http://hl7.org/fhir/StructureDefinition/patient-extensions-Patient-mothersMaidenName')",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "name",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-name",
      "expression": "Patient.name",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "organization",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Patient-organization",
      "expression": "Patient.managingOrganization",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "part-agree",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/example-extension",
      "expression": "Patient.extension('http://example.org/fhir/StructureDefinition/participation-agreement').value",
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
