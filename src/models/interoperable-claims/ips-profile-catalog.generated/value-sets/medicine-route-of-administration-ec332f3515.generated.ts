// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/medicine-route-of-administration|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/medicine-route-of-administration",
  "resolved": true,
  "version": "2.0.1",
  "name": "MedicineRouteOfAdministrationUvIps",
  "title": "Medicine EDQM Route of Administration - IPS",
  "status": "active",
  "description": "While SNOMED remains a preferred binding for medicine route, EDQM (European Directorate for the Quality of Medicines and Healthcare) route of administration codes are allowed as additional binding. \n\nEDQM (European Directorate for the Quality of Medicines and Healthcare) Route of Administration codes.  This Value Set includes all the EDQM Standard Terms having:  \n[Concept Status] = ‘C’ AND  \n[Concept Class] = 'ROA' AND  \n[Domain] = 'H+V'  \n\nC = 'Current'; ROA = 'Route of administration'; H+V = 'Human and Veterinary'",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://standardterms.edqm.eu",
        "filter": [
          {
            "property": "status",
            "op": "=",
            "value": "C"
          },
          {
            "property": "class",
            "op": "=",
            "value": "ROA"
          },
          {
            "property": "domain",
            "op": "=",
            "value": "H+V"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "MedicationRequest",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1",
      "elementId": "MedicationRequest.dosageInstruction.route",
      "path": "MedicationRequest.dosageInstruction.route",
      "purpose": "additional",
      "strength": "preferred"
    },
    {
      "resourceType": "MedicationStatement",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationStatement-uv-ips|2.0.1",
      "elementId": "MedicationStatement.dosage.route",
      "path": "MedicationStatement.dosage.route",
      "purpose": "additional",
      "strength": "preferred"
    },
    {
      "resourceType": "Immunization",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1",
      "elementId": "Immunization.route",
      "path": "Immunization.route",
      "purpose": "additional",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
