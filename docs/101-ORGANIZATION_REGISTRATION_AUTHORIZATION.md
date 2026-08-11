# 101: organization registration authorization

## Teaching goal

Model the evidence shared by a registration portal, a Node BFF and GW CORE
without making the portal status equivalent to tenant admission.

## The one-code rule

`PostalActivationLicenseBinding` describes one purpose-bound licence:

`issued -> delivered -> redeemed`

The clear code is not a VC claim. A host stores a protected digest, the
applicant uses the code to record delivery, and `Token/_exchange` later
consumes that same code. `revoked` and `expired` are terminal.

## The authorization VC

`buildOrganizationRegistrationAuthorizationCredential(...)` creates an
`OrganizationRegistrationAuthorizationCredential` bound to:

- application and legal-organization identifiers;
- requested network;
- controller email and RFC 9278 public-key commitment;
- postal licence id, address digest and delivered timestamp.

`canonicalizeOrganizationRegistrationAuthorizationCredential(...)` removes
the complete `proof` property and recursively orders the remaining keys. Every
human or institutional proof therefore signs the same payload.

## Transaction boundary

`LegalOrganizationVerificationTransactionInput.authorizationCredential`
carries the out-of-band VC inside the first Bundle entry. Attachments remain
available for production ICA evidence. Test Network may apply a configured
host-verification policy; production must keep the ICA qualified path.

These types do not send email, dispatch physical mail, admit a Fabric member,
create an Offer, redeem a code or complete DCR. Those are runtime concerns.
