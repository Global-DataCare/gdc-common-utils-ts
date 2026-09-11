// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('published NodeNext declaration barrel', () => {
  it('uses explicit runtime extensions so TypeScript can traverse public re-exports', () => {
    const declarations = readFileSync(resolve(process.cwd(), 'dist/index.d.ts'), 'utf8');

    expect(declarations).toContain("export * from './constants/index.js';");
    expect(declarations).toContain("export * from './utils/index.js';");
    expect(declarations).not.toMatch(/(?:from|import\()\s*['"]\.\.?\/[^'"]+(?<!\.(?:js|mjs|cjs|json|node))['"]/);
  });
});
