// Flow contract: shared FHIR resource catalogs are the only source for resourceType values used by GW and SDK writers.
import {
  FhirDataTypes,
  ResourceTypesFhirR4,
  ResourceTypesFhirR5,
} from '../src/constants/fhir-resource-types.js';
import { HttpMediaTypes, HttpStatusCodes } from '../src/constants/http.js';
import { SchemaOrgTypes } from '../src/constants/schemaorg.js';
import { CompositionSemanticTypes } from '../src/constants/composition.js';
import { JsonLdKeywords } from '../src/constants/jsonld.js';
import { UrnPrefixes } from '../src/constants/urn.js';
import {
  GatewayEnvelopeTypes,
  GatewayInternalResourceTypes,
  GatewayRequestEntryTypes,
  GatewayResponseEntryTypes,
  GatewayRouteFormats,
  GatewayRouteSections,
} from '../src/constants/gateway-response.js';

describe('FHIR R4 resource type catalog', () => {
  it('includes infrastructure resources emitted by canonical Bundle writers', () => {
    expect(ResourceTypesFhirR4.OperationOutcome).toBeDefined();
    expect(ResourceTypesFhirR4.Parameters).toBeDefined();
    expect(ResourceTypesFhirR4.Person).toBeDefined();
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
    expect(GatewayRequestEntryTypes.OrganizationOrder).toBeDefined();
    expect(GatewayResponseEntryTypes.LicenseGeneration).toBeDefined();
    expect(GatewayInternalResourceTypes.Document).toBeDefined();
    expect(FhirDataTypes.Annotation).toBeDefined();
    expect(ResourceTypesFhirR5.SubscriptionStatus).toBeDefined();
    expect(SchemaOrgTypes.Customer).toBeDefined();
    expect(SchemaOrgTypes.Order).toBeDefined();
  });

  it('provides shared transport and route vocabulary for GW writers and fixtures', () => {
    expect(HttpMediaTypes.ApiJson).toBeDefined();
    expect(HttpMediaTypes.ApiJsonShort).toBeDefined();
    expect(HttpMediaTypes.BundleApiJson).toBeDefined();
    expect(HttpMediaTypes.DidcommEncryptedJson).toBeDefined();
    expect(HttpMediaTypes.DidcommPlainJson).toBeDefined();
    expect(HttpMediaTypes.DidcommSignedJson).toBeDefined();
    expect(HttpMediaTypes.FhirJson).toBeDefined();
    expect(HttpMediaTypes.JsonApi).toBeDefined();
    expect(GatewayRouteSections.Identity).toBeDefined();
    expect(GatewayRouteFormats.OpenId).toBeDefined();
    expect(UrnPrefixes.Email).toBeDefined();
  });
});
