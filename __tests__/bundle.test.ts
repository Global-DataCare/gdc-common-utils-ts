// Copyright 2025 Antifraud Services Inc. under the Apache License, Version 2.0.

import { extractResources, getNextLink } from '../src/utils/bundle';

describe('bundle utils', () => {
  it('extracts resources from FHIR bundle entry', () => {
    const bundle = {
      entry: [{ resource: { id: 'r1' } }, { resource: { id: 'r2' } }],
    };
    expect(extractResources(bundle)).toEqual([{ id: 'r1' }, { id: 'r2' }]);
  });

  it('extracts resources from JSON:API data', () => {
    const bundle = {
      data: [{ resource: { id: 'r1' } }, { id: 'r2' }],
    };
    expect(extractResources(bundle)).toEqual([{ id: 'r1' }, { id: 'r2' }]);
  });

  it('returns resource fallback when bundle is a resource', () => {
    const bundle = { resourceType: 'Patient', id: 'p1' };
    expect(extractResources(bundle)).toEqual([bundle]);
  });

  it('reads next link', () => {
    const bundle = { link: [{ relation: 'next', url: 'https://next' }] };
    expect(getNextLink(bundle)).toBe('https://next');
  });
});
