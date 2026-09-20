// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsValueSetDefinition } from '../../ips-profile-types';

export const VALUE_SET = {
  "canonicalReference": "http://hl7.org/fhir/ValueSet/document-classcodes",
  "canonicalUrl": "http://hl7.org/fhir/ValueSet/document-classcodes",
  "resolved": true,
  "version": "4.0.1",
  "name": "DocumentClassValueSet",
  "title": "Document Class Value Set",
  "status": "active",
  "description": "This is the code specifying the high-level kind of document (e.g. Prescription, Discharge Summary, Report, etc.). Note: Class code for documents comes from LOINC, and is based upon one of the following:The type of service described by the document. It is described at a very high level in Section 7.3 of the LOINC Manual. The type study performed. It was determined by identifying modalities for study reports. The section of the chart where the document is placed. It was determined from the SETs created for Claims Attachment requests.",
  "compose": {
    "include": [
      {
        "system": "http://loinc.org",
        "concept": [
          {
            "code": "11369-6",
            "display": "History of Immunization"
          },
          {
            "code": "11485-0",
            "display": "Anesthesia records"
          },
          {
            "code": "11486-8",
            "display": "Chemotherapy records"
          },
          {
            "code": "11488-4",
            "display": "Consult Note"
          },
          {
            "code": "11506-3",
            "display": "Provider-unspecified progress note"
          },
          {
            "code": "11543-6",
            "display": "Nursery records"
          },
          {
            "code": "15508-5",
            "display": "Labor and delivery records"
          },
          {
            "code": "18726-0",
            "display": "Radiology studies (set)"
          },
          {
            "code": "18761-7",
            "display": "Provider-unspecified transfer summary"
          },
          {
            "code": "18842-5",
            "display": "Discharge summary"
          },
          {
            "code": "26436-6",
            "display": "Laboratory Studies (set)"
          },
          {
            "code": "26441-6",
            "display": "Cardiology studies (set)"
          },
          {
            "code": "26442-4",
            "display": "Obstetrical studies (set)"
          },
          {
            "code": "27895-2",
            "display": "Gastroenterology endoscopy studies (set)"
          },
          {
            "code": "27896-0",
            "display": "Pulmonary studies (set)"
          },
          {
            "code": "27897-8",
            "display": "Neuromuscular electrophysiology studies (set)"
          },
          {
            "code": "27898-6",
            "display": "Pathology studies (set)"
          },
          {
            "code": "28570-0",
            "display": "Provider-unspecified procedure note"
          },
          {
            "code": "28619-5",
            "display": "Ophthalmology/optometry studies (set)"
          },
          {
            "code": "28634-4",
            "display": "Miscellaneous studies (set)"
          },
          {
            "code": "29749-9",
            "display": "Dialysis records"
          },
          {
            "code": "29750-7",
            "display": "Neonatal intensive care records"
          },
          {
            "code": "29751-5",
            "display": "Critical care records"
          },
          {
            "code": "29752-3",
            "display": "Perioperative records"
          },
          {
            "code": "34109-9",
            "display": "Evaluation and management note"
          },
          {
            "code": "34117-2",
            "display": "Provider-unspecified, History and physical note"
          },
          {
            "code": "34121-4",
            "display": "Interventional procedure note"
          },
          {
            "code": "34122-2",
            "display": "Pathology procedure note"
          },
          {
            "code": "34133-9",
            "display": "Summarization of episode note"
          },
          {
            "code": "34140-4",
            "display": "Transfer of care referral note"
          },
          {
            "code": "34748-4",
            "display": "Telephone encounter note"
          },
          {
            "code": "34775-7",
            "display": "General surgery Pre-operative evaluation and management note"
          },
          {
            "code": "47039-3",
            "display": "Inpatient Admission history and physical note"
          },
          {
            "code": "47042-7",
            "display": "Counseling note"
          },
          {
            "code": "47045-0",
            "display": "Study report Document"
          },
          {
            "code": "47046-8",
            "display": "Summary of death"
          },
          {
            "code": "47049-2",
            "display": "Non-patient Communication"
          },
          {
            "code": "57017-6",
            "display": "Privacy Policy Organization Document"
          },
          {
            "code": "57016-8",
            "display": "Privacy Policy Acknowledgment Document"
          },
          {
            "code": "56445-0",
            "display": "Medication Summary Document"
          },
          {
            "code": "53576-5",
            "display": "Personal health monitoring report Document"
          },
          {
            "code": "56447-6",
            "display": "Plan of care note"
          },
          {
            "code": "18748-4",
            "display": "Diagnostic imaging study"
          },
          {
            "code": "11504-8",
            "display": "Surgical operation note "
          },
          {
            "code": "57133-1",
            "display": "Referral note"
          }
        ]
      }
    ]
  },
  "usages": [
    {
      "resourceType": "DocumentReference",
      "profile": "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1",
      "elementId": "DocumentReference.category",
      "path": "DocumentReference.category",
      "purpose": "primary",
      "strength": "example"
    }
  ]
} as const satisfies IpsValueSetDefinition;
