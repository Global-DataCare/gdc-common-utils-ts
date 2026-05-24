/**
 * Canonical SMART/GW scope literals currently used by the CORE GW contract.
 *
 * These are gateway-specific scope strings, not a complete generic SMART
 * terminology catalog.
 */
export const SmartGatewayScopesFhirR4 = Object.freeze({
  /**
   * Consent resource CRUDS scope used by the current GW SMART token flows.
   */
  ConsentCruds: 'organization/Consent.cruds',
} as const);

