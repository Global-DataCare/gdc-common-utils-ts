// Flow contract: convert Ocean datasets into direct catalogue entries and carry a homogeneous offering document in the DIDComm body.
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {test} from '@jest/globals'
import {buildCataloguePrimaryDocument, projectOceanDatasetEntries, withCatalogueBody} from '../src/convert/ocean-catalogue.js'
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
