// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import type { ClaimSpec } from './types';

/** Canonical claims used to preserve the primary coded PractitionerRole label. */
export const PractitionerRoleClaim = {
  Identifier: 'PractitionerRole.identifier',
  Active: 'PractitionerRole.active',
  Practitioner: 'PractitionerRole.practitioner',
  Organization: 'PractitionerRole.organization',
  Location: 'PractitionerRole.location',
  Service: 'PractitionerRole.service',
  Specialty: 'PractitionerRole.specialty',
  PeriodStart: 'PractitionerRole.period-start',
  PeriodEnd: 'PractitionerRole.period-end',
  Code: 'PractitionerRole.code',
  CodeText: 'PractitionerRole.code-text',
  CodeDisplay: 'PractitionerRole.code-display',
} as const;

export type PractitionerRoleClaimKey =
  typeof PractitionerRoleClaim[keyof typeof PractitionerRoleClaim];

export const PractitionerRoleClaimSpecs: ClaimSpec[] = [
  {
    key: PractitionerRoleClaim.Code,
    meaning: 'Primary practitioner role code token.',
    example: 'http://snomed.info/sct|158965000',
  },
  {
    key: PractitionerRoleClaim.CodeText,
    meaning: 'Local-language practitioner role label.',
    example: 'Médico',
  },
  {
    key: PractitionerRoleClaim.CodeDisplay,
    meaning: 'Canonical/international practitioner role display.',
    example: 'Doctor',
  },
];
