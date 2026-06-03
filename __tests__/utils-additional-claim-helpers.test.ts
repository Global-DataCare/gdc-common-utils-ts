import { describe, expect, it } from '@jest/globals';

import { AppointmentClaim } from '../src/models/interoperable-claims/appointment-claims.js';
import { CoverageClaim } from '../src/models/interoperable-claims/coverage-claims.js';
import { DiagnosticReportClaim } from '../src/models/interoperable-claims/diagnostic-report-claims.js';
import { EncounterClaim } from '../src/models/interoperable-claims/encounter-claims.js';
import { LocationClaim } from '../src/models/interoperable-claims/location-claims.js';
import { OrganizationClaim } from '../src/models/interoperable-claims/organization-claims.js';
import {
  getAppointmentParticipantActorList,
  setAppointmentParticipantActorList,
} from '../src/utils/claims-helpers-appointment.js';
import {
  getCoveragePayorList,
  setCoveragePayorList,
} from '../src/utils/claims-helpers-coverage.js';
import {
  getDiagnosticReportResultList,
  setDiagnosticReportResultList,
} from '../src/utils/claims-helpers-diagnostic-report.js';
import {
  getEncounterParticipantList,
  setEncounterParticipantList,
} from '../src/utils/claims-helpers-encounter.js';
import {
  getLocationTelecomList,
  setLocationTelecomList,
} from '../src/utils/claims-helpers-location.js';
import {
  getOrganizationAliasList,
  setOrganizationAliasList,
} from '../src/utils/claims-helpers-organization.js';

describe('additional claim helpers', () => {
  it('stores appointment participant actors as canonical CSV and reads them as list', () => {
    const next = setAppointmentParticipantActorList({}, ['Patient/p1', 'Practitioner/pr1']);
    expect(next[AppointmentClaim.ParticipantActor]).toBe('Patient/p1,Practitioner/pr1');
    expect(getAppointmentParticipantActorList(next)).toEqual(['Patient/p1', 'Practitioner/pr1']);
  });

  it('stores diagnostic report results as canonical CSV and reads them as list', () => {
    const next = setDiagnosticReportResultList({}, ['Observation/o1', 'Observation/o2']);
    expect(next[DiagnosticReportClaim.Result]).toBe('Observation/o1,Observation/o2');
    expect(getDiagnosticReportResultList(next)).toEqual(['Observation/o1', 'Observation/o2']);
  });

  it('stores encounter participants as canonical CSV and reads them as list', () => {
    const next = setEncounterParticipantList({}, ['Practitioner/pr1', 'RelatedPerson/r1']);
    expect(next[EncounterClaim.Participant]).toBe('Practitioner/pr1,RelatedPerson/r1');
    expect(getEncounterParticipantList(next)).toEqual(['Practitioner/pr1', 'RelatedPerson/r1']);
  });

  it('stores coverage payors as canonical CSV and reads them as list', () => {
    const next = setCoveragePayorList({}, ['Organization/payor-1', 'Organization/payor-2']);
    expect(next[CoverageClaim.Payor]).toBe('Organization/payor-1,Organization/payor-2');
    expect(getCoveragePayorList(next)).toEqual(['Organization/payor-1', 'Organization/payor-2']);
  });

  it('stores organization aliases as canonical CSV and reads them as list', () => {
    const next = setOrganizationAliasList({}, ['Cardiology', 'Heart Clinic']);
    expect(next[OrganizationClaim.Alias]).toBe('Cardiology,Heart Clinic');
    expect(getOrganizationAliasList(next)).toEqual(['Cardiology', 'Heart Clinic']);
  });

  it('stores location telecom values as canonical CSV and reads them as list', () => {
    const next = setLocationTelecomList({}, ['tel:+16045550102', 'mailto:consultation@example.org']);
    expect(next[LocationClaim.Telecom]).toBe('tel:+16045550102,mailto:consultation@example.org');
    expect(getLocationTelecomList(next)).toEqual(['tel:+16045550102', 'mailto:consultation@example.org']);
  });
});
