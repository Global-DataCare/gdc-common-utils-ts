// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: crypto-ts/models/resource-document.ts

/**
 * A flexible record type for claims objects.
 */
export type ClaimsRecord = Record<string, any>;

// A generic type for records stored in the vault.
export interface RecordBase {
  id: string;
}

/**
 * Represents the configuration metadata for a vault.
 * As defined in the original database abstract layer.
 */
export interface VaultConfig extends RecordBase{
    custodian?: string; // The tenant responsible for this vault
}

