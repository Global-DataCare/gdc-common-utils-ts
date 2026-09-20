// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips",
    "version": "2.0.1",
    "name": "ObservationPregnancyEddUvIps",
    "elements": [
      {
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/edd-method-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueDateTime",
        "path": "Observation.value[x]",
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
        "id": "Observation.bodySite",
        "path": "Observation.bodySite",
        "min": 0,
        "max": "0",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/body-site|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.method",
        "path": "Observation.method",
        "min": 0,
        "max": "0",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-methods|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.specimen",
        "path": "Observation.specimen",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Specimen|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.device",
        "path": "Observation.device",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Device|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DeviceMetric|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.referenceRange",
        "path": "Observation.referenceRange",
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
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips",
    "version": "2.0.1",
    "name": "ObservationPregnancyOutcomeUvIps",
    "elements": [
      {
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/pregnancies-summary-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
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
        "id": "Observation.bodySite",
        "path": "Observation.bodySite",
        "min": 0,
        "max": "0",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/body-site|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.specimen",
        "path": "Observation.specimen",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Specimen|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.device",
        "path": "Observation.device",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Device|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DeviceMetric|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.referenceRange",
        "path": "Observation.referenceRange",
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
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips",
    "version": "2.0.1",
    "name": "ObservationPregnancyStatusUvIps",
    "elements": [
      {
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "82810-3"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueCodeableConcept",
        "path": "Observation.value[x]",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/pregnancy-status-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.bodySite",
        "path": "Observation.bodySite",
        "min": 0,
        "max": "0",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/body-site|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.specimen",
        "path": "Observation.specimen",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Specimen|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.device",
        "path": "Observation.device",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Device|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DeviceMetric|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.referenceRange",
        "path": "Observation.referenceRange",
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
        "id": "Observation.hasMember",
        "path": "Observation.hasMember",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1"
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
        "id": "Observation.hasMember.reference",
        "path": "Observation.hasMember.reference",
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
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips",
    "version": "2.0.1",
    "name": "ObservationAlcoholUseUvIps",
    "elements": [
      {
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "74013-4"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips",
    "version": "2.0.1",
    "name": "ObservationTobaccoUseUvIps",
    "elements": [
      {
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "72166-2"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueCodeableConcept",
        "path": "Observation.value[x]",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/current-smoking-status-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips",
    "version": "2.0.1",
    "name": "ObservationResultsLaboratoryPathologyUvIps",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/results-status-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/CodeableConcept-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:laboratory",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "laboratory"
              }
            ]
          }
        },
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/results-laboratory-pathology-observations-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1",
          "http://hl7.org/fhir/StructureDefinition/Group|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Device|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Location|4.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime",
          "Period"
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
        "id": "Observation.effective[x]:effectiveDateTime",
        "path": "Observation.effective[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:able-to-populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Observation.performer",
        "path": "Observation.performer",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Organization-uv-ips|2.0.1",
          "http://hl7.org/fhir/StructureDefinition/CareTeam|4.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1"
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueString",
        "path": "Observation.value[x]",
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
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
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
        "id": "Observation.value[x]:valueCodeableConcept",
        "path": "Observation.value[x]",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/results-coded-values-laboratory-pathology-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.specimen",
        "path": "Observation.specimen",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Specimen-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.hasMember",
        "path": "Observation.hasMember",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-codes|4.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips",
    "version": "2.0.1",
    "name": "ObservationResultsRadiologyUvIps",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.partOf",
        "path": "Observation.partOf",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/ImagingStudy-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.status",
        "path": "Observation.status",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/results-status-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/CodeableConcept-uv-ips|2.0.1"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:radiology",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "imaging"
              }
            ]
          }
        },
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/results-radiology-observations-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1"
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
        "id": "Observation.subject.reference",
        "path": "Observation.subject.reference",
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime",
          "Period"
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
        "id": "Observation.effective[x]:effectiveDateTime",
        "path": "Observation.effective[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:able-to-populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Observation.performer",
        "path": "Observation.performer",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Practitioner-uv-ips|2.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/PractitionerRole-uv-ips|2.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Organization-uv-ips|2.0.1",
          "http://hl7.org/fhir/StructureDefinition/CareTeam|4.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Patient-uv-ips|2.0.1",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1"
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueString",
        "path": "Observation.value[x]",
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
        "id": "Observation.bodySite",
        "path": "Observation.bodySite",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/body-site|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.device",
        "path": "Observation.device",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Device-observer-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.hasMember",
        "path": "Observation.hasMember",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
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
        "id": "Observation.component.code",
        "path": "Observation.component.code",
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
          "valueSet": "http://hl7.org/fhir/uv/ips/ValueSet/results-radiology-component-uv-ips|2.0.1",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/resprate",
    "version": "4.0.1",
    "name": "observation-resprate",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:RespRateCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:RespRateCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:RespRateCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "9279-1"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "/min"
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/heartrate",
    "version": "4.0.1",
    "name": "observation-heartrate",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:HeartRateCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:HeartRateCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:HeartRateCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "8867-4"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "/min"
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/oxygensat",
    "version": "4.0.1",
    "name": "observation-oxygensat",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:OxygenSatCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:OxygenSatCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:OxygenSatCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "2708-6"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "%"
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/bodytemp",
    "version": "4.0.1",
    "name": "observation-bodytemp",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BodyTempCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BodyTempCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:BodyTempCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "8310-5"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-bodytemp|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/bodyheight",
    "version": "4.0.1",
    "name": "observation-bodyheight",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BodyHeightCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BodyHeightCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:BodyHeightCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "8302-2"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-bodylength|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/headcircum",
    "version": "4.0.1",
    "name": "observation-headcircum",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:HeadCircumCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:HeadCircumCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:HeadCircumCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "9843-4"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-bodylength|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/bodyweight",
    "version": "4.0.1",
    "name": "observation-bodyweight",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BodyWeightCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BodyWeightCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:BodyWeightCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "29463-7"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-bodyweight|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/bmi",
    "version": "4.0.1",
    "name": "observation-bmi",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BMICode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BMICode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:BMICode.code",
        "path": "Observation.code.coding.code",
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
          "value": "39156-5"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.value",
        "path": "Observation.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.unit",
        "path": "Observation.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity.system",
        "path": "Observation.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.value[x]:valueQuantity.code",
        "path": "Observation.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "kg/m2"
        }
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  },
  "http://hl7.org/fhir/StructureDefinition/bp|4.0.1": {
    "resourceType": "Observation",
    "canonicalUrl": "http://hl7.org/fhir/StructureDefinition/bp",
    "version": "4.0.1",
    "name": "observation-bp",
    "elements": [
      {
        "id": "Observation",
        "path": "Observation",
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
        "id": "Observation.status",
        "path": "Observation.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category",
        "path": "Observation.category",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat",
        "path": "Observation.category",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-category",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.category:VSCat.coding",
        "path": "Observation.category.coding",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.category:VSCat.coding.system",
        "path": "Observation.category.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://terminology.hl7.org/CodeSystem/observation-category"
        }
      },
      {
        "id": "Observation.category:VSCat.coding.code",
        "path": "Observation.category.coding.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "vital-signs"
        }
      },
      {
        "id": "Observation.code",
        "path": "Observation.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.code.coding",
        "path": "Observation.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BPCode",
        "path": "Observation.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.code.coding:BPCode.system",
        "path": "Observation.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.code.coding:BPCode.code",
        "path": "Observation.code.coding.code",
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
          "value": "85354-9"
        }
      },
      {
        "id": "Observation.subject",
        "path": "Observation.subject",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.effective[x]",
        "path": "Observation.effective[x]",
        "min": 1,
        "max": "1",
        "mustSupport": true,
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
        "id": "Observation.value[x]",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.value[x]:valueQuantity",
        "path": "Observation.value[x]",
        "min": 0,
        "max": "0",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.dataAbsentReason",
        "path": "Observation.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component",
        "path": "Observation.component",
        "min": 2,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity",
          "CodeableConcept",
          "string",
          "boolean",
          "integer",
          "Range",
          "Ratio",
          "SampledData",
          "time",
          "dateTime",
          "Period"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component:SystolicBP",
        "path": "Observation.component",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:SystolicBP.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component:SystolicBP.code.coding",
        "path": "Observation.component.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:SystolicBP.code.coding:SBPCode",
        "path": "Observation.component.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:SystolicBP.code.coding:SBPCode.system",
        "path": "Observation.component.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.component:SystolicBP.code.coding:SBPCode.code",
        "path": "Observation.component.code.coding.code",
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
          "value": "8480-6"
        }
      },
      {
        "id": "Observation.component:SystolicBP.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component:SystolicBP.value[x].value",
        "path": "Observation.component.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:SystolicBP.value[x].unit",
        "path": "Observation.component.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:SystolicBP.value[x].system",
        "path": "Observation.component.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.component:SystolicBP.value[x].code",
        "path": "Observation.component.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "mm[Hg]"
        }
      },
      {
        "id": "Observation.component:SystolicBP.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component:DiastolicBP",
        "path": "Observation.component",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:DiastolicBP.code",
        "path": "Observation.component.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/observation-vitalsignresult",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component:DiastolicBP.code.coding",
        "path": "Observation.component.code.coding",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:DiastolicBP.code.coding:DBPCode",
        "path": "Observation.component.code.coding",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Coding"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:DiastolicBP.code.coding:DBPCode.system",
        "path": "Observation.component.code.coding.system",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://loinc.org"
        }
      },
      {
        "id": "Observation.component:DiastolicBP.code.coding:DBPCode.code",
        "path": "Observation.component.code.coding.code",
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
          "value": "8462-4"
        }
      },
      {
        "id": "Observation.component:DiastolicBP.value[x]",
        "path": "Observation.component.value[x]",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Quantity"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/ucum-vitals-common|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Observation.component:DiastolicBP.value[x].value",
        "path": "Observation.component.value[x].value",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "decimal"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:DiastolicBP.value[x].unit",
        "path": "Observation.component.value[x].unit",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Observation.component:DiastolicBP.value[x].system",
        "path": "Observation.component.value[x].system",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "uri"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Uri",
          "value": "http://unitsofmeasure.org"
        }
      },
      {
        "id": "Observation.component:DiastolicBP.value[x].code",
        "path": "Observation.component.value[x].code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "fixedValue": {
          "fhirType": "Code",
          "value": "mm[Hg]"
        }
      },
      {
        "id": "Observation.component:DiastolicBP.dataAbsentReason",
        "path": "Observation.component.dataAbsentReason",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "binding": {
          "strength": "extensible",
          "valueSet": "http://hl7.org/fhir/ValueSet/data-absent-reason",
          "additionalValueSets": []
        }
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "Observation",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1",
    "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bp|4.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-edd-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1",
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1",
    "http://hl7.org/fhir/StructureDefinition/resprate|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/heartrate|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/oxygensat|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bodytemp|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bodyheight|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/headcircum|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bodyweight|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bmi|4.0.1",
    "http://hl7.org/fhir/StructureDefinition/bp|4.0.1"
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
      "code": "amino-acid-change",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/observation-genetic-Observation-amino-acid-change",
      "expression": "Observation.extension('http://hl7.org/fhir/StructureDefinition/observation-geneticsAminoAcidChangeName')",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "based-on",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-based-on",
      "expression": "Observation.basedOn",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-category",
      "expression": "Observation.category",
      "fhirVersions": [
        "4.0.1",
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
      "code": "code-value-concept",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-code-value-concept",
      "expression": "Observation",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "code-value-date",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-code-value-date",
      "expression": "Observation",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "code-value-quantity",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-code-value-quantity",
      "expression": "Observation",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "code-value-string",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-code-value-string",
      "expression": "Observation",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "combo-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-combo-code",
      "expression": "Observation.code | Observation.component.code",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "combo-code-value-concept",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-combo-code-value-concept",
      "expression": "Observation | Observation.component",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "combo-code-value-quantity",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-combo-code-value-quantity",
      "expression": "Observation | Observation.component",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "combo-data-absent-reason",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-combo-data-absent-reason",
      "expression": "Observation.dataAbsentReason | Observation.component.dataAbsentReason",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "combo-value-concept",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-combo-value-concept",
      "expression": "Observation.value.ofType(CodeableConcept) | Observation.component.value.ofType(CodeableConcept)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "combo-value-quantity",
      "type": "quantity",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-combo-value-quantity",
      "expression": "Observation.value.ofType(Quantity) | Observation.value.ofType(SampledData) | Observation.component.value.ofType(Quantity) | Observation.component.value.ofType(SampledData)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-code",
      "expression": "Observation.component.code",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-code-value-concept",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-code-value-concept",
      "expression": "Observation.component",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-code-value-quantity",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-code-value-quantity",
      "expression": "Observation.component",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-data-absent-reason",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-data-absent-reason",
      "expression": "Observation.component.dataAbsentReason",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-value-canonical",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-value-canonical",
      "expression": "Observation.component.value.ofType(canonical)",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "component-value-concept",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-value-concept",
      "expression": "Observation.component.value.ofType(CodeableConcept)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-value-quantity",
      "type": "quantity",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-value-quantity",
      "expression": "Observation.component.value.ofType(Quantity) | Observation.component.value.ofType(SampledData)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "component-value-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-component-value-reference",
      "expression": "Observation.component.value.ofType(Reference)",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "data-absent-reason",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-data-absent-reason",
      "expression": "Observation.dataAbsentReason",
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
      "code": "derived-from",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-derived-from",
      "expression": "Observation.derivedFrom",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "device",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-device",
      "expression": "Observation.device",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "dna-variant",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/observation-genetic-Observation-dna-variant",
      "expression": "Observation.extension('http://hl7.org/fhir/StructureDefinition/observation-geneticsDnaVariant')",
      "fhirVersions": [
        "4.0.1"
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
      "code": "focus",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-focus",
      "expression": "Observation.focus",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "gene-amino-acid-change",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/observation-genetic-Observation-gene-amino-acid-change",
      "expression": "Observation.extension('http://hl7.org/fhir/StructureDefinition/observation-geneticsAminoAcidChangeName')",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "gene-dnavariant",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/observation-genetic-Observation-gene-dnavariant",
      "expression": "Observation.extension('http://hl7.org/fhir/StructureDefinition/observation-geneticsDnaVariant')",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "gene-identifier",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/observation-genetic-Observation-gene-identifier",
      "expression": "Observation.extension('http://hl7.org/fhir/StructureDefinition/observation-geneticsGene')",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "has-member",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-has-member",
      "expression": "Observation.hasMember",
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
      "code": "method",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-method",
      "expression": "Observation.method",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "part-of",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-part-of",
      "expression": "Observation.partOf",
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
      "url": "http://hl7.org/fhir/SearchParameter/Observation-performer",
      "expression": "Observation.performer",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "specimen",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-specimen",
      "expression": "Observation.specimen",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-status",
      "expression": "Observation.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-subject",
      "expression": "Observation.subject",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "value-canonical",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-canonical",
      "expression": "Observation.value.ofType(canonical)",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "value-concept",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-concept",
      "expression": "Observation.value.ofType(CodeableConcept)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "value-date",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-date",
      "expression": "Observation.value.ofType(dateTime) | Observation.value.ofType(Period)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "value-markdown",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-markdown",
      "expression": "Observation.value.ofType(markdown) | Observation.value.ofType(CodeableConcept).text",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "value-quantity",
      "type": "quantity",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-quantity",
      "expression": "Observation.value.ofType(Quantity) | Observation.value.ofType(SampledData)",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "value-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-reference",
      "expression": "Observation.value.ofType(Reference)",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "value-string",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Observation-value-string",
      "expression": "(Observation.value as string) | (Observation.value as CodeableConcept).text",
      "fhirVersions": [
        "4.0.1"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
