# TODO: Interoperable Claim Catalogs

Status: Pending implementation.

Purpose: create the missing interoperable claim catalogs in this shared package so the rest of the stack can import canonical claim ids instead of keeping local ad hoc aliases.

## Why this TODO exists

The current shared package already provides canonical claim catalogs for:

- `Appointment`
- `AppointmentResponse`
- `Communication`
- `Composition`
- `DocumentReference`
- `MedicationStatement`

The following claim families are currently defined or inferred in consumer repos, but they still need to be created and exported upstream here:

- `Subject`
- `RelatedPerson`
- `Consent`
- `Observation`
- `Condition`
- `Device`
- `AllergyIntolerance`
- `DeviceAssociation`
- `DeviceUsage`

## Target location

Create each new catalog under the shared claims folder:

- `src/models/interoperable-claims/`

and re-export it from:

- `src/models/interoperable-claims/index.ts`

## Expected shape

Follow the same pattern already used by the existing modules in this folder:

1. Define the resource-specific canonical claim keys.
2. Export the key union / enum / flat interface used by consumers.
3. Keep the parameter names resource-scoped and canonical, using lowercase and hyphens when required.
4. Avoid transport-specific names or local aliases that only exist in one app.

## Consumer alignment

Until these upstream catalogs exist, the following consumers keep temporary compatibility mappings:

- SDK clients
- gateway/API services
- frontend applications
- chat/orchestration services
- any template or helper that still exports local claim aliases

Once the upstream catalogs are added, update those consumers to import from the shared claim catalog and remove the duplicate local mappings.

## Suggested implementation order

1. Add `Subject` and `RelatedPerson` first, since they are the first canonical names already consumed by downstream services.
2. Add `Consent`, `Observation`, `Condition`, and `Device` next.
3. Add `AllergyIntolerance`, `DeviceAssociation`, and `DeviceUsage` last.
4. Extend `src/models/interoperable-claims/index.ts` with the new exports.
5. Replace consumer-side compatibility aliases with imports from this package.
