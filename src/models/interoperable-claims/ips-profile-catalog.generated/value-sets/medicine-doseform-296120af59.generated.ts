// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/medicine-doseform|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/medicine-doseform",
  "resolved": true,
  "version": "2.0.1",
  "name": "MedicineDoseFormUvIps",
  "title": "Medicine EDQM Doseform - IPS",
  "status": "active",
  "description": "While SNOMED remains a preferred binding for medicine doseform, EDQM (European Directorate for the Quality of Medicines and Healthcare) doseform codes are allowed as additional binding. \n\nThis Value Set includes all the EDQM Standard Terms having:  \n[Concept Status] = ‘C’ AND  \n[Concept Class] IN (‘PDF’, ‘CMT’, ‘CDF’, ‘PFT') AND  \n[Domain] = 'H+V'  \n\nC = 'Current'; PDF = 'Pharmaceutical dose form'; CMT = 'Combined terms'; CDF = 'Combined pharmaceutical dose form'; PFT = 'Patient Friendly'; H+V = 'Human and Veterinary'",
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
            "value": "PDF"
          },
          {
            "property": "domain",
            "op": "=",
            "value": "H+V"
          }
        ]
      },
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
            "value": "CMT"
          },
          {
            "property": "domain",
            "op": "=",
            "value": "H+V"
          }
        ]
      },
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
            "value": "CDF"
          },
          {
            "property": "domain",
            "op": "=",
            "value": "H+V"
          }
        ]
      },
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
            "value": "PFT"
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
      "resourceType": "Medication",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Medication-uv-ips|2.0.1",
      "elementId": "Medication.form",
      "path": "Medication.form",
      "purpose": "additional",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
