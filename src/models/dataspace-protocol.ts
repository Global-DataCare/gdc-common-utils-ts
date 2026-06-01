// Copyright 2026 Antifraud Services Inc. under the Apache License, Version 2.0.

/**
 * One advertised Dataspace Protocol version entry from `/.well-known/dspace-version`.
 */
export type DspaceProtocolVersionEntry = Readonly<{
  version: string;
  path: string;
}>;

/**
 * Minimal version metadata payload returned by the DSP well-known discovery
 * endpoint.
 */
export type DspaceVersionMetadata = Readonly<{
  protocolVersions: readonly DspaceProtocolVersionEntry[];
}>;
