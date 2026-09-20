// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.

import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';

export const RESOURCE_PROFILES = {
  "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1": {
    "resourceType": "Composition",
    "canonicalUrl": "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips",
    "version": "2.0.1",
    "name": "CompositionUvIps",
    "elements": [
      {
        "id": "Composition",
        "path": "Composition",
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
        "id": "Composition.meta.profile",
        "path": "Composition.meta.profile",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "canonical"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/StructureDefinition|4.0.1"
        ],
        "creatorObligations": [
          "MAY:able-to-populate"
        ],
        "consumerObligations": []
      },
      {
        "id": "Composition.text",
        "path": "Composition.text",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.identifier",
        "path": "Composition.identifier",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Identifier"
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
        "id": "Composition.status",
        "path": "Composition.status",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/composition-status|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.type",
        "path": "Composition.type",
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
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle"
        ],
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "60591-5"
              }
            ]
          }
        },
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-typecodes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.subject",
        "path": "Composition.subject",
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
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.subject.reference",
        "path": "Composition.subject.reference",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.date",
        "path": "Composition.date",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "dateTime"
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
        "id": "Composition.author",
        "path": "Composition.author",
        "min": 1,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Practitioner|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Device|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Patient|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Organization|4.0.1"
        ],
        "creatorObligations": [
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.title",
        "path": "Composition.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.attester",
        "path": "Composition.attester",
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
        "id": "Composition.attester.mode",
        "path": "Composition.attester.mode",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "code"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ],
        "binding": {
          "strength": "required",
          "valueSet": "http://hl7.org/fhir/ValueSet/composition-attestation-mode|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.attester.time",
        "path": "Composition.attester.time",
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
        "id": "Composition.attester.party",
        "path": "Composition.attester.party",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Patient|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/RelatedPerson|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Practitioner|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/PractitionerRole|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/Organization|4.0.1"
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
        "id": "Composition.custodian",
        "path": "Composition.custodian",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Organization|4.0.1"
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
        "id": "Composition.relatesTo.code",
        "path": "Composition.relatesTo.code",
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
          "valueSet": "http://hl7.org/fhir/ValueSet/document-relationship-type|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.relatesTo.target[x]",
        "path": "Composition.relatesTo.target[x]",
        "min": 1,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Identifier",
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Composition|4.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.event",
        "path": "Composition.event",
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
        "id": "Composition.event:careProvisioningEvent",
        "path": "Composition.event",
        "min": 0,
        "max": "1",
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
        "id": "Composition.event:careProvisioningEvent.code",
        "path": "Composition.event.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHALL:populate"
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
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActClass",
                "code": "PCPR"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://terminology.hl7.org/ValueSet/v3-ActCode|3.0.0",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.event:careProvisioningEvent.period",
        "path": "Composition.event.period",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
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
        "id": "Composition.section",
        "path": "Composition.section",
        "min": 3,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section.extension",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section.code",
        "path": "Composition.section.code",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "CodeableConcept"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHALL:handle"
        ],
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section.section",
        "path": "Composition.section.section",
        "min": 0,
        "max": "0",
        "mustSupport": false,
        "fhirTypes": [],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [],
        "contentReference": "http://hl7.org/fhir/StructureDefinition/Composition#Composition.section"
      },
      {
        "id": "Composition.section:sectionProblems",
        "path": "Composition.section",
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
        "id": "Composition.section:sectionProblems.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionProblems.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionProblems.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "11450-4"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionProblems.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionProblems.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Condition|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionProblems.entry:problem",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHALL:able-to-populate",
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionProblems.emptyReason",
        "path": "Composition.section.emptyReason",
        "min": 0,
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
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/list-empty-reason|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionAllergies",
        "path": "Composition.section",
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
        "id": "Composition.section:sectionAllergies.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAllergies.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionAllergies.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "48765-2"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionAllergies.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionAllergies.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/AllergyIntolerance|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAllergies.entry:allergyOrIntolerance",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHALL:able-to-populate",
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionAllergies.emptyReason",
        "path": "Composition.section.emptyReason",
        "min": 0,
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
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/list-empty-reason|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionMedications",
        "path": "Composition.section",
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
        "id": "Composition.section:sectionMedications.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionMedications.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionMedications.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "10160-0"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionMedications.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionMedications.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/MedicationStatement|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/MedicationRequest|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/MedicationAdministration|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/MedicationDispense|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionMedications.entry:medicationStatementOrRequest",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationStatement-uv-ips|2.0.1",
          "http://hl7.org/fhir/uv/ips/StructureDefinition/MedicationRequest-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHALL:able-to-populate",
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionMedications.emptyReason",
        "path": "Composition.section.emptyReason",
        "min": 0,
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
        "binding": {
          "strength": "preferred",
          "valueSet": "http://hl7.org/fhir/ValueSet/list-empty-reason|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionImmunizations",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionImmunizations.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionImmunizations.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionImmunizations.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "11369-6"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionImmunizations.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionImmunizations.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Immunization|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionImmunizations.entry:immunization",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Immunization-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionResults",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionResults.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionResults.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionResults.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "30954-2"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionResults.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionResults.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Observation|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DiagnosticReport|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionResults.entry:results-observation-laboratory-pathology",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-laboratory-pathology-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionResults.entry:results-observation-radiology",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-results-radiology-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionResults.entry:results-diagnosticReport",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/DiagnosticReport-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionProceduresHx",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionProceduresHx.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionProceduresHx.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionProceduresHx.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "47519-4"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionProceduresHx.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionProceduresHx.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Procedure|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionProceduresHx.entry:procedure",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Procedure-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionMedicalDevices",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionMedicalDevices.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionMedicalDevices.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionMedicalDevices.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "46264-8"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionMedicalDevices.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionMedicalDevices.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/DeviceUseStatement|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionMedicalDevices.entry:deviceStatement",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": true,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/DeviceUseStatement-uv-ips|2.0.1"
        ],
        "creatorObligations": [
          "SHOULD:populate-if-known"
        ],
        "consumerObligations": [
          "SHALL:handle",
          "SHOULD:display"
        ]
      },
      {
        "id": "Composition.section:sectionAdvanceDirectives",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionAdvanceDirectives.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAdvanceDirectives.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionAdvanceDirectives.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "42348-3"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionAdvanceDirectives.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionAdvanceDirectives.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAdvanceDirectives.entry:advanceDirectivesConsent",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Consent|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAlerts",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionAlerts.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAlerts.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionAlerts.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "104605-1"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionAlerts.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionAlerts.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Flag|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionAlerts.entry:alertsFlag",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Flag-alert-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionFunctionalStatus",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionFunctionalStatus.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionFunctionalStatus.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionFunctionalStatus.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "47420-5"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionFunctionalStatus.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionFunctionalStatus.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Condition|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/ClinicalImpression|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionFunctionalStatus.entry:disability",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionFunctionalStatus.entry:functionalAssessment",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/ClinicalImpression|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPastProblems",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionPastProblems.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPastProblems.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionPastProblems.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "11348-0"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionPastProblems.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionPastProblems.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Condition|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPastProblems.entry:pastProblem",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Condition-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPregnancyHx",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionPregnancyHx.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPregnancyHx.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionPregnancyHx.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "10162-6"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionPregnancyHx.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionPregnancyHx.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Observation|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPregnancyHx.entry:pregnancyStatus",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-status-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPregnancyHx.entry:pregnancyOutcome",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-pregnancy-outcome-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPatientStory",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionPatientStory.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPatientStory.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionPatientStory.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "81338-6"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionPatientStory.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionPatientStory.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Resource|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPlanOfCare",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionPlanOfCare.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPlanOfCare.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionPlanOfCare.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "18776-5"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionPlanOfCare.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionPlanOfCare.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPlanOfCare.entry:carePlan",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/CarePlan|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionPlanOfCare.entry:immunizationRecommendation",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/ImmunizationRecommendation|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionSocialHistory",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionSocialHistory.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionSocialHistory.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionSocialHistory.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "29762-2"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionSocialHistory.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionSocialHistory.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Observation|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionSocialHistory.entry:smokingTobaccoUse",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-tobaccouse-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionSocialHistory.entry:alcoholUse",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "1",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/uv/ips/StructureDefinition/Observation-alcoholuse-uv-ips|2.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionVitalSigns",
        "path": "Composition.section",
        "min": 0,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "BackboneElement"
        ],
        "typeProfiles": [],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": [
          "SHOULD:display",
          "SHALL:handle"
        ]
      },
      {
        "id": "Composition.section:sectionVitalSigns.extension:section-note",
        "path": "Composition.section.extension",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Extension"
        ],
        "typeProfiles": [
          "http://hl7.org/fhir/StructureDefinition/note|5.3.0"
        ],
        "targetProfiles": [],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionVitalSigns.title",
        "path": "Composition.section.title",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "string"
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
        "id": "Composition.section:sectionVitalSigns.code",
        "path": "Composition.section.code",
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
        "patternValue": {
          "fhirType": "CodeableConcept",
          "value": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "8716-3"
              }
            ]
          }
        },
        "binding": {
          "strength": "example",
          "valueSet": "http://hl7.org/fhir/ValueSet/doc-section-codes|4.0.1",
          "additionalValueSets": []
        }
      },
      {
        "id": "Composition.section:sectionVitalSigns.text",
        "path": "Composition.section.text",
        "min": 1,
        "max": "1",
        "mustSupport": true,
        "fhirTypes": [
          "Narrative"
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
        "id": "Composition.section:sectionVitalSigns.entry",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/Observation|4.0.1",
          "http://hl7.org/fhir/StructureDefinition/DocumentReference|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      },
      {
        "id": "Composition.section:sectionVitalSigns.entry:vitalSign",
        "path": "Composition.section.entry",
        "min": 0,
        "max": "*",
        "mustSupport": false,
        "fhirTypes": [
          "Reference"
        ],
        "typeProfiles": [],
        "targetProfiles": [
          "http://hl7.org/fhir/StructureDefinition/vitalsigns|4.0.1"
        ],
        "creatorObligations": [],
        "consumerObligations": []
      }
    ]
  }
} as const satisfies IpsProfileCatalog;

export const RESOURCE_CAPABILITY = {
  "resourceType": "Composition",
  "supportedProfiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1"
  ],
  "profiles": [
    "http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1"
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
      "code": "attester",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-attester",
      "expression": "Composition.attester.party",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "author",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-author",
      "expression": "Composition.author",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "category",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-category",
      "expression": "Composition.category",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "confidentiality",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-confidentiality",
      "expression": "Composition.confidentiality",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "context",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-context",
      "expression": "Composition.event.code",
      "fhirVersions": [
        "4.0.1"
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
      "code": "entry",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-entry",
      "expression": "Composition.section.entry",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "event-code",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-event-code",
      "expression": "Composition.event.detail.concept",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "event-reference",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-event-reference",
      "expression": "Composition.event.detail.reference",
      "fhirVersions": [
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
      "code": "period",
      "type": "date",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-period",
      "expression": "Composition.event.period",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "related",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-related",
      "expression": "Composition.relatesTo.resourceReference",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "related-id",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-related-id",
      "expression": "(Composition.relatesTo.target as Identifier)",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "related-ref",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-related-ref",
      "expression": "(Composition.relatesTo.target as Reference)",
      "fhirVersions": [
        "4.0.1"
      ]
    },
    {
      "code": "section",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-section",
      "expression": "Composition.section.code",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "section-code-text",
      "type": "composite",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-section-code-text",
      "expression": "Composition.section",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "section-text",
      "type": "special",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-section-text",
      "expression": "Composition.section.text | Composition.section.section.text",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "status",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-status",
      "expression": "Composition.status",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "subject",
      "type": "reference",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-subject",
      "expression": "Composition.subject",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "title",
      "type": "string",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-title",
      "expression": "Composition.title",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "type",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/clinical-type",
      "expression": "Account.type | AllergyIntolerance.type | Composition.type | Coverage.type | DocumentReference.type | Encounter.type | EpisodeOfCare.type | Invoice.type | MedicationDispense.type | MolecularSequence.type | Specimen.type",
      "fhirVersions": [
        "4.0.1",
        "5.0.0"
      ]
    },
    {
      "code": "url",
      "type": "uri",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-url",
      "expression": "Composition.url",
      "fhirVersions": [
        "5.0.0"
      ]
    },
    {
      "code": "version",
      "type": "token",
      "url": "http://hl7.org/fhir/SearchParameter/Composition-version",
      "expression": "Composition.version",
      "fhirVersions": [
        "5.0.0"
      ]
    }
  ]
} as const satisfies IpsResourceCapability;
