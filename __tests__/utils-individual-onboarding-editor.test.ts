import { describe, expect, it } from '@jest/globals';

import {
  EXAMPLE_SERVICE_PROVIDER_DOMAIN,
  EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME,
  EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED,
} from '../src/examples/shared';
import { createIndividualOnboardingEditor } from '../src/utils/individual-onboarding-editor';

describe('individual onboarding editor validation', () => {
  it('accepts a minimal current-day draft with valid provider locator/date formats', () => {
    const today = new Date().toISOString().slice(0, 10);
    const validation = createIndividualOnboardingEditor()
      .setSelf(true)
      .setControllerAlternateName(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME)
      .setControllerEmail(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED)
      .setSubjectBirthDate('2020')
      .setConsentDate(today)
      .setServiceProviderDomain(EXAMPLE_SERVICE_PROVIDER_DOMAIN)
      .validate();

    expect(validation.ok).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('rejects malformed or future dates and invalid serviceProviderDomain locators', () => {
    const validation = createIndividualOnboardingEditor()
      .setSelf(false)
      .setControllerAlternateName(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME)
      .setControllerEmail(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED)
      .setSubjectBirthDate('3020-01-01')
      .setConsentDate('2026/06/09')
      .setServiceProviderDomain('Health Index')
      .validate();

    expect(validation.ok).toBe(false);
    expect(validation.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'subject-birth-date-in-future',
      'invalid-doc-date-format',
      'invalid-service-provider-domain',
    ]));
  });

  it('warns when docDate is not today because some flows require same-day acceptance', () => {
    const validation = createIndividualOnboardingEditor()
      .setSelf(true)
      .setControllerAlternateName(EXAMPLE_REGISTERED_SUBJECT_ALTERNATE_NAME)
      .setControllerEmail(EXAMPLE_SELF_REGISTERED_INDIVIDUAL_EMAIL_NORMALIZED)
      .setConsentDate('2026-06-08')
      .validate();

    expect(validation.ok).toBe(true);
    expect(validation.warnings.map((issue) => issue.code)).toContain('doc-date-not-today');
  });
});
