import { BundleTypes } from '../models/bundle-editor-types';
import { ResourceTypesFhirR4 } from './fhir-resource-types';
import {
  IdentityAuthResponseEntryTypes,
} from './identity-auth';
import { OrganizationEmployeeSearchResponseEntryTypes } from './employee-lifecycle';

/** Shared asynchronous gateway response-entry discriminator values. */
export const GatewayResponseEntryTypes = Object.freeze({
  BundleSearch: 'Bundle-search-response-v1.0',
  BundleSummary: 'Bundle-summary-response-v1.0',
  CommunicationIngestionRequest: 'Communication-ingestion-request-v1.0',
  CommunicationSearch: 'Communication-search-response-v1.0',
  CompositionSearch: 'Composition-search-response-v1.0',
  DeviceRegistered: 'Device:Registered',
  DocumentReferenceSearch: 'DocumentReference-search-response-v1.0',
  EmployeeLicenseOffer: 'Employee-license-offer-v1.0',
  EmployeeSearch: OrganizationEmployeeSearchResponseEntryTypes.Employee,
  FamilyDisable: 'Family-disable-response-v1.0',
  FamilyOrder: 'Family-order-response-v1.0',
  FamilyOwnerDirectory: 'Family-owner-directory-result-v1.0',
  FamilyPurge: 'Family-purge-response-v1.0',
  FamilyRegistrationOffer: 'Family-registration-offer-v1.0',
  FamilySearch: 'Family-search-result-v1.0',
  IcaEnroll: 'IcaEnrollResponse-v1.0',
  LicenseGeneration: 'LicenseGenerationResult',
  LicenseIssued: IdentityAuthResponseEntryTypes.LicenseIssued,
  LicenseSearch: OrganizationEmployeeSearchResponseEntryTypes.License,
  MedicationStatementSearch: 'MedicationStatement-search-response-v1.0',
  MessagingDelete: 'MessagingDeleteResponse-v1.0',
  MessagingGet: 'MessagingGetResponse-v1.0',
  MessagingList: 'MessagingListResponse-v1.0',
  MessagingReceive: 'MessagingReceiveResponse-v1.0',
  MessagingResponse: 'MessagingResponse-v1.0',
  MessagingSend: 'MessagingSendResponse-v1.0',
  OfferSearch: 'Offer-search-response-v1.0',
  OperationOutcome: ResourceTypesFhirR4.OperationOutcome,
  OrganizationActivation: 'Organization-activation-response-v1.0',
  OrganizationLifecycleStatus: 'Organization-lifecycle-status-response-v1.0',
  OrganizationLicenseOffer: 'Organization-license-offer-response-v1.0',
  OrganizationOrder: 'Organization-order-response-v1.0',
  OrganizationPurge: 'Organization-purge-response-v1.0',
  OrderSearch: 'Order-search-response-v1.0',
  RelatedPersonSearch: 'RelatedPerson-search-response-v1.0',
  ResearchSubjectSearch: 'ResearchSubject-search-response-v1.0',
  SubjectSearch: 'Subject-search-response-v1.0',
} as const);

/** Shared asynchronous gateway response-envelope discriminator values. */
export const GatewayEnvelopeTypes = Object.freeze({
  BatchResponse: BundleTypes.batchResponse,
  MessagingResponse: 'messaging-response',
  TransactionResponse: BundleTypes.transactionResponse,
} as const);

/** Non-FHIR resource discriminator values carried inside gateway entries. */
export const GatewayInternalResourceTypes = Object.freeze({
  Document: 'Document',
  IcaEnrollmentResult: 'IcaEnrollmentResult',
} as const);

/** Verification states exposed by shared gateway response contracts. */
export const GatewayVerificationStatuses = Object.freeze({
  Approved: 'approved',
} as const);
