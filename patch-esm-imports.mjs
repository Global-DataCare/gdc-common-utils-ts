import fs from 'fs';
import path from 'path';

const BUILD_DIR = path.resolve(process.cwd(), 'dist');

function collectFiles(dir, extensions, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, extensions, files);
    } else if (entry.isFile()) {
      const ext = path.extname(fullPath);
      if (extensions.includes(ext)) files.push(fullPath);
    }
  }
  return files;
}

function hasRuntimeExtension(specifier) {
  const ext = path.extname(specifier);
  return ['.js', '.mjs', '.cjs', '.json', '.node'].includes(ext);
}

function resolveExtension(specifier, sourceFile) {
  if (!specifier.startsWith('.') && !specifier.startsWith('..')) return null;
  if (hasRuntimeExtension(specifier)) return null;

  const basePath = path.resolve(path.dirname(sourceFile), specifier);
  const candidates = [
    `${basePath}.js`,
    path.join(basePath, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const rel = path.relative(path.dirname(sourceFile), candidate).replace(/\\/g, '/');
      return rel.startsWith('.') ? rel : `./${rel}`;
    }
  }
  return null;
}

function rewriteImports(source, sourceFile) {
  let updated = source;

  updated = updated.replace(
    /\bfrom\s+(['"])([^'"]+)\1/g,
    (match, quote, spec) => {
      const resolved = resolveExtension(spec, sourceFile);
      if (!resolved) return match;
      return `from ${quote}${resolved}${quote}`;
    },
  );

  updated = updated.replace(
    /\bimport\(\s*(['"])([^'"]+)\1\s*\)/g,
    (match, quote, spec) => {
      const resolved = resolveExtension(spec, sourceFile);
      if (!resolved) return match;
      return `import(${quote}${resolved}${quote})`;
    },
  );

  return updated;
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error(`[patch-esm-imports] Build directory not found: ${BUILD_DIR}`);
  process.exit(1);
}

const files = collectFiles(BUILD_DIR, ['.js']);
let changedCount = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = rewriteImports(original, file);
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    changedCount += 1;
  }
}

console.log(`[patch-esm-imports] Updated ${changedCount} file(s).`);
