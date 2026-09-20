// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1": {
    "resourceType": "Bundle",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips",
    "version": "2.0.1",
    "name": "BundleUvIps",
    "elements": [
      {
        "id": "Bundle",
        "path": "Bundle",
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
        "id": "Bundle.identifier",
        "path": "Bundle.identifier",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Identifier"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle"
        ]
      },
      {
        "id": "Bundle.type",
        "path": "Bundle.type",
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
        "fixedValue": {
          "fhirType": "Code",
          "value": "document"
        },
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/bundle-type|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.timestamp",
        "path": "Bundle.timestamp",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "instant"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle"
        ]
      },
      {
        "id": "Bundle.link.relation",
        "path": "Bundle.link.relation",
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
        "id": "Bundle.link.url",
        "path": "Bundle.link.url",
        "min": 1,
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
        "id": "Bundle.entry",
        "path": "Bundle.entry",
        "min": 2,
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
        "id": "Bundle.entry.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry.search",
        "path": "Bundle.entry.search",
        "min": 0,
        "max": "0",
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
        "id": "Bundle.entry.request",
        "path": "Bundle.entry.request",
        "min": 0,
        "max": "0",
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
        "id": "Bundle.entry.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry.response",
        "path": "Bundle.entry.response",
        "min": 0,
        "max": "0",
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
        "id": "Bundle.entry.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:composition",
        "path": "Bundle.entry",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
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
        "id": "Bundle.entry:composition.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:composition.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Composition"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:composition.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:composition.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:composition.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:patient",
        "path": "Bundle.entry",
        "min": 1,
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
        "id": "Bundle.entry:patient.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:patient.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Patient"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:patient.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:patient.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:patient.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:allergyintolerance",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:allergyintolerance.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:allergyintolerance.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "AllergyIntolerance"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:allergyintolerance.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:allergyintolerance.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:allergyintolerance.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:careplan",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:careplan.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:careplan.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "CarePlan"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:careplan.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:careplan.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:careplan.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:clinicalimpression",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:clinicalimpression.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:clinicalimpression.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "ClinicalImpression"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:clinicalimpression.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:clinicalimpression.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:clinicalimpression.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:condition",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:condition.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:condition.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Condition"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:condition.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:condition.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:condition.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:consent",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:consent.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:consent.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Consent"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:consent.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:consent.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:consent.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:device",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:device.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:device.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Device"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:device.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:device.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:device.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:deviceusestatement",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:deviceusestatement.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:deviceusestatement.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "DeviceUseStatement"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/DeviceUseStatement-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:deviceusestatement.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:deviceusestatement.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:deviceusestatement.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:diagnosticreport",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:diagnosticreport.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:diagnosticreport.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "DiagnosticReport"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/DiagnosticReport-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:diagnosticreport.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:diagnosticreport.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:diagnosticreport.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:documentreference",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:documentreference.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:documentreference.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "DocumentReference"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:documentreference.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:documentreference.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:documentreference.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:flag",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:flag.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:flag.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Flag"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Flag-alert-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:flag.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:flag.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:flag.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:imagingstudy",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:imagingstudy.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:imagingstudy.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "ImagingStudy"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:imagingstudy.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:imagingstudy.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:imagingstudy.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:immunization",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:immunization.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:immunization.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Immunization"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:immunization.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:immunization.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:immunization.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:immunizationrecommendation",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:immunizationrecommendation.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:immunizationrecommendation.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "ImmunizationRecommendation"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:immunizationrecommendation.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:immunizationrecommendation.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:immunizationrecommendation.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:medication",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:medication.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:medication.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Medication"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Medication-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:medication.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:medication.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:medication.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:medicationrequest",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:medicationrequest.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:medicationrequest.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "MedicationRequest"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:medicationrequest.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:medicationrequest.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:medicationrequest.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:medicationstatement",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:medicationstatement.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:medicationstatement.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "MedicationStatement"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationStatement-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:medicationstatement.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:medicationstatement.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:medicationstatement.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:practitioner",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:practitioner.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:practitioner.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Practitioner"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:practitioner.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:practitioner.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:practitioner.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:practitionerrole",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:practitionerrole.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:practitionerrole.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "PractitionerRole"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:practitionerrole.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:practitionerrole.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:practitionerrole.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:procedure",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:procedure.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:procedure.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Procedure"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Procedure-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:procedure.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:procedure.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:procedure.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-pregnancy-edd",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-pregnancy-edd.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-pregnancy-edd.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-pregnancy-edd.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-pregnancy-edd.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-pregnancy-edd.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-pregnancy-outcome",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-pregnancy-outcome.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-pregnancy-outcome.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-pregnancy-outcome.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-pregnancy-outcome.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-pregnancy-outcome.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-pregnancy-status",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-pregnancy-status.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-pregnancy-status.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-pregnancy-status.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-pregnancy-status.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-pregnancy-status.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-alcohol-use",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-alcohol-use.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-alcohol-use.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-alcohol-use.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-alcohol-use.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-alcohol-use.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-tobacco-use",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-tobacco-use.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-tobacco-use.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-tobacco-use.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-tobacco-use.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-tobacco-use.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-results-laboratory-pathology",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-results-laboratory-pathology.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-results-laboratory-pathology.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-results-laboratory-pathology.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-results-laboratory-pathology.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-results-laboratory-pathology.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-results-radiology",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-results-radiology.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-results-radiology.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-results-radiology.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-results-radiology.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-results-radiology.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:observation-vital-signs",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:observation-vital-signs.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:observation-vital-signs.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Observation"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/vitalsigns|4.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:observation-vital-signs.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:observation-vital-signs.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:observation-vital-signs.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:organization",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:organization.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:organization.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Organization"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Organization-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:organization.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:organization.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:organization.response.status",
        "path": "Bundle.entry.response.status",
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
        "id": "Bundle.entry:specimen",
        "path": "Bundle.entry",
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
        "id": "Bundle.entry:specimen.fullUrl",
        "path": "Bundle.entry.fullUrl",
        "min": 1,
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
        "id": "Bundle.entry:specimen.resource",
        "path": "Bundle.entry.resource",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Specimen"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Specimen-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Bundle.entry:specimen.request.method",
        "path": "Bundle.entry.request.method",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/http-verb|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Bundle.entry:specimen.request.url",
        "path": "Bundle.entry.request.url",
        "min": 1,
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
        "id": "Bundle.entry:specimen.response.status",
        "path": "Bundle.entry.response.status",
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
  "resourceType": "Bundle",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Bundle-uv-ips|2.0.1"
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
      "code": "composition",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Bundle-composition",
      "expression": "Bundle.entry[0].resource as Composition",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "example-constraint",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/example-constraint",
      "expression": "Bundle.entry[0].resource",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "identifier",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Bundle-identifier",
      "expression": "Bundle.identifier",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "message",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Bundle-message",
      "expression": "Bundle.entry[0].resource as MessageHeader",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "timestamp",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Bundle-timestamp",
      "expression": "Bundle.timestamp",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "type",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Bundle-type",
      "expression": "Bundle.type",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
