/**
 * Teaching goal:
 * - `code` is the token SearchParameter for `medication.concept`
 * - `medication` is the reference SearchParameter for `medication.reference`
 * - R5 `adherence` is a token SearchParameter; its dotted FHIRPath expression is never a claim key
 * - readable companions belong to CodeableConcept/Coding targets, not to every token parameter
 */
import { BundleEditableResourceTypes, BundleOperations } from '../src/models/bundle-editor-types.js';
import {
  MEDICATION_STATEMENT_ADHERENCE_CODE_SYSTEM,
  MedicationStatementAdherenceCodes,
  MedicationStatementClaim,
  MedicationStatementClaimsFhirApi,
  MedicationStatementSearchParamNames,
  MedicationStatementSearchParamToClaimKey,
} from '../src/models/interoperable-claims/medication-statement-claims.js';
import { medicationStatementFlatToFhirR4 } from '../src/convert/convert-medication-statement.js';
import { BundleEditor } from '../src/utils/bundle-editor-core.js';
import '../src/utils/medication-statement-entry-editor.js';

const SUBJECT = 'Patient/patient-123';
const CODE = 'http://www.nlm.nih.gov/research/umls/rxnorm|5640';
const ADHERENCE = `${MEDICATION_STATEMENT_ADHERENCE_CODE_SYSTEM}|${MedicationStatementAdherenceCodes.TakingAsDirected}`;

describe('101: MedicationStatement code, medication and adherence contracts', () => {
  test('authors canonical code and R5 adherence claims with typed editor methods', () => {
    // Step 1. Author the medication concept and adherence independently.
    const bundle = new BundleEditor()
      .setBundleOperation(BundleOperations.create)
      .setAllowedResourceType(BundleEditableResourceTypes.medicationStatement);
    const entry = bundle
      .newEntryAs(BundleEditableResourceTypes.medicationStatement, 'urn:uuid:medication-statement-1')
      .setSubject(SUBJECT)
      .setStatus('active')
      .setCode(CODE)
      .setCodeTextLocal('Ibuprofeno')
      .setCodeDisplay('Ibuprofen')
      .setAdherence(ADHERENCE)
      .setAdherenceCode(ADHERENCE)
      .setAdherenceCodeTextLocal('Tomando según indicación')
      .setAdherenceCodeDisplay('Taking As Directed');

    // Step 2. The newbie-friendly method emits `code-text`; PascalCase and
    // historical `medication-text` are never produced by new authoring.
    const built = entry.doneEntry().build();
    const claims = (built.entry?.[0]?.resource as any)?.meta?.claims || {};
    expect(claims[MedicationStatementClaim.Code]).toBe(CODE);
    expect(claims[MedicationStatementClaim.CodeText]).toBe('Ibuprofeno');
    expect(claims[MedicationStatementClaim.CodeDisplay]).toBe('Ibuprofen');
    expect(claims[MedicationStatementClaim.Adherence]).toBe(ADHERENCE);
    expect(claims[MedicationStatementClaim.Adherence]).toBe(ADHERENCE);
    expect(claims[MedicationStatementClaim.AdherenceText]).toBe('Tomando según indicación');
    expect(claims[MedicationStatementClaim.AdherenceDisplay]).toBe('Taking As Directed');
    expect(claims['MedicationStatement.adherence.code']).toBeUndefined();
    expect(claims[MedicationStatementClaim.MedicationText]).toBeUndefined();
    expect(claims['MedicationStatement.CodeTextLocal']).toBeUndefined();
  });

  test('keeps the three official search parameters distinct', () => {
    // Step 1. Search names are FHIR names, not guessed resource property names.
    expect(MedicationStatementSearchParamToClaimKey[MedicationStatementSearchParamNames.Code])
      .toBe(MedicationStatementClaimsFhirApi.Code);
    expect(MedicationStatementSearchParamToClaimKey[MedicationStatementSearchParamNames.Medication])
      .toBe(MedicationStatementClaimsFhirApi.Medication);
    expect(MedicationStatementSearchParamToClaimKey[MedicationStatementSearchParamNames.Adherence])
      .toBe(MedicationStatementClaimsFhirApi.Adherence);

    // Step 2. A reference wins the R4 medication[x] choice and is never emitted
    // beside medicationCodeableConcept.
    const fhir = medicationStatementFlatToFhirR4({
      [MedicationStatementClaim.Subject]: SUBJECT,
      [MedicationStatementClaim.Status]: 'active',
      [MedicationStatementClaim.Code]: CODE,
      [MedicationStatementClaim.CodeText]: 'Ibuprofeno',
      [MedicationStatementClaim.Medication]: 'Medication/medication-123',
    });
    expect(fhir.medicationReference).toEqual({ reference: 'Medication/medication-123' });
    expect(fhir.medicationCodeableConcept).toBeUndefined();
  });
});
