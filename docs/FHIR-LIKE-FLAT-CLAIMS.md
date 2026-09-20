# FHIR-like flat claim origin contract

`<ResourceType>.<name>` is a flat claims representation. Its prefix does not,
by itself, make `<name>` part of FHIR.

Every flat claim belongs to exactly one of these categories:

1. **FHIR search parameter** — canonical. The name is published in the
   resource's `Search Parameters` section (`#search`). This is the source of
   truth for canonical flat claim and query names.
2. **FHIR standard extension** — not a core search parameter. It must resolve
   to an extension published by HL7 for that resource and retain that
   extension's canonical URL when projected to native FHIR.
3. **custom extension** — neither a published search parameter nor an HL7
   standard extension. It must be documented as custom and have an explicit
   canonical extension URL and projection contract.

A native FHIR element that is not published as a search parameter is not canonical
in this flat-search vocabulary. It is represented through the applicable FHIR
standard extension or custom extension contract; its presence in the native
resource structure does not silently promote it to a canonical flat claim.

Search modifiers such as `:text` are transport syntax. They do not create a
different stored claim. For example, a `code:text` query may target the stored
`ResourceType.code-text` extension selected by its documented projection.

Before adding or reviewing any key, open both official pages for its resource:

| Resource type | Canonical search parameters | Standard extensions |
| --- | --- | --- |
| AllergyIntolerance | [AllergyIntolerance search parameters](https://hl7.org/fhir/allergyintolerance.html#search) | [AllergyIntolerance extensions](https://hl7.org/fhir/extensions/extensions-AllergyIntolerance.html) |
| Appointment | [Appointment search parameters](https://hl7.org/fhir/appointment.html#search) | [Appointment extensions](https://hl7.org/fhir/extensions/extensions-Appointment.html) |
| AppointmentResponse | [AppointmentResponse search parameters](https://hl7.org/fhir/appointmentresponse.html#search) | [AppointmentResponse extensions](https://hl7.org/fhir/extensions/extensions-AppointmentResponse.html) |
| CarePlan | [CarePlan search parameters](https://hl7.org/fhir/careplan.html#search) | [CarePlan extensions](https://hl7.org/fhir/extensions/extensions-CarePlan.html) |
| ChargeItem | [ChargeItem search parameters](https://hl7.org/fhir/chargeitem.html#search) | [ChargeItem extensions](https://hl7.org/fhir/extensions/extensions-ChargeItem.html) |
| ClinicalImpression | [ClinicalImpression search parameters](https://hl7.org/fhir/clinicalimpression.html#search) | [ClinicalImpression extensions](https://hl7.org/fhir/extensions/extensions-ClinicalImpression.html) |
| Communication | [Communication search parameters](https://hl7.org/fhir/communication.html#search) | [Communication extensions](https://hl7.org/fhir/extensions/extensions-Communication.html) |
| Composition | [Composition search parameters](https://hl7.org/fhir/composition.html#search) | [Composition extensions](https://hl7.org/fhir/extensions/extensions-Composition.html) |
| Condition | [Condition search parameters](https://hl7.org/fhir/condition.html#search) | [Condition extensions](https://hl7.org/fhir/extensions/extensions-Condition.html) |
| Coverage | [Coverage search parameters](https://hl7.org/fhir/coverage.html#search) | [Coverage extensions](https://hl7.org/fhir/extensions/extensions-Coverage.html) |
| Device | [Device search parameters](https://hl7.org/fhir/device.html#search) | [Device extensions](https://hl7.org/fhir/extensions/extensions-Device.html) |
| DeviceUseStatement | [DeviceUseStatement search parameters](https://hl7.org/fhir/deviceusestatement.html#search) | [DeviceUseStatement extensions](https://hl7.org/fhir/extensions/extensions-DeviceUseStatement.html) |
| DiagnosticReport | [DiagnosticReport search parameters](https://hl7.org/fhir/diagnosticreport.html#search) | [DiagnosticReport extensions](https://hl7.org/fhir/extensions/extensions-DiagnosticReport.html) |
| DocumentReference | [DocumentReference search parameters](https://hl7.org/fhir/documentreference.html#search) | [DocumentReference extensions](https://hl7.org/fhir/extensions/extensions-DocumentReference.html) |
| Encounter | [Encounter search parameters](https://hl7.org/fhir/encounter.html#search) | [Encounter extensions](https://hl7.org/fhir/extensions/extensions-Encounter.html) |
| Flag | [Flag search parameters](https://hl7.org/fhir/flag.html#search) | [Flag extensions](https://hl7.org/fhir/extensions/extensions-Flag.html) |
| Immunization | [Immunization search parameters](https://hl7.org/fhir/immunization.html#search) | [Immunization extensions](https://hl7.org/fhir/extensions/extensions-Immunization.html) |
| Invoice | [Invoice search parameters](https://hl7.org/fhir/invoice.html#search) | [Invoice extensions](https://hl7.org/fhir/extensions/extensions-Invoice.html) |
| Location | [Location search parameters](https://hl7.org/fhir/location.html#search) | [Location extensions](https://hl7.org/fhir/extensions/extensions-Location.html) |
| MedicationStatement | [MedicationStatement search parameters](https://hl7.org/fhir/medicationstatement.html#search) | [MedicationStatement extensions](https://hl7.org/fhir/extensions/extensions-MedicationStatement.html) |
| Observation | [Observation search parameters](https://hl7.org/fhir/observation.html#search) | [Observation extensions](https://hl7.org/fhir/extensions/extensions-Observation.html) |
| Organization | [Organization search parameters](https://hl7.org/fhir/organization.html#search) | [Organization extensions](https://hl7.org/fhir/extensions/extensions-Organization.html) |
| PractitionerRole | [PractitionerRole search parameters](https://hl7.org/fhir/practitionerrole.html#search) | [PractitionerRole extensions](https://hl7.org/fhir/extensions/extensions-PractitionerRole.html) |
| Procedure | [Procedure search parameters](https://hl7.org/fhir/procedure.html#search) | [Procedure extensions](https://hl7.org/fhir/extensions/extensions-Procedure.html) |
| RelatedPerson | [RelatedPerson search parameters](https://hl7.org/fhir/relatedperson.html#search) | [RelatedPerson extensions](https://hl7.org/fhir/extensions/extensions-RelatedPerson.html) |
| ResearchSubject | [ResearchSubject search parameters](https://hl7.org/fhir/researchsubject.html#search) | [ResearchSubject extensions](https://hl7.org/fhir/extensions/extensions-ResearchSubject.html) |
| Task | [Task search parameters](https://hl7.org/fhir/task.html#search) | [Task extensions](https://hl7.org/fhir/extensions/extensions-Task.html) |

## IPS creation, card and terminology contract

For a resource covered by the International Patient Summary, its IPS 2.0.1
profile is the creation and card presentation contract. Its cardinalities,
`Must Support` flags and Creator/Consumer obligations determine which native
FHIR elements must be accepted, created, handled and displayed. Its terminology
bindings identify the required, extensible or preferred ValueSet for each coded
FHIR element and therefore constrain the value of the corresponding FHIR search
parameter or flat claim.

- [IPS 2.0.1 artifacts, resource profiles and ValueSets](https://hl7.org/fhir/uv/ips/2.0.1/en/artifacts.html)
- [IPS Server CapabilityStatement](https://hl7.org/fhir/uv/ips/2.0.1/en/CapabilityStatement-ips-server.html)

The CapabilityStatement defines the IPS server's supported profiles,
interactions, operations and query surface. It does not replace the element
constraints or terminology bindings in each StructureDefinition.

The executable `IPS_RESOURCE_CAPABILITIES` contract covers every resource type
listed by that CapabilityStatement, not only resources that already had a flat
claim object:

```text
Bundle, Composition, Patient, AllergyIntolerance, Condition,
MedicationRequest, MedicationStatement, CarePlan, ClinicalImpression, Consent,
Device, DeviceUseStatement, DiagnosticReport, DocumentReference, Flag,
ImagingStudy, Immunization, ImmunizationRecommendation, Medication,
MedicationAdministration, MedicationDispense, Observation, Organization,
Practitioner, PractitionerRole, Procedure, RelatedPerson, Specimen
```

`IPS_PROFILE_CATALOG` defines every constrained, required or obligated field in
every advertised profile with its FHIR type, cardinality, `Must Support` flag, type/target profiles,
Creator/Consumer obligations and primary/additional ValueSet bindings. For
resource types for which the CapabilityStatement advertises no IPS-specific
profile, it resolves the complete base FHIR R4 4.0.1 StructureDefinition rather
than inventing an IPS profile.

`Observation` includes all 16 advertised profiles: seven IPS profiles and the
nine FHIR R4 vital-sign profiles for respiratory rate, heart rate, oxygen
saturation, body temperature, body height, head circumference, body weight,
body mass index and blood pressure.

`IPS_VALUE_SET_CATALOG` stores each referenced ValueSet once, keyed by its
canonical URL/version, and records every resource/profile/field that uses it.
Large concept lists are split into generated chunks. Resource profiles and
ValueSets therefore do not live in one monolithic generated source file.

`IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE` and the generic
`IpsCanonicalFlatClaim<Resource>` type are generated from the official FHIR R4
and R5 SearchParameter definitions for each of those resource types, retaining
the release(s) in which each parameter is published. This preserves the R4
surface required by IPS while recognizing current R5 parameters such as
`Flag.category` and `Flag.status`. They are canonical flat-search claims;
fields without a SearchParameter still require a standard or custom extension
contract.

For the IPS Alerts section, `Composition.section:sectionAlerts.code` carries a
`patternCodeableConcept` containing `http://loinc.org|104605-1`; it is not the
same thing as `Flag.code`. The Flag profile makes the standard
`http://hl7.org/fhir/StructureDefinition/flag-priority` extension Must Support.
`flag-detail` is also a FHIR standard extension and is supported as a flat
extension claim, but IPS 2.0.1 does not place a specific obligation on it.

Product cards may narrow presentation but may not contradict an applicable IPS
Creator/Consumer obligation or terminology binding.

The URLs follow these rules for every resource type:

```text
https://hl7.org/fhir/<resourcetype-lowercase>.html#search
https://hl7.org/fhir/extensions/extensions-<ResourceType>.html
```

When R4 and R5 differ, the claim or extension documentation must name the
supported release and must not combine incompatible definitions silently.
