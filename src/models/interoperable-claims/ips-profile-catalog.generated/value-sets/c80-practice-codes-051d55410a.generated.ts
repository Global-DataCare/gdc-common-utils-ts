// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';
import { VALUE_SET_CHUNK as ValueSetChunk_0_0 } from './chunks/c80-practice-codes-051d55410a-include-0-0.generated';
import { VALUE_SET_CHUNK as ValueSetChunk_0_1 } from './chunks/c80-practice-codes-051d55410a-include-0-1.generated';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/c80-practice-codes",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/c80-practice-codes",
  "resolved": true,
  "version": "4.0.1",
  "name": "PracticeSettingCodeValueSet",
  "title": "Practice Setting Code Value Set",
  "status": "active",
  "description": "This is the code representing the clinical specialty of the clinician or provider who interacted with, treated, or provided a service to/for the patient. The value set used for clinical specialty has been limited by HITSP to the value set reproduced from HITSP C80 Table 2-149 Clinical Specialty Value Set Definition.",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "concept": [...ValueSetChunk_0_0, ...ValueSetChunk_0_1]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.context.practiceSetting",
      "path": "DocumentReference.context.practiceSetting",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
