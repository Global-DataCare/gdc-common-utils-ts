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
import { ClaimConsent } from '../src/models/consent-rule.js';
import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims.js';
import { CarePlanClaim } from '../src/models/interoperable-claims/care-plan-claims.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { DeviceClaim } from '../src/models/interoperable-claims/device-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { FlagClaim } from '../src/models/interoperable-claims/flag-claims.js';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import { PractitionerRoleClaim } from '../src/models/interoperable-claims/practitioner-role-claims.js';
import { ProcedureClaim } from '../src/models/interoperable-claims/procedure-claims.js';
import {
  convertFhirResourceToClaims,
} from '../src/utils/clinical-resource-converters.js';
import {
  convertClaimsToFhirResource,
  prepareBundleDocumentForSubject,
} from '../src/utils/bundle-document-builder.js';
import {
  toClinicalResourceCardView,
  toClinicalSectionViews,
  type ClinicalResourceLike,
} from '../src/utils/clinical-resource-view.js';

const IPS_BUNDLE_PATH = path.resolve(process.cwd(), 'fixtures', 'fhir-ips-bundle-all-sections.json');
const SYSTEM = 'http://snomed.info/sct';
const CODE = '123456';
const SUBJECT = 'did:web:example.test:individual:ips-reader';

const PRIMARY_CODE_CLAIM_BY_RESOURCE_TYPE: Readonly<Record<string, string>> = {
  [ResourceTypesFhirR4.AllergyIntolerance]: AllergyIntoleranceClaim.Code,
  [ResourceTypesFhirR4.Condition]: ConditionClaim.Code,
  [ResourceTypesFhirR4.MedicationStatement]: MedicationStatementClaim.Code,
  [ResourceTypesFhirR4.Immunization]: ImmunizationClaim.VaccineCode,
  [ResourceTypesFhirR4.Observation]: ObservationClaim.Code,
  [ResourceTypesFhirR4.Flag]: FlagClaim.Code,
  [ResourceTypesFhirR4.Procedure]: ProcedureClaim.Code,
  [ResourceTypesFhirR4.Device]: DeviceClaim.Type,
  [ResourceTypesFhirR4.DocumentReference]: DocumentReferenceClaim.Type,
  [ResourceTypesFhirR4.Consent]: ClaimConsent.category,
  [ResourceTypesFhirR4.PractitionerRole]: PractitionerRoleClaim.Code,
};

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

function primaryConcept(resource: Record<string, any>): Record<string, any> | undefined {
  switch (resource.resourceType) {
    case ResourceTypesFhirR4.MedicationStatement:
      return resource.medicationCodeableConcept;
    case ResourceTypesFhirR4.Immunization:
      return resource.vaccineCode;
    case ResourceTypesFhirR4.Device:
    case ResourceTypesFhirR4.DocumentReference:
      return resource.type;
    case ResourceTypesFhirR4.Consent:
      return resource.category?.[0];
    case ResourceTypesFhirR4.PractitionerRole:
      return resource.code?.[0];
    default:
      return resource.code;
  }
}

function firstConceptToken(concept: Record<string, any> | undefined): string | undefined {
  const coding = concept?.coding?.find((item: Record<string, any>) => item?.code);
  if (!coding?.code) return undefined;
  return coding.system ? `${coding.system}|${coding.code}` : coding.code;
}

describe('101: all IPS sections and declared resource types are display-ready', () => {
  it('roundtrips every resource referenced by all 16 IPS sections through canonical API claims', () => {
    // Step 1. Normalize the real IPS fixture exactly as the ingestion boundary does.
    const imported = JSON.parse(fs.readFileSync(IPS_BUNDLE_PATH, 'utf8')) as Record<string, any>;
    const prepared = prepareBundleDocumentForSubject(imported, SUBJECT) as Record<string, any>;
    const entries = Array.isArray(prepared.entry) ? prepared.entry : [];
    const composition = entries.find((entry: Record<string, any>) =>
      entry.resource?.resourceType === ResourceTypesFhirR4.Composition)?.resource;
    const resourcesByReference = new Map<string, Record<string, any>>();
    for (const entry of entries) {
      const resource = entry.resource as Record<string, any> | undefined;
      if (!resource?.resourceType || !resource?.id) continue;
      resourcesByReference.set(`${resource.resourceType}/${resource.id}`, resource);
    }

    // Step 2. Resolve every Composition.section.entry instead of inferring
    // section membership from resourceType.
    const referencedResources: Record<string, any>[] = [];
    const visitSections = (sections: unknown): void => {
      for (const section of Array.isArray(sections) ? sections : []) {
        for (const item of Array.isArray(section?.entry) ? section.entry : []) {
          const resource = resourcesByReference.get(String(item?.reference || ''));
          expect(resource).toBeDefined();
          referencedResources.push(resource!);
        }
        visitSections(section?.section);
      }
    };
    visitSections(composition?.section);
    expect(referencedResources.length).toBeGreaterThan(0);

    // Step 3. Every section resource must carry short FHIR API claims only,
    // rebuild its native FHIR fields, and produce the same claims again.
    for (const resource of referencedResources) {
      const claims = resource.meta?.claims as Record<string, unknown>;
      expect({
        resourceType: resource.resourceType,
        context: claims?.['@context'],
      }).toEqual({
        resourceType: resource.resourceType,
        context: 'org.hl7.fhir.api',
      });
      for (const key of Object.keys(claims || {}).filter((key) => !key.startsWith('@'))) {
        expect(key).toMatch(/^[A-Z][A-Za-z0-9]+\.[a-z0-9]+(?:-[a-z0-9]+)*$/);
      }

      const rebuilt = convertClaimsToFhirResource(claims) as Record<string, any>;
      const roundtripClaims = convertFhirResourceToClaims(
        rebuilt as Parameters<typeof convertFhirResourceToClaims>[0],
      );
      const comparable = (record: Record<string, unknown>) => Object.fromEntries(
        Object.entries(record).filter(([key, value]) =>
          key !== '@context'
          && key !== 'Composition.section'
          && value !== undefined),
      );
      expect(comparable(roundtripClaims)).toEqual(comparable(claims));

      const card = toClinicalResourceCardView({ resource: { ...rebuilt, meta: { claims } } });
      expect(card.resourceType).toBe(resource.resourceType);
      expect(card.title).toBeTruthy();
      const visibleClaims = Object.fromEntries(Object.entries(claims).filter(([key, value]) =>
        key !== '@context' && value !== undefined));
      expect(Object.fromEntries(card.fields.map((field) => [field.claim, field.value])))
        .toEqual(visibleClaims);
    }
  });

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

  it('roundtrips and translates every coded resource in the real IPS fixture from its specific canonical claim', () => {
    // Step 1. Import the real all-sections IPS and generate the same canonical
    // claims that the authenticated backend sends to persistence.
    const imported = JSON.parse(fs.readFileSync(IPS_BUNDLE_PATH, 'utf8'));
    const prepared = prepareBundleDocumentForSubject(imported, SUBJECT) as Record<string, any>;
    const codedResources = prepared.entry
      .map((entry: Record<string, any>) => entry.resource)
      .filter((resource: Record<string, any>) => PRIMARY_CODE_CLAIM_BY_RESOURCE_TYPE[resource.resourceType])
      .filter((resource: Record<string, any>) => firstConceptToken(primaryConcept(resource)));

    expect(codedResources.length).toBeGreaterThan(0);

    for (const resource of codedResources) {
      const sourceConcept = primaryConcept(resource);
      const sourceToken = firstConceptToken(sourceConcept)!;
      const sourceDisplay = sourceConcept?.coding?.[0]?.display;
      const claimKey = PRIMARY_CODE_CLAIM_BY_RESOURCE_TYPE[resource.resourceType];
      const claims = resource.meta.claims;

      // Step 2. Every resource type owns one explicit canonical token claim.
      expect(claims[claimKey]).toBe(sourceToken);

      // Step 3. Claims rebuild the same native coding identity and display.
      const rebuilt = convertClaimsToFhirResource(claims) as Record<string, any>;
      const rebuiltConcept = primaryConcept(rebuilt);
      expect(firstConceptToken(rebuiltConcept)).toBe(sourceToken);
      expect(rebuiltConcept?.coding?.[0]?.display).toBe(sourceDisplay);

      // Step 4. Simulate a summary projection that retains only display in the
      // native coding. Translation must still use this resource's exact claim.
      const displayOnly = JSON.parse(JSON.stringify(rebuilt)) as Record<string, any>;
      const displayOnlyConcept = primaryConcept(displayOnly);
      expect(displayOnlyConcept).toBeDefined();
      displayOnlyConcept!.coding = displayOnlyConcept!.coding.map((coding: Record<string, any>) => ({
        ...(coding.display ? { display: coding.display } : {}),
      }));
      displayOnly.language = 'en';
      displayOnly.meta = { claims };
      const card = toClinicalResourceCardView({ resource: displayOnly }, {
        locale: 'fr',
        translateCode: ({ resourceType, token }) => (
          resourceType === resource.resourceType && token === sourceToken
            ? `Traduit ${resource.resourceType}`
            : undefined
        ),
      });
      expect(card.title).toBe(`Traduit ${resource.resourceType}`);
    }
  });

  it('preserves the text-only CarePlan category without treating it as a translatable code', () => {
    const imported = JSON.parse(fs.readFileSync(IPS_BUNDLE_PATH, 'utf8'));
    const prepared = prepareBundleDocumentForSubject(imported, SUBJECT) as Record<string, any>;
    const carePlan = prepared.entry
      .map((entry: Record<string, any>) => entry.resource)
      .find((resource: Record<string, any>) => resource.resourceType === ResourceTypesFhirR4.CarePlan);

    expect(carePlan.meta.claims[CarePlanClaim.Category]).toBeUndefined();
    expect(carePlan.meta.claims[CarePlanClaim.CategoryText]).toBe('Weight management plan');

    const rebuilt = convertClaimsToFhirResource(carePlan.meta.claims) as Record<string, any>;
    expect(rebuilt.category?.[0]?.text).toBe('Weight management plan');
  });
});
