# Consent Access Matrix Task

Purpose: define the next cross-repository task after bootstrap alignment.

## Implementation Status

Implemented in the current repository thread:

- shared consent-access models and helpers in `gdc-common-utils-ts`
- shared consent-access SDK surface in `gdc-sdk-core-ts`
- package re-export availability through `gdc-sdk-node-ts` and `gdc-sdk-front-ts`
- live GW SMART evaluation update in `gwtemplate-node-ts`
- controller-side `Communication` recovery by `Communication.identifier`, `thid`, and linked `DocumentReference.contenthash`

Current implemented evaluation model:

1. read all active consent rules for the subject
2. normalize actor matching candidates as actor-specific, organization, jurisdiction, and phone-extension targets
3. evaluate per requested section and optional resource type
4. apply precedence:
   - explicit deny for a concrete email
   - explicit permit for a concrete email
   - organization decision
   - jurisdiction decision
   - default deny
5. expose grouped active-consent views and deterministic missing-permission explanations for SDK/controller use

This document covers the missing authorization layer shared by:

- `gdc-common-utils-ts`
- `gdc-sdk-core-ts`
- `gdc-sdk-node-ts`
- `gdc-sdk-front-ts`
- `gwtemplate-node-ts`

It is intentionally about consent evaluation and access requests, not about `_activate`, DCR, or DID publication bootstrap.

## Scope

The system must evaluate access against the full set of active consent rules for a subject, not against a single consent in isolation.

The same active-rule view must be available to:

- GW CORE when deciding whether a SMART token request is allowed
- the subject controller when inspecting who currently has access
- SDK clients when deciding whether to request more permissions

## Canonical Question

Given:

- subject
- actor target
- actor role
- purpose
- requested sections
- requested FHIR resource types
- current active consent rules

determine:

- allowed
- denied
- partially allowed / missing coverage
- explicitly denied even if broader allow rules exist

## Actor Target Kinds

The consent/access model must support these target kinds:

1. direct professional identifier
- email
- `did:web`
- telephone where the sector/runtime explicitly supports it

2. organization-level target
- `did:web`
- explicit organization URL/domain
- email-derived domain as a fallback-only normalization path

3. jurisdiction-level target
- country or jurisdiction code such as `ES`

4. related person target
- direct identifier such as email / `did:web` / phone

## Active Consent Aggregation

GW CORE must read all active consents for the subject and evaluate them together.

That same aggregated view must be available to the subject controller.

Minimum grouped views:

- by professional email
- by organization
- by jurisdiction
- by related person
- by telephone where the sector/runtime supports it

## Allow / Deny Precedence

The model must support both positive grants and explicit exclusions.

Recommended precedence:

1. explicit deny for a concrete email
2. explicit permit for a concrete email
3. permit for organization target
4. permit for jurisdiction target
5. otherwise deny

This precedence must be evaluated per:

- section
- resource type
- purpose
- role

Example:

- a physician organization may be broadly allowed for treatment
- a concrete physician email may still be explicitly denied for `Results`
- a related person may be denied entirely even if a broader family/org rule exists

## Individual Owner vs Legal Representative

These must stay separate:

- individual/family bootstrap and controller views use `Organization.owner.*`
- legal organization activation uses `Person` representative/member semantics plus VC `memberOf` / `hasOccupation`

This document is about consent/access evaluation after bootstrap, but the semantic split must remain explicit in examples and SDK APIs.

## SDK Gaps To Cover

### `gdc-common-utils-ts`

Add shared models/helpers/examples for:

- consent target normalization
- consent target matching
- effective access evaluation
- missing-permission explanation
- allow/deny precedence
- active consent grouped view

Suggested models:

- `ConsentTarget`
- `ConsentRuleDecision`
- `EffectiveAccessEvaluation`
- `MissingPermissionSet`
- `ActiveConsentView`

Suggested helpers:

- `normalizeConsentTarget(...)`
- `matchConsentTarget(...)`
- `evaluateConsentCoverage(...)`
- `groupActiveConsentsByTarget(...)`

### `gdc-sdk-core-ts`

Add runtime-neutral interfaces for:

- `getActiveConsentsForSubject(...)`
- `evaluateRequestedAccess(...)`
- `getMissingPermissions(...)`
- `groupConsentsForControllerView(...)`

### `gdc-sdk-node-ts` / `gdc-sdk-front-ts`

Add runtime-facing helpers/facades for:

- effective permissions for a professional/related person
- missing permissions for a requested SMART scope
- creation of a permission-request `Communication`
- retrieval of that `Communication` by stable identifier

## Permission Request Communication

When access is missing, the SDK should be able to build a `Communication` request for the subject controller.

That `Communication` should include:

- requester target
- requester role
- purpose
- missing sections
- missing resource types
- justification / note

Retrieval identifiers should support:

- `Communication.identifier`
- `thid`
- `DocumentReference.contenthash` as `z<base58>` CID when an attached request document exists

Delivery channels such as push notification, email, or SMS are extension concerns around this canonical `Communication`.

## Minimum Example Matrix

Start with these reusable examples:

- physician by email and role for continuous care
- physician by email and role for emergencies
- physician by organization and role for continuous care
- physician by jurisdiction and role for emergency care
- nursing professional by organization
- paramedic by jurisdiction
- explicit deny for a concrete physician even when a broader rule exists
- revoked consent where no email/org/jurisdiction allow rule remains active

## Minimum GW CORE Tests

GW CORE should prove:

- active rules are aggregated across the subject vault
- explicit deny overrides broader allow
- email/org/jurisdiction targeting all work
- related-person targeting works
- missing scope coverage returns deterministic denial
- permission-request communication can be correlated by stable identifier

## Current Live Finding

The current live SDK Node E2E already reaches:

- host activation
- employee creation
- individual bootstrap
- individual order
- consent creation

The remaining failure is in SMART scope evaluation:

- `No matching consent rule found for requested scope.`

So the next repository thread should focus on this document's matrix and not revisit bootstrap.
