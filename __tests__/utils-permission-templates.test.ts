import { describe, expect, it } from '@jest/globals';

import { DataspaceSectors } from '../src/constants/sectors.js';
import { HealthcareActorRoles, HealthcareConsentPurposes } from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ConsentDecisions } from '../src/models/consent-rule.js';
import {
  buildConsentAtomicRuleId,
  detectDuplicateConsentRuleConflicts,
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

  it('detects duplicate atomic consent rules and calculates the shared least-privilege targets', () => {
    const entries = exportConsentEntries([
      {
        actorIdentifiers: ['doctor@example.com'],
        decision: ConsentDecisions.Permit,
        purposes: [HealthcareConsentPurposes.Treatment],
        roles: [HealthcareActorRoles.GeneralistMedicalPractitioner],
        targets: [
          { kind: 'section', code: 'LOINC|48765-2', scopes: ['r'] },
          { kind: 'section', code: 'LOINC|10160-0', scopes: ['r'] },
          { kind: 'resource-type', code: ResourceTypesFhirR4.Observation, scopes: ['r'] },
          { kind: 'resource-type', code: ResourceTypesFhirR4.DocumentReference, scopes: ['r'] },
        ],
      },
      {
        actorIdentifiers: ['doctor@example.com'],
        decision: ConsentDecisions.Permit,
        purposes: [HealthcareConsentPurposes.Treatment],
        roles: [HealthcareActorRoles.GeneralistMedicalPractitioner],
        targets: [
          { kind: 'section', code: 'LOINC|48765-2', scopes: ['r'] },
          { kind: 'resource-type', code: ResourceTypesFhirR4.Observation, scopes: ['r'] },
        ],
      },
    ], {
      subject: 'did:web:patient.example.com',
      fullUrl: 'urn:uuid:duplicate-consent',
    });

    const conflicts = detectDuplicateConsentRuleConflicts(entries);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].ruleId).toBe(buildConsentAtomicRuleId({
      subject: 'did:web:patient.example.com',
      decision: ConsentDecisions.Permit,
      actorIdentifier: 'doctor@example.com',
      purpose: HealthcareConsentPurposes.Treatment,
      role: HealthcareActorRoles.GeneralistMedicalPractitioner,
    }));
    expect(conflicts[0].effectiveTargets.sections).toEqual(['LOINC|48765-2']);
    expect(conflicts[0].effectiveTargets.resourceTypes).toEqual([ResourceTypesFhirR4.Observation]);
    expect(conflicts[0].hasPermissionReduction).toBe(true);
    expect(conflicts[0].affectedEntries[0].redundantTargets.sections).toEqual(['LOINC|10160-0']);
    expect(conflicts[0].affectedEntries[0].redundantTargets.resourceTypes).toEqual([ResourceTypesFhirR4.DocumentReference]);
  });

  it('derives duplicate groups per actor and purpose and ignores non-duplicated combinations', () => {
    const entries = exportConsentEntries([
      {
        actorIdentifiers: ['doctor@example.com', 'nurse@example.com'],
        decision: ConsentDecisions.Permit,
        purposes: [HealthcareConsentPurposes.Treatment],
        roles: [HealthcareActorRoles.GeneralistMedicalPractitioner],
        targets: [
          { kind: 'section', code: 'LOINC|48765-2', scopes: ['r'] },
        ],
      },
      {
        actorIdentifiers: ['doctor@example.com'],
        decision: ConsentDecisions.Permit,
        purposes: [HealthcareConsentPurposes.Treatment],
        roles: [HealthcareActorRoles.GeneralistMedicalPractitioner],
        targets: [
          { kind: 'section', code: 'LOINC|48765-2', scopes: ['r'] },
        ],
      },
      {
        actorIdentifiers: ['doctor@example.com'],
        decision: ConsentDecisions.Permit,
        purposes: [HealthcareConsentPurposes.Operations],
        roles: [HealthcareActorRoles.GeneralistMedicalPractitioner],
        targets: [
          { kind: 'section', code: 'LOINC|48765-2', scopes: ['r'] },
        ],
      },
    ], {
      subject: 'did:web:patient.example.com',
      fullUrl: 'urn:uuid:derived-consent',
    });

    const conflicts = detectDuplicateConsentRuleConflicts(entries);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].actorIdentifier).toBe('doctor@example.com');
    expect(conflicts[0].purpose).toBe(HealthcareConsentPurposes.Treatment);
    expect(conflicts[0].affectedEntries).toHaveLength(2);
  });
});
