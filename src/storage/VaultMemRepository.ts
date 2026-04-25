// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: src/storage/VaultMemRepository.ts

import { RecordBase } from '../models/resource-document';
import { IVaultRepository, VaultQuery } from './IVaultRepository';

type Collection = Map<string, RecordBase>;

/**
 * In-memory implementation of IVaultRepository.
 *
 * Intended for:
 * - Unit/integration tests across all packages
 * - Short-lived runtime contexts (voice calls, transient sessions)
 *
 * Each instance is independent — instantiate one per actor/session context
 * (e.g. one per CallSid in uhc-unid-chat-node) and discard on cleanup.
 *
 * TODO: For text channels with persistent sessions, use:
 *   - storage-sdk-firestore-ts → FirestoreVaultRepository (Google Cloud)
 *   - storage-sdk-postgres-ts  → PostgresVaultRepository  (Cloud SQL / self-hosted)
 *   - storage-sdk-sqlite-ts    → SqliteVaultRepository    (mobile / expo-sqlite)
 *   - storage-sdk-indexeddb-ts → IndexedDbVaultRepository (browser)
 *   - storage-sdk-py           → Python equivalents
 * All of the above will import IVaultRepository from gdc-common-utils-ts/storage.
 */
export class VaultMemRepository extends IVaultRepository {
  private readonly collections = new Map<string, Collection>();

  private ensureCollection(collectionName: string): Collection {
    if (!this.collections.has(collectionName)) {
      this.collections.set(collectionName, new Map());
    }
    return this.collections.get(collectionName)!;
  }

  /** Clears all state. Useful for test teardown or call-end cleanup. */
  clear(): void {
    this.collections.clear();
  }

  async put<T extends RecordBase>(collectionName: string, containers: T | T[]): Promise<boolean> {
    const col = this.ensureCollection(collectionName);
    const items = Array.isArray(containers) ? containers : [containers];
    for (const item of items) {
      col.set(item.id, item);
    }
    return true;
  }

  async get<T extends RecordBase>(collectionName: string, containerId: string): Promise<T | undefined> {
    return this.collections.get(collectionName)?.get(containerId) as T | undefined;
  }

  async query<T extends RecordBase>(collectionName: string, query: VaultQuery): Promise<T[]> {
    const col = this.collections.get(collectionName);
    if (!col) return [];

    let results = Array.from(col.values()) as T[];

    if (query.where?.length) {
      results = results.filter((doc) =>
        query.where!.every((cond) => {
          const val = (doc as Record<string, unknown>)[cond.attribute];
          if (cond.equals !== undefined) return val === cond.equals;
          if (cond.in !== undefined) return cond.in.includes(val);
          return true;
        }),
      );
    }

    if (query.orderBy) {
      const { attribute, direction } = query.orderBy;
      results.sort((a, b) => {
        const av = (a as Record<string, unknown>)[attribute];
        const bv = (b as Record<string, unknown>)[attribute];
        const cmp = av! < bv! ? -1 : av! > bv! ? 1 : 0;
        return direction === 'asc' ? cmp : -cmp;
      });
    }

    if (query.offset) results = results.slice(query.offset);
    if (query.limit) results = results.slice(0, query.limit);

    return results;
  }

  async delete(collectionName: string, containerId: string): Promise<boolean> {
    return this.collections.get(collectionName)?.delete(containerId) ?? false;
  }
}
