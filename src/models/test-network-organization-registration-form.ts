/**
 * Host-service fields written by the portal BFF. They are deployment facts,
 * not editable applicant input.
 */
export interface TestNetworkProviderPdfForm {
  hostServiceCountry: string;
  hostServiceLegalName: string;
  hostServiceTaxId: string;
  hostServiceUrl: string;
}

/** Legal-organization fields captured from the applicant. */
export interface TestNetworkLegalOrganizationPdfForm {
  'Identification number': string;
  organizationLegalName: string;
  organizationName: string;
  organizationAddressCountry: string;
  organizationAddressRegion: string;
  organizationOfficialLicense: string;
  organizationAddressPostalCode: string;
  organizationAddressLine: string;
  organizationAddressCity: string;
  organizationContactUrl: string;
  organizationContactEmail: string;
  organizationContactPhone: string;
  organizationServiceCategory: string;
  organizationIdentifierType: string;
  organizationIndexProvider: boolean;
  organizationResearchProvider: boolean;
}

/** Legal-representative fields captured from the applicant. */
export interface TestNetworkLegalRepresentativePdfForm {
  representativeFullName: string;
  representativeContactEmail: string;
  representativeContactPhone: string;
  representativeIdentifierType: string;
  representativeIdentifierValue: string;
  representativeIdentifierCountry: string;
  representativeIdentifierRegion: string;
  representativeSelfDeclaration: boolean;
  'I confirm that I am duly authorized by the organization to submit this application': boolean;
}

/** Technical-controller fields captured from the applicant. */
export interface TestNetworkControllerPdfForm {
  controllerFullName: string;
  controllerContactEmail: string;
  controllerContactPhone: string;
  controllerIdentifierType: string;
  controllerIdentifierValue: string;
  controllerIdentifierCountry: string;
  controllerIdentifierRegion: string;
  representativeIsController: boolean;
  'The legal representative and the technical controller of the service are the same person': boolean;
}

/**
 * Immutable values added by the portal BFF after browser validation. The JWK
 * commitment is generated from the server-created controller key; the browser
 * must never be allowed to replace it.
 */
export interface TestNetworkRegistrationDocumentMetadata {
  docVersion: string;
  signDate: string;
  controllerKeyCommitment: string;
}

/**
 * Canonical AcroForm projection used by the Test Network registration PDF.
 * The property names are the PDF field names, including the two historical
 * sentence-shaped checkbox names present in the supplied form.
 */
export type TestNetworkOrganizationRegistrationPdfForm =
  TestNetworkProviderPdfForm
  & TestNetworkLegalOrganizationPdfForm
  & TestNetworkLegalRepresentativePdfForm
  & TestNetworkControllerPdfForm
  & TestNetworkRegistrationDocumentMetadata;

export const TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS = Object.freeze([
  'Identification number',
  'I confirm that I am duly authorized by the organization to submit this application',
  'The legal representative and the technical controller of the service are the same person',
  'hostServiceCountry',
  'hostServiceLegalName',
  'hostServiceTaxId',
  'hostServiceUrl',
  'organizationLegalName',
  'organizationName',
  'organizationAddressCountry',
  'organizationAddressRegion',
  'organizationOfficialLicense',
  'organizationAddressPostalCode',
  'organizationAddressLine',
  'organizationAddressCity',
  'organizationContactUrl',
  'organizationContactEmail',
  'organizationContactPhone',
  'representativeContactEmail',
  'representativeFullName',
  'representativeIdentifierValue',
  'representativeIdentifierCountry',
  'representativeIdentifierRegion',
  'controllerContactPhone',
  'controllerFullName',
  'controllerContactEmail',
  'controllerIdentifierValue',
  'controllerIdentifierCountry',
  'controllerIdentifierRegion',
  'representativeContactPhone',
  'organizationServiceCategory',
  'representativeIdentifierType',
  'controllerIdentifierType',
  'representativeSelfDeclaration',
  'representativeIsController',
  'docVersion',
  'signDate',
  'organizationIndexProvider',
  'organizationResearchProvider',
  'organizationIdentifierType',
  'controllerKeyCommitment',
] as const);

export type TestNetworkOrganizationRegistrationPdfFieldName =
  typeof TEST_NETWORK_ORGANIZATION_REGISTRATION_PDF_FIELDS[number];
