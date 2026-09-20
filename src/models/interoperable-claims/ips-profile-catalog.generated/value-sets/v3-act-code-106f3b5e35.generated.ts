// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://terminology.hl7.org/ValueSet/v3-ActCode",
  "canonicalUrl": "http://terminology.hl7.org/ValueSet/v3-ActCode",
  "resolved": true,
  "version": "2018-08-12",
  "name": "v3.ActCode",
  "title": "v3 Code System ActCode",
  "status": "active",
  "description": " A code specifying the particular kind of Act that the Act-instance represents within its class.  Constraints:\r\nThe kind of Act (e.g. physical examination, serum potassium, inpatient encounter, charge financial transaction, etc.) is specified with a code from one of several, typically external, coding systems.  The coding system will depend on the class of Act, such as LOINC for observations, etc. Conceptually, the Act.code must be a specialization of the Act.classCode. This is why the structure of ActClass domain should be reflected in the superstructure of the ActCode domain and then individual codes or externally referenced vocabularies subordinated under these domains that reflect the ActClass structure. Act.classCode and Act.code are not modifiers of each other but the Act.code concept should really imply the Act.classCode concept. For a negative example, it is not appropriate to use an Act.code \"potassium\" together with and Act.classCode for \"laboratory observation\" to somehow mean \"potassium laboratory observation\" and then use the same Act.code for \"potassium\" together with Act.classCode for \"medication\" to mean \"substitution of potassium\". This mutually modifying use of Act.code and Act.classCode is not permitted.",
  "immutable": true,
  "compose": {
    "include": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode"
      }
    ]
  },
  "usages": [
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.context.event",
      "path": "DocumentReference.context.event",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
