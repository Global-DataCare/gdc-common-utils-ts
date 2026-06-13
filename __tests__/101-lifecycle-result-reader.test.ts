import { describe, expect, it } from '@jest/globals';

import {
  createLifecycleResultReader,
} from '../src';
import {
  ClaimsOrganizationSchemaorg,
  ClaimsPersonSchemaorg,
} from '../src/constants/schemaorg.js';
import { IssueSeverity } from '../src/models/issue.js';

describe('101: lifecycle result reader', () => {
  it('reads one wrapper result body and exposes neutral entry summaries and identifiers', () => {
    const resultBody = {
      body: {
        data: [
          {
            meta: {
              claims: {
                '@context': 'org.schema',
                [ClaimsPersonSchemaorg.identifier]: 'urn:uuid:employee-1',
              },
            },
            response: { status: '200' },
          },
          {
            meta: {
              claims: {
                '@context': 'org.schema',
                [ClaimsOrganizationSchemaorg.identifier]: 'urn:uuid:individual-1',
              },
            },
            response: {
              status: '409',
              outcome: {
                issue: [{
                  severity: IssueSeverity.Error,
                  diagnostics: 'resource must be disabled before purge',
                }],
              },
            },
          },
        ],
      },
    };

    const reader = createLifecycleResultReader(resultBody);

    expect(reader.getSuccessfulIdentifiers()).toEqual(['urn:uuid:employee-1']);
    expect(reader.getFailedIdentifiers()).toEqual(['urn:uuid:individual-1']);
    expect(reader.getEntrySummaryByIdentifier('urn:uuid:individual-1')).toEqual(
      expect.objectContaining({
        identifier: 'urn:uuid:individual-1',
        responseStatus: '409',
        isSuccessful: false,
      }),
    );
    expect(reader.getResponseAnalysis()).toEqual(
      expect.objectContaining({
        totalOperations: 2,
        successfulOperations: 1,
        errorOperations: 1,
        hasErrors: true,
      }),
    );
  });
});
