import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const distDirectory = resolve(process.cwd(), process.argv[2] || 'dist');

function collectJavaScriptFiles(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      collectJavaScriptFiles(absolutePath, files);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(absolutePath);
    }
  }
  return files;
}

const files = collectJavaScriptFiles(distDirectory);
if (files.length === 0) {
  throw new Error(`No generated JavaScript files found in ${distDirectory}.`);
}

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (!source) {
    throw new Error(`Generated JavaScript file is empty: ${file}`);
  }
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const diagnostics = sourceFile.parseDiagnostics || [];
  if (diagnostics.length > 0) {
    const details = ts.formatDiagnostics(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => '\n',
    });
    process.stderr.write(details);
    throw new Error(`Generated JavaScript syntax check failed: ${file}`);
  }
}

console.log(`[verify-dist-syntax] Checked ${files.length} generated JavaScript file(s).`);
