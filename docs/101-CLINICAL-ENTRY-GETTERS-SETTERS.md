# Clinical Entry Getters And Setters 101

This guide shows the public typed API for creating, reading and editing one
clinical resource inside a Bundle. It does not send, authorize or persist the
Bundle.

## Received Bundles

`BundleReader` is the read-only navigation and response-analysis surface. Its
generic methods can inspect entries, but resource-specific getters and setters
belong to `BundleEditor` and its typed entry editors.

Convert a received FHIR-style `entry[]` Bundle or JSON-API-style `data[]`
Bundle to a detached editable clone before using them:

```ts
import { BundleReader } from 'gdc-common-utils-ts';

const reader = new BundleReader(receivedBundle);
const editableBundle = reader.toBundleEditor();

const allergy = editableBundle
  .openEntryByArrayIndex(entryIndex)
  .asAllergy();

const previousSeverity = allergy.getReactionSeverity();
allergy.setReactionSeverity(nextSeverity);

const updatedBundle = editableBundle.build();
```

`toBundleEditor()` clones the entries. Changes to `editableBundle` never mutate
the Bundle held by `reader`. Prefer `openEntry(resourceIdOrFullUrl)` when the
received resource exposes a stable identifier. Use `openEntryByArrayIndex(...)`
when the application selected the entry by its position or the resource has no
stable id.

## New Entries

Choose the resource family once, then use the returned typed editor for both
write and readback:

```ts
import {
  BundleEditableResourceTypes,
  BundleEditor,
} from 'gdc-common-utils-ts';

const medication = new BundleEditor()
  .newEntryAs(BundleEditableResourceTypes.medicationStatement)
  .asMedicationStatement()
  .setStatus(input.status)
  .setCode(input.codeSystem, input.codeValue)
  .setEffectivePeriodStart(input.start)
  .setEffectivePeriodEnd(input.end);

const savedCode = medication.getSystemAndCode();
const savedEnd = medication.getEffectivePeriodEnd();
```

The values in these examples come from application input or an existing
resource. The editor does not invent subject identifiers, codes, dates,
authors or attesters.

## Coding Tokens

FHIR token claims use `system|code`. For every typed coding field, the editor
exposes the same four operations, with a field-specific prefix where needed:

```ts
entry.setCode(codeValue);                 // preserves an existing system
entry.setCode(`${codeSystem}|${codeValue}`);
entry.setCode(codeSystem, codeValue);
entry.setCodeSystem(codeSystem);          // preserves an existing code
entry.setSystemAndCode(codeSystem, codeValue);

entry.getCode();           // code value only
entry.getCodeSystem();     // system only
entry.getSystemAndCode();  // canonical system|code token
```

Examples of prefixed coding fields are `setRouteSystemAndCode(...)`,
`getRouteCode()`, `getRouteCodeSystem()` and `getRouteSystemAndCode()`.

## Requested Clinical Fields

### Allergy reaction severity

```ts
const allergy = editableBundle.openEntry(allergyId).asAllergy();

allergy.setReactionSeverity(reactionSeverity);
const storedSeverity = allergy.getReactionSeverity();
```

Reaction severity and allergy criticality are different FHIR concepts. Use
`setReactionSeverity(...)` for `reaction[].severity`; do not collapse it into
`setCriticality(...)`.

### Medication treatment period

```ts
const medication = editableBundle
  .openEntry(medicationStatementId)
  .asMedicationStatement();

medication
  .setEffectivePeriodStart(treatmentStart)
  .setEffectivePeriodEnd(treatmentEnd);

const start = medication.getEffectivePeriodStart();
const end = medication.getEffectivePeriodEnd();
```

### Immunization route and site

```ts
const immunization = editableBundle
  .openEntry(immunizationId)
  .asImmunization();

immunization
  .setRoute(routeSystem, routeCode)
  .setSite(siteSystem, siteCode);

const route = immunization.getRouteSystemAndCode();
const site = immunization.getSiteSystemAndCode();
```

### Observation reference range text

```ts
const observation = editableBundle
  .openEntry(observationId)
  .asObservation();

observation.setReferenceRangeText(referenceRangeText);
const storedReferenceRange = observation.getReferenceRangeText();
```

## Typed Resource Families

The same creation and reopen pattern is available for every registered family:

| Resource family | Typed entry method | Main accessor groups |
|---|---|---|
| Vital sign | `asVitalSign()` | identifier, subject, status, category, date, note, measurement values |
| Observation | `asObservation()` | coding/value, components, method, encounter, performer, reference range |
| AllergyIntolerance | `asAllergy()` | coding, statuses, criticality, reaction severity/manifestation, onset, recorder |
| Condition | `asCondition()` | coding, category, statuses, severity, onset, recorder |
| MedicationStatement | `asMedicationStatement()` | medication coding/reference, status, effective date/period, dosage, adherence |
| Immunization | `asImmunization()` | vaccine, date, status, route, site, target disease, dose/series, performer |
| Procedure | `asProcedure()` | coding, status, date, body site, reason, encounter, performer |
| DiagnosticReport | `asDiagnosticReport()` | coding/category, date, results, specimen, performer, presented form |
| DocumentReference | `asDocumentReference()` | type/category, author, date, content, hash, location |
| CarePlan | `asCarePlan()` | status, intent, category, date, activity and outcome |
| Flag | `asFlag()` | status, category, code, date/period, encounter |
| ClinicalImpression | `asClinicalImpression()` | status, effective date, assessor, summary, prognosis |
| Device | `asDevice()` | type, status, manufacturer/model, serial number, patient/organization/location |
| DeviceUseStatement | `asDeviceUseStatement()` | device, status, timing, reason, source, recorded date |
| Encounter | `asEncounter()` | status, class/type, period, reason, participants, service provider |
| Coverage | `asCoverage()` | status, type, beneficiary/subscriber, relationship, payor, period |
| Consent | `asConsent()` | decision, status, period, purposes, actors, roles, resource types, sections |
| RelatedPerson | `asRelatedPerson()` | subject, relationship, name, telecom, roles and linked identifiers |
| Employee | `asEmployee()` | identifier, email, role, works-for and member-of organization |

All typed editors also inherit the generic entry getters/setters for `fullUrl`,
`resource.id`, claims, request operation and optimistic version matching.

## Exact Paired Accessor Index

Each suffix below represents both `set<Suffix>(...)` and `get<Suffix>()` on
that editor. Coding helpers that return only one token component, such as
`getCodeValue()`, `getRouteCode()` or `getCategoryCode()`, are additional
read-only views of the same stored token.

| Editor | Paired getter/setter suffixes |
|---|---|
| AllergyIntolerance | `Identifier`, `Subject`, `Code`, `CodeSystem`, `SystemAndCode`, `CodeTextLocal`, `CodeDisplay`, `ClinicalStatus`, `VerificationStatus`, `Category`, `Criticality`, `ReactionManifestation`, `ReactionSeverity`, `OnsetDateTime`, `Recorder`, `ContainedDocumentIdentifierList` |
| CarePlan | `Identifier`, `Subject`, `Status`, `Intent`, `Category`, `CategoryCodeSystem`, `CategorySystemAndCode`, `Encounter`, `Date`, `Note`, `ActivityCode`, `ActivityCodeSystem`, `ActivitySystemAndCode`, `ActivityOutcome`, `ActivityOutcomeCodeSystem`, `ActivityOutcomeSystemAndCode` |
| ClinicalImpression | `Identifier`, `Subject`, `Status`, `Description`, `Encounter`, `EffectiveDateTime`, `Assessor`, `Summary`, `PrognosisCode`, `PrognosisCodeSystem`, `PrognosisSystemAndCode` |
| Condition | `Identifier`, `Subject`, `Code`, `CodeSystem`, `SystemAndCode`, `CodeTextLocal`, `CodeDisplay`, `ClinicalStatus`, `VerificationStatus`, `Category`, `CategoryCodeSystem`, `CategorySystemAndCode`, `Severity`, `SeverityCodeSystem`, `SeveritySystemAndCode`, `OnsetDateTime`, `Recorder`, `ContainedDocumentIdentifierList` |
| Consent | `Identifier`, `Subject`, `Status`, `Decision`, `ActorIdentifierList`, `ActorRoleList`, `PurposeList`, `SectionList`, `ResourceTypeList`, `Date`, `PeriodStart`, `PeriodEnd` |
| Coverage | `Identifier`, `Status`, `Type`, `TypeCodeSystem`, `TypeSystemAndCode`, `PolicyHolder`, `Subscriber`, `Beneficiary`, `Relationship`, `RelationshipCodeSystem`, `RelationshipSystemAndCode`, `PeriodStart`, `PeriodEnd`, `PayorList` |
| Device | `Identifier`, `Patient`, `Status`, `Type`, `TypeCodeSystem`, `TypeSystemAndCode`, `Manufacturer`, `Model`, `DeviceName`, `SerialNumber`, `Organization`, `Location`, `Url`, `Note` |
| DeviceUseStatement | `Identifier`, `Subject`, `Status`, `Device`, `RecordedOn`, `TimingDateTime`, `ReasonCode`, `ReasonCodeSystem`, `ReasonSystemAndCode`, `Source` |
| DiagnosticReport | `Identifier`, `Subject`, `Status`, `Date`, `Category`, `CategoryCodeSystem`, `CategorySystemAndCode`, `Code`, `CodeSystem`, `SystemAndCode`, `CodeTextLocal`, `CodeDisplay`, `Encounter`, `PerformerList`, `ResultList`, `SpecimenList`, `ContainedDocumentIdentifierList`, `PresentedFormContentType`, `PresentedFormData`, `PresentedFormUrl` |
| DocumentReference | `Identifier`, `Subject`, `Type`, `TypeCodeSystem`, `TypeSystemAndCode`, `Category`, `CategoryCodeSystem`, `CategorySystemAndCode`, `ContentType`, `ContentData`, `ContentHash`, `Location`, `Description`, `Date`, `Author` |
| Employee | `Identifier`, `Email`, `Role`, `WorksFor`, `MemberOf`, `MemberOfOrgTaxId` |
| Encounter | `Identifier`, `Subject`, `Status`, `Class`, `ClassCodeSystem`, `ClassSystemAndCode`, `Type`, `TypeCodeSystem`, `TypeSystemAndCode`, `ParticipantList`, `ServiceProvider`, `PeriodStart`, `PeriodEnd`, `ReasonCode`, `ReasonCodeSystem`, `ReasonSystemAndCode` |
| Flag | `Identifier`, `Subject`, `Status`, `Category`, `CategoryCodeSystem`, `CategorySystemAndCode`, `Code`, `CodeSystem`, `SystemAndCode`, `CodeTextLocal`, `CodeDisplay`, `Date`, `Encounter`, `PeriodStart`, `PeriodEnd` |
| Immunization | `Identifier`, `Subject`, `Status`, `Date`, `VaccineCode`, `VaccineCodeSystem`, `VaccineSystemAndCode`, `VaccineCodeTextLocal`, `VaccineCodeDisplay`, `Location`, `Manufacturer`, `LotNumber`, `PerformerList`, `ReasonCode`, `ReasonCodeSystem`, `ReasonSystemAndCode`, `StatusReason`, `StatusReasonCodeSystem`, `StatusReasonSystemAndCode`, `TargetDisease`, `TargetDiseaseCodeSystem`, `TargetDiseaseSystemAndCode`, `Route`, `RouteCodeSystem`, `RouteSystemAndCode`, `Site`, `SiteCodeSystem`, `SiteSystemAndCode`, `DoseSequence`, `Series`, `ReactionDate`, `Note`, `ClinicalNote` |
| MedicationStatement | `Identifier`, `Subject`, `Status`, `Effective`, `EffectivePeriodStart`, `EffectivePeriodEnd`, `Code`, `CodeSystem`, `SystemAndCode`, `Medication`, `MedicationText`, `CodeTextLocal`, `CodeDisplay`, `Adherence`, `AdherenceCode`, `AdherenceCodeSystem`, `AdherenceSystemAndCode`, `AdherenceCodeTextLocal`, `AdherenceCodeDisplay`, `Note`, `DosageInstruction`, `CategoryList`, `DoseQuantityValue`, `DoseQuantityUnit`, `DoseQuantityUnitCodeSystem`, `DoseQuantityUnitSystemAndCode`, `DosageRoute`, `DosageRouteCodeSystem`, `DosageRouteSystemAndCode`, `TimingFrequency`, `TimingPeriod`, `TimingPeriodUnit`, `DosageAsNeeded`, `ContainedResourceReferenceList`, `UserSelected`, `ContainedDocumentIdentifierList` |
| Observation | `Method`, `MethodCodeSystem`, `MethodSystemAndCode`, `BasedOn`, `Encounter`, `Performer`, `HasMember`, `HasMemberList`, `ReferenceRangeText` plus the shared observation-component accessors below |
| Procedure | `Identifier`, `Subject`, `Status`, `Date`, `Code`, `CodeSystem`, `SystemAndCode`, `CodeTextLocal`, `CodeDisplay`, `Encounter`, `Location`, `ReasonCode`, `ReasonCodeSystem`, `ReasonSystemAndCode`, `BodySite`, `BodySiteCodeSystem`, `BodySiteSystemAndCode`, `Note`, `ClinicalNote`, `PerformerList`, `BasedOnList`, `ReasonReferenceList` |
| RelatedPerson | `Identifier`, `Active`, `Subject`, `Relationship`, `RelationshipCodeSystem`, `RelationshipSystemAndCode`, `RoleList`, `Name`, `Telecom`, `RelatedEntityType`, `ActorIdentifierList` |
| VitalSign | `Identifier`, `Subject`, `Status`, `Category`, `CategoryCodeSystem`, `CategorySystemAndCode`, `Date`, `Note`, `HeartRate`, `BodyTemperature`, `SystolicBloodPressure`, `DiastolicBloodPressure` plus the shared observation-component accessors below |

Observation and vital-sign editors inherit these paired component suffixes:
`Code`, `CodeDisplay`, `CodeSystem`, `CodeTextLocal`, `CodeValue`, `LocalText`,
`SystemAndCode`, `ValueConcept`, `ValueConceptCodeSystem`,
`ValueConceptSystemAndCode`, `ValueDate`, `ValueQuantityNumber`,
`ValueQuantityUnit`, `ValueQuantityUnitCodeSystem`,
`ValueQuantityUnitSystemAndCode` and `ValueString`.

Clinical resource editors also inherit `Language`, `SectionList`,
`UserSelected` and `ContainedResourceReferenceList` where applicable.

Two setters are intentionally composite rather than symmetric scalar fields:

- `setVitalSignType(...)` writes category, status, observation coding, display
  and optionally the quantity unit; read those values with their individual
  coding, category, status and quantity-unit getters.
- `setFhirApiClaimFields(...)` writes several normalized claim fields; read a
  field with `getFhirApiClaim(...)` or its typed resource getter.

## Boundary

The editor produces Bundle data only. Authentication, authorization,
Communication packaging, signing, sending and persistence belong to the SDK
or service layer that owns that flow. Keep subject, author and attester values
from the authenticated business context; do not substitute editor-generated
identifiers for them.
