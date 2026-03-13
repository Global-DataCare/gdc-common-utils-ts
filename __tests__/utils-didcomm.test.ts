import { prepareDidCommRequest, includeVpTokenInMessage, includeFileInMessage, getThidFromMessage, getDataResults } from '../src/utils/didcomm';

describe('DIDComm Utils', () => {
  it('should prepare DIDComm request', () => {
    const message = prepareDidCommRequest('test-type', { key: 'value' }, []);
    expect(message.type).toBe('test-type');
    expect(message.body.key).toBe('value');
    expect(message.thid).toBe(message.id);
  });

  it('should include VP token in message', () => {
    const message = prepareDidCommRequest('test-type');
    includeVpTokenInMessage(message, 'vp-token-123');
    expect(message.body.vp_token).toBe('vp-token-123');
  });

  it('should include file in message', () => {
    const message = prepareDidCommRequest('test-type');
    const fileBytes = new Uint8Array([1, 2, 3]);
    includeFileInMessage(message, fileBytes, 'application/pdf', 'file-1');
    expect(message.attachments).toHaveLength(1);
    expect(message.attachments![0].id).toBe('file-1');
    expect(message.attachments![0].media_type).toBe('application/pdf');
    expect(message.attachments![0].data.base64).toBe('AQID');
  });

  it('should get THID from message', () => {
    const message = prepareDidCommRequest('test-type');
    expect(getThidFromMessage(message)).toBe(message.id);
    message.thid = 'custom-thid';
    expect(getThidFromMessage(message)).toBe('custom-thid');
  });

  it('should get data results from response', () => {
    const response = prepareDidCommRequest('response-type');
    response.body.data = [{ id: '1' }, { id: '2' }];
    expect(getDataResults(response)).toEqual([{ id: '1' }, { id: '2' }]);
  });
});