/**
 * Teaching goal:
 * - reuse the legacy `data[].attributes[code] = display` terminology format
 * - resolve one clinical code synchronously for the existing card renderer
 * - search small local catalogs by text, code, language and coding system
 * - keep missing translations explicit so FHIR text/display remains the fallback
 */
import {
  LocalTerminologyProvider,
  createClinicalCodeTranslator,
} from '../src/utils/local-terminology-provider.js';
import { toClinicalResourceCardView } from '../src/utils/clinical-resource-view.js';

const ENGLISH = {
  id: 'mvp-en',
  name: 'MVP international terminology',
  language: 'en',
  data: [{
    id: 'http://loinc.org',
    attributes: {
      '85354-9': 'Blood pressure panel',
      '8310-5': 'Body temperature',
    },
  }, {
    // Compatibility with the legacy SNOMED IPS document.
    id: 'ips',
    attributes: {
      '44054006': 'Type 2 diabetes mellitus',
    },
  }],
} as const;

const SPANISH = {
  id: 'mvp-es',
  name: 'MVP Spanish terminology',
  language: 'es',
  jurisdiction: 'ES',
  data: [{
    id: 'http://loinc.org',
    attributes: {
      '85354-9': 'Panel de presión arterial',
      '8310-5': 'Temperatura corporal',
    },
  }, {
    id: 'http://snomed.info/sct',
    attributes: {
      '44054006': 'Diabetes mellitus tipo 2',
    },
  }],
} as const;

describe('101: local terminology fallback for an MVP application', () => {
  test('loads legacy catalogs and translates a clinical card without network access', () => {
    // Step 1. Load the established legacy JSON catalog shape.
    const terminology = new LocalTerminologyProvider([ENGLISH, SPANISH]);

    // Step 2. Adapt the synchronous local lookup to the existing display hook.
    const translateCode = createClinicalCodeTranslator(terminology);

    // Step 3. Render the known code in the requested language.
    const card = toClinicalResourceCardView({
      resource: {
        resourceType: 'Condition',
        language: 'en',
        code: {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '44054006',
            display: 'Type 2 diabetes mellitus',
          }],
        },
      },
    }, {
      locale: 'es-ES',
      translateCode,
    });

    expect(card.title).toBe('Diabetes mellitus tipo 2');
  });

  test('searches by normalized text or code and filters the selected systems', () => {
    const terminology = new LocalTerminologyProvider([ENGLISH, SPANISH]);

    // Step 1. A form selects its applicable code systems; the provider does not
    // guess them from arbitrary resource fields.
    const loinc = terminology.search({
      text: 'presion',
      language: 'es-ES',
      jurisdiction: 'ES',
      systems: ['http://loinc.org'],
      limit: 10,
    });
    expect(loinc).toEqual([{
      system: 'http://loinc.org',
      code: '85354-9',
      display: 'Panel de presión arterial',
      language: 'es',
    }]);

    // Step 2. Code search is supported for scanner/manual-code workflows.
    expect(terminology.search({
      text: '44054006',
      language: 'en',
      systems: ['http://snomed.info/sct'],
    })[0]).toEqual({
      system: 'http://snomed.info/sct',
      code: '44054006',
      display: 'Type 2 diabetes mellitus',
      language: 'en',
    });
  });

  test('returns undefined or an empty result when the local fallback has no term', () => {
    const terminology = new LocalTerminologyProvider([ENGLISH]);

    expect(terminology.lookup({
      system: 'http://loinc.org',
      code: 'unknown',
      language: 'es',
    })).toBeUndefined();
    expect(terminology.search({
      text: 'not present',
      language: 'es',
      systems: ['http://loinc.org'],
    })).toEqual([]);
  });
});
