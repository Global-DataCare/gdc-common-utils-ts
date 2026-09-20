// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/uv/ips/ValueSet/results-specimen-collection-method-uv-ips|2.0.1",
  "canonicalUrl": "http://hl7.org/fhir/uv/ips/ValueSet/results-specimen-collection-method-uv-ips",
  "resolved": true,
  "version": "2.0.1",
  "name": "ResultsSpecimenCollectionMethodUvIps",
  "title": "Results Specimen Collection Method - IPS",
  "status": "active",
  "description": "IPS Specimen collection method codes value set.  This value set includes codes from SNOMED CT®: all descendants or self of 129316008 \\|Aspiration - action (qualifier value)\\|; all descendants or self of 129314006 \\|Biopsy - action (qualifier value)\\|; all descendants or self of 129300006 \\|Puncture - action (qualifier value)\\|; all descendants or self of 129304002 \\|Excision - action (qualifier value)\\|; all descendants or self of 129323009 \\|Scraping - action (qualifier value)\\|; all descendants or self of 73416001 \\|Urine specimen collection, clean catch (procedure)\\|; all descendants or self of 225113003 \\|Timed urine collection (procedure)\\|; all descendants or self of 70777001 \\|Urine specimen collection, catheterized (procedure)\\|; all descendants or self of 386089008 \\|Collection of coughed sputum (procedure)\\|; all descendants or self of 278450005 \\|Finger-prick sampling (procedure)\\| \n\nSNOMED CT® ECL definition:\\\n\\<\\< 129316008 \\|Aspiration - action (qualifier value)\\| OR \\<\\< 129314006 \\|Biopsy - action (qualifier value)\\| OR \\<\\< 129300006 \\|Puncture - action (qualifier value)\\| OR \\<\\< 129304002 \\|Excision - action (qualifier value)\\| OR \\<\\< 129323009 \\|Scraping - action (qualifier value)\\| OR \\<\\< 73416001 \\|Urine specimen collection, clean catch (procedure)\\| OR \\<\\< 225113003 \\|Timed urine collection (procedure)\\| OR \\<\\< 70777001 \\|Urine specimen collection, catheterized (procedure)\\| OR \\<\\< 386089008 \\|Collection of coughed sputum (procedure)\\| OR \\<\\< 278450005 \\|Finger-prick sampling (procedure)\\|",
  "immutable": false,
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "129316008"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "129314006"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "129300006"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "129304002"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "129323009"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "73416001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "225113003"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "70777001"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "386089008"
          }
        ]
      },
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "278450005"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "Specimen",
      "profile": "http://hl7.org/fhir/uv/ips/StructureDefinition/Specimen-uv-ips|2.0.1",
      "elementId": "Specimen.collection.method",
      "path": "Specimen.collection.method",
      "purpose": "primary",
      "strength": "preferred"
    }
  ]
} as const satisfies IpsValueSetDefinition;
