# Observation

This package treats `Observation` as a claims-first resource with explicit
editing fields and deterministic FHIR conversion.

## Naming

Version-specific converter names must keep the concrete FHIR version suffix at
the end of the function name:

- `observationToFlatFhirR4`
- `observationFromFlatToFhirR4`

Avoid names such as:

- `observationFhirR4ToFlat`

## Scope

HL7 defines `Observation` for:

- vital signs
- laboratory data
- imaging results
- clinical findings
- device measurements
- device settings
- clinical assessment tools
- personal characteristics
- social history
- core characteristics
- product quality tests

Source:

- https://hl7.org/fhir/observation.html

## Category vs Code vs Value

Keep these meanings separate:

- `Observation.category`: classification bucket such as `vital-signs`,
  `laboratory`, or `social-history`
- `Observation.code`: what is being observed, typically a LOINC code
- `Observation.valueCodeableConcept`: coded result value when the observation
  result is itself a concept

Example:

- category: `http://terminology.hl7.org/CodeSystem/observation-category|vital-signs`
- code: `http://loinc.org|8867-4`
- code text: `Heart rate`
- quantity number: `68`
- quantity unit: `/min`

Example of a coded-value observation:

- category: `http://terminology.hl7.org/CodeSystem/observation-category|social-history`
- code: `http://loinc.org|72166-2`
- code text: `Tobacco smoking status`
- value concept: `http://snomed.info/sct|266919005`
- value concept text: `Never smoker`

## Observation.category codes

Use the canonical descriptors exported by:

- `ObservationCategoryCodes`

Current shared descriptors mirror the HL7 Observation Category code system:

- `SocialHistory`
- `VitalSigns`
- `Imaging`
- `Laboratory`
- `Procedure`
- `Survey`
- `Exam`
- `Therapy`
- `Activity`

Source:

- https://terminology.hl7.org/7.1.0/CodeSystem-observation-category.html

## Vital Signs

Vital-sign authoring examples in this package are based on the HL7 CIMI Vital
Signs guide:

- https://build.fhir.org/ig/HL7/cimi-vital-signs/

Panels imported from external FHIR may use `hasMember` or `component`. Local
apps usually create simple observations instead of authoring panels directly.
