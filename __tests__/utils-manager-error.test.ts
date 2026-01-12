import { ManagerError } from '../src/utils/manager-error.js';
import { IssueType } from '../src/models/issue.js';

describe('ManagerError', () => {
  it('sets name, code, and status from issue type', () => {
    const err = new ManagerError('bad input', IssueType.Invalid);
    expect(err.name).toBe('ManagerError');
    expect(err.code).toBe(IssueType.Invalid);
    expect(err.status).toBe('400');
  });
});
