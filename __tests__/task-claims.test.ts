// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.
import { TaskClaim, TaskClaimsFhirApi } from '../src/models/interoperable-claims/task-claims.js';

describe('canonical flat Task claims', () => {
  it('exports the mandatory R5 workflow fields and job correlation fields', () => {
    expect(TaskClaim.Status).toBe('Task.status');
    expect(TaskClaim.Intent).toBe('Task.intent');
    expect(TaskClaim.Identifier).toBe('Task.identifier');
    expect(TaskClaim.GroupIdentifier).toBe('Task.group-identifier');
    expect(TaskClaim.For).toBe('Task.for');
    expect(TaskClaim.Requester).toBe('Task.requester');
    expect(TaskClaim.ExecutionPeriodStart).toBe('Task.execution-period-start');
    expect(TaskClaim.ExecutionPeriodEnd).toBe('Task.execution-period-end');
    expect(TaskClaim.LastModified).toBe('Task.last-modified');
    expect(TaskClaim.OutputValueReference).toBe('Task.output-value-reference');
    expect(TaskClaim.UserSelected).toBe('Task.user-selected');
  });

  it('keeps the historical export as an alias of the canonical object', () => {
    expect(TaskClaimsFhirApi).toBe(TaskClaim);
    expect(TaskClaimsFhirApi.BasedOnDisplay).toBe('Task.based-on-display');
  });
});
