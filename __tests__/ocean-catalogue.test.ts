// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {test} from '@jest/globals'
import {
  buildCataloguePrimaryDocument, buildOceanDatasetPublication, captureOceanDataset,
  projectOceanDatasetEntries, restoreOceanDataset, toSchemaOrgDataset, withCatalogueBody,
  type CatalogueEntry, type OceanPublicationService,
} from '../src/convert/ocean-catalogue.js'
import type { IDecodedDidcommPayload } from '../src/models/confidential-message.js'
import {
  EXAMPLE_DIDCOMM_BUNDLE_AUD,
  EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
  EXAMPLE_DIDCOMM_BUNDLE_ISS,
  EXAMPLE_DIDCOMM_BUNDLE_JTI,
  EXAMPLE_DIDCOMM_BUNDLE_THID,
} from '../src/examples/bundle-didcomm-payload.js'

const fixture = JSON.parse(readFileSync(resolve(process.cwd(), '__tests__/fixtures/ocean-catalogue.json'), 'utf8'))
const {v4, v5, landingPage, product, service, envelope, resourceTypes} = fixture

test('restores both original DDOs exactly after serializing the public catalogue and private source separately', () => {
  for (const ddo of [v4, v5]) {
    const original = JSON.stringify(ddo, null, 2)
    const {entries, source} = captureOceanDataset({json: original, landingPage})
    const {body} = JSON.parse(JSON.stringify(withCatalogueBody(envelope, buildCataloguePrimaryDocument(entries))))
    assert.equal(restoreOceanDataset(body.data.reverse(), JSON.parse(JSON.stringify(source))), original)
    assert.ok(!JSON.stringify(body).includes(original))
    assert.throws(() => restoreOceanDataset(body.data.slice(1), source), /no longer matches/u)
    const edited = body.data.map((entry: CatalogueEntry) => entry.id === ddo.id
      ? {...entry, attributes: {...entry.attributes, title: product.attributes.name}}
      : entry)
    assert.throws(() => restoreOceanDataset(edited, source), /no longer matches/u)
  }
})

test('builds an Ocean dataset from Schema.org and recovers its portable metadata after publication', () => {
  const {schemaDataset, publisher} = fixture
  const entries = projectOceanDatasetEntries({ddo: v4, landingPage})
  assert.deepEqual(toSchemaOrgDataset(entries, schemaDataset.identifier), schemaDataset)
  const calls: Record<string, unknown>[] = []
  const asset = {
    setType(type: string) { calls.push({type}); return this },
    setName(name: string) { calls.push({name}); return this },
    setDescription(description: string) { calls.push({description}); return this },
    setLicense(license: string) { calls.push({license}); return this },
    setAuthor(author: string) { calls.push({author}); return this },
    setProvidedBy(providedBy: string) { calls.push({providedBy}); return this },
    addService(service: OceanPublicationService) { calls.push({...service}); return this },
    build() { return calls },
  }
  const settings = {version: v5.version, author: publisher, providedBy: publisher}
  const createService = (data: OceanPublicationService) => data
  const publication = buildOceanDatasetPublication(schemaDataset, entries, settings, {asset, createService})
  const {metadata, services} = v4
  assert.deepEqual(publication, [
    {type: metadata.type}, {name: metadata.name}, {description: metadata.description}, {license: metadata.license},
    {author: publisher}, {providedBy: publisher},
    ...services.map(({id, type, serviceEndpoint}: {id: string; type: string; serviceEndpoint: string}) => ({
      id: `${schemaDataset.identifier}#${id}`, type, serviceEndpoint,
    })),
  ])
  const metadataV5 = v5.credentialSubject.metadata
  const result = {
    ...Object.assign({}, ...publication.slice(0, publication.length - services.length)),
    description: {...metadataV5.description, '@value': schemaDataset.description},
    license: {...metadataV5.license, name: schemaDataset.license},
  }
  const published = {...v5, credentialSubject: {...v5.credentialSubject, metadata: result, services: publication.slice(-services.length)}}
  const publishedEntries = projectOceanDatasetEntries({ddo: published, landingPage})
  assert.deepEqual(toSchemaOrgDataset(publishedEntries, published.id), {...schemaDataset, identifier: published.id})
  const serviceAttributes = (records: readonly CatalogueEntry[]) => records
    .filter(record => record.type === resourceTypes.dataService).map(record => record.attributes)
  assert.deepEqual(serviceAttributes(publishedEntries), serviceAttributes(entries))
  calls.length = 0
  const legacy = buildOceanDatasetPublication(schemaDataset, entries, {...settings, version: v4.version}, {asset, createService})
  assert.ok(legacy.every(call => !Object.hasOwn(call, 'providedBy')))
  assert.throws(() => buildOceanDatasetPublication(schemaDataset, [], settings, {asset, createService}), /at least one data service/u)
  assert.throws(() => buildOceanDatasetPublication(schemaDataset, entries, {...settings, providedBy: undefined}, {asset, createService}), /provider/u)
})

test('projects both DDO versions and links each public service to the exact asset', () => {
  const inputs = [v4, v5].map((ddo: { id: string }) => ({ddo, landingPage}))
  const document = buildCataloguePrimaryDocument(inputs.flatMap(projectOceanDatasetEntries))
  const datasets = document.data.filter(({type}) => type === resourceTypes.dataset)
  const services = document.data.filter(({type}) => type === resourceTypes.dataService)
  assert.deepEqual(datasets.map(({id}) => id), inputs.map(({ddo}) => ddo.id))
  assert.deepEqual(datasets.map(({attributes}) => attributes.title), [v4.metadata.name, v5.credentialSubject.metadata.name])
  assert.equal(datasets[1].attributes.description, v5.credentialSubject.metadata.description['@value'])
  assert.equal(datasets[1].attributes.license, v5.credentialSubject.metadata.license.name)
  assert.equal(datasets[0].attributes.landingPage, landingPage)
  assert.deepEqual(services.map(({relationships}) => relationships?.servesDataset.data.id), [
    ...v4.services.map(() => v4.id),
    ...v5.credentialSubject.services.map(() => v5.id),
  ])
  assert.equal(new Set(services.map(({id}) => id)).size, services.length)
  const serialized = JSON.stringify(document)
  assert.ok(!serialized.includes(v4.services[0].files))
  assert.ok(!serialized.includes(v4.services[1].datatokenAddress))
  assert.ok(!serialized.includes(JSON.stringify(v5.proof)))
})

test('rejects unsupported DDOs, mismatched identities, unsafe endpoints and duplicates', () => {
  assert.throws(() => projectOceanDatasetEntries({ddo: {...v4, version: fixture.invalidVersion}}))
  assert.throws(() => projectOceanDatasetEntries({ddo: {...v4, metadata: {...v4.metadata, type: fixture.invalidAssetType}}}))
  assert.throws(() => projectOceanDatasetEntries({ddo: {...v5, id: v4.id}}))
  const [first] = v4.services
  assert.throws(() => projectOceanDatasetEntries({ddo: {...v4, services: [{...first, serviceEndpoint: fixture.invalidEndpoint}]}}))
  assert.throws(() => projectOceanDatasetEntries({ddo: {...v4, services: [first, first]}}))
  assert.throws(() => buildCataloguePrimaryDocument([product, product]))
})

test('places one or more offerings directly in the body and rejects mixed commercial types', () => {
  const products = [product, {...product, id: service.id}]
  const document = buildCataloguePrimaryDocument(products)
  assert.deepEqual(document.data, products)
  assert.deepEqual(withCatalogueBody(envelope, document), {...envelope, body: document})
  assert.deepEqual(buildCataloguePrimaryDocument([service]).data, [service])
  assert.throws(() => buildCataloguePrimaryDocument([product, service]))
})


test('fits the existing GDC DIDComm payload with one direct catalogue document', () => {
  const document = buildCataloguePrimaryDocument(projectOceanDatasetEntries({ ddo: v4, landingPage }))
  const payload: IDecodedDidcommPayload = withCatalogueBody({
    iss: EXAMPLE_DIDCOMM_BUNDLE_ISS,
    aud: EXAMPLE_DIDCOMM_BUNDLE_AUD,
    jti: EXAMPLE_DIDCOMM_BUNDLE_JTI,
    thid: EXAMPLE_DIDCOMM_BUNDLE_THID,
    type: EXAMPLE_DIDCOMM_BUNDLE_ENTRY_TYPE,
  }, document)
  assert.deepEqual(payload.body.data, document.data)
  assert.equal(payload.body.data[0].id, v4.id)
})
