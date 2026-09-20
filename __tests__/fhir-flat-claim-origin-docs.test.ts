// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.

import fs from 'fs';
import path from 'path';

describe('FHIR-like flat claim origin documentation', () => {
  it('classifies every resource catalog against its official search and extension pages', () => {
    const claimsDirectory = path.resolve('src/models/interoperable-claims');
    const resourceTypes = new Set<string>();

    for (const file of fs.readdirSync(claimsDirectory).filter(name => name.endsWith('-claims.ts'))) {
      const source = fs.readFileSync(path.join(claimsDirectory, file), 'utf8');
      for (const match of source.matchAll(
        /^\s*[A-Za-z][A-Za-z0-9]*\s*(?::|=)\s*['"]([A-Z][A-Za-z0-9]+)\.[A-Za-z0-9.-]+['"]/gm,
      )) {
        resourceTypes.add(match[1]);
      }
    }

    const contract = fs.readFileSync('docs/FHIR-LIKE-FLAT-CLAIMS.md', 'utf8');
    expect(resourceTypes.size).toBeGreaterThanOrEqual(27);
    expect(contract).toContain('FHIR search parameter');
    expect(contract).toContain('FHIR standard extension');
    expect(contract).toContain('custom extension');
    expect(contract).toContain('A native FHIR element that is not published as a search parameter is not canonical');
    expect(contract).toContain('Must Support');
    expect(contract).toContain('ValueSet');
    expect(contract).toContain('creation and card presentation');
    expect(contract).toContain('https://hl7.org/fhir/uv/ips/2.0.1/en/artifacts.html');
    expect(contract).toContain('https://hl7.org/fhir/uv/ips/2.0.1/en/CapabilityStatement-ips-server.html');

    for (const resourceType of resourceTypes) {
      expect(contract).toContain(
        `https://hl7.org/fhir/${resourceType.toLowerCase()}.html#search`,
      );
      expect(contract).toContain(
        `https://hl7.org/fhir/extensions/extensions-${resourceType}.html`,
      );
    }
  });
});
