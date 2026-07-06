import type { BundleEditor } from './bundle-editor-core';
import type { BundleEntryEditor } from './bundle-entry-editor';

export type BundleEntryEditorConstructor<T extends BundleEntryEditor = BundleEntryEditor> =
  new (bundleEditor: BundleEditor, entryIndex: number) => T;

const bundleEntryEditorConstructors = new Map<string, BundleEntryEditorConstructor>();

export function registerBundleEntryEditor(resourceType: string, ctor: BundleEntryEditorConstructor): void {
  bundleEntryEditorConstructors.set(String(resourceType || '').trim(), ctor);
}

export function getBundleEntryEditorConstructor(resourceType: string): BundleEntryEditorConstructor | undefined {
  return bundleEntryEditorConstructors.get(String(resourceType || '').trim());
}

export function createRegisteredBundleEntryEditor<T extends BundleEntryEditor>(
  resourceType: string,
  bundleEditor: BundleEditor,
  entryIndex: number,
): T {
  const ctor = getBundleEntryEditorConstructor(resourceType);
  if (!ctor) {
    throw new Error('BundleEntryEditor has not registered a constructor for resource type: ' + String(resourceType || '').trim());
  }
  return new ctor(bundleEditor, entryIndex) as T;
}
