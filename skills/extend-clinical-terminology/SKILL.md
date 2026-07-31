---
name: extend-clinical-terminology
description: Extend GDC clinical terminology safely. Use when adding a coded FHIR resource type or primary CodeableConcept, changing its canonical claim/readback mapping, adding local JSON terminology catalogs or languages, or propagating terminology lookup/search through Core, Node/BFF and Front/offline SDKs.
---

# Extend Clinical Terminology

Keep coded identity, authored text and terminology display separate:

- canonical identity: `Coding.system + Coding.code` and `system|code` claim
- authored local label: `CodeableConcept.text`
- terminology label/designation: `Coding.display`

Never translate free text or guess a code from another field.

## Add a coded resource or field

1. Identify the exact FHIR element, such as `Device.type`; do not use a generic
   search over every `code`, `type` or `category`.
2. Define the canonical token, text and display claims in
   `src/models/interoperable-claims`.
3. Preserve all three values in the resource-specific FHIR-to-claims converter.
4. Rebuild the same native `CodeableConcept.coding[]` and `text` in the
   claims-to-FHIR converter.
5. Register both conversion directions in
   `clinical-resource-converters.ts` and `bundle-document-builder.ts`.
6. Add the exact primary claim to `resolvePrimaryClaimCodeToken(...)`; keep
   compatibility aliases exact and documented.
7. Update the field-to-claim table in `docs/101-CLINICAL-IPS.md`.
8. Extend `101-ips-all-sections-display-contract.test.ts` or add a realistic
   fixture test that proves:
   - canonical token creation
   - native coding roundtrip
   - display-only summary readback translated from the exact claim
   - text-only input remains untranslated
   - an unrelated coded claim is rejected

## Add a catalog, system or language

Use the compatible catalog shape:

```json
{
  "language": "es",
  "version": "2026-01",
  "jurisdiction": "ES",
  "data": [{
    "id": "http://loinc.org",
    "attributes": {
      "85354-9": "Panel de presión arterial"
    }
  }]
}
```

- Write canonical system URIs in new files. Accept `id: "ips"` only as the
  legacy SNOMED IPS alias.
- Record version, language, jurisdiction and required licensing attribution.
- Let the application choose allowed `systems[]` for the exact form field.
- Return `undefined` for missing lookups so FHIR text/display remains visible.
- Do not put large catalogs in a browser bundle by default. Load them in the
  Node BFF, or load explicit subsets for offline applications.

## Propagate through the SDKs

1. Export shared provider/types from SDK Core.
2. For Node/Next.js, expose a framework-neutral search service and keep source
   catalogs server-side.
3. For Front/offline, expose a synchronous translator and local search facade.
4. Keep an external FHIR terminology client outside the render callback. Fetch
   and cache remote labels before passing a synchronous lookup to
   `translateCode`.

## Validate

Follow TDD and run:

```text
gdc-common-utils-ts: typecheck, full Jest suite, build
gdc-sdk-core-ts: prepublishOnly
gdc-sdk-node-ts: prepublishOnly
gdc-sdk-front-ts: prepublishOnly
```

Do not finish with duplicated undocumented resource mappings, workspace/file
dependencies, missing registry exports, or tests that translate
`CodeableConcept.text`.
