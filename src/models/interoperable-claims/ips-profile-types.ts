// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

export type FhirSearchParameterType =
  | 'number'
  | 'date'
  | 'string'
  | 'token'
  | 'reference'
  | 'composite'
  | 'quantity'
  | 'uri'
  | 'special';

export type IpsElementBinding = Readonly<{
  strength: 'required' | 'extensible' | 'preferred' | 'example';
  valueSet: string;
  additionalValueSets: readonly string[];
}>;

export type IpsProfileElement = Readonly<{
  id: string;
  path: string;
  min: number;
  max: string;
  mustSupport: boolean;
  fhirTypes: readonly string[];
  typeProfiles: readonly string[];
  targetProfiles: readonly string[];
  contentReference?: string;
  fixedValue?: Readonly<{ fhirType: string; value: unknown }>;
  patternValue?: Readonly<{ fhirType: string; value: unknown }>;
  binding?: IpsElementBinding;
  creatorObligations: readonly string[];
  consumerObligations: readonly string[];
}>;

export type IpsProfileDefinition = Readonly<{
  resourceType: string;
  canonicalUrl: string;
  version: string;
  name: string;
  elements: readonly IpsProfileElement[];
}>;

export type FhirSearchParameterDefinition = Readonly<{
  code: string;
  type: FhirSearchParameterType;
  url: string;
  expression?: string;
  fhirVersions: readonly string[];
}>;

export type IpsResourceCapability = Readonly<{
  resourceType: string;
  /** Profiles explicitly advertised by the IPS CapabilityStatement. */
  supportedProfiles: readonly string[];
  /** Effective field contracts: advertised profiles, or the R4 base resource when IPS declares none. */
  profiles: readonly string[];
  interactions: readonly string[];
  /** Canonical flat-claim names from the applicable R4 FHIR SearchParameter definitions. */
  searchParameters: readonly FhirSearchParameterDefinition[];
}>;

export type IpsProfileCatalog = Readonly<Record<string, IpsProfileDefinition>>;

export type IpsValueSetUsage = Readonly<{
  resourceType: string;
  profile: string;
  elementId: string;
  path: string;
  purpose: 'primary' | 'additional';
  strength: 'required' | 'extensible' | 'preferred' | 'example';
}>;

export type IpsValueSetDefinition = Readonly<{
  canonicalReference: string;
  canonicalUrl: string;
  resolved: boolean;
  version?: string;
  name?: string;
  title?: string;
  status?: string;
  description?: string;
  immutable?: boolean;
  compose?: unknown;
  expansion?: unknown;
  usages: readonly IpsValueSetUsage[];
}>;

export type IpsValueSetCatalog = Readonly<Record<string, IpsValueSetDefinition>>;
