// Flow contract: shared FHIR resource catalogs are the only source for resourceType values used by GW and SDK writers.
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { HttpStatusCodes } from '../src/constants/http.js';
import { CompositionSemanticTypes } from '../src/constants/composition.js';
import { JsonLdKeywords } from '../src/constants/jsonld.js';
import {
  GatewayEnvelopeTypes,
  GatewayResourceTypes,
  GatewayResponseEntryTypes,
} from '../src/constants/gateway-response.js';

describe('FHIR R4 resource type catalog', () => {
  it('includes infrastructure resources emitted by canonical Bundle writers', () => {
    expect(ResourceTypesFhirR4.OperationOutcome).toBeDefined();
    expect(ResourceTypesFhirR4.Parameters).toBeDefined();
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

  it('provides shared gateway envelope, entry and non-FHIR resource types', () => {
    expect(GatewayEnvelopeTypes.BatchResponse).toBeDefined();
    expect(GatewayResponseEntryTypes.CompositionSearch).toBeDefined();
    expect(GatewayResponseEntryTypes.OrganizationOrder).toBeDefined();
    expect(GatewayResourceTypes.LicenseGenerationResult).toBeDefined();
  });
});
