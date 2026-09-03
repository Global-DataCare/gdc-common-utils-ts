// Flow contract: share canonical SMART post-DCR route vocabulary without introducing an unimplemented `_token` action.
import {
  IdentityAuthResourceTypes,
  SmartClientAssertionTypes,
  SmartOpenIdAcrValues,
  SmartPostDcrActions,
} from '../src/constants/identity-auth.js';
import { GatewayRouteFormats, GatewayRouteSections } from '../src/constants/gateway-response.js';

describe('SMART post-DCR route vocabulary', () => {
  it('exposes token submission, canonical response polling and only the temporary batch-response alias', () => {
    expect(GatewayRouteSections.Identity).toBeDefined();
    expect(GatewayRouteFormats.OpenId).toBeDefined();
    expect(IdentityAuthResourceTypes.Smart).toBeDefined();
    expect(SmartPostDcrActions.Token).toBeDefined();
    expect(SmartPostDcrActions.TokenResponse).toBeDefined();
    expect(SmartPostDcrActions.LegacyBatchResponse).toBeDefined();
    expect(Object.values(SmartPostDcrActions)).toHaveLength(3);
    expect(SmartClientAssertionTypes.PrivateKeyJwt).toBeDefined();
    expect(SmartOpenIdAcrValues.Individual).toBeDefined();
  });
});
