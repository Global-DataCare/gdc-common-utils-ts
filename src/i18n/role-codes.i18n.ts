import { HealthcareRolesByFamily } from '../constants/healthcare';

export type RoleCodeI18nKey =
  | `org.ilo.isco-08.${string}`
  | `org.isco08.${string}`
  | `org.hl7.terminology.CodeSystem.v3-RoleCode.${string}`
  /**
   * @deprecated Use `org.hl7.terminology.CodeSystem.v3-RoleCode.<code>`.
   */
  | `org.hl7.v3.personalRelationship.${string}`
  /**
   * @deprecated Use `org.hl7.terminology.CodeSystem.v3-RoleCode.<code>`.
   */
  | `org.hl7.v3.roleCode.${string}`;

export type RoleCodeI18nMap = Readonly<Record<RoleCodeI18nKey, string>>;

function buildRoleCodeI18nMap(): RoleCodeI18nMap {
  const baseEntries = Object.values(HealthcareRolesByFamily)
    .flatMap((catalog) => Object.values(catalog))
    .map((descriptor) => [descriptor.i18nKey as RoleCodeI18nKey, descriptor.titleEn] as const);

  const legacyIscoAliases = baseEntries
    .filter(([key]) => key.startsWith('org.ilo.isco-08.'))
    .map(([key, label]) => [key.replace('org.ilo.isco-08.', 'org.isco08.') as RoleCodeI18nKey, label] as const);

  const legacyHl7Aliases = baseEntries
    .filter(([key]) => key.startsWith('org.hl7.terminology.CodeSystem.v3-RoleCode.'))
    .flatMap(([key, label]) => {
      const suffix = key.replace('org.hl7.terminology.CodeSystem.v3-RoleCode.', '');
      return [
        /** @deprecated Compatibility alias for older consumers. */
        [`org.hl7.v3.personalRelationship.${suffix}`, label] as const,
        /** @deprecated Compatibility alias for older consumers. */
        [`org.hl7.v3.roleCode.${suffix}`, label] as const,
      ];
    });

  const entries = [...baseEntries, ...legacyIscoAliases, ...legacyHl7Aliases];

  return Object.freeze(Object.fromEntries(entries)) as RoleCodeI18nMap;
}

export const roleCodeI18nEn = buildRoleCodeI18nMap();
export const healthcareRoleI18nEn = roleCodeI18nEn;
