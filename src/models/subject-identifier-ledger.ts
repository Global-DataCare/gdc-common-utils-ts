/**
 * Minimal public payload stored for one opaque subject-identifier lookup key.
 *
 * `indexProviderDid` is the resolvable `did:web` of the provider that owns the
 * protected subject index. The ledger payload contains no card, subject,
 * contact identifier, provider code, domain duplicate or authorization data.
 */
export type SubjectIdentifierLedgerPayload = Readonly<{
  indexProviderDid: string;
}>;
