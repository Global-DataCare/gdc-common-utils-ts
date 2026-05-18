# Normalization Spec (LOINC, Claims, and Storage Keys)

This document is the canonical normalization contract for SDKs, GW backends, and integrator-facing APIs.

Scope:
- `gdc-common-utils-ts` helpers and models
- `gwtemplate-node-ts` ingestion, storage, search, and authorization checks
- SDK payload generation
- Integrator documentation (API guides)

## 1. LOINC representation layers

The same concept MUST be represented differently depending on layer.

| Layer | Canonical format | Example |
| --- | --- | --- |
| Storage/search token | `LOINC|<code>` | `LOINC|56446-8`, `LOINC|LP173418-7` |
| FHIR coding | `system=http://loinc.org`, `code=<code>` | `system=http://loinc.org`, `code=56446-8` |
| i18n key | `org.loinc.<code>` | `org.loinc.56446-8`, `org.loinc.LP173418-7` |

Rules:
1. Authorization and section matching MUST use storage/search token format (`LOINC|...`).
2. FHIR serialization/deserialization MUST use `http://loinc.org` in `Coding.system`.
3. UI translation MUST use `org.loinc.<code>` keys.
4. Reverse DNS keys (`org.loinc.*`) MUST NOT be used as authorization tokens.

## 2. Consent and Communication coding usage

### 2.1 Consent
- `Consent.action`: comma-separated section/action tokens (typically `LOINC|...`) used for permission checks.
- `Consent.category`: comma-separated consent-type classification tokens (e.g., `LOINC|59284-0`, `LOINC|64292-6`) used for consent classification/search.

### 2.2 Communication ingestion
- `Communication.datatype`: document ontology/type token (recommended `LOINC|LP...`).
- `Communication.category`: subtype/classification token (recommended `LOINC|LP...`).
- `Communication.section` (optional): target clinical section token (`LOINC|...`) when message content is projected into Composition indexing.
- If no `datatype` and no explicit section hints are present, route to fallback notifications bucket according to service policy.

## 3. Flat interoperable claims normalization

Claims may arrive in different forms:
- Contextualized: `@context` present (e.g., `org.hl7.fhir.api`, `org.hl7.fhir.r4`, `org.schema`)
- Non-contextualized short keys: `Consent.action`, `Organization.identifier`, etc.

Normalization rules:
1. If `@context` is present and key is not already fully-qualified under an allowed known domain, prepend `${@context}.`.
2. Preserve `@context` and `@type`.
3. Preserve already interoperable fully-qualified keys (e.g., `org.hl7...`, `org.schema...`, `org.loinc...`).
4. Canonicalize map ordering (alphabetical keys) before hashing/signing/persisting flows that require deterministic content.

## 4. Storage-key normalization for DB backends

Logical claim keys and physical DB keys are different concerns.

- Logical key (canonical): `org.hl7.fhir.api.Consent.actor-identifier`
- Physical storage key (backend-specific, optional): replace `.` and `-` with `_`
  - Example: `org_hl7_fhir_api_Consent_actor_identifier`

Rules:
1. Physical key transforms MUST be reversible or accompanied by a deterministic mapper.
2. Search/query APIs MUST operate on canonical logical keys at contract level.
3. Any backend-specific physical transform MUST be transparent to SDK/integrator contracts.

## 5. Server configuration profile behavior

Depending on server profile, accepted claim styles may differ at ingress, but persisted canonical form MUST be consistent.

Supported ingress styles:
- Fully-qualified claims (`org.hl7.fhir.<version>.*` / `org.schema.*`)
- Contextual short claims with `@context`
- Transitional short claims without prefix (`Consent.*`, `Organization.*`) if compatibility mode is enabled

Mandatory persistence target:
- Canonical normalized keys (as defined in Section 3), independent of ingress style.

## 6. Required alignment across repositories

### 6.1 SDKs
- Emit canonical `LOINC|...` for permission/search tokens.
- Emit `Coding.system=http://loinc.org` when building FHIR resources.
- Emit i18n keys only for UI lookup, never for permission matching.
- Normalize claims according to `@context` rules before request submission when possible.

### 6.2 Gateway/storage services
- Normalize incoming claims to canonical logical keys.
- Evaluate authorization using canonical logical keys and `LOINC|...` action tokens.
- Persist consent category/action as searchable attributes.
- Keep physical storage-key transform internal and reversible.

### 6.3 Integrator documentation
- Document all three LOINC layers explicitly.
- Document consent `action` vs `category` semantics.
- Document `Communication.datatype/category/section` semantics.
- Document claim normalization and compatibility mode behavior.

## 7. Validation checklist (implementation)

1. Same consent rule matches regardless of equivalent ingress key style.
2. Permission checks use `LOINC|...` tokens only.
3. FHIR output always emits `http://loinc.org` in coding system.
4. i18n lookup always uses `org.loinc.<code>`.
5. DB adapter key transform does not leak into public API contracts.

