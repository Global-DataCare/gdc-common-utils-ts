import { describe, expect, it } from '@jest/globals';
import {
  EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
  EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
  EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD,
} from '../src/examples/profile-manager-mem';
import { WalletQueueStatuses } from '../src/models/wallet';
import { MemoryProfileOutboxRepository } from '../src/utils/profile-outbox-memory-repository';

describe('utils/profile-outbox-memory-repository', () => {
  it('stores message history and returns it by id', async () => {
    const repository = new MemoryProfileOutboxRepository();

    await repository.putMessage({
      id: 'history-message-001',
      thid: String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid),
      messageType: String(EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD.type),
      priority: EXAMPLE_PROFILE_MANAGER_MEM_PRIORITY_NORMAL,
      status: WalletQueueStatuses.Delivered,
      recordedAt: '2026-06-30T11:00:00.000Z',
      payload: EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD,
      envelope: 'compact-envelope-001',
    });

    const stored = await repository.getMessage('history-message-001');
    expect(stored?.payload).toEqual(EXAMPLE_PROFILE_MANAGER_MEM_REQUEST_PAYLOAD);
    expect((await repository.listMessages())).toHaveLength(1);
  });

  it('stores multiple responses per thread and returns the latest one', async () => {
    const repository = new MemoryProfileOutboxRepository();

    await repository.putResponse({
      thid: String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid),
      receivedAt: '2026-06-30T11:01:00.000Z',
      content: {
        ...EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD,
        jti: 'response-old',
      },
      meta: {},
    });
    await repository.putResponse({
      thid: String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid),
      receivedAt: '2026-06-30T11:02:00.000Z',
      content: {
        ...EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD,
        jti: 'response-new',
      },
      meta: {},
    });

    const latest = await repository.getLatestResponseByThreadId(
      String(EXAMPLE_PROFILE_MANAGER_MEM_RESPONSE_PAYLOAD.thid),
    );
    expect((latest?.content as Record<string, unknown>)['jti']).toBe('response-new');
    expect((await repository.listResponses())).toHaveLength(2);
  });
});
