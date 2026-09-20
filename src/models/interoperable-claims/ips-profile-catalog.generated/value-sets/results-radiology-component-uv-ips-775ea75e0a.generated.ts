// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/results-radiology-component-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/results-radiology-component-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ResultsRadiologyComponentUvIps",
  "title": "Results Radiology Component - IPS",
  "status": "active",
  "description": "Value set including SNOMED CT, LOINC and DICOM concepts for textual reports, measurements, and other radiology components",
  "immutable": false,
  "compose": {
    "include": [
      {
        "valueSet": [
          "http://hl7.org/fhir/uv/ips/ValueSet/results-radiology-observations-uv-ips"
        ]
      },
      {
        "system": "http://dicom.nema.org/resources/ontology/DCM",
        "version": "01",
        "concept": [
          {
            "code": "121065",
            "display": "Procedure Description"
          },
          {
            "code": "121069",
            "display": "Previous Finding"
          },
          {
            "code": "121071",
            "display": "Finding"
          },
          {
            "code": "121073",
            "display": "Impression"
          },
          {
            "code": "121075",
            "display": "Recommendation"
          },
          {
            "code": "121077",
            "display": "Conclusion"
          },
          {
            "code": "121207",
            "display": "Height"
          },
          {
            "code": "121211",
            "display": "Path length"
          },
          {
            "code": "121206",
            "display": "Distance"
          },
          {
            "code": "121216",
            "display": "Volume estimated from single 2D region"
          },
          {
            "code": "121218",
            "display": "Volume estimated from two non-coplanar 2D regions"
          },
          {
            "code": "121217",
            "display": "Volume estimated from three or more non-coplanar 2D regions"
          },
          {
            "code": "121222",
            "display": "Volume of sphere"
          },
          {
            "code": "121221",
            "display": "Volume of ellipsoid"
          },
          {
            "code": "121220",
            "display": "Volume of circumscribed sphere"
          },
          {
            "code": "121219",
            "display": "Volume of bounding three dimensional region"
          }
        ]
      },
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "55108-5",
            "display": "Clinical presentation Document"
          },
          {
            "code": "55112-7",
            "display": "Document summary"
          },
          {
            "code": "11329-0",
            "display": "History general Narrative - Reported"
          },
          {
            "code": "55115-0",
            "display": "Requested imaging studies information Document"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "concept": [
          {
            "code": "116224001",
            "display": "Complication of Procedure"
          },
          {
            "code": "410668003",
            "display": "Length"
          },
          {
            "code": "103355008",
            "display": "Width"
          },
          {
            "code": "131197000",
            "display": "Depth"
          },
          {
            "code": "81827009",
            "display": "Diameter"
          },
          {
            "code": "103339001",
            "display": "Long Axis"
          },
          {
            "code": "103340004",
            "display": "Short Axis"
          },
          {
            "code": "131187009",
            "display": "Major Axis"
          },
          {
            "code": "131188004",
            "display": "Minor Axis"
          },
          {
            "code": "131189007",
            "display": "Perpendicular Axis"
          },
          {
            "code": "131190003",
            "display": "Radius"
          },
          {
            "code": "131191004",
            "display": "Perimeter"
          },
          {
            "code": "74551000",
            "display": "Circumference"
          },
          {
            "code": "131192006",
            "display": "Diameter of circumscribed circle"
          },
          {
            "code": "42798000",
            "display": "Area"
          },
          {
            "code": "131184002",
            "display": "Area of defined region"
          },
          {
            "code": "118565006",
            "display": "Volume"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Observation",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1",
      "elementId": "Observation.component.code",
      "path": "Observation.component.code",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
