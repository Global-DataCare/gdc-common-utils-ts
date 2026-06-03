# Convert

Resource-specific FHIR conversion helpers live in this folder.

Main entry point:

- [`index.ts`](./index.ts)

Current contract:

- `*FlatToFhirR4(...)`
- `*FhirR4ToFlat(...)`

These converters are used by `gdc-common-utils-ts` to keep a claims-first
workflow while still regenerating canonical FHIR R4 resources when needed.

Prior work:

- `uhc-fhir-utils-ts`
- https://github.com/Universal-Health-Chain/uhc-fhir-utils-ts

This folder adapts that earlier line of work to:

- reverse-DNS flat claims
- IPS bundle extraction/regeneration
- `gdc-common-utils-ts` package exports
