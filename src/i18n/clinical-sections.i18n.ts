import {
  clinicalDocTypes,
  clinicalSectionAdditional,
  clinicalSectionsBase,
} from '../models/clinical-sections.en';
import { loincI18nKey } from '../models/clinical-sections';

export type ClinicalSectionI18nMap = Readonly<Record<`org.loinc.${string}`, string>>;

function toClinicalI18nMap(source: Readonly<Record<string, string>>): ClinicalSectionI18nMap {
  const entries = Object.entries(source).map(([code, label]) => [loincI18nKey(code), label] as const);
  return Object.freeze(Object.fromEntries(entries)) as ClinicalSectionI18nMap;
}

export const clinicalSectionsBaseI18nEn = toClinicalI18nMap(clinicalSectionsBase);
export const clinicalDocTypesI18nEn = toClinicalI18nMap(clinicalDocTypes);
export const clinicalSectionAdditionalI18nEn = toClinicalI18nMap(clinicalSectionAdditional);

export const clinicalSectionI18nEn = Object.freeze({
  ...clinicalSectionsBaseI18nEn,
  ...clinicalDocTypesI18nEn,
  ...clinicalSectionAdditionalI18nEn,
}) as ClinicalSectionI18nMap;

export const clinicalSectionsI18nEn = clinicalSectionI18nEn;