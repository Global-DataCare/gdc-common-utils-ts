// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.
// File: __tests__/storage-vault-mem.test.ts

import { VaultMemRepository } from '../src/storage/VaultMemRepository';
import { RecordBase } from '../src/models/resource-document';

interface TokenRecord extends RecordBase {
  accessToken: string;
  expiresIn?: number;
}

describe('VaultMemRepository', () => {
  let repo: VaultMemRepository;

  beforeEach(() => {
    repo = new VaultMemRepository();
  });

  it('puts and gets a single record', async () => {
    const token: TokenRecord = { id: 'call-001', accessToken: 'tok-abc' };
    await repo.put('tokens', token);
    const result = await repo.get<TokenRecord>('tokens', 'call-001');
    expect(result?.accessToken).toBe('tok-abc');
  });

  it('puts array of records', async () => {
    await repo.put('tokens', [
      { id: 'a', accessToken: 'tok-a' },
      { id: 'b', accessToken: 'tok-b' },
    ]);
    expect(await repo.get<TokenRecord>('tokens', 'a')).toMatchObject({ accessToken: 'tok-a' });
    expect(await repo.get<TokenRecord>('tokens', 'b')).toMatchObject({ accessToken: 'tok-b' });
  });

  it('overwrites existing record on put', async () => {
    await repo.put('tokens', { id: 'x', accessToken: 'old' });
    await repo.put('tokens', { id: 'x', accessToken: 'new' });
    const result = await repo.get<TokenRecord>('tokens', 'x');
    expect(result?.accessToken).toBe('new');
  });

  it('returns undefined for missing record', async () => {
    expect(await repo.get('tokens', 'missing')).toBeUndefined();
  });

  it('deletes a record', async () => {
    await repo.put('tokens', { id: 'del', accessToken: 'tok-del' });
    const deleted = await repo.delete('tokens', 'del');
    expect(deleted).toBe(true);
    expect(await repo.get('tokens', 'del')).toBeUndefined();
  });

  it('delete returns false when record does not exist', async () => {
    expect(await repo.delete('tokens', 'ghost')).toBe(false);
  });

  it('keeps collections isolated', async () => {
    await repo.put('tokens', { id: 'shared-id', accessToken: 'tok' });
    await repo.put('sessions', { id: 'shared-id', accessToken: 'session' });
    const tok = await repo.get<TokenRecord>('tokens', 'shared-id');
    const ses = await repo.get<TokenRecord>('sessions', 'shared-id');
    expect(tok?.accessToken).toBe('tok');
    expect(ses?.accessToken).toBe('session');
  });

  it('query with equals filter', async () => {
    await repo.put('tokens', [
      { id: '1', accessToken: 'tok-a', expiresIn: 3600 },
      { id: '2', accessToken: 'tok-b', expiresIn: 900 },
      { id: '3', accessToken: 'tok-c', expiresIn: 3600 },
    ]);
    const results = await repo.query<TokenRecord>('tokens', {
      where: [{ attribute: 'expiresIn', equals: 3600 }],
    });
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.id).sort()).toEqual(['1', '3']);
  });

  it('query with limit', async () => {
    await repo.put('tokens', [
      { id: '1', accessToken: 'a' },
      { id: '2', accessToken: 'b' },
      { id: '3', accessToken: 'c' },
    ]);
    const results = await repo.query<TokenRecord>('tokens', { limit: 2 });
    expect(results).toHaveLength(2);
  });

  it('clear removes all data', async () => {
    await repo.put('tokens', { id: 'x', accessToken: 'tok' });
    repo.clear();
    expect(await repo.get('tokens', 'x')).toBeUndefined();
  });

  it('separate instances are fully independent', async () => {
    const repo2 = new VaultMemRepository();
    await repo.put('tokens', { id: 'id1', accessToken: 'r1' });
    await repo2.put('tokens', { id: 'id1', accessToken: 'r2' });
    expect((await repo.get<TokenRecord>('tokens', 'id1'))?.accessToken).toBe('r1');
    expect((await repo2.get<TokenRecord>('tokens', 'id1'))?.accessToken).toBe('r2');
  });
});
