#!/usr/bin/env node
// Generates split IPS resource and ValueSet catalogs from pinned FHIR packages.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const IPS_VERSION = '2.0.1';
const FHIR_R4_VERSION = '4.0.1';
const FHIR_R5_VERSION = '5.0.0';
const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const ipsPackage = valueAfter('--ips-package');
const r4Package = valueAfter('--r4-package');
const r5Package = valueAfter('--r5-package');
if (!ipsPackage || !r4Package || !r5Package) {
  throw new Error(
    'Usage: generate-ips-profile-catalog.mjs --ips-package <hl7.fhir.uv.ips-2.0.1.tgz> --r4-package <hl7.fhir.r4.core-4.0.1.tgz> --r5-package <hl7.fhir.r5.core-5.0.0.tgz>',
  );
}

const work = mkdtempSync(join(tmpdir(), 'gdc-ips-catalog-'));
const extract = (archive, name) => {
  const destination = join(work, name);
  mkdirSync(destination, { recursive: true });
  execFileSync('tar', ['-xzf', resolve(archive), '-C', destination]);
  return join(destination, 'package');
};
const loadJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const withoutVersion = (canonical) => canonical.split('|')[0];
const unique = (values) => [...new Set(values.filter(Boolean))];
const kebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
const identifier = (value) => value.replace(/[^A-Za-z0-9_$]/g, '_');
const generatedHeader =
  '// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.\n' +
  '// GENERATED FILE. DO NOT EDIT. See scripts/generate-ips-profile-catalog.mjs.\n\n';

const obligationUrl = 'http://hl7.org/fhir/StructureDefinition/obligation';
const hasObligation = (element) =>
  (element.extension ?? []).some((extension) => extension.url === obligationUrl);
const obligationValues = (element, actorName) =>
  unique(
    (element.extension ?? [])
      .filter((extension) => extension.url === obligationUrl)
      .filter((extension) =>
        (extension.extension ?? []).some(
          (part) =>
            part.url === 'actor' &&
            typeof part.valueCanonical === 'string' &&
            part.valueCanonical.includes(`/ActorDefinition/${actorName}|`),
        ),
      )
      .flatMap((extension) =>
        (extension.extension ?? [])
          .filter((part) => part.url === 'code')
          .map((part) => part.valueCode),
      ),
  );
const additionalValueSets = (binding) =>
  unique(
    (binding?.extension ?? [])
      .filter((extension) => extension.url.endsWith('/additional-binding'))
      .flatMap((extension) =>
        (extension.extension ?? [])
          .filter((part) => part.url === 'valueSet')
          .map((part) => part.valueCanonical),
      ),
  );

const mapElement = (element) => {
  const types = element.type ?? [];
  const result = {
    id: element.id,
    path: element.path,
    min: element.min,
    max: element.max,
    mustSupport: element.mustSupport === true,
    fhirTypes: unique(types.map((type) => type.code)),
    typeProfiles: unique(types.flatMap((type) => type.profile ?? [])),
    targetProfiles: unique(types.flatMap((type) => type.targetProfile ?? [])),
    creatorObligations: obligationValues(element, 'Creator'),
    consumerObligations: obligationValues(element, 'Consumer'),
  };
  if (element.contentReference) result.contentReference = element.contentReference;
  const fixed = Object.entries(element).find(([key]) => key.startsWith('fixed'));
  if (fixed) result.fixedValue = { fhirType: fixed[0].slice(5), value: fixed[1] };
  const pattern = Object.entries(element).find(([key]) => key.startsWith('pattern'));
  if (pattern) result.patternValue = { fhirType: pattern[0].slice(7), value: pattern[1] };
  if (element.binding?.valueSet) {
    result.binding = {
      strength: element.binding.strength,
      valueSet: element.binding.valueSet,
      additionalValueSets: additionalValueSets(element.binding),
    };
  }
  return result;
};

try {
  const ipsDir = extract(ipsPackage, 'ips');
  const r4Dir = extract(r4Package, 'r4');
  const r5Dir = extract(r5Package, 'r5');
  const capability = loadJson(join(ipsDir, 'CapabilityStatement-ips-server.json'));
  if (capability.version !== IPS_VERSION || capability.fhirVersion !== FHIR_R4_VERSION) {
    throw new Error(`Unexpected IPS package contract ${capability.version}/${capability.fhirVersion}`);
  }

  const structureDefinitions = new Map();
  const valueSetDefinitions = new Map();
  for (const directory of [r4Dir, ipsDir]) {
    for (const filename of readdirSync(directory).filter((name) => name.endsWith('.json'))) {
      const definition = loadJson(join(directory, filename));
      if (
        definition.resourceType === 'StructureDefinition' &&
        definition.kind === 'resource' &&
        definition.snapshot?.element
      ) {
        structureDefinitions.set(definition.url, definition);
      }
      if (definition.resourceType === 'ValueSet' && definition.url) {
        valueSetDefinitions.set(definition.url, definition);
      }
    }
  }

  const searchParameters = [];
  for (const [directory, fhirVersion] of [
    [r4Dir, FHIR_R4_VERSION],
    [r5Dir, FHIR_R5_VERSION],
  ]) {
    for (const filename of readdirSync(directory).filter(
      (name) => name.startsWith('SearchParameter-') && name.endsWith('.json'),
    )) {
      const parameter = loadJson(join(directory, filename));
      if (parameter.status === 'retired' || !parameter.code || !parameter.type) continue;
      searchParameters.push({ ...parameter, sourceFhirVersion: fhirVersion });
    }
  }
  const inheritedBases = new Set(['Resource', 'DomainResource']);
  const searchFor = (resourceType) => {
    const candidatesByCode = new Map();
    for (const parameter of searchParameters) {
      const bases = parameter.base ?? [];
      if (!bases.some((base) => inheritedBases.has(base) || base === resourceType)) continue;
      const candidates = candidatesByCode.get(parameter.code) ?? [];
      candidates.push(parameter);
      candidatesByCode.set(parameter.code, candidates);
    }
    return [...candidatesByCode.values()]
      .map((candidates) => {
        const rank = (parameter) =>
          (parameter.base.includes(resourceType) ? 10 : 0) +
          (parameter.sourceFhirVersion === FHIR_R5_VERSION ? 1 : 0);
        const parameter = [...candidates].sort((left, right) => rank(right) - rank(left))[0];
        return {
          code: parameter.code,
          type: parameter.type,
          url: parameter.url,
          ...(parameter.expression ? { expression: parameter.expression } : {}),
          fhirVersions: unique(
            candidates.map(({ sourceFhirVersion }) => sourceFhirVersion),
          ).sort(),
        };
      })
      .sort((left, right) => left.code.localeCompare(right.code));
  };

  const resources = capability.rest.flatMap((rest) => rest.resource ?? []);
  const catalogsByResource = [];
  const valueSetUsages = new Map();
  for (const resource of resources) {
    const supportedProfiles = resource.supportedProfile ?? [];
    const profiles = supportedProfiles.length
      ? supportedProfiles
      : [`http://hl7.org/fhir/StructureDefinition/${resource.type}|${FHIR_R4_VERSION}`];
    const profileCatalog = {};
    for (const canonical of profiles) {
      const definition = structureDefinitions.get(withoutVersion(canonical));
      if (!definition) throw new Error(`Cannot resolve profile ${canonical}`);
      const differentialIds = new Set(
        (definition.differential?.element ?? []).map(({ id }) => id),
      );
      const isBaseResource = definition.derivation !== 'constraint';
      const selectedElements = definition.snapshot.element.filter(
        (element) =>
          isBaseResource ||
          differentialIds.has(element.id) ||
          element.min > 0 ||
          element.mustSupport === true ||
          hasObligation(element),
      );
      profileCatalog[canonical] = {
        resourceType: definition.type,
        canonicalUrl: definition.url,
        version: definition.version,
        name: definition.name,
        elements: selectedElements.map(mapElement),
      };
      for (const element of selectedElements) {
        if (!element.binding?.valueSet) continue;
        const references = [
          { canonical: element.binding.valueSet, purpose: 'primary' },
          ...additionalValueSets(element.binding).map((canonical) => ({
            canonical,
            purpose: 'additional',
          })),
        ];
        for (const reference of references) {
          const usages = valueSetUsages.get(reference.canonical) ?? [];
          usages.push({
            resourceType: resource.type,
            profile: canonical,
            elementId: element.id,
            path: element.path,
            purpose: reference.purpose,
            strength: element.binding.strength,
          });
          valueSetUsages.set(reference.canonical, usages);
        }
      }
    }
    const resourceCapability = {
      resourceType: resource.type,
      supportedProfiles,
      profiles,
      interactions: (resource.interaction ?? []).map(({ code }) => code),
      searchParameters: searchFor(resource.type),
    };
    catalogsByResource.push({ profileCatalog, resourceCapability });
  }

  const valueSets = [...valueSetUsages.entries()].map(([canonicalReference, usages]) => {
    const definition = valueSetDefinitions.get(withoutVersion(canonicalReference));
    return {
      canonicalReference,
      canonicalUrl: withoutVersion(canonicalReference),
      ...(definition
        ? {
            resolved: true,
            version: definition.version,
            name: definition.name,
            ...(definition.title ? { title: definition.title } : {}),
            status: definition.status,
            ...(definition.description ? { description: definition.description } : {}),
            ...(definition.immutable !== undefined ? { immutable: definition.immutable } : {}),
            ...(definition.compose ? { compose: definition.compose } : {}),
            ...(definition.expansion ? { expansion: definition.expansion } : {}),
          }
        : { resolved: false }),
      usages,
    };
  });

  const here = dirname(fileURLToPath(import.meta.url));
  const outputDir = resolve(
    here,
    '../src/models/interoperable-claims/ips-profile-catalog.generated',
  );
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(join(outputDir, 'resources'), { recursive: true });
  mkdirSync(join(outputDir, 'value-sets'), { recursive: true });
  mkdirSync(join(outputDir, 'value-sets', 'chunks'), { recursive: true });

  const resourceImports = [];
  const profileSpreads = [];
  const capabilityNames = [];
  const canonicalFlatClaimsByResource = {};
  for (const { profileCatalog, resourceCapability } of catalogsByResource) {
    const resourceType = resourceCapability.resourceType;
    const variable = identifier(resourceType);
    const filename = `${kebab(resourceType)}.generated.ts`;
    const source =
      generatedHeader +
      "import type { IpsProfileCatalog, IpsResourceCapability } from '../../ips-profile-types';\n\n" +
      `export const RESOURCE_PROFILES = ${JSON.stringify(profileCatalog, null, 2)} as const satisfies IpsProfileCatalog;\n\n` +
      `export const RESOURCE_CAPABILITY = ${JSON.stringify(resourceCapability, null, 2)} as const satisfies IpsResourceCapability;\n`;
    writeFileSync(join(outputDir, 'resources', filename), source);
    resourceImports.push(
      `import { RESOURCE_PROFILES as ${variable}Profiles, RESOURCE_CAPABILITY as ${variable}Capability } from './resources/${filename.replace(/\.ts$/, '')}';`,
    );
    profileSpreads.push(`  ...${variable}Profiles,`);
    capabilityNames.push(`  ${variable}Capability,`);
    canonicalFlatClaimsByResource[resourceType] = resourceCapability.searchParameters.map(
      ({ code }) => `${resourceType}.${code}`,
    );
  }

  const valueSetImports = [];
  const valueSetNames = [];
  for (const valueSet of valueSets) {
    const hash = createHash('sha256')
      .update(valueSet.canonicalReference)
      .digest('hex')
      .slice(0, 10);
    const baseName = withoutVersion(valueSet.canonicalReference).split('/').pop() || 'value-set';
    const filename = `${kebab(baseName)}-${hash}.generated.ts`;
    const variable = `ValueSet_${hash}`;
    const compactValueSet = structuredClone(valueSet);
    const chunkImports = [];
    const replacements = [];
    let chunkGroup = 0;
    const splitLargeArray = (parent, key, label) => {
      const values = parent?.[key];
      if (!Array.isArray(values) || values.length <= 100) return;
      const variables = [];
      for (let offset = 0; offset < values.length; offset += 100) {
        const chunk = values.slice(offset, offset + 100);
        const chunkIndex = offset / 100;
        const chunkVariable = `ValueSetChunk_${chunkGroup}_${chunkIndex}`;
        const chunkFilename = `${kebab(baseName)}-${hash}-${kebab(label)}-${chunkIndex}.generated.ts`;
        writeFileSync(
          join(outputDir, 'value-sets', 'chunks', chunkFilename),
          generatedHeader + `export const VALUE_SET_CHUNK = ${JSON.stringify(chunk, null, 2)} as const;\n`,
        );
        chunkImports.push(
          `import { VALUE_SET_CHUNK as ${chunkVariable} } from './chunks/${chunkFilename.replace(/\.ts$/, '')}';`,
        );
        variables.push(chunkVariable);
      }
      const placeholder = `__VALUE_SET_CHUNKS_${chunkGroup}__`;
      parent[key] = placeholder;
      replacements.push([
        JSON.stringify(placeholder),
        `[${variables.map((variable) => `...${variable}`).join(', ')}]`,
      ]);
      chunkGroup += 1;
    };
    splitLargeArray(compactValueSet.expansion, 'contains', 'expansion');
    for (const [includeIndex, include] of (compactValueSet.compose?.include ?? []).entries()) {
      splitLargeArray(include, 'concept', `include-${includeIndex}`);
    }
    let serializedValueSet = JSON.stringify(compactValueSet, null, 2);
    for (const [placeholder, expression] of replacements) {
      serializedValueSet = serializedValueSet.replace(placeholder, expression);
    }
    const valueSetSource =
      generatedHeader +
      "import type { IpsValueSetDefinition } from '../../ips-profile-types';\n" +
      (chunkImports.length ? `${chunkImports.join('\n')}\n` : '') +
      `\nexport const VALUE_SET = ${serializedValueSet} as const satisfies IpsValueSetDefinition;\n`;
    writeFileSync(join(outputDir, 'value-sets', filename), valueSetSource);
    valueSetImports.push(
      `import { VALUE_SET as ${variable} } from './${filename.replace(/\.ts$/, '')}';`,
    );
    valueSetNames.push(`  [${variable}.canonicalReference]: ${variable},`);
  }
  writeFileSync(
    join(outputDir, 'value-sets', 'index.ts'),
    generatedHeader +
      "import type { IpsValueSetCatalog } from '../../ips-profile-types';\n" +
      `${valueSetImports.join('\n')}\n\n` +
      `export const IPS_VALUE_SET_CATALOG = {\n${valueSetNames.join('\n')}\n} as const satisfies IpsValueSetCatalog;\n`,
  );

  writeFileSync(
    join(outputDir, 'index.ts'),
    generatedHeader +
      "import type { IpsProfileCatalog, IpsResourceCapability } from '../ips-profile-types';\n" +
      `${resourceImports.join('\n')}\n\n` +
      `export const IPS_VERSION = ${JSON.stringify(IPS_VERSION)} as const;\n` +
      `export const IPS_FHIR_R4_VERSION = ${JSON.stringify(FHIR_R4_VERSION)} as const;\n` +
      `export const IPS_FHIR_SEARCH_VERSIONS = ${JSON.stringify([FHIR_R4_VERSION, FHIR_R5_VERSION])} as const;\n\n` +
      `export const IPS_PROFILE_CATALOG = {\n${profileSpreads.join('\n')}\n} as const satisfies IpsProfileCatalog;\n\n` +
      `export const IPS_RESOURCE_CAPABILITIES = [\n${capabilityNames.join('\n')}\n] as const satisfies readonly IpsResourceCapability[];\n\n` +
      'export const IPS_RESOURCE_TYPES = Object.freeze(IPS_RESOURCE_CAPABILITIES.map(({ resourceType }) => resourceType));\n\n' +
      `export const IPS_CANONICAL_FLAT_CLAIMS_BY_RESOURCE = ${JSON.stringify(canonicalFlatClaimsByResource, null, 2)} as const;\n\n` +
      "export { IPS_VALUE_SET_CATALOG } from './value-sets';\n",
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}
