// constants/Schemas.ts
// Based on the backend's src/models/schemaorg.ts

/**
 * Defines the types of form requests that can be sent in a batch.
 */
export const FormRequestType = {
  IndividualTerms: 'IndividualTerms',
  PersonalIdentity: 'PersonalIdentity',
} as const;

// --- Enums for URL construction and validation ---

export const Sector = {
  EMERGENCY: 'emergency',
  HEALTH_CARE: 'health-care',
  HEALTH_INSURANCE: 'health-insurance',
  RESEARCH: 'research',
} as const;
export type Sector = typeof Sector[keyof typeof Sector];

export const Section = {
  REGISTRY: 'registry',
  ENTITY: 'entity',
  INDIVIDUAL: 'individual',
  NETWORK: 'network',
} as const;
export type Section = typeof Section[keyof typeof Section];

export const Format = {
  SCHEMA: 'org.schema',
  FHIR_API: 'org.hl7.fhir.api',
  FHIR_R4: 'org.hl7.fhir.r4',
} as const;
export type Format = typeof Format[keyof typeof Format];

export const Resource = {
  PERSON: 'Person',
  RELATED_PERSON: 'RelatedPerson',
  LICENSE: 'License',
  EMPLOYEE: 'Employee',
  EMPLOYEE_ROLE: 'EmployeeRole',
  PRACTITIONER: 'Practitioner',
  PRACTITIONER_ROLE: 'PractitionerRole',
  ORGANIZATION: 'Organization',
  LOCATION: 'Location',
  GROUP: 'Group',
} as const;
export type Resource = typeof Resource[keyof typeof Resource];

export const JobAction = {
  BATCH: '_batch',
  CREATE: '_create',
  DISCOVERY: '_discovery',
  SEARCH: '_search',
} as const;
export type JobAction = typeof JobAction[keyof typeof JobAction];

export const knownDomainsReversed = [
  'org.schema',
  'org.hl7.fhir',
  'org.ilo.isco',
  'net.openid',
] as const;
