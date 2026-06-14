/**
 * Recursively removes `undefined` values from plain objects and arrays.
 *
 * Why this helper exists:
 * - databases such as Firestore reject `undefined` values during writes
 * - JSON payloads become easier to compare in tests when missing values are removed
 * - callers can sanitize nested structures without rewriting the traversal logic
 *
 * Behaviour:
 * - object properties with value `undefined` are removed
 * - array items equal to `undefined` are removed
 * - all other values are preserved
 *
 * @template T Input value type preserved for the caller.
 * @param value Any serializable-like value.
 * @returns The same logical value without nested `undefined` entries.
 */
export function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripUndefinedDeep(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === 'object') {
    const cleanedEntries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, stripUndefinedDeep(entryValue)]);
    return Object.fromEntries(cleanedEntries) as T;
  }

  return value;
}
