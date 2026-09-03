// Flow contract: shared FHIR resource catalogs are the only source for resourceType values used by GW and SDK writers.
import {
  FhirDataTypes,
  ResourceTypesFhirR4,
  ResourceTypesFhirR5,
} from '../src/constants/fhir-resource-types.js';
import { HttpStatusCodes } from '../src/constants/http.js';
import { SchemaOrgTypes } from '../src/constants/schemaorg.js';
import { CompositionSemanticTypes } from '../src/constants/composition.js';
import { JsonLdKeywords } from '../src/constants/jsonld.js';
import {
  GatewayEnvelopeTypes,
  GatewayInternalResourceTypes,
  GatewayResponseEntryTypes,
} from '../src/constants/gateway-response.js';

describe('FHIR R4 resource type catalog', () => {
  it('includes infrastructure resources emitted by canonical Bundle writers', () => {
    expect(ResourceTypesFhirR4.OperationOutcome).toBeDefined();
    expect(ResourceTypesFhirR4.Parameters).toBeDefined();
    expect(ResourceTypesFhirR4.ResearchSubject).toBeDefined();
  });

  it('includes every successful asynchronous response status used by Bundle writers', () => {
    expect(HttpStatusCodes.Accepted).toBeDefined();
    expect(HttpStatusCodes.NoContent).toBeDefined();
  });

  it('provides the shared semantic type for researcher-owned working selections', () => {
    expect(CompositionSemanticTypes.ResearcherWorkingSelection).toBeDefined();
  });

  it('provides shared JSON-LD claim keys for canonical claims writers', () => {
    expect(JsonLdKeywords.Context).toBeDefined();
    expect(JsonLdKeywords.Type).toBeDefined();
  });

  it('keeps gateway wire types separated by their actual vocabulary', () => {
    expect(GatewayEnvelopeTypes.BatchResponse).toBeDefined();
    expect(GatewayResponseEntryTypes.CompositionSearch).toBeDefined();
    expect(GatewayResponseEntryTypes.OrganizationOrder).toBeDefined();
    expect(GatewayResponseEntryTypes.LicenseGeneration).toBeDefined();
    expect(GatewayInternalResourceTypes.Document).toBeDefined();
    expect(FhirDataTypes.Annotation).toBeDefined();
    expect(ResourceTypesFhirR5.SubscriptionStatus).toBeDefined();
    expect(SchemaOrgTypes.Customer).toBeDefined();
  });
});
