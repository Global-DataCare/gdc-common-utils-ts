import { describe, expect, it } from '@jest/globals';

import { EXAMPLE_ORGANIZATION_DID_BINDING_BUNDLE } from '../src/examples/organization-did-binding';
import {
  EXAMPLE_CONTROLLER_BINDING,
  EXAMPLE_TENANT_SERVICE_DID,
} from '../src/examples/shared';
import {
  buildOrganizationDidBindingBundle,
  OrganizationDidBindingEntryTypes,
  validateOrganizationDidBindingInput,
} from '../src/utils/organization-did-binding';

describe('organization DID binding utils', () => {
  it('accepts organization.url and normalizes it into an alias list', () => {
    const result = validateOrganizationDidBindingInput({
      organization: {
        url: 'https://provider.example.org, did:web:provider.example.org',
      },
    });

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.normalizedInput.organization.url).toEqual(['https://provider.example.org', 'did:web:provider.example.org']);
  });

  it('rejects requests that omit organization.url', () => {
    const result = validateOrganizationDidBindingInput({
      organization: {
        url: '',
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toEqual([
      'MISSING_ORGANIZATION_URL',
    ]);
  });

  it('rejects legacy taxID and identifier locators because the tenant path is the locator', () => {
    const result = validateOrganizationDidBindingInput({
      organization: {
        url: 'https://provider.example.org',
        taxID: 'VATES-B00112233',
        identifier: 'did:web:provider.example.org',
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toEqual([
      'UNSUPPORTED_ORGANIZATION_LOCATOR',
    ]);
  });

  it('builds the canonical bundle using the shared binding example without introducing ad hoc literals', () => {
    const firstEntry = EXAMPLE_ORGANIZATION_DID_BINDING_BUNDLE.data[0] as any;

    expect(EXAMPLE_ORGANIZATION_DID_BINDING_BUNDLE.type).toBe('collection');
    expect(firstEntry?.type).toBe(OrganizationDidBindingEntryTypes.Request);
    expect(firstEntry?.resource?.organization?.url).toEqual([
      'https://provider.example.org',
      EXAMPLE_TENANT_SERVICE_DID,
    ]);
    expect(firstEntry?.resource?.controller?.sameAs).toBe(EXAMPLE_CONTROLLER_BINDING.sameAs);
  });

  it('throws when building a bundle without organization.url', () => {
    expect(() => buildOrganizationDidBindingBundle({
      organization: {
        url: '',
      },
    })).toThrow('requires at least one organization.url');
  });
});
