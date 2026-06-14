import { Format } from './Schemas';

/**
 * Shared interoperability contexts reused by examples, readers, and SDK
 * adapters so they do not re-hardcode protocol-family strings inline.
 */
export const InteroperableContext = Object.freeze({
  FhirApi: Format.FHIR_API,
  FhirR4: Format.FHIR_R4,
  Schema: Format.SCHEMA,
} as const);

/**
 * Stable request type ids reused by lifecycle examples and SDK runtime
 * adapters for the currently deployed GW CORE contract.
 */
export const LifecycleRequestType = Object.freeze({
  RelatedPersonDisable: 'RelatedPerson-disable-request-v1.0',
  RelatedPersonPurge: 'RelatedPerson-purge-request-v1.0',
  TenantEnable: 'Organization-enable-request-v1.0',
  TenantDisable: 'Organization-disable-request-v1.0',
  TenantPurge: 'Organization-purge-request-v1.0',
} as const);
