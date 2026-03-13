import { DidCommPayload, DidCommAttachment } from '../models/comm';

// Re-export for convenience
export { DidCommAttachment } from '../models/comm';

/**
 * Generates a random ID for DIDComm messages.
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Creates a DIDComm message instance.
 */
export class DidCommMessage implements DidCommPayload {
  id: string;
  type: string;
  from?: string;
  to?: string[];
  thid?: string;
  pthid?: string;
  created_time?: number;
  expires_time?: number;
  body: { [key: string]: any };
  attachments?: DidCommAttachment[];

  constructor() {
    this.id = generateId();
    this.type = '';
    this.body = {};
  }
}

/**
 * Prepares a DIDComm request message.
 */
export function prepareDidCommRequest(type: string, body: any = {}, attachments: DidCommAttachment[] = []): DidCommMessage {
  const message = new DidCommMessage();
  message.type = type;
  message.body = body;
  message.attachments = attachments;
  message.thid = message.id; // Set thid to id for new threads
  return message;
}

/**
 * Includes VP token in DIDComm message body.
 */
export function includeVpTokenInMessage(message: DidCommMessage, vpToken: string): void {
  message.body.vp_token = vpToken;
}

/**
 * Includes file bytes as base64 attachment in DIDComm message.
 */
export function includeFileInMessage(message: DidCommMessage, fileBytes: Uint8Array, mediaType: string, id: string): void {
  const base64 = Buffer.from(fileBytes).toString('base64');
  if (!message.attachments) message.attachments = [];
  message.attachments.push({
    id,
    media_type: mediaType,
    data: { base64 }
  });
}

/**
 * Gets THID from DIDComm message.
 */
export function getThidFromMessage(message: DidCommMessage): string {
  return message.thid || message.id;
}

/**
 * Gets data results from polling response body.
 */
export function getDataResults(response: DidCommMessage): any[] {
  return response.body?.data || [];
}