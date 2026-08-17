# 101: organization Test Network credentials

## Teaching goal

Model the evidence shared by a registration portal, a Node BFF and GW CORE
without making the portal status equivalent to tenant admission.

## The one-code rule

`PostalActivationLicenseBinding` describes one purpose-bound licence:

`issued -> delivered -> redeemed`

The clear code is not a VC claim. A host stores a protected digest, the
applicant uses the code to record delivery, and `Token/_exchange` later
consumes that same code. `revoked` and `expired` are terminal.

## The admission VC

`buildOrganizationTestNetworkCredential(...)` creates an
`OrganizationTestNetworkCredential` bound to:

- application and legal-organization identifiers;
- requested network;
- controller email and RFC 9278 public-key commitment;
- postal licence id, address digest and delivered timestamp.

`canonicalizeOrganizationTestNetworkCredential(...)` removes
the complete `proof` property and recursively orders the remaining keys. Every
human or institutional proof therefore signs the same payload.

`buildTestNetworkOrganizationCredentialSet(...)` creates the normal
`OrganizationCredential`, `LegalRepresentativeCredential` and
`ServiceControllerCredential`. Each also carries `TestNetworkCredential`,
`targetNetwork=test-network`, the immutable PDF digest and its domain binding.
They are drafts until the reviewer adds an ML-DSA-65 assertion proof to each.

## Transaction boundary

`LegalOrganizationVerificationTransactionInput.organizationTestNetworkCredential`
carries the admission VC inside the first Bundle entry. Attachments remain
available for production ICA evidence.
`LegalOrganizationVerificationTransactionInput.testNetworkCredentials`
carries exactly three reviewer-signed domain VCs. The Test Network host may
apply this configured review policy; production must keep the ICA path.

These types do not send email, dispatch physical mail, admit a Fabric member,
create an Offer, redeem a code or complete DCR. Those are runtime concerns.
