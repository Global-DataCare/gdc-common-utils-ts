// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

function propertyName(node: ts.PropertyName | undefined): string | undefined {
  return node && (ts.isIdentifier(node) || ts.isStringLiteral(node)) ? node.text : undefined;
}

function hasProperty(object: ts.ObjectLiteralExpression, name: string): boolean {
  return object.properties.some((property) => propertyName(property.name) === name);
}

function isLegacyClaimsMeta(property: ts.ObjectLiteralElementLike): boolean {
  return ts.isPropertyAssignment(property)
    && propertyName(property.name) === 'meta'
    && ts.isObjectLiteralExpression(property.initializer)
    && hasProperty(property.initializer, 'claims');
}

function isDirectBundleArrayEntry(object: ts.ObjectLiteralExpression): boolean {
  let current: ts.Node = object;
  while (current.parent && !ts.isSourceFile(current.parent)) {
    if (ts.isArrayLiteralExpression(current.parent)) {
      const arrayProperty = current.parent.parent;
      return ts.isPropertyAssignment(arrayProperty)
        && (propertyName(arrayProperty.name) === 'data' || propertyName(arrayProperty.name) === 'entry');
    }
    if (ts.isObjectLiteralExpression(current.parent)) return false;
    current = current.parent;
  }
  return false;
}

function sourceFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(root, entry.name);
    return entry.isDirectory()
      ? sourceFiles(resolved)
      : (/\.ts$/.test(entry.name) ? [resolved] : []);
  });
}

describe('canonical Bundle entry writer boundary', () => {
  it('rejects governed source writers that author entry.meta.claims', () => {
    const violations: string[] = [];
    for (const file of sourceFiles(path.resolve('src'))) {
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
      const visit = (node: ts.Node): void => {
        if (ts.isObjectLiteralExpression(node)) {
          const legacyMeta = node.properties.find(isLegacyClaimsMeta);
          const isOperationEntry = hasProperty(node, 'request') && (hasProperty(node, 'type') || hasProperty(node, 'resource'));
          if (legacyMeta && (isOperationEntry || isDirectBundleArrayEntry(node))) {
            const location = source.getLineAndCharacterOfPosition(legacyMeta.getStart(source));
            violations.push(`${path.relative(process.cwd(), file)}:${location.line + 1}`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    expect(violations).toEqual([]);
  });
});
