// Flow contract: reuse shared test fixtures and canonical types; do not introduce duplicated literals.

import {
  ClaimConsent,
  CONSENT_PROJECTION_TEST_DATA,
  ConsentDecisions,
  ConsentStatuses,
  consentFhirR4ToFlat,
  consentFhirR5ToFlat,
  consentFlatToFhirR4,
  consentFlatToFhirR5,
} from '../src';

const T = CONSENT_PROJECTION_TEST_DATA;
const [actorRoleSystem, actorRoleCode] = T.actorRole.split('|');
const [resourceTypeSystem, resourceTypeCode] = T.resourceType.split('|');
const provisionCodes = T.provisionCodeList.split(',').map((value) => {
  const [system, code] = value.split('|');
  return { coding: [{ system, code }] };
});

const claims = {
  '@context': 'org.hl7.fhir.api',
  [ClaimConsent.identifier]: T.identifier,
  [ClaimConsent.status]: ConsentStatuses.Active,
  [ClaimConsent.subject]: T.subject,
  [ClaimConsent.date]: T.createdAt,
  [ClaimConsent.decision]: ConsentDecisions.Permit,
  [ClaimConsent.periodStart]: T.consentPeriodStart,
  [ClaimConsent.periodEnd]: T.consentPeriodEnd,
  [ClaimConsent.grantor]: T.grantor,
  [ClaimConsent.grantee]: T.grantee,
  [ClaimConsent.manager]: T.manager,
  [ClaimConsent.controller]: T.controller,
  [ClaimConsent.actorIdentifier]: T.grantee,
  [ClaimConsent.actorRole]: T.actorRole,
  [ClaimConsent.action]: T.action,
  [ClaimConsent.purpose]: T.purpose,
  [ClaimConsent.scope]: T.scope,
  [ClaimConsent.category]: T.category,
  [ClaimConsent.resourceType]: T.resourceType,
  [ClaimConsent.provisionCode]: T.provisionCodeList,
  [ClaimConsent.securityLabel]: T.securityLabel,
  [ClaimConsent.dataPeriodStart]: T.dataPeriodStart,
  [ClaimConsent.dataPeriodEnd]: T.dataPeriodEnd,
  [ClaimConsent.attachmentContentType]: T.attachmentContentType,
  [ClaimConsent.attachmentData]: T.attachmentData,
};

describe('Consent flat claims <-> native FHIR R4/R5', () => {
  it('exports the canonical authorization claims and ODRL source attachment to R4', () => {
    const resource = consentFlatToFhirR4(claims);

    expect(resource.sourceAttachment).toEqual({
      contentType: T.attachmentContentType,
      data: T.attachmentData,
    });
    expect(resource.performer).toEqual([{ reference: T.grantor }]);
    expect(resource.organization).toEqual([{ reference: T.manager }]);
    expect(resource.provision).toMatchObject({
      type: ConsentDecisions.Permit,
      actor: [{
        role: { coding: [{ system: actorRoleSystem, code: actorRoleCode }] },
        reference: { reference: T.grantee },
      }],
      class: [{ system: resourceTypeSystem, code: resourceTypeCode }],
      dataPeriod: { start: T.dataPeriodStart, end: T.dataPeriodEnd },
    });
    expect(resource.provision).toMatchObject({
      code: provisionCodes,
    });
    const {
      [ClaimConsent.controller]: _r5OnlyController,
      ...r4RepresentableClaims
    } = claims;
    expect(consentFhirR4ToFlat(resource)).toMatchObject(r4RepresentableClaims);
  });

  it('exports the same canonical contract using native R5 field names', () => {
    const resource = consentFlatToFhirR5(claims);

    expect(resource).toMatchObject({
      decision: ConsentDecisions.Permit,
      subject: { reference: T.subject },
      date: T.createdAt,
      period: { start: T.consentPeriodStart, end: T.consentPeriodEnd },
      grantor: [{ reference: T.grantor }],
      grantee: [{ reference: T.grantee }],
      manager: [{ reference: T.manager }],
      controller: [{ reference: T.controller }],
      sourceAttachment: [{ contentType: T.attachmentContentType, data: T.attachmentData }],
      provision: [{
        actor: [{ role: { coding: [{ system: actorRoleSystem, code: actorRoleCode }] }, reference: { reference: T.grantee } }],
        resourceType: [{ system: resourceTypeSystem, code: resourceTypeCode }],
        dataPeriod: { start: T.dataPeriodStart, end: T.dataPeriodEnd },
      }],
    });
    expect(consentFhirR5ToFlat(resource)).toMatchObject(claims);
  });

  it('does not invent FHIR fields for ODRL-only constraints', () => {
    const withOdrlOnlyConstraint = {
      ...claims,
      [T.odrlOnlyConstraintName]: T.odrlOnlyConstraintValue,
    };

    expect(JSON.stringify(consentFlatToFhirR5(withOdrlOnlyConstraint))).not.toContain(T.odrlOnlyConstraintName);
  });
});
