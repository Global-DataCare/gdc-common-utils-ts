// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
/**
 * Journey:
 * 1. A direct actor sends one DIDComm/FAPI request with the same DID in `from` and `iss`.
 * 2. Its JWS header identifies the registered signing key with `kid`, never the actor identity.
 * 3. A DCR client signs a SMART request as the device while `sub` identifies the professional.
 * Authorization invariant: signer/client identity, human actor and stable contact alias remain separate.
 * Persistence invariant: raw email, telephone and card identifiers never enter the transport envelope.
 */
import {
  buildExampleCommunicationIngestionPayload,
  EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE,
  EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE,
  EXAMPLE_PROFESSIONAL_DID,
} from '../src/examples';
import { Format } from '../src/constants/Schemas';

describe('101 DIDComm identity boundary', () => {
  it('keeps direct sender, issuer, key and SMART actor in their canonical layers', () => {
    expect(EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE.from).toBe(
      EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE.iss,
    );
    expect(EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE.iss).toMatch(/^did:web:/);
    expect(EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE.meta?.jws?.protected?.kid).not.toBe(
      EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE.iss,
    );
  });

  it('keeps the DCR client as issuer and the professional as SMART subject', () => {
    expect(EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE.from).toBe(
      EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE.iss,
    );
    expect(EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE.body.sub).toBe(EXAMPLE_PROFESSIONAL_DID);
    expect(EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE.body.scope).toMatch(
      /^organization\/Composition\.rs\?subject=/,
    );
    expect(EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE.meta?.jws?.protected?.kid).not.toBe(
      EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE.body.sub,
    );
  });

  it('keeps version-neutral flat claims inside an attached native FHIR Communication', () => {
    const payload = buildExampleCommunicationIngestionPayload();
    const communication = payload.body.data[0].resource;

    expect(communication.resourceType).toBe('Communication');
    expect(communication.meta.claims['@context']).toBe(Format.FHIR_API);
  });
});
