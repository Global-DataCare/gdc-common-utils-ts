import { HealthcareRolesByFamily } from '../constants/healthcare';

export type RoleCodeI18nKey =
  | `org.ilo.isco-08.${string}`
  | `org.isco08.${string}`
  | `org.hl7.v3.personalRelationship.${string}`
  | `org.hl7.v3.roleCode.${string}`;

export type RoleCodeI18nMap = Readonly<Record<RoleCodeI18nKey, string>>;

function buildRoleCodeI18nMap(): RoleCodeI18nMap {
  const baseEntries = Object.values(HealthcareRolesByFamily)
    .flatMap((catalog) => Object.values(catalog))
    .map((descriptor) => [descriptor.i18nKey as RoleCodeI18nKey, descriptor.titleEn] as const);

  const legacyIscoAliases = baseEntries
    .filter(([key]) => key.startsWith('org.ilo.isco-08.'))
    .map(([key, label]) => [key.replace('org.ilo.isco-08.', 'org.isco08.') as RoleCodeI18nKey, label] as const);

  const entries = [...baseEntries, ...legacyIscoAliases];

  return Object.freeze(Object.fromEntries(entries)) as RoleCodeI18nMap;
}

export const roleCodeI18nEn = buildRoleCodeI18nMap();
export const healthcareRoleI18nEn = roleCodeI18nEn;
