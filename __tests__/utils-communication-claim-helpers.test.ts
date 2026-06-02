import { describe, expect, it } from '@jest/globals';

import { CommunicationCategoryCodes } from '../src/constants/communication.js';
import {
  addCommunicationCategoryList,
  getCommunicationCategory,
  getCommunicationCategoryList,
  removeCommunicationCategoryList,
  setCommunicationCategory,
} from '../src/utils/communication-claim-helpers.js';
import { CommunicationClaim } from '../src/models/interoperable-claims/communication-claims.js';

describe('communication claim helpers', () => {
  it('stores Communication.category as canonical CSV and exposes list helpers', () => {
    let claims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };

    claims = setCommunicationCategory(claims, [
      CommunicationCategoryCodes.Notification.attributeValue,
    ]);
    claims = addCommunicationCategoryList(claims, [
      CommunicationCategoryCodes.Reminder.attributeValue,
    ]);

    expect(getCommunicationCategory(claims)).toBe([
      CommunicationCategoryCodes.Notification.attributeValue,
      CommunicationCategoryCodes.Reminder.attributeValue,
    ].join(','));
    expect(getCommunicationCategoryList(claims)).toEqual([
      CommunicationCategoryCodes.Notification.attributeValue,
      CommunicationCategoryCodes.Reminder.attributeValue,
    ]);
    expect(String(claims[CommunicationClaim.Category] || '')).toBe([
      CommunicationCategoryCodes.Notification.attributeValue,
      CommunicationCategoryCodes.Reminder.attributeValue,
    ].join(','));
  });

  it('replaces and removes Communication.category tokens cleanly', () => {
    let claims: Record<string, unknown> = { '@context': 'org.hl7.fhir.r4' };

    claims = setCommunicationCategory(claims, [
      CommunicationCategoryCodes.Notification.attributeValue,
      CommunicationCategoryCodes.Reminder.attributeValue,
    ]);
    claims = removeCommunicationCategoryList(claims, [
      CommunicationCategoryCodes.Notification.attributeValue,
    ]);

    expect(getCommunicationCategoryList(claims)).toEqual([
      CommunicationCategoryCodes.Reminder.attributeValue,
    ]);
  });
});
