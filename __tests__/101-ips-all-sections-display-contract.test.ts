/**
 * Teaching goal:
 * - exercise the real 16-section IPS fixture
 * - cover every resource type declared by HealthcareIpsSectionResourceProfiles
 * - prove local text, international display and terminology translation order
 * - never render a system|code token as the clinical name
 */
import fs from 'fs';
import path from 'path';
import {
  HealthcareIpsSectionResourceProfiles,
  HealthcareIpsSharedResourceTypes,
} from '../src/constants/healthcare.js';
import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import {
  toClinicalResourceCardView,
  toClinicalSectionViews,
  type ClinicalResourceLike,
} from '../src/utils/clinical-resource-view.js';

const IPS_BUNDLE_PATH = path.resolve(process.cwd(), 'fixtures', 'fhir-ips-bundle-all-sections.json');
const SYSTEM = 'http://snomed.info/sct';
const CODE = '123456';

function concept(resourceType: string) {
  return {
    text: `Texto local ${resourceType}`,
    coding: [{ system: SYSTEM, code: CODE, display: `International ${resourceType}` }],
  };
}

function resourceFor(resourceType: string): ClinicalResourceLike {
  const common = { resourceType, id: `fixture-${resourceType}`, language: 'es' };
  const coded = concept(resourceType);
  switch (resourceType) {
    case ResourceTypesFhirR4.MedicationStatement:
    case ResourceTypesFhirR4.MedicationRequest:
      return { ...common, medicationCodeableConcept: coded };
    case ResourceTypesFhirR4.Medication:
      return { ...common, code: coded };
    case ResourceTypesFhirR4.Immunization:
      return { ...common, vaccineCode: coded };
    case ResourceTypesFhirR4.Specimen:
    case ResourceTypesFhirR4.Device:
    case ResourceTypesFhirR4.DocumentReference:
      return { ...common, type: coded };
    case ResourceTypesFhirR4.ImagingStudy:
      return { ...common, procedureCode: [coded] };
    case ResourceTypesFhirR4.DeviceUseStatement:
      return { ...common, device: { display: `International ${resourceType}` } };
    case ResourceTypesFhirR4.ClinicalImpression:
      return { ...common, summary: `Texto local ${resourceType}` };
    case ResourceTypesFhirR4.ImmunizationRecommendation:
      return { ...common, recommendation: [{ vaccineCode: [coded] }] };
    case ResourceTypesFhirR4.Consent:
    case ResourceTypesFhirR4.CarePlan:
      return { ...common, category: [coded] };
    case ResourceTypesFhirR4.Organization:
      return { ...common, name: `International ${resourceType}` };
    case ResourceTypesFhirR4.Practitioner:
      return { ...common, name: [{ given: ['Ada'], family: 'Lovelace' }] };
    case ResourceTypesFhirR4.PractitionerRole:
      return { ...common, code: [coded] };
    default:
      return { ...common, code: coded };
  }
}

describe('101: all IPS sections and declared resource types are display-ready', () => {
  it('renders all 16 sections and every referenced resource in the real IPS fixture', () => {
    // Step 1. Reuse the complete real-world Bundle fixture.
    const bundle = JSON.parse(fs.readFileSync(IPS_BUNDLE_PATH, 'utf8'));

    // Step 2. Resolve section references through the shared reader.
    const sections = toClinicalSectionViews(bundle);
    expect(sections).toHaveLength(16);

    // Step 3. Every populated section yields human-readable cards.
    for (const section of sections) {
      expect(section.unresolvedReferences).toEqual([]);
      for (const card of section.resources) {
        expect(card.title).toBeTruthy();
        expect(card.title).not.toMatch(/^https?:\/\/[^|]+\|/);
      }
    }
  });

  it.each([
    ...new Set([
      ...Object.values(HealthcareIpsSectionResourceProfiles)
        .flatMap((profile) => [...profile.expectedResourceTypes]),
      ...HealthcareIpsSharedResourceTypes,
    ]),
  ])('resolves local, English and translated labels for %s', (resourceType) => {
    const resource = resourceFor(resourceType);
    const entry = { resource };

    const local = toClinicalResourceCardView(entry, { locale: 'es' });
    const english = toClinicalResourceCardView(entry, { locale: 'en' });
    const translated = toClinicalResourceCardView(entry, {
      locale: 'fr',
      translateCode: ({ token }) => token === `${SYSTEM}|${CODE}`
        ? `Traduit ${resourceType}`
        : undefined,
    });

    expect(local.title).toBeTruthy();
    expect(english.title).toBeTruthy();
    expect(translated.title).toBeTruthy();
    expect(local.title).not.toBe(`${SYSTEM}|${CODE}`);
    expect(english.title).not.toBe(`${SYSTEM}|${CODE}`);
    expect(translated.title).not.toBe(`${SYSTEM}|${CODE}`);

    const hasTranslatableConcept = ![
      ResourceTypesFhirR4.DeviceUseStatement,
      ResourceTypesFhirR4.ClinicalImpression,
      ResourceTypesFhirR4.Organization,
      ResourceTypesFhirR4.Practitioner,
    ].includes(resourceType as any);
    if (hasTranslatableConcept) {
      expect(local.title).toBe(`Texto local ${resourceType}`);
      expect(english.title).toBe(`International ${resourceType}`);
      expect(translated.title).toBe(`Traduit ${resourceType}`);
    }
  });
});
