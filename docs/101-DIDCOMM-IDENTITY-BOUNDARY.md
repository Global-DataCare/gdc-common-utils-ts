# DIDComm identity boundary

Use this page when you need to know who sent a message, which key proved it,
and which person is allowed to access subject data. These are separate facts.

## The four identifiers

- `from`: DIDComm sender DID.
- `iss`: FAPI issuer DID bound to the signature. In a direct request it equals `from`.
- `kid`: verification-method identifier for the concrete registered signing key.
- SMART `sub`: human or professional actor authorized by the access token.

Email, telephone and card values do not belong in `from`. Shared identity
builders convert private contact inputs to stable aliases such as
`urn:multibase:z...`; actor/individual DID builders then place the stable
payload in a routable `did:web` without exposing the original contact.

## Direct actor

```jsonc
{
  "from": "did:web:clinic.example:employee:z...:ISCO-08|2211", // DIDComm sender
  "iss": "did:web:clinic.example:employee:z...:ISCO-08|2211",  // same direct signer
  "meta": {
    "jws": {
      "protected": {
        "kid": "did:web:clinic.example:employee:z...:ISCO-08|2211#communication-signing" // key, not actor
      }
    }
  },
  "body": {
    "data": [
      { "resource": { "resourceType": "Communication" } } // business/FHIR layer
    ]
  }
}
```

The executable, literal-free fixture is
`EXAMPLE_DIRECT_ACTOR_DIDCOMM_MESSAGE` from `gdc-common-utils-ts/examples`.

## DCR client acting for a professional

```jsonc
{
  "from": "did:web:device-001", // DCR client/device sender
  "iss": "did:web:device-001",  // issuer bound to the device signature
  "meta": {
    "jws": {
      "protected": {
        "kid": "did:web:device-001#dcr-signing" // registered device key
      }
    }
  },
  "body": {
    "sub": "did:web:clinic.example:employee:z...:ISCO-08|2211", // professional actor
    "scope": "organization/Composition.rs?subject=did:web:...&section=LOINC|60591-5" // allowed data
  }
}
```

The executable fixture is
`EXAMPLE_DEVICE_BOUND_SMART_DIDCOMM_MESSAGE`.

## FHIR transport is different

With direct `application/fhir+json`, the HTTP body is a FHIR `Communication`
or `Bundle`. It does not contain `from`, `iss` or `kid`. Authentication stays
in the HTTP `Authorization` proof. `Communication.sender` is a business
participant and must not be treated as transport authentication.

SDKs select the carrier. Applications author the Communication and use the
high-level facade; they do not manually copy transport identity fields.
