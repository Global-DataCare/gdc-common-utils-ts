import { describe, expect, it } from '@jest/globals';

import {
  HL7_ACT_REASON_CODE_SYSTEM,
  parseServiceActReasonCodes,
  parseServiceActReasonCodings,
  serializeServiceActReasonCodes,
} from '../src/utils/service-act-reasons.js';

describe('service act reasons', () => {
  it('parses the compact same-system CSV form used by flat claims', () => {
    expect(parseServiceActReasonCodings(
      'http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,HRESCH',
    )).toEqual([
      { system: HL7_ACT_REASON_CODE_SYSTEM, code: 'METAMGT' },
      { system: HL7_ACT_REASON_CODE_SYSTEM, code: 'HRESCH' },
    ]);
  });

  it('accepts the expanded repeated-system form for compatibility', () => {
    expect(parseServiceActReasonCodes(
      'http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,http://terminology.hl7.org/CodeSystem/v3-ActReason|HRESCH',
    )).toEqual(['METAMGT', 'HRESCH']);
  });

  it('serializes same-system act reasons back into the compact canonical form', () => {
    expect(serializeServiceActReasonCodes(['metamgt', 'HRESCH'])).toBe(
      'http://terminology.hl7.org/CodeSystem/v3-ActReason|METAMGT,HRESCH',
    );
  });
});
