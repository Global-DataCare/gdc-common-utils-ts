# 101: organization Test Network credentials

## Teaching goal

Model the evidence shared by a registration portal, a Node BFF and GW CORE
without making the portal status equivalent to tenant admission.

## Separate postal-address verification

`PostalActivationLicenseBinding` remains a reusable model for a future,
independent postal-address verification flow:

`issued -> delivered -> redeemed`

It is not a Test Network admission precondition and is never embedded by
`buildOrganizationTestNetworkCredential(...)`. The `postalLicense` builder
input is deprecated compatibility input and is ignored.

The reusable `PostalActivationLicenseBinding.protectedCode` shape owns the
server-side `algorithm`, `salt` and `digest`; these values are protected
persistence metadata, never business claims. A clear value submitted later in
an Order uses the standard Schema.org `Order.confirmationNumber` claim.

## The admission VC

`buildOrganizationTestNetworkCredential(...)` creates an
`OrganizationTestNetworkCredential` bound to:

- application and legal-organization identifiers;
- requested network;
- controller email and RFC 9278 public-key commitment;

`canonicalizeOrganizationTestNetworkCredential(...)` removes
the complete `proof` property and recursively orders the remaining keys. Every
human or institutional proof therefore signs the same payload.

`buildTestNetworkOrganizationCredentialSet(...)` creates the normal
`OrganizationCredential`, `LegalRepresentativeCredential` and
`ServiceControllerCredential`. Each also carries `TestNetworkCredential`,
`TestNetworkCredential` in the signed `type[]`, the immutable PDF digest and
its domain binding. Do not add `targetNetwork` to schema.org credential
subjects; the credential type is the environment discriminator.
They are drafts until the reviewer adds an ML-DSA-65 assertion proof to each.

## Transaction boundary

`LegalOrganizationVerificationTransactionInput.organizationTestNetworkCredential`
carries the admission VC inside the first Bundle entry. Attachments remain
available for production ICA evidence.
`LegalOrganizationVerificationTransactionInput.testNetworkCredentials`
carries exactly three reviewer-signed domain VCs. The Test Network host may
apply this configured review policy; production must keep the ICA path.

These types do not send email, verify a postal address, admit a Fabric member,
create an Offer, issue/exchange its activation credential or complete DCR.
Those are separate runtime concerns.
