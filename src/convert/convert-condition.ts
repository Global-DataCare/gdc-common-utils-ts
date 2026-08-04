// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/convert-condition.ts

import { ConditionClaim } from '../models/interoperable-claims/condition-claims';
import type { FhirResource, FlatClaims } from './convert-shared';
import { codingFromValue, codingToValue, requireClaim } from './convert-shared';

export function conditionFlatToFhirR4(claims: FlatClaims): FhirResource {
  const subject = requireClaim(claims, ConditionClaim.Subject);
  return {
    resourceType: 'Condition',
    identifier: claims[ConditionClaim.Identifier] ? [{ value: claims[ConditionClaim.Identifier] }] : undefined,
    subject: { reference: subject },
    code: claims[ConditionClaim.Code]
      ? {
        coding: codingFromValue(claims[ConditionClaim.Code])?.map((coding) => ({
          ...coding,
          ...(claims[ConditionClaim.CodeDisplay]
            ? { display: claims[ConditionClaim.CodeDisplay] }
            : {}),
        })),
        ...(claims[ConditionClaim.CodeText]
          ? { text: claims[ConditionClaim.CodeText] }
          : {}),
      }
      : undefined,
    clinicalStatus: claims[ConditionClaim.ClinicalStatus] ? { coding: [{ code: claims[ConditionClaim.ClinicalStatus] }] } : undefined,
    verificationStatus: claims[ConditionClaim.VerificationStatus] ? { coding: [{ code: claims[ConditionClaim.VerificationStatus] }] } : undefined,
    category: claims[ConditionClaim.Category] ? [{ coding: codingFromValue(claims[ConditionClaim.Category]) }] : undefined,
    severity: claims[ConditionClaim.Severity] ? { coding: codingFromValue(claims[ConditionClaim.Severity]) } : undefined,
    onsetDateTime: claims[ConditionClaim.OnsetDateTime],
    recorder: claims[ConditionClaim.Recorder] ? { reference: claims[ConditionClaim.Recorder] } : undefined,
  };
}

export function conditionFhirR4ToFlat(resource: FhirResource): FlatClaims {
  const code = resource.code as { text?: string; coding?: Array<{ system?: string; code?: string; display?: string }> } | undefined;
  return {
    [ConditionClaim.Identifier]: (resource.identifier as Array<{ value?: string }> | undefined)?.[0]?.value,
    [ConditionClaim.Subject]: (resource.subject as { reference?: string } | undefined)?.reference,
    [ConditionClaim.Code]: codingToValue(code?.coding?.[0]) || code?.text,
    [ConditionClaim.CodeText]: code?.text,
    [ConditionClaim.CodeDisplay]: code?.coding?.[0]?.display,
    [ConditionClaim.ClinicalStatus]: (resource.clinicalStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [ConditionClaim.VerificationStatus]: (resource.verificationStatus as { coding?: Array<{ code?: string }> } | undefined)?.coding?.[0]?.code,
    [ConditionClaim.Category]: codingToValue((resource.category as Array<{ coding?: Array<{ system?: string; code?: string }> }> | undefined)?.[0]?.coding?.[0]),
    [ConditionClaim.Severity]: codingToValue((resource.severity as { coding?: Array<{ system?: string; code?: string }> } | undefined)?.coding?.[0]),
    [ConditionClaim.OnsetDateTime]: resource.onsetDateTime as string | undefined,
    [ConditionClaim.Recorder]: (resource.recorder as { reference?: string } | undefined)?.reference,
  };
}
