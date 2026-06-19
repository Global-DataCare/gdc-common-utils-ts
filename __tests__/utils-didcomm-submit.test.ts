import { submitDidcomm } from '../src/utils/didcomm-submit';

describe('submitDidcomm', () => {
  it('submits plaintext didcomm when mode=plain', async () => {
    const fetcher = jest.fn().mockResolvedValue({
      status: 202,
      headers: { get: (name: string) => (name.toLowerCase() === 'location' ? '/jobs/1' : null) },
      text: async () => '{"ok":true}',
    });

    const result = await submitDidcomm({
      mode: 'plain',
      url: 'https://gw.example.com/path',
      payload: { thid: 't-1', body: { a: 1 } },
      defaultHeaders: { 'x-test': '1' },
      bearerToken: 'abc',
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledWith(
      'https://gw.example.com/path',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/didcomm-plain+json',
          Authorization: 'Bearer abc',
          'x-test': '1',
        }),
      }),
    );
    expect(result.submitKind).toBe('plain');
    expect(result.location).toBe('/jobs/1');
    expect(result.body).toEqual({ ok: true });
  });

  it('submits encrypted didcomm when strict and keys provided', async () => {
    const fetcher = jest.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => null },
      text: async () => '{"ok":true}',
    });
    const signCompactJws = jest.fn().mockResolvedValue('signed-jws');
    const encryptCompactJwe = jest.fn().mockResolvedValue('encrypted-jwe');
    const recipientJwk = { kty: 'RSA', kid: 'enc-1' };

    const result = await submitDidcomm({
      mode: 'strict',
      url: 'https://gw.example.com/path',
      payload: { thid: 't-2' },
      recipientEncryptionJwk: recipientJwk,
      signCompactJws,
      encryptCompactJwe,
      fetcher,
    });

    expect(signCompactJws).toHaveBeenCalledWith({ thid: 't-2' });
    expect(encryptCompactJwe).toHaveBeenCalledWith('signed-jws', recipientJwk);
    expect(fetcher).toHaveBeenCalledWith(
      'https://gw.example.com/path',
      expect.objectContaining({
        body: 'encrypted-jwe',
        headers: expect.objectContaining({
          'Content-Type': 'application/didcomm-encrypted+json',
        }),
      }),
    );
    expect(result.submitKind).toBe('encrypted');
  });
});
