// Flow contract: canonical Consent.provision-code narrows resource coverage using trusted instance codes; missing context cannot turn a constrained permit into a wildcard, while explicit denials, unassigned sections and unconstrained legacy rules retain their existing semantics.
import {evaluateConsentCoverage} from '../src/utils/consent'
import {ClaimConsent as C,ConsentDecisions,ConsentStatuses,type ConsentDecision,type ConsentRule} from '../src/models/consent-rule'
import type {ConsentCoverageRequest} from '../src/models/consent-access'
import {EXAMPLE_CONSENT_ACCESS_RULES,EXAMPLE_CONSENT_ACCESS_SUBJECT,EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL} from '../src/examples/consent-access'
import {EXAMPLE_ENCOUNTER_CLASS,EXAMPLE_ENCOUNTER_REASON_CODE} from '../src/examples/shared'
import {IndividualLogicalSections} from '../src/constants/individual-sections'
import {HealthcareConsentPurposes} from '../src/constants/healthcare'
import {ResourceTypesFhirR4} from '../src/constants/fhir-resource-types'

const original=EXAMPLE_CONSENT_ACCESS_RULES.relatedPersonClinicalSections
const section=IndividualLogicalSections.Encounters.attributeValue
const request:ConsentCoverageRequest={subject:EXAMPLE_CONSENT_ACCESS_SUBJECT,actor:{actorKind:'related-person',email:EXAMPLE_CONSENT_ACCESS_RELATED_PERSON_EMAIL},actorRole:original[C.actorRole],purpose:HealthcareConsentPurposes.Treatment,sections:[section]}
const withContext=(resourceType:string,provisionCodes:readonly string[])=>({...request,resourceContext:{resourceType,provisionCodes}})

function rule({constrained=true,decision=ConsentDecisions.Permit}:{constrained?:boolean;decision?:ConsentDecision}={}):ConsentRule{
 return {...original,[C.status]:ConsentStatuses.Active,[C.decision]:decision,[C.action]:section,[C.resourceType]:ResourceTypesFhirR4.Encounter,...(constrained?{[C.provisionCode]:EXAMPLE_ENCOUNTER_CLASS}:{})}
}

describe('resource-context Consent coverage',()=>{
 it('fails closed for a coded permit when an older consumer provides no resource context',()=>{
  expect(evaluateConsentCoverage([rule()],request).allowed).toBe(false)
 })

 it('requires a matching resource type and exact instance code for a constrained permit',()=>{
  expect(evaluateConsentCoverage([rule()],withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_CLASS])).allowed).toBe(true)
  expect(evaluateConsentCoverage([rule()],withContext(ResourceTypesFhirR4.Encounter,[])).allowed).toBe(false)
  expect(evaluateConsentCoverage([rule()],withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_REASON_CODE])).allowed).toBe(false)
  expect(evaluateConsentCoverage([rule()],withContext(ResourceTypesFhirR4.Appointment,[EXAMPLE_ENCOUNTER_CLASS])).allowed).toBe(false)
 })

 it('retains explicit constrained denial precedence and cannot discard a denial when context is missing',()=>{
  const rules=[rule({constrained:false}),rule({decision:ConsentDecisions.Deny})]
  const matching=evaluateConsentCoverage(rules,withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_CLASS]))
  expect(matching.allowed).toBe(false)
  expect(matching.explicitDenials).toHaveLength(1)
  expect(evaluateConsentCoverage(rules,request).allowed).toBe(false)
  expect(evaluateConsentCoverage(rules,withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_REASON_CODE])).allowed).toBe(true)
 })

 it('preserves unconstrained legacy coverage with and without trusted resource context',()=>{
  expect(evaluateConsentCoverage([rule({constrained:false})],request).allowed).toBe(true)
  expect(evaluateConsentCoverage([rule({constrained:false})],withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_REASON_CODE])).allowed).toBe(true)
 })

 it('does not infer permission from a treatment purpose or turn unassigned data into an explicit denial',()=>{
  const emergencyPurpose={...request,purpose:HealthcareConsentPurposes.EmergencyTreatment}
  expect(evaluateConsentCoverage([{...rule(),[C.purpose]:HealthcareConsentPurposes.EmergencyTreatment}],emergencyPurpose).allowed).toBe(false)
  const unassigned=evaluateConsentCoverage([rule()],{...withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_CLASS]),sections:[IndividualLogicalSections.Appointments.attributeValue]})
  expect(unassigned.allowed).toBe(false)
  expect(unassigned.explicitDenials).toHaveLength(0)
 })

 it('keeps subject, actor, role, lifecycle and purpose checks independent of instance codes',()=>{
  const matching=withContext(ResourceTypesFhirR4.Encounter,[EXAMPLE_ENCOUNTER_CLASS])
  expect(evaluateConsentCoverage([{...rule(),[C.status]:ConsentStatuses.Draft}],matching).allowed).toBe(false)
  expect(evaluateConsentCoverage([{...rule(),[C.status]:ConsentStatuses.Inactive}],matching).allowed).toBe(false)
  expect(evaluateConsentCoverage([rule()],{...matching,subject:EXAMPLE_CONSENT_ACCESS_RULES.physicianByOrganizationContinuousCare[C.actorIdentifier]}).allowed).toBe(false)
  expect(evaluateConsentCoverage([rule()],{...matching,actorRole:EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare[C.actorRole]}).allowed).toBe(false)
  expect(evaluateConsentCoverage([rule()],{...matching,purpose:HealthcareConsentPurposes.EmergencyTreatment}).allowed).toBe(false)
  expect(evaluateConsentCoverage([rule()],{...matching,actor:{actorKind:'related-person',email:EXAMPLE_CONSENT_ACCESS_RULES.physicianByEmailContinuousCare[C.actorIdentifier]}}).allowed).toBe(false)
 })
})
