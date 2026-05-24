import { CommunicationMode, resolveDidcommSubmissionPlan } from './didcomm-submit-policy';

export type DidcommFetchInit = {
  method: 'POST';
  headers: Record<string, string>;
  body: string;
};

export type DidcommFetchResponse = {
  status: number;
  headers?: { get(name: string): string | null };
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
};

export type DidcommFetchLike = (url: string, init: DidcommFetchInit) => Promise<DidcommFetchResponse>;

export type DidcommSubmitInput = {
  mode: CommunicationMode;
  url: string;
  payload: Record<string, unknown>;
  defaultHeaders?: Record<string, string>;
  bearerToken?: string;
  recipientEncryptionJwk?: unknown;
  fetcher: DidcommFetchLike;
  signCompactJws?: (claims: Record<string, unknown>) => Promise<string>;
  encryptCompactJwe?: (compactJws: string, recipientEncryptionJwk: unknown) => Promise<string>;
};

export type DidcommSubmitResult = {
  status: number;
  location?: string;
  body: unknown;
  submitKind: 'plain' | 'encrypted';
  contentType: 'application/didcomm-plaintext+json' | 'application/didcomm-encrypted+json';
};

function getHeaderValue(
  headers: { get(name: string): string | null } | undefined,
  name: string,
): string | undefined {
  if (!headers || typeof headers.get !== 'function') {
    return undefined;
  }
  const value = headers.get(name);
  return value == null ? undefined : value;
}

async function parseBody(response: DidcommFetchResponse): Promise<unknown> {
  if (typeof response.text === 'function') {
    const raw = await response.text();
    if (!raw) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return undefined;
}

/**
 * Submits a DIDComm payload using either plaintext or encrypted transport,
 * depending on the resolved submission policy.
 *
 * @param input.mode Communication mode that drives plain vs encrypted submission.
 * @param input.url Target endpoint URL.
 * @param input.payload DIDComm payload body to submit.
 * @param input.defaultHeaders Optional extra request headers.
 * @param input.bearerToken Optional bearer token.
 * @param input.recipientEncryptionJwk Recipient public key for encrypted mode.
 * @param input.fetcher Runtime fetch-like implementation.
 * @param input.signCompactJws Callback used to sign plaintext claims before encryption.
 * @param input.encryptCompactJwe Callback used to encrypt the signed JWS.
 */
export async function submitDidcomm(input: DidcommSubmitInput): Promise<DidcommSubmitResult> {
  const plan = resolveDidcommSubmissionPlan(input.mode, {
    hasRecipientEncryptionJwk: !!input.recipientEncryptionJwk,
  });

  const headers: Record<string, string> = {
    ...(input.defaultHeaders ?? {}),
    Accept: 'application/json, application/didcomm-plaintext+json, */*',
  };

  let body: string;
  let contentType: DidcommSubmitResult['contentType'];

  if (plan.submitKind === 'plain') {
    contentType = 'application/didcomm-plaintext+json';
    body = JSON.stringify(input.payload);
  } else {
    if (!input.signCompactJws) {
      throw new Error('Encrypted DIDComm submission requires signCompactJws callback.');
    }
    if (!input.encryptCompactJwe) {
      throw new Error('Encrypted DIDComm submission requires encryptCompactJwe callback.');
    }
    if (!input.recipientEncryptionJwk) {
      throw new Error('Encrypted DIDComm submission requires recipientEncryptionJwk.');
    }

    const compactJws = await input.signCompactJws(input.payload);
    body = await input.encryptCompactJwe(compactJws, input.recipientEncryptionJwk);
    contentType = 'application/didcomm-encrypted+json';
  }

  headers['Content-Type'] = contentType;
  if (input.bearerToken) {
    headers.Authorization = `Bearer ${input.bearerToken}`;
  }

  const response = await input.fetcher(input.url, {
    method: 'POST',
    headers,
    body,
  });

  return {
    status: response.status,
    location: getHeaderValue(response.headers, 'location'),
    body: await parseBody(response),
    submitKind: plan.submitKind,
    contentType,
  };
}
