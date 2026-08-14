/** Actions accepted by the reusable organization-registration review route. */
export const OrganizationRegistrationReviewActions = Object.freeze({
  MarkPostalDelivered: 'mark_postal_delivered',
  IssuePostalLicense: 'issue_postal_license',
  DownloadDraft: 'download_draft',
  Authorize: 'authorize',
  Reject: 'reject',
} as const);

export type OrganizationRegistrationReviewAction =
  typeof OrganizationRegistrationReviewActions[keyof typeof OrganizationRegistrationReviewActions];

/** Narrows untrusted request input to one supported review action. */
export function isOrganizationRegistrationReviewAction(
  value: unknown,
): value is OrganizationRegistrationReviewAction {
  return typeof value === 'string'
    && Object.values(OrganizationRegistrationReviewActions).includes(value as OrganizationRegistrationReviewAction);
}

/** Stable error identifiers shared by route handlers, services and tests. */
export const OrganizationRegistrationErrors = Object.freeze({
  InvalidReviewAction: 'invalid_review_action',
  ApplicationNotReviewable: 'application_not_reviewable',
  AuthorizationCredentialRequired: 'organization_authorization_credential_required',
  ReviewFailed: 'review_failed',
  InvalidOrganization: 'invalid_organization',
  ApplicationFailed: 'application_failed',
} as const);

/** Default and accepted authorization validity window for registration evidence. */
export const OrganizationRegistrationValidity = Object.freeze({
  DefaultDays: 180,
  MinimumDays: 1,
  MaximumDays: 730,
  MillisecondsPerDay: 86_400_000,
} as const);
