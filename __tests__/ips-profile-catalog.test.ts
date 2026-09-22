// Flow contract: load the complete IPS 2.0.1 server surface -> resolve every declared profile -> expose every profile field with its FHIR types, cardinality, obligations and terminology bindings for creation and card presentation.

import {
  IPS_FHIR_R4_VERSION,
  IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE,
  IPS_PROFILE_CATALOG,
  IPS_RESOURCE_CAPABILITIES,
  IPS_VALUE_SET_CATALOG,
  IPS_VERSION,
} from '../src/models/interoperable-claims/ips-profile-catalog';
import type { IpsProfileElement } from '../src/models/interoperable-claims/ips-profile-types';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

describe('FHIR IPS profile catalog', () => {
  it('defines every resource type declared by the IPS server CapabilityStatement', () => {
    expect(IPS_VERSION).toBe('2.0.1');
    expect(IPS_FHIR_R4_VERSION).toBe('4.0.1');
    expect(IPS_RESOURCE_CAPABILITIES.map(({ resourceType }) => resourceType)).toEqual(
      Object.keys(IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE),
    );
  });

  it('keeps generated contracts split by resource and deduplicated ValueSet', () => {
    const generated = resolve(
      __dirname,
      '../src/models/interoperable-claims/ips-profile-catalog.generated',
    );
    expect(existsSync(`${generated}.ts`)).toBe(false);
    expect(readdirSync(`${generated}/resources`).filter((name) => name.endsWith('.ts'))).toHaveLength(28);
    expect(
      readdirSync(`${generated}/value-sets`).filter((name) => name.endsWith('.generated.ts')).length,
    ).toBeGreaterThan(100);
    const generatedFiles = [
      ...readdirSync(`${generated}/resources`).map((name) => `${generated}/resources/${name}`),
      ...readdirSync(`${generated}/value-sets`)
        .filter((name) => name.endsWith('.ts'))
        .map((name) => `${generated}/value-sets/${name}`),
    ];
    expect(
      Math.max(
        ...generatedFiles.map(
          (path) => readFileSync(path, 'utf8').split('\n').length,
        ),
      ),
    ).toBeLessThan(8_000);
  });

  it('resolves every IPS-supported profile, including all Observation profiles', () => {
    for (const capability of IPS_RESOURCE_CAPABILITIES) {
      expect(capability.profiles.length).toBeGreaterThan(0);
      for (const profileUrl of capability.profiles) {
        const profile = IPS_PROFILE_CATALOG[profileUrl];
        expect(profile).toBeDefined();
        expect(profile.resourceType).toBe(capability.resourceType);
        expect(profile.elements.length).toBeGreaterThan(0);
      }
    }

    const observations = IPS_RESOURCE_CAPABILITIES.find(
      ({ resourceType }) => resourceType === 'Observation',
    );
    expect(observations?.supportedProfiles).toHaveLength(16);
  });

  it('retains every supported field type, cardinality, obligation and ValueSet binding needed by creators and cards', () => {
    const allergyProfile =
      IPS_PROFILE_CATALOG[
        'http://hl7.org/fhir/uv/ips/StructureDefinition/AllergyIntolerance-uv-ips|2.0.1'
      ];
    const code = allergyProfile.elements.find(
      ({ path }) => path === 'AllergyIntolerance.code',
    );

    expect(code).toMatchObject({
      min: 1,
      max: '1',
      mustSupport: true,
      fhirTypes: ['CodeableConcept'],
      binding: {
        strength: 'preferred',
        valueSet:
          'http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips|2.0.1',
      },
    });
    expect(code?.creatorObligations).toContain('SHALL:populate-if-known');
    expect(code?.consumerObligations).toEqual(
      expect.arrayContaining(['SHALL:handle', 'SHOULD:display']),
    );

    const composition =
      IPS_PROFILE_CATALOG[
        'http://hl7.org/fhir/uv/ips/StructureDefinition/Composition-uv-ips|2.0.1'
      ];
    const alertsSectionCode = (composition.elements as readonly IpsProfileElement[]).find(
      ({ id }) => id === 'Composition.section:sectionAlerts.code',
    );
    expect(alertsSectionCode?.fixedValue).toBeUndefined();
    expect(alertsSectionCode?.patternValue).toEqual({
      fhirType: 'CodeableConcept',
      value: {
        coding: [{ system: 'http://loinc.org', code: '104605-1' }],
      },
    });

    for (const profile of Object.values(IPS_PROFILE_CATALOG)) {
      for (const element of profile.elements) {
        expect(element.id).toBeTruthy();
        expect(element.path).toBeTruthy();
        expect(element.min).toBeGreaterThanOrEqual(0);
        expect(element.max).toBeTruthy();
        expect(element.fhirTypes).toBeDefined();
      }
    }
  });

  it('deduplicates ValueSet definitions and records every resource-field usage', () => {
    const allergyValueSet =
      IPS_VALUE_SET_CATALOG[
        'http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips|2.0.1'
      ];

    expect(allergyValueSet).toMatchObject({
      canonicalUrl:
        'http://hl7.org/fhir/uv/ips/ValueSet/allergies-intolerances-uv-ips',
      resolved: true,
      version: '2.0.1',
    });
    expect(allergyValueSet.usages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          resourceType: 'AllergyIntolerance',
          elementId: 'AllergyIntolerance.code',
          purpose: 'primary',
          strength: 'preferred',
        }),
      ]),
    );
  });

  it('defines the canonical FHIR search parameters and types per IPS resource', () => {
    for (const capability of IPS_RESOURCE_CAPABILITIES) {
      expect(capability.searchParameters.length).toBeGreaterThan(0);
      for (const searchParameter of capability.searchParameters) {
        expect(searchParameter.code).toBeTruthy();
        expect(searchParameter.type).toMatch(
          /^(number|date|string|token|reference|composite|quantity|uri|special)$/,
        );
        expect(searchParameter.url).toMatch(/^http:\/\/hl7\.org\/fhir\/SearchParameter\//);
      }
      expect(IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE[capability.resourceType]).toEqual(
        capability.searchParameters.map(
          ({ code }) => `${capability.resourceType}.${code}`,
        ),
      );
    }
    expect(IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE.Flag).toEqual(
      expect.arrayContaining(['Flag.category', 'Flag.status']),
    );
  });
});
