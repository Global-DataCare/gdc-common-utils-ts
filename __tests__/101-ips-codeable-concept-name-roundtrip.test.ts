/**
 * Teaching goal:
 * - every coded IPS form keeps the local name independently from system|code
 * - BundleEditor is the authoring surface
 * - FHIR code.text/coding.display and claims survive a write/read roundtrip
 * - UI cards never replace the human label with the terminology token
 */
import { BundleOperations, BundleEditableResourceTypes } from '../src/models/bundle-editor-types.js';
import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { BundleEditor } from '../src/utils/bundle-editor-core.js';
import '../src/utils/allergy-intolerance-entry-editor.js';
import '../src/utils/condition-entry-editor.js';
import {
  allergyIntoleranceFhirR4ToFlat,
  allergyIntoleranceFlatToFhirR4,
} from '../src/convert/convert-allergy-intolerance.js';
import {
  conditionFhirR4ToFlat,
  conditionFlatToFhirR4,
} from '../src/convert/convert-condition.js';
import { toClinicalResourceCardView } from '../src/utils/clinical-resource-view.js';

const SUBJECT = 'did:web:example.test:individual:diego';

describe('101: IPS coded clinical names survive authoring, FHIR and rendering', () => {
  test('never exposes a terminology token when no human label is available', () => {
    const token = 'http://snomed.info/sct|373270004';
    const card = toClinicalResourceCardView({
      resource: {
        resourceType: 'AllergyIntolerance',
        language: 'es',
        code: { coding: [{ system: 'http://snomed.info/sct', code: '373270004' }] },
        meta: { claims: { [AllergyIntoleranceClaim.Code]: token } },
      },
    }, { locale: 'es' });

    expect(card.title).toBe('AllergyIntolerance');
    expect(card.title).not.toBe(token);
  });

  test.each([
    {
      resourceType: BundleEditableResourceTypes.allergyIntolerance,
      identifier: 'urn:uuid:allergy-penicillin',
      code: 'http://snomed.info/sct|373270004',
      localText: 'Penicilina',
      display: 'Penicillin',
      codeTextClaim: AllergyIntoleranceClaim.CodeText,
      codeDisplayClaim: AllergyIntoleranceClaim.CodeDisplay,
      open: (editor: BundleEditor) => editor
        .newEntryAs(BundleEditableResourceTypes.allergyIntolerance, 'urn:uuid:allergy-penicillin')
        .setIdentifier('urn:uuid:allergy-penicillin')
        .setSubject(SUBJECT),
      toFhir: allergyIntoleranceFlatToFhirR4,
      toClaims: allergyIntoleranceFhirR4ToFlat,
    },
    {
      resourceType: BundleEditableResourceTypes.condition,
      identifier: 'urn:uuid:condition-diabetes',
      code: 'http://snomed.info/sct|44054006',
      localText: 'Diabetes mellitus tipo 2',
      display: 'Type 2 diabetes mellitus',
      codeTextClaim: ConditionClaim.CodeText,
      codeDisplayClaim: ConditionClaim.CodeDisplay,
      open: (editor: BundleEditor) => editor
        .newEntryAs(BundleEditableResourceTypes.condition, 'urn:uuid:condition-diabetes')
        .setIdentifier('urn:uuid:condition-diabetes')
        .setSubject(SUBJECT),
      toFhir: conditionFlatToFhirR4,
      toClaims: conditionFhirR4ToFlat,
    },
  ])(
    'keeps $resourceType local text and international display',
    ({ resourceType, code, localText, display, codeTextClaim, codeDisplayClaim, open, toFhir, toClaims }) => {
      // Step 1. Author one claims-first entry without touching raw meta.claims.
      const bundleEditor = new BundleEditor()
        .setBundleOperation(BundleOperations.create)
        .setAllowedResourceType(resourceType);
      const entryEditor = open(bundleEditor)
        .setCode(code)
        .setCodeTextLocal(localText)
        .setCodeDisplay(display);

      expect(entryEditor.getCode()).toBe(code);
      expect(entryEditor.getCodeTextLocal()).toBe(localText);
      expect(entryEditor.getCodeDisplay()).toBe(display);

      // Step 2. Materialize and project to native FHIR.
      const built = entryEditor.doneEntry().build();
      const claims = (built.entry?.[0]?.resource as any)?.meta?.claims || {};
      expect(claims[codeTextClaim]).toBe(localText);
      expect(claims[codeDisplayClaim]).toBe(display);

      const fhir = toFhir(claims);
      expect((fhir.code as any)?.text).toBe(localText);
      expect((fhir.code as any)?.coding?.[0]).toMatchObject({
        system: 'http://snomed.info/sct',
        code: code.split('|')[1],
        display,
      });

      // Step 3. Normalize the authoritative readback and render a card.
      const roundtripClaims = toClaims(fhir);
      expect(roundtripClaims[codeTextClaim]).toBe(localText);
      expect(roundtripClaims[codeDisplayClaim]).toBe(display);

      const card = toClinicalResourceCardView({
        resource: {
          ...fhir,
          language: 'es',
          meta: { claims: roundtripClaims },
        },
      }, { locale: 'es-ES' });
      expect(card.title).toBe(localText);
      expect(card.title).not.toContain('http://snomed.info/sct');

      const englishCard = toClinicalResourceCardView({
        resource: { ...fhir, language: 'es', meta: { claims: roundtripClaims } },
      }, { locale: 'en' });
      expect(englishCard.title).toBe(display);

      const translatedCard = toClinicalResourceCardView({
        resource: { ...fhir, language: 'es', meta: { claims: roundtripClaims } },
      }, {
        locale: 'fr',
        translateCode: ({ token }) => token === code ? `fr:${display}` : undefined,
      });
      expect(translatedCard.title).toBe(`fr:${display}`);

      const displayOnlyClaims = { ...roundtripClaims };
      delete displayOnlyClaims[codeTextClaim];
      const displayOnlyFhir = toFhir(displayOnlyClaims);
      const displayOnlyCard = toClinicalResourceCardView({
        resource: { ...displayOnlyFhir, language: 'en', meta: { claims: displayOnlyClaims } },
      }, { locale: 'en' });
      expect(displayOnlyCard.title).toBe(display);

      // Step 4. Reopen the authoritative copy and save it again. The editor
      // field must still contain the manual text, never the terminology token.
      const reopenedBundle = new BundleEditor()
        .setBundleOperation(BundleOperations.create)
        .setAllowedResourceType(resourceType)
        .setBundle({
          resourceType: built.resourceType,
          type: built.type,
          data: built.entry,
        } as any);
      const reopened = reopenedBundle.openEntry(entryEditor.getIdentifier()!).asResourceType(resourceType) as any;
      expect(reopened.getCodeTextLocal()).toBe(localText);
      expect(reopened.getCode()).toBe(code);
      const secondSaveClaims = (reopened.doneEntry().build().entry?.[0]?.resource as any)?.meta?.claims || {};
      expect(secondSaveClaims[codeTextClaim]).toBe(localText);
      expect(secondSaveClaims[codeTextClaim]).not.toBe(code);
    },
  );
});
