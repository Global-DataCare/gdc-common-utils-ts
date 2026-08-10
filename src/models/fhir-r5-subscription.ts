/** Standard FHIR R5 Subscription channel coding. */
export const FhirR5SubscriptionChannelTypes = Object.freeze({ RestHook: 'rest-hook' } as const);

export const FhirR5SubscriptionScopes = Object.freeze({
  Individual: 'individual',
  Tenant: 'tenant',
} as const);

export type FhirR5SubscriptionScope = typeof FhirR5SubscriptionScopes[keyof typeof FhirR5SubscriptionScopes];

export interface FhirR5SubscriptionFilter {
  resourceType?: string;
  filterParameter: string;
  comparator?: 'eq' | 'ne';
  modifier?: string;
  value: string;
}

export interface FhirR5Subscription {
  resourceType: 'Subscription';
  id: string;
  status: 'requested' | 'active' | 'error' | 'off' | 'entered-in-error';
  topic: string;
  reason?: string;
  filterBy?: FhirR5SubscriptionFilter[];
  channelType: { system?: string; code: string };
  endpoint?: string;
  parameter?: Array<{ name: string; value: string }>;
  contentType?: string;
  content?: 'empty' | 'id-only' | 'full-resource';
  heartbeatPeriod?: number;
  timeout?: number;
  maxCount?: number;
}

export interface FhirR5SubscriptionTopicFilterDefinition {
  resourceType?: string;
  filterParameter: string;
  comparator?: Array<'eq' | 'ne'>;
  modifier?: string[];
}

export interface FhirR5SubscriptionTopic {
  resourceType: 'SubscriptionTopic';
  id: string;
  url: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  title?: string;
  description?: string;
  resourceTrigger: Array<{ resource: string }>;
  canFilterBy?: FhirR5SubscriptionTopicFilterDefinition[];
}

export interface BuildFhirR5RestHookSubscriptionInput {
  id: string;
  scope: FhirR5SubscriptionScope;
  topic: string;
  endpoint: string;
  filters?: readonly FhirR5SubscriptionFilter[];
  reason?: string;
  contentType?: string;
  heartbeatPeriod?: number;
  timeout?: number;
}

function requiredText(value: string, label: string): string {
  const normalized = String(value || '').trim();
  if (!normalized) throw new Error(`${label} is required.`);
  return normalized;
}

function absoluteHttpsUrl(value: string, label: string): string {
  const normalized = requiredText(value, label);
  let parsed: URL;
  try { parsed = new URL(normalized); } catch { throw new Error(`${label} must be an absolute HTTPS URL.`); }
  if (parsed.protocol !== 'https:') throw new Error(`${label} must be an absolute HTTPS URL.`);
  return parsed.href;
}

/** Builds a reusable standards-shaped FHIR R5 rest-hook Subscription. */
export function buildFhirR5RestHookSubscription(
  input: BuildFhirR5RestHookSubscriptionInput,
): FhirR5Subscription {
  const filters = (input.filters || []).map((filter) => ({
    ...(filter.resourceType ? { resourceType: requiredText(filter.resourceType, 'Subscription filter resourceType') } : {}),
    filterParameter: requiredText(filter.filterParameter, 'Subscription filter parameter'),
    ...(filter.comparator ? { comparator: filter.comparator } : {}),
    ...(filter.modifier ? { modifier: filter.modifier } : {}),
    value: requiredText(filter.value, 'Subscription filter value'),
  }));
  if (input.scope === FhirR5SubscriptionScopes.Individual) {
    const exactSubject = filters.some((filter) =>
      ['patient', 'subject'].includes(filter.filterParameter.toLowerCase())
      && !filter.value.includes('*') && !filter.value.includes(','));
    if (!exactSubject) throw new Error('An individual-scoped Subscription requires an exact patient or subject filter.');
  }
  return {
    resourceType: 'Subscription',
    id: requiredText(input.id, 'Subscription id'),
    status: 'requested',
    topic: absoluteHttpsUrl(input.topic, 'Subscription topic'),
    reason: input.reason?.trim() || 'Notify the registered BFF when matching data changes.',
    ...(filters.length ? { filterBy: filters } : {}),
    channelType: {
      system: 'http://terminology.hl7.org/CodeSystem/subscription-channel-type',
      code: FhirR5SubscriptionChannelTypes.RestHook,
    },
    endpoint: absoluteHttpsUrl(input.endpoint, 'Subscription endpoint'),
    contentType: input.contentType?.trim() || 'application/fhir+json',
    content: 'id-only',
    ...(input.heartbeatPeriod !== undefined ? { heartbeatPeriod: input.heartbeatPeriod } : {}),
    ...(input.timeout !== undefined ? { timeout: input.timeout } : {}),
  };
}

/** Builds the relative gateway `_batch` request for a Subscription resource. */
export function buildFhirR5SubscriptionBatch(subscription: FhirR5Subscription, scope: FhirR5SubscriptionScope) {
  const section = scope === FhirR5SubscriptionScopes.Individual ? 'individual' : 'entity';
  return {
    path: `${section}/org.hl7.fhir.r5/Subscription/_batch`,
    body: {
      resourceType: 'Bundle' as const,
      type: 'batch' as const,
      entry: [{ request: { method: 'POST' as const, url: 'Subscription' as const }, resource: subscription }],
    },
  };
}

/** Builds the standard R5 notification Bundle delivered to a subscriber. */
export function buildFhirR5SubscriptionNotification(input: {
  subscriptionReference: string;
  topic?: string;
  eventNumber: number;
  focusReference: string;
  eventsSinceSubscriptionStart: number;
  timestamp?: string;
  additionalContextReferences?: readonly string[];
}) {
  const timestamp = input.timestamp || new Date().toISOString();
  return {
    resourceType: 'Bundle' as const,
    type: 'subscription-notification' as const,
    timestamp,
    entry: [{
      fullUrl: 'urn:uuid:subscription-status',
      resource: {
        resourceType: 'SubscriptionStatus' as const,
        status: 'active' as const,
        type: 'event-notification' as const,
        subscription: { reference: requiredText(input.subscriptionReference, 'Subscription reference') },
        ...(input.topic ? { topic: input.topic } : {}),
        eventsSinceSubscriptionStart: String(input.eventsSinceSubscriptionStart),
        notificationEvent: [{
          eventNumber: String(input.eventNumber),
          timestamp,
          focus: { reference: requiredText(input.focusReference, 'Notification focus reference') },
          ...(input.additionalContextReferences?.length ? {
            additionalContext: input.additionalContextReferences.map((reference) => ({ reference })),
          } : {}),
        }],
      },
    }],
  };
}

function readPath(resource: Record<string, any>, path: string): string[] {
  const aliases: Record<string, string[]> = {
    patient: ['patient.reference', 'subject.reference'],
    subject: ['subject.reference', 'patient.reference'],
  };
  const paths = aliases[path.toLowerCase()] || [path];
  const values: string[] = [];
  for (const candidate of paths) {
    let current: any[] = [resource];
    for (const part of candidate.split('.')) {
      current = current.flatMap((value) => {
        const next = value?.[part];
        return Array.isArray(next) ? next : next === undefined ? [] : [next];
      });
    }
    values.push(...current.map((value) => String(value)).filter(Boolean));
  }
  return values;
}

/** Evaluates the initial portable `eq`/`ne` SubscriptionTopic filter profile. */
export function matchesFhirR5SubscriptionEvent(
  subscription: FhirR5Subscription,
  topic: FhirR5SubscriptionTopic,
  resource: Record<string, any>,
): boolean {
  if (subscription.status !== 'active' || topic.status !== 'active' || subscription.topic !== topic.url) return false;
  const resourceType = String(resource.resourceType || '');
  if (!topic.resourceTrigger.some((trigger) => trigger.resource === resourceType)) return false;
  return (subscription.filterBy || []).every((filter) => {
    if (filter.resourceType && filter.resourceType !== resourceType) return true;
    const allowed = (topic.canFilterBy || []).find((candidate) =>
      candidate.filterParameter === filter.filterParameter
      && (!candidate.resourceType || candidate.resourceType === resourceType));
    if (!allowed) return false;
    const comparator = filter.comparator || 'eq';
    if (allowed.comparator?.length && !allowed.comparator.includes(comparator)) return false;
    const match = readPath(resource, filter.filterParameter).includes(filter.value);
    return comparator === 'ne' ? !match : match;
  });
}
