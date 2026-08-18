# Connected device FHIR R4 ingestion

This is the neutral baseline for human-health and animal-health device partners.
It is a wire/import profile; canonical indexed records remain scalar claims in
`resource.meta.claims`.

Send a FHIR R4 `Bundle.type=transaction` containing:

1. exactly one `Patient`, identified by the deployment's authorized public
   subject-card identifier and identifier system;
2. exactly one `Device`, with a stable manufacturer identifier and
   `Device.patient` pointing to that Patient;
3. one or more coded `Observation` resources with stable identifiers,
   `subject`, `device`, time, value and UCUM units;
4. `Provenance` covering every Observation and naming the accountable
   manufacturer or clinic organization.

For an animal, the FHIR `Patient` wire projection includes the standard
`patient-animal` extension with a coded species. The internal system still uses
the neutral private Subject UUID. The deployment decides which public subject
identifier is the exact Consent subject.

The recipient must authenticate the submitting application, resolve its
organization, verify an active subject-scoped Consent/SMART grant, reject
replays by Observation identifier and only then call
`normalizeConnectedDeviceFhirR4Bundle(...)`. FHIR Subscription can notify
downstream consumers after acceptance; it is not write authorization.

The executable partner example is
`__tests__/101-connected-device-fhir-r4-ingestion.test.ts`.
