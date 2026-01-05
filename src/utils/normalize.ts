// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/utils/normalize.ts

/**
 * Creates a stable, serialized JSON string from an object by sorting its keys alphabetically.
 * This is the core function for achieving canonical serialization.
 * @param obj The object to serialize.
 * @returns A stable JSON string.
 */
function stableStringify(obj: object): string {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObject: { [key: string]: any } = {};
  for (const key of sortedKeys) {
    sortedObject[key] = (obj as any)[key];
  }
  return JSON.stringify(sortedObject);
}

/**
 * Normalizes an object for hashing by excluding a standard set of volatile properties.
 * This function is based on the original `normalizeAndSerializeObject` from the backend utils.
 *
 * @param obj The object to normalize.
 * @returns A stable, canonical JSON string of the object's core properties.
 */
export function normalizeObject(obj: object): string {
  // Exclude properties that are often volatile or client-specific
  // and should not be part of the core content hash.
  const { id, meta, text, contained, ...coreContent } = obj as any;
  return stableStringify(coreContent);
}

/**
 * Normalizes a DIDComm payload specifically for generating the `payload.id` (version hash).
 * According to the defined architecture, this specifically excludes `id` and `meta`.
 *
 * @param payload The DIDComm payload object.
 * @returns A stable JSON string representation of the payload's core content.
 */
export function normalizeDidcommPayloadForId(payload: object): string {
  const { id, meta, ...coreContent } = payload as any;
  return stableStringify(coreContent);
}
