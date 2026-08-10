/** Public provider pointer stored for one opaque subject-identifier asset. */
export type SubjectIdentifierProviderPointer = Readonly<{
  identifier: Readonly<{ value: string }>;
  /** Bare DNS domain: no URL scheme, path, DID or tenant identifier. */
  url: string;
}>;

/** Public unified-card pointer resolved from an exact known identifier. */
export type SubjectIdentifierCardPointer = Readonly<{
  identifier: Readonly<{ value: string }>;
  subjectKind: 'person' | 'animal' | 'property';
}>;

/** Ledger payload. It deliberately contains no raw private identifier. */
export type SubjectIdentifierLedgerPayload = Readonly<{
  card: SubjectIdentifierCardPointer;
  provider: SubjectIdentifierProviderPointer;
}>;

/**
 * @deprecated Parse canonical Person/Animal/Place Bundle entries with
 * `readSubjectIdentityBundleEntry` instead. Kept for 2.x compatibility only.
 */
export type SubjectIdentifierLedgerBundleEntry = Readonly<{
  sameAs: string | readonly string[];
}>;
