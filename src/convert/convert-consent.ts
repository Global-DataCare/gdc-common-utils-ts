// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ClaimConsent } from '../models/consent-rule';
import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, referenceToValue } from './convert-shared';

type Coding = { system?: string; code?: string; display?: string };
type Concept = { text?: string; coding?: Coding[] };
type Reference = { reference?: string };
type Period = { start?: string; end?: string };
type Attachment = { contentType?: string; data?: string };

const firstReference = (value: unknown): string | undefined =>
  referenceToValue((value as Reference[] | undefined)?.[0]);
const conceptFromClaim = (value?: string, display?: string): Concept[] | undefined => {
  const coding = codingFromValue(value)?.map((item) => ({ ...item, ...(display ? { display } : {}) }));
  return coding ? [{ coding }] : undefined;
};
const referencesFromClaim = (value?: string): Reference[] | undefined =>
  value ? value.split(',').filter(Boolean).map((reference) => ({ reference })) : undefined;
const codingsFromClaim = (value?: string): Array<{ system?: string; code: string }> | undefined => {
  const codings = value?.split(',').filter(Boolean).flatMap((token) => codingFromValue(token) || []);
  return codings?.length ? codings : undefined;
};
const codingsToClaim = (value?: Coding[]): string | undefined => {
  const tokens = (value || []).map((coding) => codingToValue(coding)).filter(Boolean);
  return tokens.length ? tokens.join(',') : undefined;
};
const conceptsToClaim = (value?: Concept[]): string | undefined => {
  const tokens = (value || []).flatMap((concept) => concept.coding || []).map((coding) => codingToValue(coding)).filter(Boolean);
  return tokens.length ? tokens.join(',') : undefined;
};
const conceptsFromClaim = (value?: string, display?: string): Concept[] | undefined =>
  codingsFromClaim(value)?.map((coding) => ({ coding: [{ ...coding, ...(display ? { display } : {}) }] }));
const conceptWithCodingsFromClaim = (value?: string): Concept | undefined => {
  const coding = codingsFromClaim(value);
  return coding ? { coding } : undefined;
};
const attachmentFromClaims = (claims: FlatClaims): Attachment | undefined =>
  claims[ClaimConsent.attachmentContentType] || claims[ClaimConsent.attachmentData]
    ? { contentType: claims[ClaimConsent.attachmentContentType], data: claims[ClaimConsent.attachmentData] }
    : undefined;
const periodFromClaims = (claims: FlatClaims, start: ClaimConsent, end: ClaimConsent): Period | undefined =>
  claims[start] || claims[end] ? { start: claims[start], end: claims[end] } : undefined;

/** Converts native FHIR R4 Consent into the canonical flat claims contract. */
export function consentFhirR4ToFlat(resource: FhirResource, context = 'org.hl7.fhir.api'): FlatClaims {
  const category = (resource.category as Concept[] | undefined)?.[0];
  const provision = resource.provision as {
    type?: string; period?: Period; actor?: Array<{ role?: Concept; reference?: Reference }>;
    action?: Concept[]; purpose?: Coding[]; securityLabel?: Coding[]; class?: Coding[];
    code?: Concept[]; dataPeriod?: Period;
  } | undefined;
  const attachment = resource.sourceAttachment as Attachment | undefined;
  const scope = resource.scope as Concept | undefined;
  const policyRule = resource.policyRule as Concept | undefined;
  return {
    '@context': context,
    [ClaimConsent.identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value || resource.id as string | undefined,
    [ClaimConsent.status]: resource.status as string | undefined,
    [ClaimConsent.subject]: referenceToValue(resource.patient as Reference | undefined),
    [ClaimConsent.patient]: referenceToValue(resource.patient as Reference | undefined),
    [ClaimConsent.date]: resource.dateTime as string | undefined,
    [ClaimConsent.decision]: provision?.type,
    [ClaimConsent.periodStart]: provision?.period?.start,
    [ClaimConsent.periodEnd]: provision?.period?.end,
    [ClaimConsent.dataPeriodStart]: provision?.dataPeriod?.start,
    [ClaimConsent.dataPeriodEnd]: provision?.dataPeriod?.end,
    [ClaimConsent.grantor]: firstReference(resource.performer),
    [ClaimConsent.grantee]: referenceToValue(provision?.actor?.[0]?.reference),
    [ClaimConsent.manager]: firstReference(resource.organization),
    [ClaimConsent.actorIdentifier]: referenceToValue(provision?.actor?.[0]?.reference),
    [ClaimConsent.actorRole]: codingsToClaim(provision?.actor?.[0]?.role?.coding),
    [ClaimConsent.action]: conceptsToClaim(provision?.action),
    [ClaimConsent.purpose]: codingsToClaim(provision?.purpose),
    [ClaimConsent.securityLabel]: codingsToClaim(provision?.securityLabel),
    [ClaimConsent.resourceType]: codingsToClaim(provision?.class),
    [ClaimConsent.provisionCode]: conceptsToClaim(provision?.code),
    [ClaimConsent.provisionCodeDisplay]: provision?.code?.[0]?.coding?.[0]?.display,
    [ClaimConsent.sourceReference]: referenceToValue(resource.sourceReference as Reference | undefined),
    [ClaimConsent.attachmentContentType]: attachment?.contentType,
    [ClaimConsent.attachmentData]: attachment?.data,
    [ClaimConsent.category]: codingToValue(category?.coding?.[0]),
    [ClaimConsent.categoryText]: category?.text,
    [ClaimConsent.categoryDisplay]: category?.coding?.[0]?.display,
    [ClaimConsent.scope]: codingToValue(scope?.coding?.[0]),
    [ClaimConsent.scopeDisplay]: scope?.coding?.[0]?.display,
    [ClaimConsent.policyRule]: codingToValue(policyRule?.coding?.[0]),
  };
}

/** Projects canonical Consent claims to native FHIR R4. ODRL stays in sourceAttachment. */
export function consentFlatToFhirR4(claims: FlatClaims): FhirResource {
  const actorRole = conceptWithCodingsFromClaim(claims[ClaimConsent.actorRole]);
  const actorReference = claims[ClaimConsent.grantee] || claims[ClaimConsent.actorIdentifier];
  const provisionCode = conceptsFromClaim(claims[ClaimConsent.provisionCode], claims[ClaimConsent.provisionCodeDisplay]);
  const attachment = attachmentFromClaims(claims);
  return {
    resourceType: ResourceTypesFhirR4.Consent,
    identifier: claims[ClaimConsent.identifier] ? [{ value: claims[ClaimConsent.identifier] }] : undefined,
    status: claims[ClaimConsent.status],
    scope: conceptFromClaim(claims[ClaimConsent.scope], claims[ClaimConsent.scopeDisplay])?.[0],
    category: conceptFromClaim(claims[ClaimConsent.category], claims[ClaimConsent.categoryDisplay]),
    patient: claims[ClaimConsent.subject] || claims[ClaimConsent.patient] ? { reference: claims[ClaimConsent.subject] || claims[ClaimConsent.patient] } : undefined,
    dateTime: claims[ClaimConsent.date],
    performer: referencesFromClaim(claims[ClaimConsent.grantor]),
    organization: referencesFromClaim(claims[ClaimConsent.manager]),
    sourceAttachment: attachment,
    sourceReference: claims[ClaimConsent.sourceReference] ? { reference: claims[ClaimConsent.sourceReference] } : undefined,
    policyRule: conceptFromClaim(claims[ClaimConsent.policyRule])?.[0],
    provision: {
      type: claims[ClaimConsent.decision],
      period: periodFromClaims(claims, ClaimConsent.periodStart, ClaimConsent.periodEnd),
      actor: actorReference ? [{ role: actorRole, reference: { reference: actorReference } }] : undefined,
      action: conceptsFromClaim(claims[ClaimConsent.action]),
      purpose: codingsFromClaim(claims[ClaimConsent.purpose]),
      securityLabel: codingsFromClaim(claims[ClaimConsent.securityLabel]),
      class: codingsFromClaim(claims[ClaimConsent.resourceType]),
      code: provisionCode,
      dataPeriod: periodFromClaims(claims, ClaimConsent.dataPeriodStart, ClaimConsent.dataPeriodEnd),
    },
  };
}

/** Converts native FHIR R5 Consent into the same version-neutral flat claims contract. */
export function consentFhirR5ToFlat(resource: FhirResource, context = 'org.hl7.fhir.api'): FlatClaims {
  const categories = resource.category as Concept[] | undefined;
  const scopeConcept = categories?.find((item) => item.coding?.[0]?.system?.includes('consentscope'));
  const categoryConcept = categories?.find((item) => item !== scopeConcept);
  const provision = (resource.provision as Array<{
    period?: Period; actor?: Array<{ role?: Concept; reference?: Reference }>; action?: Concept[];
    purpose?: Coding[]; securityLabel?: Coding[]; documentType?: Coding[]; resourceType?: Coding[];
    code?: Concept[]; dataPeriod?: Period;
  }> | undefined)?.[0];
  const attachment = (resource.sourceAttachment as Attachment[] | undefined)?.[0];
  return {
    '@context': context,
    [ClaimConsent.identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value || resource.id as string | undefined,
    [ClaimConsent.status]: resource.status as string | undefined,
    [ClaimConsent.subject]: referenceToValue(resource.subject as Reference | undefined),
    [ClaimConsent.date]: resource.date as string | undefined,
    [ClaimConsent.decision]: resource.decision as string | undefined,
    [ClaimConsent.periodStart]: (resource.period as Period | undefined)?.start,
    [ClaimConsent.periodEnd]: (resource.period as Period | undefined)?.end,
    [ClaimConsent.grantor]: firstReference(resource.grantor),
    [ClaimConsent.grantee]: firstReference(resource.grantee),
    [ClaimConsent.manager]: firstReference(resource.manager),
    [ClaimConsent.controller]: firstReference(resource.controller),
    [ClaimConsent.actorIdentifier]: referenceToValue(provision?.actor?.[0]?.reference) || firstReference(resource.grantee),
    [ClaimConsent.actorRole]: codingsToClaim(provision?.actor?.[0]?.role?.coding),
    [ClaimConsent.action]: conceptsToClaim(provision?.action),
    [ClaimConsent.purpose]: codingsToClaim(provision?.purpose),
    [ClaimConsent.securityLabel]: codingsToClaim(provision?.securityLabel),
    [ClaimConsent.documentType]: codingsToClaim(provision?.documentType),
    [ClaimConsent.resourceType]: codingsToClaim(provision?.resourceType),
    [ClaimConsent.provisionCode]: conceptsToClaim(provision?.code),
    [ClaimConsent.dataPeriodStart]: provision?.dataPeriod?.start,
    [ClaimConsent.dataPeriodEnd]: provision?.dataPeriod?.end,
    [ClaimConsent.attachmentContentType]: attachment?.contentType,
    [ClaimConsent.attachmentData]: attachment?.data,
    [ClaimConsent.sourceReference]: firstReference(resource.sourceReference),
    [ClaimConsent.scope]: codingToValue(scopeConcept?.coding?.[0]),
    [ClaimConsent.category]: codingToValue(categoryConcept?.coding?.[0] || categories?.[0]?.coding?.[0]),
  };
}

/** Projects canonical Consent claims to native FHIR R5. ODRL stays in sourceAttachment. */
export function consentFlatToFhirR5(claims: FlatClaims): FhirResource {
  const category = conceptFromClaim(claims[ClaimConsent.category], claims[ClaimConsent.categoryDisplay]);
  const scope = conceptFromClaim(claims[ClaimConsent.scope], claims[ClaimConsent.scopeDisplay]);
  const actorReference = claims[ClaimConsent.grantee] || claims[ClaimConsent.actorIdentifier];
  const attachment = attachmentFromClaims(claims);
  return {
    resourceType: ResourceTypesFhirR4.Consent,
    identifier: claims[ClaimConsent.identifier] ? [{ value: claims[ClaimConsent.identifier] }] : undefined,
    status: claims[ClaimConsent.status],
    category: [...(scope || []), ...(category || [])],
    subject: claims[ClaimConsent.subject] ? { reference: claims[ClaimConsent.subject] } : undefined,
    date: claims[ClaimConsent.date],
    period: periodFromClaims(claims, ClaimConsent.periodStart, ClaimConsent.periodEnd),
    grantor: referencesFromClaim(claims[ClaimConsent.grantor]),
    grantee: referencesFromClaim(claims[ClaimConsent.grantee] || claims[ClaimConsent.actorIdentifier]),
    manager: referencesFromClaim(claims[ClaimConsent.manager]),
    controller: referencesFromClaim(claims[ClaimConsent.controller]),
    sourceAttachment: attachment ? [attachment] : undefined,
    sourceReference: referencesFromClaim(claims[ClaimConsent.sourceReference]),
    decision: claims[ClaimConsent.decision],
    provision: [{
      actor: actorReference ? [{ role: conceptWithCodingsFromClaim(claims[ClaimConsent.actorRole]), reference: { reference: actorReference } }] : undefined,
      action: conceptsFromClaim(claims[ClaimConsent.action]),
      securityLabel: codingsFromClaim(claims[ClaimConsent.securityLabel]),
      purpose: codingsFromClaim(claims[ClaimConsent.purpose]),
      documentType: codingsFromClaim(claims[ClaimConsent.documentType]),
      resourceType: codingsFromClaim(claims[ClaimConsent.resourceType]),
      code: conceptsFromClaim(claims[ClaimConsent.provisionCode], claims[ClaimConsent.provisionCodeDisplay]),
      dataPeriod: periodFromClaims(claims, ClaimConsent.dataPeriodStart, ClaimConsent.dataPeriodEnd),
    }],
  };
}
