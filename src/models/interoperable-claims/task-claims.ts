// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/models/interoperable-claims/task-claims.ts

/**
 * Canonical claims keys for Task (FHIR-oriented claims-first payloads).
 * These keys are the source of truth for GW/SDK Task claim mapping.
 */
export const TaskClaim = Object.freeze({
  Id: 'Task.id',
  Identifier: 'Task.identifier',
  GroupIdentifier: 'Task.group-identifier',
  Status: 'Task.status',
  StatusReason: 'Task.status-reason',
  BusinessStatus: 'Task.business-status',
  Intent: 'Task.intent',
  Code: 'Task.code',
  Description: 'Task.description',
  Subject: 'Task.subject',
  For: 'Task.for',
  Requester: 'Task.requester',
  Owner: 'Task.owner',
  Focus: 'Task.focus',
  PartOf: 'Task.part-of',
  BasedOn: 'Task.based-on',
  BasedOnDisplay: 'Task.based-on-display',
  Language: 'Task.language',
  Channel: 'Task.channel',
  AuthoredOn: 'Task.authored-on',
  LastModified: 'Task.last-modified',
  ScheduledAt: 'Task.scheduled-at',
  RetryIntervalMinutes: 'Task.retry-interval-minutes',
  MaxAttempts: 'Task.max-attempts',
  TriggerType: 'Task.trigger-type',
  Attempt: 'Task.attempt',
  WindowStart: 'Task.window-start',
  WindowEnd: 'Task.window-end',
  AutoCloseAt: 'Task.auto-close-at',
  EscalationRecipient: 'Task.escalation-recipient',
  Confirmed: 'Task.confirmed',
  ConfirmedAt: 'Task.confirmed-at',
  Repetitions: 'Task.repetitions',
  DaysOfWeek: 'Task.days-of-week',
  RepeatCount: 'Task.repeat-count',
  RepeatDurationValue: 'Task.repeat-duration-value',
  RepeatDurationUnit: 'Task.repeat-duration-unit',
  Modified: 'Task.modified',
  Priority: 'Task.priority',
  RestrictionPeriodStart: 'Task.restriction-period-start',
  RestrictionPeriodEnd: 'Task.restriction-period-end',
  ExecutionPeriodStart: 'Task.execution-period-start',
  ExecutionPeriodEnd: 'Task.execution-period-end',
  OutputType: 'Task.output-type',
  OutputValueReference: 'Task.output-value-reference',
  OutputValueString: 'Task.output-value-string',
  UserSelected: 'Task.user-selected',
} as const);

/** @deprecated Use the canonical, generator-compatible `TaskClaim` object. */
export const TaskClaimsFhirApi = TaskClaim;
