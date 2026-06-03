import { describe, expect, it } from '@jest/globals';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { LocationClaim } from '../src/models/interoperable-claims/location-claims.js';
import { OrganizationClaim } from '../src/models/interoperable-claims/organization-claims.js';
import {
  buildBundleDocumentFromClaims,
  extractBundleDocumentClaimsList,
} from '../src/utils/bundle-document-builder.js';

describe('101 bundle other resource claims', () => {
  it('extracts Organization and Location claims from a non-IPS support bundle', () => {
    const bundle = {
      resourceType: ResourceTypesFhirR4.Bundle,
      type: 'document',
      entry: [
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Composition,
            id: 'composition-1',
            type: {
              coding: [{ system: 'http://loinc.org', code: '11503-0' }],
            },
            section: [
              {
                code: {
                  coding: [{ system: 'http://loinc.org', code: '46240-8' }],
                },
                entry: [
                  { reference: 'Organization/dept-cardiology-001' },
                  { reference: 'Location/room-201' },
                ],
              },
            ],
          },
        },
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Organization,
            identifier: [{ value: 'dept-cardiology-001' }],
            active: true,
            type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/organization-type', code: 'dept' }] }],
            name: 'Cardiology Department',
            alias: ['Cardiology', 'Heart Clinic'],
            telecom: [{ value: 'tel:+16045550101' }, { value: 'mailto:cardiology@example.org' }],
            address: [{ text: '123 Main St, Vancouver' }],
          },
        },
        {
          resource: {
            resourceType: ResourceTypesFhirR4.Location,
            identifier: [{ value: 'room-201' }],
            status: 'active',
            name: 'Consultation Room 201',
            description: 'Second floor consultation room',
            type: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode', code: 'OF' }] }],
            mode: 'instance',
            telecom: [{ value: 'tel:+16045550102' }],
            address: { text: '123 Main St, Vancouver' },
            physicalType: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/location-physical-type', code: 'ro' }] },
            managingOrganization: { reference: 'Organization/dept-cardiology-001' },
          },
        },
      ],
    };

    const claimsList = extractBundleDocumentClaimsList(bundle);
    expect(claimsList).toHaveLength(2);

    const organizationClaims = claimsList.find((claims) =>
      Object.keys(claims).some((key) => key.startsWith('Organization.')),
    );
    const locationClaims = claimsList.find((claims) =>
      Object.keys(claims).some((key) => key.startsWith('Location.')),
    );

    expect(organizationClaims?.[OrganizationClaim.Name]).toBe('Cardiology Department');
    expect(organizationClaims?.[OrganizationClaim.Alias]).toBe('Cardiology,Heart Clinic');
    expect(locationClaims?.[LocationClaim.Name]).toBe('Consultation Room 201');
    expect(locationClaims?.[LocationClaim.ManagingOrganization]).toBe('Organization/dept-cardiology-001');
  });

  it('rebuilds a support bundle from Organization and Location claims', () => {
    const claimsList = [
      {
        [OrganizationClaim.Identifier]: 'dept-cardiology-001',
        [OrganizationClaim.Active]: 'true',
        [OrganizationClaim.Type]: 'http://terminology.hl7.org/CodeSystem/organization-type|dept',
        [OrganizationClaim.Name]: 'Cardiology Department',
        [OrganizationClaim.Alias]: 'Cardiology,Heart Clinic',
        [OrganizationClaim.Telecom]: 'tel:+16045550101,mailto:cardiology@example.org',
      },
      {
        [LocationClaim.Identifier]: 'room-201',
        [LocationClaim.Status]: 'active',
        [LocationClaim.Name]: 'Consultation Room 201',
        [LocationClaim.Description]: 'Second floor consultation room',
        [LocationClaim.Type]: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode|OF',
        [LocationClaim.Mode]: 'instance',
        [LocationClaim.Telecom]: 'tel:+16045550102',
        [LocationClaim.PhysicalType]: 'http://terminology.hl7.org/CodeSystem/location-physical-type|ro',
        [LocationClaim.ManagingOrganization]: 'Organization/dept-cardiology-001',
      },
    ];

    const bundle = buildBundleDocumentFromClaims({
      claimsList,
      compositionType: 'http://loinc.org|11503-0',
    });

    expect(bundle.resourceType).toBe(ResourceTypesFhirR4.Bundle);
    expect(bundle.type).toBe('document');

    const resources = (bundle.entry as Array<{ resource: Record<string, unknown> }>).map((entry) => entry.resource);
    const organization = resources.find((resource) => resource.resourceType === ResourceTypesFhirR4.Organization);
    const location = resources.find((resource) => resource.resourceType === ResourceTypesFhirR4.Location);

    expect(organization).toBeDefined();
    expect(location).toBeDefined();
    expect((organization?.name as string | undefined)).toBe('Cardiology Department');
    expect((location?.name as string | undefined)).toBe('Consultation Room 201');
  });
});
