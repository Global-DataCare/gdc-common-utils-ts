// Flow contract: every repository skill preserves interactive npm authorization continuity and provisional-only tarball validation.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

describe('npm authorization continuity policy', () => {
  it('is mandatory in every repository skill', () => {
    const skillsRoot = resolve(process.cwd(), '.codex/skills');
    const skillFiles = readdirSync(skillsRoot, { recursive: true })
      .map(String)
      .filter((file) => file.endsWith('SKILL.md'));
    expect(skillFiles.length).toBeGreaterThan(0);
    for (const file of skillFiles) {
      const contract = readFileSync(resolve(skillsRoot, file), 'utf8');
      expect(contract).toMatch(/three.*attempts.*five\s+minutes/is);
      expect(contract).toMatch(/npm pack.*tarball.*local.*test/is);
      expect(contract).toMatch(/registry.*publish.*consumer.*merge.*deploy/is);
    }
  });
});
