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

## Claims context contract

- FHIR-like claims are version-independent FHIR API SearchParameter claims.
- Author payloads with `@context: org.hl7.fhir.api` and short keys in the form
  `<ResourceType>.<concrete-param>`.
- A short FHIR claim has exactly one dot: the separator after ResourceType.
  The SearchParameter itself is one lower kebab-case segment and can never
  contain `.`. Dotted FHIRPath expressions belong only to HL7 definitions.
- The only valid expanded form is
  `org.hl7.fhir.api.<ResourceType>.<concrete-param>`.
- Never create, accept or document `org.hl7.fhir.r4.*` claims. `r4` belongs to
  native FHIR resource representation and transport paths, not `meta.claims`.
- Schema.org is a separate vocabulary: use `@context: org.schema` and preserve
  its canonical property spelling, including Schema.org camelCase.

## Add a coded resource or field

1. Identify the official SearchParameter name, its search type, its FHIR
   expression, and the expression's target datatype. Never infer one from the
   resource property name or from another resource family.
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
9. Add a contract assertion proving the emitted payload uses
   `@context: org.hl7.fhir.api`, short keys, and no version-specific FHIR claim
   prefix.

### Token parameters and readable companions

Do not add `-text` and `-display` to every SearchParameter whose search type is
`token`. The target datatype decides which companions exist:

- `CodeableConcept`: token plus `-text` for `CodeableConcept.text` and
  `-display` for `Coding.display`.
- `Coding`: token plus `-display`; there is no `CodeableConcept.text`.
- primitive `code`, `Identifier`, `ContactPoint`, `boolean`, and other token
  targets: no automatic `-text` or `-display` family.

MedicationStatement is a required special-case test fixture:

- `code` is the official token SearchParameter whose HL7 FHIRPath expression
  targets `medication.concept`, so
  the claims family is `code`, `code-text`, and `code-display`.
- `medication` is the official reference SearchParameter whose FHIRPath
  expression targets `medication.reference`; it is not an alias for `code` and gets no readable
  companions.
- R5 `adherence` is the official token SearchParameter. The dotted
  `adherence.code` string is only its HL7 FHIRPath expression and must never be
  emitted as a claim. Its readable companions are `adherence-text` and
  `adherence-display`. R4 export cannot project adherence into a native
  MedicationStatement element.
- Immunization uses its own official `vaccine-code` SearchParameter and the
  `vaccine-code-text` / `vaccine-code-display` CodeableConcept companions.

### Validate vocabulary syntax without rejecting the resource

- FHIR claim parameters use lower kebab-case. Omit malformed camel/PascalCase
  or underscore keys and write a structured warning containing context, key,
  vocabulary and reason; retain valid sibling claims.
- Normalize only explicitly documented historical aliases. Do not silently
  guess arbitrary spellings.
- Schema.org is separate: reverse-DNS claims retain canonical camelCase and
  reject hyphens and underscores.

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
