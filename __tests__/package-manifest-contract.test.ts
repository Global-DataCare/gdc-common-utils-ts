// Flow contract: a published shared package must never depend on itself or create recursive dependency trees.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('package manifest contract', () => {
  it('does not declare gdc-common-utils-ts as its own dependency', () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
    ) as { name: string; dependencies?: Record<string, string> };

    expect(manifest.name).toBe('gdc-common-utils-ts');
    expect(manifest.dependencies).not.toHaveProperty(manifest.name);
  });
});
