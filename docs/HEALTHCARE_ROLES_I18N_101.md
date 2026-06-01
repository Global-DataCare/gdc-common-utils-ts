# Healthcare Roles And i18n 101

This guide explains how new developers should use healthcare role catalogs in `gdc-common-utils-ts`.

Scope covered:

- sector-aware professional roles (ISCO-08)
- personal relationship roles (HL7)
- legal representative roles (HL7)
- i18n key lookup for UI labels

## Why this exists

Do not hardcode role codes, role claims, or role labels in frontend or backend code.

Use shared constants and helpers so all SDK layers resolve the same semantic contract.

## Canonical role families

From `src/constants/healthcare.ts`:

- `professionalOccupationIsco08`
- `personalRelationshipHl7`
- `legalRepresentativeHl7`

Family-level catalog:

- `HealthcareRolesByFamily`
- `getHealthcareRolesByFamily(family)`

## Sector-aware professional roles

Professional roles are filtered by sector with explicit code sets.

Main helpers:

- `HealthcareProfessionalRoleCodesBySector`
- `HealthcareProfessionalRolesBySector`
- `getHealthcareProfessionalRolesBySector(sector)`
- `getHealthcareRolesBySector(sector, family)`

Examples:

- `health-care` includes roles such as Physician (`2211`)
- `animal-care` includes roles such as Veterinarian (`2250`)
- `health-research` and `animal-research` can have different role subsets

Use `DataspaceSectors` values as input sectors.

## Claim and coding-system conventions

Professional role claim format:

- `ISCO-08|<code>`

Professional coding system descriptor:

- `org.ilo.isco`

HL7 role claim formats:

- `v3-PersonalRelationshipRoleType|<code>`
- `v3-RoleCode|<code>`

## i18n keys

For ISCO role labels, use:

- `org.ilo.isco-08.<code>`

For HL7 personal relationship labels, use:

- `org.hl7.v3.personalRelationship.<code>`

For HL7 role code labels, use:

- `org.hl7.v3.roleCode.<code>`

Shared map export:

- `roleCodeI18nEn`

Backward compatibility:

- legacy aliases `org.isco08.<code>` are still available in `roleCodeI18nEn`

## Typical usage patterns

### Backend validation/authorization

1. Resolve professional roles allowed by sector.
2. Match incoming claim values against `claim` fields.
3. Evaluate access without relying on translated labels.

```ts
import {
  DataspaceSectors,
  getHealthcareProfessionalRolesBySector,
} from 'gdc-common-utils-ts';

const allowed = getHealthcareProfessionalRolesBySector(DataspaceSectors.AnimalCare);
const veterinarianClaim = allowed['2250']?.claim; // ISCO-08|2250
```

### Frontend role dropdown + translation

1. Resolve catalog by sector and family.
2. Render stable `claim`/`code` as value.
3. Use `i18nKey` with your translation runtime.

```ts
import {
  DataspaceSectors,
  HealthcareRoleFamilies,
  getHealthcareRolesBySector,
  roleCodeI18nEn,
} from 'gdc-common-utils-ts';

const roles = getHealthcareRolesBySector(
  DataspaceSectors.HealthResearch,
  HealthcareRoleFamilies.ProfessionalOccupationIsco08,
);

const options = Object.values(roles).map((r) => ({
  value: r.claim,
  code: r.code,
  label: roleCodeI18nEn[r.i18nKey] ?? r.titleEn,
}));
```

## Rules for new code

- Do not add role literals directly in feature code.
- Do not use labels for permission decisions.
- Always use `claim` for matching and persistence.
- Always use `i18nKey` for rendering labels.
- Prefer sector-aware APIs over global role lists.

## Source of truth

- `src/constants/healthcare.ts`
- `src/constants/hl7-roles.ts`
- `src/constants/sectors.ts`
- `src/i18n/role-codes.i18n.ts`
- `__tests__/constants-healthcare-roles.test.ts`
