import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { ProcedureClaim } from '../src/models/interoperable-claims/procedure-claims.js';
import { HealthcareBasicSections } from '../src/constants/healthcare.js';
import {
  EXAMPLE_SUBJECT_DID,
  buildExampleLiveMedicationCases,
} from '../src/examples/shared.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import { DiagnosticReportClaim } from '../src/models/interoperable-claims/diagnostic-report-claims.js';
import {
  buildBundleDocumentFromClaims,
  convertClaimsToFhirResource,
  detectClaimsResourceType,
  extractBundleDocumentClaimsList,
  getSimpleClaimAttributeName,
  resolveClaimsSectionList,
  validateBundleDocumentBasic,
} from '../src/utils/bundle-document-builder.js';
import { fhirResourceToFlatClaims, flatClaimsToFhirResource } from '../src/utils/clinical-resource-converters.js';
import { BundleReader } from '../src/utils/bundle-reader.js';

describe('bundle document builder', () => {
  it('detects claims resource type and converts medication claims to a FHIR resource', () => {
    const medication = buildExampleLiveMedicationCases(321)[0]!;
    const claims = {
      '@context': 'org.hl7.fhir.api',
      [MedicationStatementClaim.Identifier]: medication.identifier,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Status]: 'active',
      [MedicationStatementClaim.MedicationText]: medication.text,
      [MedicationStatementClaim.Effective]: medication.effectiveDateTime,
      [MedicationStatementClaim.Note]: medication.note,
      [MedicationStatementClaim.Category]: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    };

    expect(detectClaimsResourceType(claims)).toBe(ResourceTypesFhirR4.MedicationStatement);
    expect(resolveClaimsSectionList(claims)).toEqual([HealthcareBasicSections.HistoryOfMedicationUse.attributeValue]);

    const resource = convertClaimsToFhirResource(claims);
    expect(resource.resourceType).toBe(ResourceTypesFhirR4.MedicationStatement);
  });

  it('builds a valid Bundle document from claims and links sections to resource references', () => {
    const medication = buildExampleLiveMedicationCases(654)[0]!;
    const claims = {
      '@context': 'org.hl7.fhir.api',
      [MedicationStatementClaim.Identifier]: medication.identifier,
      [MedicationStatementClaim.Subject]: EXAMPLE_SUBJECT_DID,
      [MedicationStatementClaim.Status]: 'active',
      [MedicationStatementClaim.MedicationText]: medication.text,
      [MedicationStatementClaim.Effective]: medication.effectiveDateTime,
      [MedicationStatementClaim.Note]: medication.note,
      [MedicationStatementClaim.Category]: HealthcareBasicSections.HistoryOfMedicationUse.attributeValue,
    };

    const bundle = buildBundleDocumentFromClaims({
      subjectDid: EXAMPLE_SUBJECT_DID,
      claimsList: [claims],
    }) as any;

    expect(validateBundleDocumentBasic(bundle)).toEqual({ ok: true, issues: [] });
    expect(bundle.entry[0].resource.resourceType).toBe(ResourceTypesFhirR4.Composition);
    expect(bundle.entry[0].resource.section[0].code.coding[0].code).toBe('10160-0');
    expect(bundle.entry[0].resource.section[0].entry[0].reference).toBe(`MedicationStatement/${medication.identifier}`);
    expect(bundle.entry.find((entry: any) => entry.resource?.resourceType === ResourceTypesFhirR4.MedicationStatement)?.resource?.meta?.claims?.[MedicationStatementClaim.Identifier])
      .toBe(medication.identifier);
  });

  it('flattens an unsupported FHIR resource into review claims and rebuilds the same resource shape', () => {
    const immunization = {
      resourceType: ResourceTypesFhirR4.Immunization,
      id: 'imm-001',
      status: 'completed',
      patient: { reference: EXAMPLE_SUBJECT_DID },
      vaccineCode: {
        coding: [{ system: 'http://hl7.org/fhir/sid/cvx', code: '207' }],
        text: 'COVID-19 vaccine',
      },
      occurrenceDateTime: '2026-06-01T10:00:00Z',
      note: [{ text: 'No adverse reaction' }],
    } as const;

    const claims = fhirResourceToFlatClaims(immunization as any);
    expect(getSimpleClaimAttributeName('org.hl7.fhir.r4.Immunization.vaccineCode.coding[0].code'))
      .toBe('Immunization.vaccineCode.coding[0].code');
    expect(claims['Immunization.vaccineCode.coding[0].code']).toBe('207');
    expect(claims['Immunization.note[0].text']).toBe('No adverse reaction');

    const rebuilt = flatClaimsToFhirResource(claims);
    expect(rebuilt).toEqual(immunization);
  });

  it('extracts semantic procedure claims from a bundle document and regenerates the FHIR resource', () => {
    const sourceBundle = {
      resourceType: ResourceTypesFhirR4.Bundle,
      type: 'document',
      entry: [
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Composition,
            status: 'final',
            type: { coding: [{ system: 'http://loinc.org', code: '60591-5' }] },
          },
        },
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Procedure,
            id: 'procedure-001',
            status: 'completed',
            subject: { reference: EXAMPLE_SUBJECT_DID },
            code: {
              coding: [{ system: 'http://snomed.info/sct', code: '80146002' }],
              text: 'Appendectomy',
            },
            performedDateTime: '2026-06-01T10:00:00Z',
          },
        },
      ],
    };

    const claimsList = extractBundleDocumentClaimsList(sourceBundle);
    expect(claimsList).toHaveLength(1);
    expect(claimsList[0][ProcedureClaim.Code]).toBe('http://snomed.info/sct|80146002');
    expect(claimsList[0][ProcedureClaim.Status]).toBe('completed');

    const rebuiltBundle = buildBundleDocumentFromClaims({
      subjectDid: EXAMPLE_SUBJECT_DID,
      compositionType: 'http://loinc.org|60591-5',
      claimsList,
    }) as any;

    expect(validateBundleDocumentBasic(rebuiltBundle)).toEqual({ ok: true, issues: [] });
    const rebuiltProcedure = rebuiltBundle.entry.find(
      (entry: any) => entry.resource?.resourceType === ResourceTypesFhirR4.Procedure,
    )?.resource;
    expect(rebuiltProcedure).toMatchObject({
      resourceType: ResourceTypesFhirR4.Procedure,
      status: 'completed',
      subject: { reference: EXAMPLE_SUBJECT_DID },
      code: {
        coding: [{ system: 'http://snomed.info/sct', code: '80146002' }],
      },
      performedDateTime: '2026-06-01T10:00:00Z',
    });
    expect(rebuiltProcedure.meta?.claims?.[ProcedureClaim.Code]).toBe('http://snomed.info/sct|80146002');
  });

  it('imports contained resources as internal claims entries and rebuilds them back under the parent resource', () => {
    const sourceBundle = {
      resourceType: ResourceTypesFhirR4.Bundle,
      type: 'document',
      entry: [
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Composition,
            status: 'final',
            type: { coding: [{ system: 'http://loinc.org', code: '60591-5' }] },
            section: [
              {
                code: { coding: [{ system: 'http://loinc.org', code: '11502-2' }] },
                entry: [{ reference: 'DiagnosticReport/diag-001' }],
              },
            ],
          },
        },
        {
          resource: {
            resourceType: ResourceTypesFhirR4.DiagnosticReport,
            id: 'diag-001',
            status: 'final',
            subject: { reference: EXAMPLE_SUBJECT_DID },
            code: { coding: [{ system: 'http://loinc.org', code: '58410-2' }] },
            result: [{ reference: '#obs-1' }],
            contained: [
              {
                resourceType: ResourceTypesFhirR4.Observation,
                id: 'obs-1',
                status: 'final',
                code: { coding: [{ system: 'http://loinc.org', code: '789-8' }] },
                valueString: 'Hemoglobin normal',
              },
            ],
          },
        },
      ],
    };

    const claimsList = extractBundleDocumentClaimsList(sourceBundle);
    expect(claimsList).toHaveLength(2);
    expect(claimsList[0][DiagnosticReportClaim.ContainedReferenceList]).toBe('Observation/obs-1');
    expect(claimsList[1]['Observation.is-contained']).toBe(true);
    expect(claimsList[1]['Observation.contained-parent-reference']).toBe('DiagnosticReport/diag-001');

    const rebuiltBundle = buildBundleDocumentFromClaims({
      subjectDid: EXAMPLE_SUBJECT_DID,
      claimsList,
    }) as Record<string, unknown>;

    const rebuiltReader = new BundleReader(rebuiltBundle);
    expect(rebuiltReader.getEntryCount()).toBe(3);
    expect(rebuiltReader.getVisibleResourceIds({
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport],
    })).toEqual(['diag-001']);
    expect(rebuiltReader.getVisibleResourceCount({
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport, ResourceTypesFhirR4.Observation],
    })).toBe(1);
    expect(rebuiltReader.getVisibleResourceIds({
      resourceTypes: [ResourceTypesFhirR4.Observation],
    })).toEqual([]);
    expect(rebuiltReader.getVisibleEntryIndexes({
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport, ResourceTypesFhirR4.Observation],
    })).toEqual([2]);
    expect(rebuiltReader.getVisibleEntryIndexByPosition(0, {
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport, ResourceTypesFhirR4.Observation],
    })).toBe(2);
    expect(rebuiltReader.getNextVisibleEntryIndex(2, {
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport, ResourceTypesFhirR4.Observation],
    })).toBeUndefined();
    expect(rebuiltReader.getPreviousVisibleEntryIndex(2, {
      resourceTypes: [ResourceTypesFhirR4.DiagnosticReport, ResourceTypesFhirR4.Observation],
    })).toBeUndefined();

    const rebuiltDiagnosticReport = (rebuiltBundle as any).entry.find(
      (entry: any) => entry.resource?.resourceType === ResourceTypesFhirR4.DiagnosticReport,
    )?.resource;
    expect(rebuiltDiagnosticReport?.contained).toHaveLength(1);
    expect(rebuiltDiagnosticReport?.contained?.[0]?.resourceType).toBe(ResourceTypesFhirR4.Observation);
    expect(rebuiltDiagnosticReport?.contained?.[0]?.id).toBe('obs-1');
  });
});
