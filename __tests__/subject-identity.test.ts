/**
 * Teaching goal:
 *
 * Show how a private identity record is linked to one public unified card
 * without turning `Subject` into a person/animal resource type. The outer
 * collection is Subject; each Bundle entry keeps its semantic resource type.
 */
import {
  buildSubjectIdentifierAssetId,
  buildSubjectIdentifierToken,
  buildSubjectIdentityBundleEntry,
  readSubjectIdentityBundleEntry,
} from '../src/utils/subject-identity';
import { buildIndividualIdentifierLedgerAssetId } from '../src/utils/individual-identifier';

describe('Subject identity collection', () => {
  it('builds one human Person whose private identifier points to the public card', () => {
    // Step 1. The controller supplies one exact identifier already known to them.
    const entry = buildSubjectIdentityBundleEntry({
      subjectKind: 'person',
      cardId: 'urn:example:card:person:alice',
      codingSystem: 'NN',
      jurisdiction: 'ES',
      codeValue: '12345678Z',
      additionalClaims: { 'org.schema.Person.identifier.assigner': 'Ministry' },
    });

    // Step 2. Subject remains the collection; Person remains the identity.
    expect(entry.request).toEqual({ method: 'POST', url: 'Subject' });
    expect(entry.resource?.resourceType).toBe('Person');
    expect(entry.resource?.meta?.claims).toMatchObject({
      'org.schema.Person.sameAs': 'urn:example:card:person:alice',
      'org.schema.Person.identifier.additionalType': 'org.hl7.terminology.CodeSystem.v2-0203.NN',
      'org.schema.Person.identifier.jurisdiction': 'ES',
      'org.schema.Person.identifier.value': '12345678Z',
      'org.schema.Person.identifier.assigner': 'Ministry',
    });

    // Step 3. A reader recovers the same association for encrypted storage and indexing.
    expect(readSubjectIdentityBundleEntry(entry)).toMatchObject({
      subjectKind: 'person',
      resourceType: 'Person',
      cardId: 'urn:example:card:person:alice',
      codingSystem: 'org.hl7.terminology.CodeSystem.v2-0203.NN',
      jurisdiction: 'ES',
      codeValue: '12345678Z',
    });
  });

  it('uses the same collection contract for an ISO animal microchip', () => {
    const entry = buildSubjectIdentityBundleEntry({
      subjectKind: 'animal',
      cardId: 'urn:vetchain:card:animal:luna',
      codingSystem: 'urn:iso:std:iso:11784-11785',
      jurisdiction: '',
      codeValue: '981020000123456',
    });

    expect(entry.resource?.resourceType).toBe('Animal');
    expect(entry.resource?.meta?.claims?.['org.schema.Animal.sameAs'])
      .toBe('urn:vetchain:card:animal:luna');
    expect(readSubjectIdentityBundleEntry(entry).subjectKind).toBe('animal');
  });

  it('preserves an explicit empty jurisdiction for a globally readable microchip', () => {
    const input = {
      codingSystem: 'urn:iso:std:iso:11784-11785',
      jurisdiction: '',
      codeValue: '981020000123456',
    } as const;

    expect(buildSubjectIdentifierToken(input))
      .toBe('urn:iso:std:iso:11784-11785||981020000123456');
    const assetId = buildSubjectIdentifierAssetId(input);
    expect(assetId).toMatch(/^urn:multibase:z/);
    expect(assetId).not.toContain(input.codeValue);
    expect(buildSubjectIdentifierAssetId(input)).toBe(assetId);
  });

  it('rejects ambiguous tokens and a card id that is not a stable URI', () => {
    expect(() => buildSubjectIdentifierToken({
      codingSystem: 'system|with-delimiter',
      jurisdiction: '',
      codeValue: 'value',
    })).toThrow(/must not contain/);
    expect(() => buildSubjectIdentityBundleEntry({
      subjectKind: 'person',
      cardId: 'browser-local-card',
      codingSystem: 'urn:example:id',
      jurisdiction: 'ES',
      codeValue: '42',
    })).toThrow(/stable URI/);
  });

  it('reuses the existing individual type|jurisdiction|value ledger derivation', () => {
    const subjectAsset = buildSubjectIdentifierAssetId({
      codingSystem: 'org.hl7.terminology.CodeSystem.v2-0203.MB', jurisdiction: 'ES', codeValue: 'member-42',
    });
    expect(subjectAsset).toBe(buildIndividualIdentifierLedgerAssetId({
      type: 'MB', jurisdiction: 'ES', value: 'member-42',
    }));
  });
});
