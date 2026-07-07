# Vital Sign Entry Editor 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This is the canonical editor-level document for vital-sign bundle construction.

Use this document when you need to understand:

- `BundleEditor`
- `BundleEntryEditor`
- `ObservationComponentEntryEditor`
- `VitalSignEntryEditor`
- `ObservationEntryEditor`
- how directly authored vital signs are shaped as `Observation` bundle entries

For the shortest executable reference, open:

- [__tests__/101-vital-sign-entry-editor.test.ts](../__tests__/101-vital-sign-entry-editor.test.ts)

## Goal

Keep bundle mechanics in `common-utils` and keep runtime or transport questions
out of the editor layer.

- `BundleEditor`
  - owns the bundle
  - owns entry creation, opening, and final materialization
- `ObservationComponentEntryEditor`
  - owns reusable Observation code/value helpers
- `VitalSignEntryEditor`
  - owns vital-sign-specific getters and setters
- `ObservationEntryEditor`
  - extends the vital-sign editor with the broader Observation surface

## Recommended Flow

Teach the flow in this order:

```ts
import {
  BundleEditor,
  BundleEditableResourceTypes,
  EmployeeBundleOperations,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
} from 'gdc-common-utils-ts/examples';
} from 'gdc-common-utils-ts';

const bundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(BundleEditableResourceTypes.vitalSign);

const vitalEntry = bundle
  .newEntry(EXAMPLE_OBSERVATION_IDENTIFIER)
  .asVitalSign()
  .setIdentifier(EXAMPLE_OBSERVATION_IDENTIFIER)
  .setSubject(EXAMPLE_SUBJECT_DID)
  .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
  .setHeartRate(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE);

const currentHeartRate = vitalEntry.getHeartRate();

vitalEntry.doneEntry();

const vitalSignsBundle = bundle.build();
```

Read that example as:

- `bundle`
  - is the main editor object
- `newEntry()`
  - opens one active entry inside that bundle
- `asVitalSign()`
  - switches that active entry to vital-sign-specific editing
- `doneEntry()`
  - closes the active entry and returns control to the bundle
- `build()`
  - materializes the final bundle object from the editor state in memory

`build()` does not:

- send anything
- sign anything
- wrap DIDComm
- convert to another standard

It only returns the final bundle payload.

Practical split:

- the bundle returned here can later be carried by `Communication` when the
  user, professional, or device wants to update the individual's index
- the same bundle can later be certified on-chain as a batch hash/CID when the
  system or operator decides it is meaningful
- do not treat one observed value as the blockchain unit; the bundle is the
  unit that can be shared, indexed, or sealed later
- for a phone assistant, the day-batch should be reopened by date and appended
  with new vital signs, then resubmitted as a whole bundle
- if several caregivers take turns, each actor may maintain its own day batch
  for the same individual; recover that batch id first, and create a new UUID
  batch when no actor-owned batch exists for the current day

## Generic Entry Editing

The active entry supports the generic API first:

- `setClaim(...)`
- `getClaim(...)`
- `addClaim(...)`
- `removeClaim(...)`
- `setResourceId(...)`
- `getResourceId()`
- `setFullUrl(...)`
- `getFullUrl()`
- `doneEntry()`

Then `asVitalSign()` exposes vital-sign-specific helpers:

- `setIdentifier(...)`
- `getIdentifier()`
- `ensureIdentifier()`
- `setSubject(...)`
- `getSubject()`
- `setStatus(...)`
- `getStatus()`
- `setDate(...)`
- `getDate()`
- `setLocalText(...)`
- `getLocalText()`
- `setHeartRate(...)`
- `getHeartRate()`
- `setBodyTemperature(...)`
- `getBodyTemperature()`
- `setSystolicBloodPressure(...)`
- `getSystolicBloodPressure()`
- `setDiastolicBloodPressure(...)`
- `getDiastolicBloodPressure()`
- `setValueQuantityNumber(...)`
- `getValueQuantityNumber()`
- `setValueQuantityUnit(...)`
- `getValueQuantityUnit()`

Then `asObservation()` extends the same entry with broader Observation helpers:

- `setBasedOn(...)`
- `getBasedOn()`
- `setEncounter(...)`
- `getEncounter()`
- `setPerformer(...)`
- `getPerformer()`
- `setHasMember(...)`
- `getHasMember()`

## One Example Of Each Directly Authored Vital Sign

```ts
import {
  BundleEditor,
  BundleEditableResourceTypes,
  EmployeeBundleOperations,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER,
  EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_OBSERVATION_PANEL_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE,
  EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC,
} from 'gdc-common-utils-ts/examples';
} from 'gdc-common-utils-ts';

const vitalSignsBundle = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(BundleEditableResourceTypes.observation)
  .newEntry(EXAMPLE_OBSERVATION_IDENTIFIER)
  .asVitalSign()
  .setIdentifier(EXAMPLE_OBSERVATION_IDENTIFIER)
  .setSubject(EXAMPLE_SUBJECT_DID)
  .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
  .setHeartRate(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE)
  .doneEntry()
  .newEntry(EXAMPLE_OBSERVATION_PANEL_IDENTIFIER)
  .asVitalSign()
  .setIdentifier(EXAMPLE_OBSERVATION_PANEL_IDENTIFIER)
  .setSubject(EXAMPLE_SUBJECT_DID)
  .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
  .setBodyTemperature(EXAMPLE_VITAL_SIGN_VALUE_BODY_TEMPERATURE)
  .doneEntry()
  .newEntry(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER)
  .asVitalSign()
  .setIdentifier(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER)
  .setSubject(EXAMPLE_SUBJECT_DID)
  .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
  .setSystolicBloodPressure(EXAMPLE_VITAL_SIGN_VALUE_SYSTOLIC)
  .doneEntry()
  .newEntry(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY)
  .asVitalSign()
  .setIdentifier(EXAMPLE_OBSERVATION_COMPONENT_IDENTIFIER_SECONDARY)
  .setSubject(EXAMPLE_SUBJECT_DID)
  .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
  .setDiastolicBloodPressure(EXAMPLE_VITAL_SIGN_VALUE_DIASTOLIC)
  .doneEntry()
  .build();
```

## Observation Extension

Use `asObservation()` when the entry still behaves like one vital sign but also
needs the broader Observation surface:

```ts
import {
  BundleEditor,
  BundleEditableResourceTypes,
  EmployeeBundleOperations,
  EXAMPLE_OBSERVATION_IDENTIFIER,
  EXAMPLE_SUBJECT_DID,
  EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME,
  EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE,
  VitalSignsCodes,
  VitalSignsUnits,
} from 'gdc-common-utils-ts/examples';
} from 'gdc-common-utils-ts';

const observationEntry = new BundleEditor()
  .setBundleOperation(EmployeeBundleOperations.create)
  .setAllowedResourceType(BundleEditableResourceTypes.observation)
  .newEntry(EXAMPLE_OBSERVATION_IDENTIFIER)
  .asObservation()
  .setIdentifier(EXAMPLE_OBSERVATION_IDENTIFIER)
  .setSubject(EXAMPLE_SUBJECT_DID)
  .setDate(EXAMPLE_VITAL_SIGNS_EFFECTIVE_DATE_TIME)
  .setVitalSignType(VitalSignsCodes.HeartRate, VitalSignsUnits.BeatsPerMinute)
  .setValueQuantityNumber(EXAMPLE_VITAL_SIGN_VALUE_HEART_RATE)
  .setEncounter('Encounter/enc-1')
  .setPerformer('Practitioner/prac-1')
  .setBasedOn('ServiceRequest/sr-1')
  .setHasMember('Observation/member-1');
```

## Hierarchy

The current editor hierarchy is:

- `BundleEntryEditor`
- `ObservationComponentEntryEditor extends BundleEntryEditor`
- `VitalSignEntryEditor extends ObservationComponentEntryEditor`
- `ObservationEntryEditor extends VitalSignEntryEditor`

This hierarchy is about the SDK editing surface.

It does not mean every FHIR Observation is clinically a vital sign. It means
the editor reuses the narrower code/value layer first, then adds the visible
vital-sign layer, then adds the broader Observation layer.
