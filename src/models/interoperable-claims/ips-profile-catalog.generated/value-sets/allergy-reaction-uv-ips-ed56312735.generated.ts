// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/allergy-reaction-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/allergy-reaction-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "AllergyReactionUvIps",
  "title": "Allergy Reaction - IPS",
  "status": "active",
  "description": "IPS allergy reaction value set. This value set includes a set of SNOMED CT codes  and descendants (all top level codes are included in the SNOMED CT IPS Terminology) that may be used to represent allergy or intolerance reactions.\n\nSNOMED CT® ECL definition:\\\n\\<\\< 4386001 |Bronchospasm (finding)| OR \\<\\< 9826008 |Conjunctivitis (disorder)| OR \\<\\< 23924001 |Tight chest (finding)| OR \\<\\< 24079001 |Atopic dermatitis (disorder)| OR \\<\\< 31996006 |Vasculitis (disorder)| OR \\<\\< 39579001 |Anaphylaxis (disorder)| OR \\<\\< 41291007 |Angioedema (disorder)| OR \\<\\< 43116000 |Eczema (disorder)| OR \\<\\< 49727002 |Cough (finding)| OR \\<\\< 51599000 |Edema of larynx (disorder)| OR \\<\\< 62315008 |Diarrhea (finding)| OR \\<\\< 70076002 |Rhinitis (disorder)| OR \\<\\< 73442001 |Stevens-Johnson syndrome (disorder)| OR \\<\\< 76067001 |Sneezing (finding)| OR \\<\\< 91175000 |Seizure (finding)| OR \\<\\< 126485001 |Urticaria (disorder)| OR \\<\\< 162290004 |Dry eyes (finding)| OR \\<\\< 195967001 |Asthma (disorder)| OR \\<\\< 247472004 |Weal (disorder)| OR \\<\\< 267036007 |Dyspnea (finding)| OR \\<\\< 271757001 |Papular eruption (disorder)| OR \\<\\< 271759003 |Bullous eruption (disorder)| OR \\<\\< 271807003 |Eruption of skin (disorder)| OR \\<\\< 410430005 |Cardiorespiratory arrest (disorder)| OR \\<\\< 418363000 |Itching of skin (finding)| OR \\<\\< 422400008 |Vomiting (disorder)| OR \\<\\< 422587007 |Nausea (finding)| OR \\<\\< 698247007 |Cardiac arrhythmia (disorder)| OR \\<\\< 702809001 |Drug reaction with eosinophilia and systemic symptoms (disorder)| OR \\<\\< 768962006 |Lyell syndrome (disorder)| OR \\<\\< 781682005 |Hyperemia of eye (finding)|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "4386001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "9826008"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "23924001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "24079001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "31996006"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "39579001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "41291007"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "43116000"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "49727002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "51599000"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "62315008"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "70076002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "73442001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "76067001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "91175000"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "126485001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "162290004"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "195967001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "247472004"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "267036007"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "271757001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "271759003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "271807003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "410430005"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "418363000"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "422400008"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "422587007"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "698247007"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "702809001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "768962006"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "781682005"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "AllergyIntolerance",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1",
      "elementId": "AllergyIntolerance.reaction.manifestation",
      "path": "AllergyIntolerance.reaction.manifestation",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
