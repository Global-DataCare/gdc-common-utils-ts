import { describe, expect, it } from '@jest/globals';

import { DataspaceSectors } from '../src/constants/sectors.js';
import { HealthcareActorRoles, HealthcareConsentPurposes } from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ConsentDecisions } from '../src/models/consent-rule.js';
import {
  exportConsentClaims,
  exportConsentEntries,
  importConsentClaims,
  importConsentEntry,
  importPermissionTemplate,
  PermissionTemplateOperationCodes,
  resolvePermissionTemplate,
} from '../src/utils/permission-templates.js';

describe('Permission template utilities', () => {
  it('resolves a sector-scoped template and round-trips it through consent claims', () => {
    const template = resolvePermissionTemplate({
      sector: DataspaceSectors.HealthCare,
      roleClaim: HealthcareActorRoles.GeneralistMedicalPractitioner,
    });

    expect(template?.id).toBe(`${DataspaceSectors.HealthCare}_isco-08_2211`);

    const draft = importPermissionTemplate(template as NonNullable<typeof template>, {
      actorIdentifiers: ['doctor@example.com', 'did:web:hospital.example.com'],
      purposes: [
        HealthcareConsentPurposes.Treatment,
        HealthcareConsentPurposes.Operations,
        HealthcareConsentPurposes.Treatment,
      ],
      roles: [
        HealthcareActorRoles.GeneralistMedicalPractitioner,
        HealthcareActorRoles.GeneralistMedicalPractitioner,
      ],
    });

    const claims = exportConsentClaims(draft, {
      identifier: 'urn:uuid:test-consent',
      subject: 'did:web:patient.example.com',
    });
    const imported = importConsentClaims(claims);

    expect(imported.decision).toBe(ConsentDecisions.Permit);
    expect(imported.actorIdentifiers).toEqual([
      'doctor@example.com',
      'did:web:hospital.example.com',
    ]);
    expect(imported.purposes).toEqual([
      HealthcareConsentPurposes.Treatment,
      HealthcareConsentPurposes.Operations,
    ]);
    expect(imported.roles).toEqual([HealthcareActorRoles.GeneralistMedicalPractitioner]);
    expect(imported.targets).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: ResourceTypesFhirR4.DocumentReference,
        kind: 'resource-type',
      }),
    ]));
  });

  it('exports multiple decisions as consent entries and imports them back', () => {
    const template = resolvePermissionTemplate({
      sector: DataspaceSectors.AnimalCare,
      roleClaim: HealthcareActorRoles.Veterinarian,
    });

    const entries = exportConsentEntries([
      importPermissionTemplate(template as NonNullable<typeof template>, {
        actorIdentifiers: ['vet@example.com'],
      }),
      importPermissionTemplate(template as NonNullable<typeof template>, {
        actorIdentifiers: ['vet-2@example.com'],
        decision: ConsentDecisions.Deny,
      }),
    ], {
      fullUrl: 'urn:uuid:consent-template',
    });

    expect(entries).toHaveLength(2);
    expect(entries[0].fullUrl).toBe('urn:uuid:consent-template-1');
    expect(importConsentEntry(entries[1]).decision).toBe(ConsentDecisions.Deny);
  });

  it('rejects search-only targets when exporting to the current claim contract', () => {
    const template = resolvePermissionTemplate({
      sector: DataspaceSectors.HealthCare,
      roleClaim: HealthcareActorRoles.Controller,
    });
    const draft = importPermissionTemplate(template as NonNullable<typeof template>);

    expect(() => exportConsentClaims(draft)).toThrow(/read-oriented targets/);
    expect(draft.targets[0].scopes).toEqual([PermissionTemplateOperationCodes.Search]);
  });
});
