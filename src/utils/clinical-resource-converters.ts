// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: src/utils/clinical-resource-converters.ts

export type { FlatClaims, FhirResource } from '../convert/convert-shared';
export {
  flatClaimsToFhirResource,
  fhirResourceToFlatClaims,
} from '../convert/convert-shared';

export {
  medicationStatementFlatToFhirR4,
  medicationStatementFhirR4ToFlat,
} from '../convert/convert-medication-statement';
export {
  allergyIntoleranceFlatToFhirR4,
  allergyIntoleranceFhirR4ToFlat,
} from '../convert/convert-allergy-intolerance';
export {
  conditionFlatToFhirR4,
  conditionFhirR4ToFlat,
} from '../convert/convert-condition';
export {
  deviceUseStatementFlatToFhirR4,
  deviceUseStatementFhirR4ToFlat,
} from '../convert/convert-device-use-statement';
export {
  documentReferenceFlatToFhirR4,
  documentReferenceFhirR4ToFlat,
} from '../convert/convert-document-reference';
export {
  immunizationFlatToFhirR4,
  immunizationFhirR4ToFlat,
} from '../convert/convert-immunization';
export {
  locationFlatToFhirR4,
  locationFhirR4ToFlat,
} from '../convert/convert-location';
export {
  observationFromFlatToFhirR4,
  observationToFlatFhirR4,
  observationFlatToFhirR4,
  observationFhirR4ToFlat,
} from '../convert/convert-observation';
export {
  organizationFlatToFhirR4,
  organizationFhirR4ToFlat,
} from '../convert/convert-organization';
export {
  procedureFlatToFhirR4,
  procedureFhirR4ToFlat,
} from '../convert/convert-procedure';
export {
  deviceFlatToFhirR4,
  deviceFhirR4ToFlat,
} from '../convert/convert-device';
export {
  flagFlatToFhirR4,
  flagFhirR4ToFlat,
} from '../convert/convert-flag';
export {
  carePlanFlatToFhirR4,
  carePlanFhirR4ToFlat,
} from '../convert/convert-care-plan';
export {
  diagnosticReportFlatToFhirR4,
  diagnosticReportFhirR4ToFlat,
} from '../convert/convert-diagnostic-report';
export {
  compositionFlatToFhirR4,
  compositionFhirR4ToFlat,
} from '../convert/convert-composition';
export {
  appointmentFlatToFhirR4,
  appointmentFhirR4ToFlat,
} from '../convert/convert-appointment';
export {
  appointmentResponseFlatToFhirR4,
  appointmentResponseFhirR4ToFlat,
} from '../convert/convert-appointment-response';
export {
  encounterFlatToFhirR4,
  encounterFhirR4ToFlat,
} from '../convert/convert-encounter';
export {
  relatedPersonFlatToFhirR4,
  relatedPersonFhirR4ToFlat,
} from '../convert/convert-related-person';
export {
  coverageFlatToFhirR4,
  coverageFhirR4ToFlat,
} from '../convert/convert-coverage';
export {
  clinicalImpressionFlatToFhirR4,
  clinicalImpressionFhirR4ToFlat,
} from '../convert/convert-clinical-impression';
export {
  consentFlatToFhirR4,
  consentFhirR4ToFlat,
} from '../convert/convert-consent';
export {
  practitionerRoleFlatToFhirR4,
  practitionerRoleFhirR4ToFlat,
} from '../convert/convert-practitioner-role';

import type { FhirResource, FlatClaims } from '../convert/convert-shared';
import { fhirResourceToFlatClaims } from '../convert/convert-shared';
import { medicationStatementFhirR4ToFlat, medicationStatementFlatToFhirR4 } from '../convert/convert-medication-statement';
import { allergyIntoleranceFhirR4ToFlat, allergyIntoleranceFlatToFhirR4 } from '../convert/convert-allergy-intolerance';
import { conditionFhirR4ToFlat, conditionFlatToFhirR4 } from '../convert/convert-condition';
import { deviceUseStatementFhirR4ToFlat, deviceUseStatementFlatToFhirR4 } from '../convert/convert-device-use-statement';
import { documentReferenceFhirR4ToFlat, documentReferenceFlatToFhirR4 } from '../convert/convert-document-reference';
import { immunizationFhirR4ToFlat, immunizationFlatToFhirR4 } from '../convert/convert-immunization';
import { locationFhirR4ToFlat, locationFlatToFhirR4 } from '../convert/convert-location';
import {
  observationFromFlatToFhirR4,
  observationToFlatFhirR4,
} from '../convert/convert-observation';
import { organizationFhirR4ToFlat, organizationFlatToFhirR4 } from '../convert/convert-organization';
import { procedureFhirR4ToFlat, procedureFlatToFhirR4 } from '../convert/convert-procedure';
import { deviceFhirR4ToFlat, deviceFlatToFhirR4 } from '../convert/convert-device';
import { flagFhirR4ToFlat, flagFlatToFhirR4 } from '../convert/convert-flag';
import { carePlanFhirR4ToFlat, carePlanFlatToFhirR4 } from '../convert/convert-care-plan';
import { diagnosticReportFhirR4ToFlat, diagnosticReportFlatToFhirR4 } from '../convert/convert-diagnostic-report';
import { compositionFhirR4ToFlat, compositionFlatToFhirR4 } from '../convert/convert-composition';
import { appointmentFhirR4ToFlat, appointmentFlatToFhirR4 } from '../convert/convert-appointment';
import { appointmentResponseFhirR4ToFlat, appointmentResponseFlatToFhirR4 } from '../convert/convert-appointment-response';
import { encounterFhirR4ToFlat, encounterFlatToFhirR4 } from '../convert/convert-encounter';
import { relatedPersonFhirR4ToFlat, relatedPersonFlatToFhirR4 } from '../convert/convert-related-person';
import { coverageFhirR4ToFlat, coverageFlatToFhirR4 } from '../convert/convert-coverage';
import { clinicalImpressionFhirR4ToFlat, clinicalImpressionFlatToFhirR4 } from '../convert/convert-clinical-impression';
import { consentFhirR4ToFlat, consentFlatToFhirR4 } from '../convert/convert-consent';
import { practitionerRoleFhirR4ToFlat, practitionerRoleFlatToFhirR4 } from '../convert/convert-practitioner-role';

export const medicationStatementFlatToFhir = medicationStatementFlatToFhirR4;
export const medicationStatementFhirToFlat = medicationStatementFhirR4ToFlat;
export const allergyIntoleranceFlatToFhir = allergyIntoleranceFlatToFhirR4;
export const allergyIntoleranceFhirToFlat = allergyIntoleranceFhirR4ToFlat;
export const conditionFlatToFhir = conditionFlatToFhirR4;
export const conditionFhirToFlat = conditionFhirR4ToFlat;
export const deviceUseStatementFlatToFhir = deviceUseStatementFlatToFhirR4;
export const deviceUseStatementFhirToFlat = deviceUseStatementFhirR4ToFlat;
export const documentReferenceFlatToFhir = documentReferenceFlatToFhirR4;
export const documentReferenceFhirToFlat = documentReferenceFhirR4ToFlat;
export const immunizationFlatToFhir = immunizationFlatToFhirR4;
export const immunizationFhirToFlat = immunizationFhirR4ToFlat;
export const locationFlatToFhir = locationFlatToFhirR4;
export const locationFhirToFlat = locationFhirR4ToFlat;
export const observationFlatToFhir = observationFromFlatToFhirR4;
export const observationFhirToFlat = observationToFlatFhirR4;
export const organizationFlatToFhir = organizationFlatToFhirR4;
export const organizationFhirToFlat = organizationFhirR4ToFlat;
export const procedureFlatToFhir = procedureFlatToFhirR4;
export const procedureFhirToFlat = procedureFhirR4ToFlat;
export const deviceFlatToFhir = deviceFlatToFhirR4;
export const deviceFhirToFlat = deviceFhirR4ToFlat;
export const flagFlatToFhir = flagFlatToFhirR4;
export const flagFhirToFlat = flagFhirR4ToFlat;
export const carePlanFlatToFhir = carePlanFlatToFhirR4;
export const carePlanFhirToFlat = carePlanFhirR4ToFlat;
export const diagnosticReportFlatToFhir = diagnosticReportFlatToFhirR4;
export const diagnosticReportFhirToFlat = diagnosticReportFhirR4ToFlat;
export const compositionFlatToFhir = compositionFlatToFhirR4;
export const compositionFhirToFlat = compositionFhirR4ToFlat;
export const appointmentFlatToFhir = appointmentFlatToFhirR4;
export const appointmentFhirToFlat = appointmentFhirR4ToFlat;
export const appointmentResponseFlatToFhir = appointmentResponseFlatToFhirR4;
export const appointmentResponseFhirToFlat = appointmentResponseFhirR4ToFlat;
export const encounterFlatToFhir = encounterFlatToFhirR4;
export const encounterFhirToFlat = encounterFhirR4ToFlat;
export const relatedPersonFlatToFhir = relatedPersonFlatToFhirR4;
export const relatedPersonFhirToFlat = relatedPersonFhirR4ToFlat;
export const coverageFlatToFhir = coverageFlatToFhirR4;
export const coverageFhirToFlat = coverageFhirR4ToFlat;
export const clinicalImpressionFlatToFhir = clinicalImpressionFlatToFhirR4;
export const clinicalImpressionFhirToFlat = clinicalImpressionFhirR4ToFlat;
export const consentFlatToFhir = consentFlatToFhirR4;
export const consentFhirToFlat = consentFhirR4ToFlat;
export const practitionerRoleFlatToFhir = practitionerRoleFlatToFhirR4;
export const practitionerRoleFhirToFlat = practitionerRoleFhirR4ToFlat;

/**
 * Converts a FHIR resource to the semantic flat-claims contract when a
 * resource-specific converter exists. Unsupported resources fall back to the
 * generic structural flattening.
 */
export function convertFhirResourceToClaims(
  resource: FhirResource,
  context: string = 'org.hl7.fhir.api',
): FlatClaims {
  const claims = convertFhirResourceToClaimsByType(resource, context);
  const language = typeof resource.language === 'string' ? resource.language.trim() : '';
  return {
    '@context': context,
    ...claims,
    ...(language ? { [`${resource.resourceType}.language`]: language } : {}),
  };
}

function convertFhirResourceToClaimsByType(
  resource: FhirResource,
  context: string,
): FlatClaims {
  switch (resource.resourceType) {
    case 'MedicationStatement':
      return medicationStatementFhirR4ToFlat(resource);
    case 'AllergyIntolerance':
      return allergyIntoleranceFhirR4ToFlat(resource);
    case 'Condition':
      return conditionFhirR4ToFlat(resource);
    case 'DocumentReference':
      return documentReferenceFhirR4ToFlat(resource);
    case 'DeviceUseStatement':
      return deviceUseStatementFhirR4ToFlat(resource);
    case 'Immunization':
      return immunizationFhirR4ToFlat(resource);
    case 'Location':
      return locationFhirR4ToFlat(resource);
    case 'Observation':
      return observationToFlatFhirR4(resource);
    case 'Organization':
      return organizationFhirR4ToFlat(resource);
    case 'Procedure':
      return procedureFhirR4ToFlat(resource);
    case 'Device':
      return deviceFhirR4ToFlat(resource);
    case 'Flag':
      return flagFhirR4ToFlat(resource);
    case 'CarePlan':
      return carePlanFhirR4ToFlat(resource);
    case 'DiagnosticReport':
      return diagnosticReportFhirR4ToFlat(resource);
    case 'Composition':
      return compositionFhirR4ToFlat(resource);
    case 'Appointment':
      return appointmentFhirR4ToFlat(resource);
    case 'AppointmentResponse':
      return appointmentResponseFhirR4ToFlat(resource);
    case 'Encounter':
      return encounterFhirR4ToFlat(resource);
    case 'RelatedPerson':
      return relatedPersonFhirR4ToFlat(resource);
    case 'Coverage':
      return coverageFhirR4ToFlat(resource);
    case 'ClinicalImpression':
      return clinicalImpressionFhirR4ToFlat(resource);
    case 'Consent':
      return consentFhirR4ToFlat(resource, context);
    case 'PractitionerRole':
      return practitionerRoleFhirR4ToFlat(resource, context);
    default:
      return fhirResourceToFlatClaims(resource, context);
  }
}
