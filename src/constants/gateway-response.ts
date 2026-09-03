import { BundleTypes } from '../models/bundle-editor-types';
import { ResourceTypesFhirR4 } from './fhir-resource-types';
import {
  IdentityAuthResponseEntryTypes,
} from './identity-auth';
import { OrganizationEmployeeSearchResponseEntryTypes } from './employee-lifecycle';

/** URL sections accepted by GW request routing. */
export const GatewayRouteSections = Object.freeze({
  Entity: 'entity',
  Identity: 'identity',
  Individual: 'individual',
  Network: 'network',
  Registry: 'registry',
} as const);

/** URL formats accepted by GW request routing. */
export const GatewayRouteFormats = Object.freeze({
  Auth: 'auth',
  Firebase: 'firebase',
  FhirApi: 'org.hl7.fhir.api',
  OpenId: 'openid',
  SchemaOrg: 'org.schema',
} as const);

/** Shared request-entry discriminator values used by GW, SDK and test fixtures. */
export const GatewayRequestEntryTypes = Object.freeze({
  AllergyIntoleranceDelete: 'AllergyIntolerance-delete-request-v1.0',
  AllergyIntoleranceEdit: 'AllergyIntolerance-edit-request-v1.0',
  CommunicationSend: 'Communication-send-v1.0',
  CompositionEntryAdd: 'Composition-entry-add-v1.0',
  CustomerForm: 'Customer-form-v1.0',
  EmployeeForm: 'Employee-form-v1.0',
  EmployeePurge: 'Employee-purge-request-v1.0',
  EmployeeRegistration: 'Employee-registration-request-v1.0',
  FamilyPurge: 'Family-purge-request-v1.0',
  FamilyRegistrationForm: 'Family-registration-form-v1.0',
  FamilyRegistration: 'Family-registration-request-v1.0',
  ImmunizationCreate: 'Immunization-create-request-v1.0',
  ImmunizationDelete: 'Immunization-delete-request-v1.0',
  MedicationStatementSearch: 'MedicationStatement-search-request-v1.0',
  ObservationCreate: 'Observation-create-request-v1.0',
  OfferSearch: 'Offer-search-request-v1.0',
  OrderSearch: 'Order-search-request-v1.0',
  OrganizationActivation: 'Organization-activation-request-v1.0',
  OrganizationDisable: 'Organization-disable-request-v1.0',
  OrganizationEnable: 'Organization-enable-request-v1.0',
  OrganizationLifecycleStatus: 'Organization-lifecycle-status-request-v1.0',
  OrganizationOrder: 'Organization-order-request-v1.0',
  OrganizationRegistrationForm: 'Organization-registration-form-v1.0',
  PersonDiscover: 'Person-discover-v1.0',
  SubscriptionCreate: 'Subscription-create-v1.0',
} as const);

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
  IndividualLicenseOffer: 'Individual-license-offer-v1.0',
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
