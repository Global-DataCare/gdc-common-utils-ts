import { ParameterData } from '../models/params';

export type SearchParameterPrimitive =
  | string
  | number
  | boolean
  | readonly (string | number | boolean)[];

export type SearchRequestEncoding = 'get-query' | 'post-parameters';

export type FhirParametersParameter = {
  name: string;
  valueString?: string;
  valueCode?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
  valueUri?: string;
  valueReference?: { reference: string };
  valueCoding?: { system?: string; code: string };
};

export type FhirParametersResource = {
  resourceType: 'Parameters';
  parameter: FhirParametersParameter[];
};

function normalizeSearchPrimitiveValues(
  value: SearchParameterPrimitive,
): Array<string | number | boolean> {
  const values = Array.isArray(value) ? [...value] : [value];
  return values
    .map((item) => typeof item === 'string' ? item.trim() : item)
    .filter((item) => item !== '' && item !== undefined && item !== null);
}

function toPrimitiveString(value: string | number | boolean): string {
  return typeof value === 'string' ? value.trim() : String(value);
}

function toSearchParameter(name: string, value: string | number | boolean): FhirParametersParameter {
  if (typeof value === 'boolean') {
    return { name, valueBoolean: value };
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { name, valueInteger: value }
      : { name, valueDecimal: value };
  }
  return { name, valueString: value.trim() };
}

function flattenParameterDataValue(parameter: ParameterData): FhirParametersParameter | undefined {
  const name = String(parameter?.name || '').trim();
  if (!name) {
    return undefined;
  }

  if (parameter.type === 'reference') {
    const reference = String((parameter as any).reference || parameter.value || '').trim();
    return reference ? { name, valueReference: { reference } } : undefined;
  }

  if (parameter.type === 'token') {
    const code = String(parameter.value || '').trim();
    if (!code) {
      return undefined;
    }
    return parameter.system
      ? { name, valueCoding: { system: String(parameter.system).trim(), code } }
      : { name, valueCode: code };
  }

  if (parameter.type === 'uri') {
    const value = String(parameter.value || '').trim();
    return value ? { name, valueUri: value } : undefined;
  }

  if (typeof parameter.value === 'number') {
    return Number.isInteger(parameter.value)
      ? { name, valueInteger: parameter.value }
      : { name, valueDecimal: parameter.value };
  }

  const value = String(parameter.value || '').trim();
  return value ? { name, valueString: value } : undefined;
}

export function buildSearchQueryString(
  searchParams: Readonly<Record<string, SearchParameterPrimitive | undefined>>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined || value === null) continue;
    const normalized = normalizeSearchPrimitiveValues(value);
    if (normalized.length === 0) continue;
    params.set(key, normalized.map(toPrimitiveString).join(','));
  }
  return params.toString();
}

export function buildFhirParametersResourceFromSearchParams(
  searchParams: Readonly<Record<string, SearchParameterPrimitive | undefined>>,
): FhirParametersResource {
  const parameter: FhirParametersParameter[] = [];
  for (const [name, value] of Object.entries(searchParams)) {
    if (value === undefined || value === null) continue;
    for (const item of normalizeSearchPrimitiveValues(value)) {
      parameter.push(toSearchParameter(name, item));
    }
  }
  return {
    resourceType: 'Parameters',
    parameter,
  };
}

export function buildFhirParametersResourceFromParameterData(
  parameters: ReadonlyArray<ParameterData>,
): FhirParametersResource {
  return {
    resourceType: 'Parameters',
    parameter: parameters
      .map((parameter) => flattenParameterDataValue(parameter))
      .filter((parameter): parameter is FhirParametersParameter => Boolean(parameter)),
  };
}
