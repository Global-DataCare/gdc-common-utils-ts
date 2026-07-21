/** Public provider pointer stored for one opaque subject-identifier asset. */
export type SubjectIdentifierProviderPointer = Readonly<{
  identifier: Readonly<{ value: string }>;
  /** Bare DNS domain: no URL scheme, path, DID or tenant identifier. */
  url: string;
}>;

/** Ledger payload. It deliberately contains no subject DID or raw identifier. */
export type SubjectIdentifierLedgerPayload = Readonly<{
  provider: SubjectIdentifierProviderPointer;
}>;

/** One individual/animal bundle entry expanded into one write per `sameAs` alias. */
export type SubjectIdentifierLedgerBundleEntry = Readonly<{
  sameAs: string | readonly string[];
}>;
