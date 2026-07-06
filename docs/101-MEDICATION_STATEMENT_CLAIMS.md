# MedicationStatement Claims 101

> 101 note
> - Teach here: the highest-level public `common-utils` helper available for this topic.
> - Do not present raw `meta.claims`, `upsert*`, or pack/unpack as the main path unless the topic itself is transport.
> - Read [101-README.md](./101-README.md) for the ordered path, then continue upward into `gdc-sdk-core-ts` and `gdc-sdk-node-ts`.


This guide shows the simple `get/set` path for building flat
`MedicationStatement` claims in `gdc-common-utils-ts`.

Executable step-by-step reference:

- [__tests__/101-medication-claim-helpers.test.ts](../__tests__/101-medication-claim-helpers.test.ts)

## Short path

```ts
import {
  setMedicationDosageAsNeeded,
  setMedicationDoseQuantityUnit,
  setMedicationDoseQuantityValue,
  setMedicationEffective,
  setMedicationIdentifier,
  setMedicationStatus,
  setMedicationSubject,
  setMedicationText,
  setMedicationTimingFrequency,
  setMedicationTimingPeriod,
  setMedicationTimingPeriodUnit,
} from 'gdc-common-utils-ts/utils/medication-claim-helpers';
import {
  EXAMPLE_MEDICATION_DOSE_UNIT_MG,
  EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE,
  EXAMPLE_MEDICATION_IBUPROFEN_TEXT,
  EXAMPLE_MEDICATION_STATEMENT_STATUS,
  EXAMPLE_MEDICATION_STATEMENT_UUID,
  EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS,
  EXAMPLE_SUBJECT_DID,
} from 'gdc-common-utils-ts/examples/shared';

let claims = { '@context': 'org.hl7.fhir.api' };

claims = setMedicationIdentifier(claims, EXAMPLE_MEDICATION_STATEMENT_UUID);
claims = setMedicationSubject(claims, EXAMPLE_SUBJECT_DID);
claims = setMedicationStatus(claims, EXAMPLE_MEDICATION_STATEMENT_STATUS);
claims = setMedicationEffective(claims, EXAMPLE_MEDICATION_IBUPROFEN_EFFECTIVE);
claims = setMedicationText(claims, EXAMPLE_MEDICATION_IBUPROFEN_TEXT);

claims = setMedicationDoseQuantityValue(claims, 400);
claims = setMedicationDoseQuantityUnit(claims, EXAMPLE_MEDICATION_DOSE_UNIT_MG);
claims = setMedicationTimingFrequency(claims, 1);
claims = setMedicationTimingPeriod(claims, 8);
claims = setMedicationTimingPeriodUnit(claims, EXAMPLE_MEDICATION_TIMING_PERIOD_UNIT_HOURS);
claims = setMedicationDosageAsNeeded(claims, true);
```

This example means:

- one `MedicationStatement` for one individual
- medication text: ibuprofen 400 mg
- timing: 1 dose every 8 hours
- PRN: yes

These helpers only build the flat `meta.claims` object.

If you want to:

- put that resource into a `Bundle`
- attach that bundle to a `Communication`
- or send/store it through draft/outbox/runtime layers

use the next SDK layer for that orchestration.
