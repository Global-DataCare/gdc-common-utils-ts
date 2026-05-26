# Lifecycle 101

This document is the canonical `v1` lifecycle guide for GW, SDKs, Swagger examples, and portal/front integrations.

If you are new, use only these three operation names:

- `enable`
- `disable`
- `delete`

Do not start with `revoke`, `suspend`, `purge`, or product-specific synonyms in public examples.

## What Each Operation Means

### `enable`

Use `enable` when the identity already exists and must become active again.

Examples:

- reactivate an `employee` with the same `email + role`
- reactivate a `tenant` with the same `taxId`
- reactivate an `individual` after a local suspension
- reactivate a previously disabled `consent`

### `disable`

Use `disable` when the record must remain auditable but operationally suspended.

Examples:

- suspend an `employee` without deleting history
- suspend a `tenant` without purging its trace
- suspend an `individual` without erasing all records
- suspend a `consent` so it no longer grants access

Important `v1` rule:

- `disable` does **not** automatically release the reserved employee license seat
- `disable` does **not** mean VC revocation by itself
- authoritative VC suspension/revocation still belongs to ICA + ledger `credentialStatus`

### `delete`

Use `delete` when the business/legal intent is real deletion, not just suspension.

Examples:

- `individual`: right to be forgotten or equivalent privacy workflow
- `consent`: delete when your legal model requires removal instead of simple suspension
- `employee` and `tenant`: exceptional flow, usually not the first business operation

Important `v1` rule:

- `delete` does not have to mean immediate physical purge in every backend
- retention, legal hold, and minimum audit trail may still apply

## Copy/Paste Placeholders

Use these placeholders in examples, Swagger docs, and tutorials instead of personal data:

```json
{
  "tenantId": "acme-id",
  "tenantTaxId": "{{tenantTaxId}}",
  "tenantDid": "{{tenantDid}}",
  "employeeIdentifier": "{{employeeIdentifier}}",
  "employeeEmail": "{{employeeEmail}}",
  "employeeRole": "{{employeeRole}}",
  "individualIdentifier": "{{individualIdentifier}}",
  "individualAlternateName": "{{individualAlternateName}}",
  "individualSubjectDid": "{{individualSubjectDid}}",
  "consentIdentifier": "{{consentIdentifier}}",
  "consentActorIdentifier": "{{consentActorIdentifier}}",
  "deleteReason": "{{deleteReason}}",
  "icaCredentialStatus": "{{icaCredentialStatus}}"
}
```

## Employee Examples

### Enable employee

```json
{
  "operation": "enable",
  "resourceType": "Employee",
  "routeContext": {
    "tenantId": "acme-id",
    "jurisdiction": "ES",
    "sector": "health-care"
  },
  "claims": {
    "@context": "org.schema",
    "org.schema.Person.identifier": "{{employeeIdentifier}}",
    "org.schema.Person.email": "{{employeeEmail}}",
    "org.schema.Person.hasOccupation.identifier.value": "{{employeeRole}}"
  }
}
```

### Disable employee

```json
{
  "operation": "disable",
  "resourceType": "Employee",
  "routeContext": {
    "tenantId": "acme-id",
    "jurisdiction": "ES",
    "sector": "health-care"
  },
  "claims": {
    "@context": "org.schema",
    "org.schema.Person.identifier": "{{employeeIdentifier}}",
    "org.schema.Person.email": "{{employeeEmail}}",
    "org.schema.Person.hasOccupation.identifier.value": "{{employeeRole}}"
  }
}
```

### Delete employee

```json
{
  "operation": "delete",
  "resourceType": "Employee",
  "routeContext": {
    "tenantId": "acme-id",
    "jurisdiction": "ES",
    "sector": "health-care"
  },
  "claims": {
    "@context": "org.schema",
    "org.schema.Person.identifier": "{{employeeIdentifier}}",
    "org.schema.Person.email": "{{employeeEmail}}",
    "org.schema.Person.hasOccupation.identifier.value": "{{employeeRole}}"
  },
  "deleteReason": "{{deleteReason}}"
}
```

## Tenant Examples

### Disable tenant

```json
{
  "operation": "disable",
  "resourceType": "Organization",
  "routeContext": {
    "tenantId": "host",
    "jurisdiction": "ES",
    "sector": "health-care"
  },
  "claims": {
    "@context": "org.schema",
    "org.schema.Organization.identifier.value": "{{tenantTaxId}}",
    "org.schema.Organization.taxID": "{{tenantTaxId}}",
    "org.schema.Organization.identifier": "{{tenantDid}}"
  }
}
```

## Individual Examples

### Delete individual

This is the place where privacy workflows such as right to be forgotten typically belong.

```json
{
  "operation": "delete",
  "resourceType": "IndividualOrganization",
  "routeContext": {
    "tenantId": "acme-id",
    "jurisdiction": "ES",
    "sector": "health-care"
  },
  "claims": {
    "@context": "org.schema",
    "org.schema.Organization.identifier": "{{individualIdentifier}}",
    "org.schema.Organization.alternateName": "{{individualAlternateName}}",
    "org.schema.Organization.owner.email": "ana.parent@example.org"
  },
  "deleteReason": "right-to-be-forgotten"
}
```

## Consent Examples

### Disable consent

```json
{
  "operation": "disable",
  "resourceType": "Consent",
  "routeContext": {
    "tenantId": "acme-id",
    "jurisdiction": "ES",
    "sector": "health-care"
  },
  "claims": {
    "@context": "org.hl7.fhir.api",
    "Consent.identifier": "{{consentIdentifier}}",
    "Consent.subject": "{{individualSubjectDid}}",
    "Consent.actor-identifier": "{{consentActorIdentifier}}",
    "Consent.actor-role": "ISCO-08|2211",
    "Consent.purpose": "TREAT",
    "Consent.action": "LOINC|48765-2",
    "Consent.decision": "permit"
  }
}
```

## Source Of Truth

These examples are exported from:

- `gdc-common-utils-ts/examples/lifecycle`

Other repositories should import and reuse them instead of copying payloads by hand:

- `gwtemplate-node-ts`
- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
