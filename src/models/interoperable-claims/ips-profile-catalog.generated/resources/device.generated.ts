// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-uv-ips|2.0.1": {
    "resourceType": "Device",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-uv-ips",
    "version": "2.0.1",
    "name": "DeviceUvIps",
    "elements": [
      {
        "id": "Device",
        "path": "Device",
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
        "id": "Device.udiCarrier",
        "path": "Device.udiCarrier",
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
        "id": "Device.deviceName.name",
        "path": "Device.deviceName.name",
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
      },
      {
        "id": "Device.deviceName.type",
        "path": "Device.deviceName.type",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/device-nametype|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Device.type",
        "path": "Device.type",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/medical-devices-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Device.specialization.systemType",
        "path": "Device.specialization.systemType",
        "min": 1,
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
        "id": "Device.version.value",
        "path": "Device.version.value",
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
      },
      {
        "id": "Device.property.type",
        "path": "Device.property.type",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-observer-uv-ips|2.0.1": {
    "resourceType": "Device",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-observer-uv-ips",
    "version": "2.0.1",
    "name": "DeviceObserverUvIps",
    "elements": [
      {
        "id": "Device",
        "path": "Device",
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
        "id": "Device.identifier",
        "path": "Device.identifier",
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
        "id": "Device.manufacturer",
        "path": "Device.manufacturer",
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
        "id": "Device.deviceName.name",
        "path": "Device.deviceName.name",
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
      },
      {
        "id": "Device.deviceName.type",
        "path": "Device.deviceName.type",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/device-nametype|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Device.modelNumber",
        "path": "Device.modelNumber",
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
        "id": "Device.specialization.systemType",
        "path": "Device.specialization.systemType",
        "min": 1,
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
        "id": "Device.version.value",
        "path": "Device.version.value",
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
      },
      {
        "id": "Device.property.type",
        "path": "Device.property.type",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
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
  "resourceType": "Device",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-observer-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-observer-uv-ips|2.0.1"
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
      "code": "biological-source-event",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Device-biological-source-event",
      "expression": "Device.biologicalSourceEvent",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Device-code",
      "expression": "Device.definition.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "code-value-concept",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Device-code-value-concept",
      "expression": "Device",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "definition",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Device-definition",
      "expression": "Device.definition.reference",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "device-name",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-device-name",
      "expression": "Device.name.value | Device.type.coding.display | Device.type.text",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "din",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/device-extensions-Device-din",
      "expression": "Device.extension('http://hl7.org/fhir/SearchParameter/device-extensions-Device-din')",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "expiration-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Device-expiration-date",
      "expression": "Device.expirationDate",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "identifier",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Device-identifier",
      "expression": "Device.identifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "location",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Device-location",
      "expression": "Device.location",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "lot-number",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-lot-number",
      "expression": "Device.lotNumber",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "manufacture-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Device-manufacture-date",
      "expression": "Device.manufactureDate",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "manufacturer",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-manufacturer",
      "expression": "Device.manufacturer",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "model",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-model",
      "expression": "Device.modelNumber",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "organization",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Device-organization",
      "expression": "Device.owner",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "parent",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Device-parent",
      "expression": "Device.parent",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "patient",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Device-patient",
      "expression": "Device.patient",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "serial-number",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-serial-number",
      "expression": "Device.serialNumber | Device.identifier.where(type='SNO')",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "specification",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Device-specification",
      "expression": "Device.conformsTo.specification",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "specification-version",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Device-specification-version",
      "expression": "Device.conformsTo",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Device-status",
      "expression": "Device.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "type",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Device-type",
      "expression": "Device.type",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "udi-carrier",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-udi-carrier",
      "expression": "Device.udiCarrier.carrierHRF",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "udi-di",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-udi-di",
      "expression": "Device.udiCarrier.deviceIdentifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "url",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/Device-url",
      "expression": "Device.url",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "version",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Device-version",
      "expression": "Device.version.value",
      "fhirVersions": [
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
