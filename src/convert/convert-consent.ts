// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ClaimConsent } from '../models/consent-rule';
import type { FhirResource, FlatClaims } from './convert-shared';
import {
  codingFromValue,
  codingToValue,
  referenceToValue,
} from './convert-shared';

export function consentFhirR4ToFlat(
  resource: FhirResource,
  context: string = 'org.hl7.fhir.api',
): FlatClaims {
  const concept = (resource.category as Array<{
    text?: string;
    coding?: Array<{ system?: string; code?: string; display?: string }>;
  }> | undefined)?.[0];
  const provision = resource.provision as {
    type?: string;
    period?: { start?: string; end?: string };
    action?: Array<{ coding?: Array<{ system?: string; code?: string }> }>;
    purpose?: Array<{ system?: string; code?: string }>;
  } | undefined;
  return {
    '@context': context,
    [ClaimConsent.identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value
      || resource.id as string | undefined,
    [ClaimConsent.status]: resource.status as string | undefined,
    [ClaimConsent.subject]: referenceToValue(resource.patient as { reference?: string } | undefined),
    [ClaimConsent.patient]: referenceToValue(resource.patient as { reference?: string } | undefined),
    [ClaimConsent.date]: resource.dateTime as string | undefined,
    [ClaimConsent.decision]: provision?.type,
    [ClaimConsent.action]: codingToValue(provision?.action?.[0]?.coding?.[0]),
    [ClaimConsent.periodStart]: provision?.period?.start,
    [ClaimConsent.periodEnd]: provision?.period?.end,
    [ClaimConsent.purpose]: codingToValue(provision?.purpose?.[0]),
    [ClaimConsent.sourceReference]: referenceToValue(resource.sourceReference as { reference?: string } | undefined),
    [ClaimConsent.category]: codingToValue(concept?.coding?.[0]),
    [ClaimConsent.categoryText]: concept?.text,
    [ClaimConsent.categoryDisplay]: concept?.coding?.[0]?.display,
  };
}

export function consentFlatToFhirR4(claims: FlatClaims): FhirResource {
  const coding = codingFromValue(claims[ClaimConsent.category])?.map((item) => ({
    ...item,
    ...(claims[ClaimConsent.categoryDisplay]
      ? { display: claims[ClaimConsent.categoryDisplay] }
      : {}),
  }));
  const actionCoding = codingFromValue(claims[ClaimConsent.action]);
  const purposeCoding = codingFromValue(claims[ClaimConsent.purpose]);
  return {
    resourceType: 'Consent',
    identifier: claims[ClaimConsent.identifier] ? [{ value: claims[ClaimConsent.identifier] }] : undefined,
    status: claims[ClaimConsent.status],
    patient: claims[ClaimConsent.subject] || claims[ClaimConsent.patient]
      ? { reference: claims[ClaimConsent.subject] || claims[ClaimConsent.patient] }
      : undefined,
    dateTime: claims[ClaimConsent.date],
    sourceReference: claims[ClaimConsent.sourceReference]
      ? { reference: claims[ClaimConsent.sourceReference] }
      : undefined,
    category: coding || claims[ClaimConsent.categoryText] ? [{
      ...(coding ? { coding } : {}),
      ...(claims[ClaimConsent.categoryText] ? { text: claims[ClaimConsent.categoryText] } : {}),
    }] : undefined,
    provision: claims[ClaimConsent.decision]
      || claims[ClaimConsent.periodStart]
      || claims[ClaimConsent.periodEnd]
      || actionCoding
      || purposeCoding
      ? {
        type: claims[ClaimConsent.decision],
        period: claims[ClaimConsent.periodStart] || claims[ClaimConsent.periodEnd]
          ? { start: claims[ClaimConsent.periodStart], end: claims[ClaimConsent.periodEnd] }
          : undefined,
        action: actionCoding ? [{ coding: actionCoding }] : undefined,
        purpose: purposeCoding,
      }
      : undefined,
  };
}
