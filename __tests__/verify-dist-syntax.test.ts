import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const verifier = resolve(process.cwd(), 'scripts/verify-dist-syntax.mjs');

describe('generated distribution syntax gate', () => {
  let fixtureDirectory: string;

  beforeEach(() => {
    fixtureDirectory = mkdtempSync(resolve(tmpdir(), 'gdc-dist-syntax-'));
  });

  afterEach(() => {
    rmSync(fixtureDirectory, { recursive: true, force: true });
  });

  it('accepts non-empty valid generated JavaScript', () => {
    writeFileSync(resolve(fixtureDirectory, 'valid.js'), 'export const ready = true;\n');

    const result = spawnSync(
      process.execPath,
      [verifier, fixtureDirectory],
      { encoding: 'utf8' },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Checked 1 generated JavaScript file');
  });

  it('rejects a truncated generated JavaScript file', () => {
    writeFileSync(
      resolve(fixtureDirectory, 'truncated.js'),
      'const value = Object.freeze({ physicianB\n',
    );

    const result = spawnSync(
      process.execPath,
      [verifier, fixtureDirectory],
      { encoding: 'utf8' },
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Generated JavaScript syntax check failed');
  });
});
