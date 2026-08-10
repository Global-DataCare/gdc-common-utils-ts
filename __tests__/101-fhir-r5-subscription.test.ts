import {
  buildFhirR5RestHookSubscription,
  buildFhirR5SubscriptionBatch,
  buildFhirR5SubscriptionNotification,
  FhirR5SubscriptionScopes,
  matchesFhirR5SubscriptionEvent,
  type FhirR5SubscriptionTopic,
} from '../src';

describe('101: FHIR R5 Subscription', () => {
  const topic: FhirR5SubscriptionTopic = {
    resourceType: 'SubscriptionTopic', id: 'new-data',
    url: 'https://profiles.example/SubscriptionTopic/new-data', status: 'active',
    resourceTrigger: [{ resource: 'Observation' }],
    canFilterBy: [{ resourceType: 'Observation', filterParameter: 'patient', comparator: ['eq'] }],
  };

  it('builds tenant and individual gateway routes without a product dependency', () => {
    const subscription = buildFhirR5RestHookSubscription({
      id: 'tenant-new-data', scope: FhirR5SubscriptionScopes.Tenant,
      topic: topic.url, endpoint: 'https://bff.example/fhir/subscriptions',
      filters: [{ resourceType: 'Observation', filterParameter: 'patient', value: 'Patient/123' }],
    });
    expect(buildFhirR5SubscriptionBatch(subscription, FhirR5SubscriptionScopes.Tenant).path)
      .toBe('entity/org.hl7.fhir.r5/Subscription/_batch');
  });

  it('matches an active topic/filter and builds a standard notification Bundle', () => {
    const requested = buildFhirR5RestHookSubscription({
      id: 'subject-new-data', scope: FhirR5SubscriptionScopes.Individual,
      topic: topic.url, endpoint: 'https://personal.example/fhir/subscriptions',
      filters: [{ resourceType: 'Observation', filterParameter: 'patient', value: 'Patient/123' }],
    });
    const subscription = { ...requested, status: 'active' as const };
    expect(matchesFhirR5SubscriptionEvent(subscription, topic, {
      resourceType: 'Observation', id: 'obs-1', subject: { reference: 'Patient/123' },
    })).toBe(true);
    expect(buildFhirR5SubscriptionNotification({
      subscriptionReference: 'Subscription/subject-new-data', topic: topic.url,
      eventNumber: 1, eventsSinceSubscriptionStart: 1, focusReference: 'Observation/obs-1',
    }).type).toBe('subscription-notification');
  });
});
