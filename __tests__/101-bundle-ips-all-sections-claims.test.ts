import { describe, expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import { ResourceTypesFhirR4 } from '../src/constants/fhir-resource-types.js';
import { AllergyIntoleranceClaim } from '../src/models/interoperable-claims/allergy-intolerance-claims.js';
import { CarePlanClaim } from '../src/models/interoperable-claims/care-plan-claims.js';
import { ConditionClaim } from '../src/models/interoperable-claims/condition-claims.js';
import { DeviceClaim } from '../src/models/interoperable-claims/device-claims.js';
import { DeviceUseStatementClaim } from '../src/models/interoperable-claims/device-use-statement-claims.js';
import { DocumentReferenceClaim } from '../src/models/interoperable-claims/document-reference-claims.js';
import { FlagClaim } from '../src/models/interoperable-claims/flag-claims.js';
import { ImmunizationClaim } from '../src/models/interoperable-claims/immunization-claims.js';
import { MedicationStatementClaim } from '../src/models/interoperable-claims/medication-statement-claims.js';
import { ObservationClaim } from '../src/models/interoperable-claims/observation-claims.js';
import { ProcedureClaim } from '../src/models/interoperable-claims/procedure-claims.js';
import { extractBundleDocumentClaimsList } from '../src/utils/bundle-document-builder.js';

const IPS_BUNDLE_PATH = path.resolve(process.cwd(), '..', 'Bundle-bundle-ips-all-sections.json');

describe('101 IPS bundle all sections claims', () => {
  it('extracts one flat-claims object per non-demographic resource from the real IPS bundle', () => {
    const bundle = JSON.parse(fs.readFileSync(IPS_BUNDLE_PATH, 'utf8'));
    const claimsList = extractBundleDocumentClaimsList(bundle);

    expect(claimsList).toHaveLength(37);

    const byResourceType = new Map<string, Record<string, unknown>[]>();
    for (const claims of claimsList) {
      const firstKey = Object.keys(claims).find((key) => key !== '@context') || '';
      const resourceType = firstKey.split('.')[0];
      const list = byResourceType.get(resourceType) || [];
      list.push(claims as Record<string, unknown>);
      byResourceType.set(resourceType, list);
    }

    expect(byResourceType.get(ResourceTypesFhirR4.AllergyIntolerance)?.[0]?.[AllergyIntoleranceClaim.Code]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.Condition)?.[0]?.[ConditionClaim.Code]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.MedicationStatement)?.[0]?.[MedicationStatementClaim.Status]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.Immunization)?.[0]?.[ImmunizationClaim.VaccineCode]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.Observation)?.[0]?.[ObservationClaim.Code]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.Procedure)?.[0]?.[ProcedureClaim.Code]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.DeviceUseStatement)?.[0]?.[DeviceUseStatementClaim.Device]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.Device)?.[0]?.[DeviceClaim.Type]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.Flag)?.[0]?.[FlagClaim.Subject]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.CarePlan)?.[0]?.[CarePlanClaim.Status]).toBeDefined();
    expect(byResourceType.get(ResourceTypesFhirR4.DocumentReference)?.[0]?.[DocumentReferenceClaim.ContentType]).toBeDefined();
  });
});
