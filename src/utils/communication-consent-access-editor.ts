// Copyright 2026 Conectate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ResourceTypesFhirR4 } from '../constants/fhir-resource-types';
import {
  getHealthcareProfessionalRolesBySector,
  getHealthcareRolesByFamily,
  getHealthcareSectionsByFamily,
  getHealthcareSectionFamilyByCode,
  HealthcareRoleFamilies,
  type HealthcareActorRoleDescriptor,
  type HealthcareCanonicalSectionFamily,
  HealthcareCanonicalSectionFamilies,
  type HealthcareSectionDescriptor,
} from '../constants/healthcare';
import type { DataspaceSector } from '../constants/sectors';
import { ClaimConsent } from '../models/consent-rule';
import type {
  CommunicationAttachedBundleSessionOptions,
  ConsentEditorClassifiedActors,
  ConsentEditorClassifiedPurpose,
  ConsentEditorClassifiedRole,
  ConsentEditorClassifiedRoles,
  ConsentEditorClassifiedTarget,
  ConsentViewModel,
} from '../models/communication-attached-bundle-session';
import {
  ConsentEditorScopeCodes,
  ConsentEditorTargetKinds,
} from '../models/communication-attached-bundle-session';
import type { ConsentDuplicateRuleConflict } from './consent-duplicate-rules';
import { detectDuplicateConsentRuleConflicts } from './consent-duplicate-rules';
import { CommunicationAttachedBundleSession } from './communication-attached-bundle-session';
import {
  asTrimmedString,
  buildClassifiedConsentTarget,
  buildConsentViewModel,
  buildSectionCatalogOptions,
  classifyConsentActors,
  classifyConsentPurposes,
  classifyConsentRoles,
  classifyConsentTargetsFromClaims,
  CSV_SEPARATOR,
  flattenClassifiedActors,
  flattenClassifiedRoles,
  flattenClassifiedTargets,
  normalizeCsvValues,
  splitCsv,
} from './communication-attached-bundle-session-helpers';

/**
 * High-level access-policy editor for onboarding and app-facing code.
 *
 * This edits permit/deny rules governing who may access which data, for which
 * purpose and scope, inside a Communication-carried bundle. It does not model
 * informed consent for a clinical procedure, treatment or intervention.
 *
 * The name deliberately separates authorization consent from clinical
 * intervention consent while retaining the FHIR-like `Consent` resource used
 * by the existing access-rule contract.
 */
export class ConsentAccessEditor extends CommunicationAttachedBundleSession {
  /** Returns duplicate atomic consent-rule conflicts across the current bundle. */
  getConsentRuleDuplicateConflicts(): ConsentDuplicateRuleConflict[] {
    return detectDuplicateConsentRuleConflicts(this.getBundleInMemory().data);
  }

  /** Returns duplicate atomic consent-rule conflicts affecting the active Consent entry. */
  getActiveConsentRuleDuplicateConflicts(): ConsentDuplicateRuleConflict[] {
    const activeEntryIndex = this.getActiveEntryIndex();
    if (activeEntryIndex === null) {
      return [];
    }
    return this.getConsentRuleDuplicateConflicts()
      .filter((conflict) => conflict.affectedEntries.some((entry) => entry.entryIndex === activeEntryIndex));
  }

  /** Returns one frontend-facing editable view model for the active Consent entry. */
  getConsentViewModel(): ConsentViewModel {
    return buildConsentViewModel(
      this.getActiveEntry(),
      this.getDecision(),
      this.getActorsClassified(),
      this.getRolesClassified(),
      this.getPurposesClassified(),
      this.getTargetsClassified(),
    );
  }

  /** Applies one frontend-facing editable view model back into the active Consent entry. */
  applyConsentViewModel(viewModel: ConsentViewModel): this {
    this.setActiveEntryClaim(ClaimConsent.identifier, viewModel.identifier);
    this.setActiveEntryClaim(ClaimConsent.subject, viewModel.subject);
    this.setActiveEntryClaim(ClaimConsent.decision, viewModel.decision);
    this.setActiveEntryClaimList(
      ClaimConsent.actorIdentifier,
      flattenClassifiedActors(viewModel.classifiedActors),
    );
    this.setSelectedRoles(flattenClassifiedRoles(viewModel.classifiedRoles));
    this.setSelectedPurposes(viewModel.classifiedPurposes.map((purpose) => purpose.code));

    const flattenedTargets = flattenClassifiedTargets(viewModel.classifiedTargets);
    this.setSelectedCoreSections(flattenedTargets.coreSections);
    this.setSelectedKindOfDocuments(flattenedTargets.kindOfDocuments);
    this.setSelectedTypeOfServices(flattenedTargets.typeOfServices);
    this.setSelectedSubjectMatterDomains(flattenedTargets.subjectMatterDomains);
    this.setSelectedResourceTypes(flattenedTargets.resourceTypes);
    return this;
  }

  /** Returns the canonical permit/deny decision from the active Consent entry. */
  getDecision(): string {
    return asTrimmedString(this.getActiveEntryClaim(ClaimConsent.decision));
  }

  /** @deprecated Use `getDecision()`. */
  getPermit(): string {
    return this.getDecision();
  }

  /** Returns target classification derived from the current consent claim contract. */
  getTargetsClassified(): ConsentEditorClassifiedTarget[] {
    return classifyConsentTargetsFromClaims({
      ...(this.getActiveEntry()?.resource?.meta?.claims || {}),
    });
  }

  getCoreSectionOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.CoreSection);
  }

  getCoreSectionCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.CoreSection);
  }

  getKindOfDocumentOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.KindOfDocument);
  }

  getKindOfDocumentCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.KindOfDocument);
  }

  getTypeOfServiceOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.TypeOfService);
  }

  getTypeOfServiceCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.TypeOfService);
  }

  getSubjectMatterDomainOptions(): readonly ConsentEditorClassifiedTarget[] {
    return buildSectionCatalogOptions(HealthcareCanonicalSectionFamilies.SubjectMatterDomain);
  }

  getSubjectMatterDomainCatalog(): Readonly<Record<string, HealthcareSectionDescriptor>> {
    return getHealthcareSectionsByFamily(HealthcareCanonicalSectionFamilies.SubjectMatterDomain);
  }

  getResourceTypeOptions(): readonly ConsentEditorClassifiedTarget[] {
    return this.getSelectedResourceTypes().map((code) =>
      buildClassifiedConsentTarget(ConsentEditorTargetKinds.ResourceType, code, [ConsentEditorScopeCodes.Read]));
  }

  getResourceTypeCatalog(): readonly string[] {
    return Object.values(ResourceTypesFhirR4).filter((resourceType) => resourceType !== ResourceTypesFhirR4.Bundle);
  }

  getAvailableProfessionalRolesBySector(
    sector: DataspaceSector,
  ): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
    return getHealthcareProfessionalRolesBySector(sector);
  }

  getAvailableRelationshipRoles(): Readonly<Record<string, HealthcareActorRoleDescriptor>> {
    return getHealthcareRolesByFamily(HealthcareRoleFamilies.PersonalRelationshipHl7);
  }

  getSelectedCoreSections(): string[] {
    return this.getSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
    );
  }

  getSelectedKindOfDocuments(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.category));
  }

  getSelectedTypeOfServices(): string[] {
    return this.getSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
    );
  }

  getSelectedSubjectMatterDomains(): string[] {
    return this.getSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
    );
  }

  getSelectedResourceTypes(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.resourceType));
  }

  setSelectedCoreSections(codes: readonly string[]): this {
    return this.setSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
      codes,
    );
  }

  setSelectedKindOfDocuments(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.category, codes);
  }

  setSelectedTypeOfServices(codes: readonly string[]): this {
    return this.setSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
      codes,
    );
  }

  setSelectedSubjectMatterDomains(codes: readonly string[]): this {
    return this.setSelectedSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
      codes,
    );
  }

  setSelectedResourceTypes(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.resourceType, codes);
  }

  addCoreSections(codes: readonly string[]): this {
    return this.addSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
      codes,
    );
  }

  removeCoreSections(codes: readonly string[]): this {
    return this.removeSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.CoreSection,
      codes,
    );
  }

  addKindOfDocuments(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.category, codes);
  }

  removeKindOfDocuments(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.category, codes);
  }

  addTypeOfServices(codes: readonly string[]): this {
    return this.addSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
      codes,
    );
  }

  removeTypeOfServices(codes: readonly string[]): this {
    return this.removeSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.TypeOfService,
      codes,
    );
  }

  addSubjectMatterDomains(codes: readonly string[]): this {
    return this.addSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
      codes,
    );
  }

  removeSubjectMatterDomains(codes: readonly string[]): this {
    return this.removeSectionCodesByFamily(
      ClaimConsent.action,
      HealthcareCanonicalSectionFamilies.SubjectMatterDomain,
      codes,
    );
  }

  addResourceTypes(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.resourceType, codes);
  }

  removeResourceTypes(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.resourceType, codes);
  }

  getPurposesClassified(): ConsentEditorClassifiedPurpose[] {
    return classifyConsentPurposes(this.getSelectedPurposes());
  }

  getSelectedPurposes(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.purpose));
  }

  setSelectedPurposes(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.purpose, codes);
  }

  addPurposes(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.purpose, codes);
  }

  removePurposes(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.purpose, codes);
  }

  getRolesClassified(): ConsentEditorClassifiedRoles {
    return classifyConsentRoles(this.getSelectedRoles());
  }

  getSelectedRoles(): string[] {
    return splitCsv(this.getActiveEntryClaim(ClaimConsent.actorRole));
  }

  setSelectedRoles(codes: readonly string[]): this {
    return this.setActiveEntryClaimList(ClaimConsent.actorRole, codes);
  }

  addRoles(codes: readonly string[]): this {
    return this.addActiveEntryClaimList(ClaimConsent.actorRole, codes);
  }

  removeRoles(codes: readonly string[]): this {
    return this.removeActiveEntryClaimList(ClaimConsent.actorRole, codes);
  }

  getActorsClassified(): ConsentEditorClassifiedActors {
    const claims = {
      ...(this.getActiveEntry()?.resource?.meta?.claims || {}),
    };
    return classifyConsentActors(
      splitCsv(claims[ClaimConsent.actorIdentifier]),
      splitCsv(claims[ClaimConsent.actorRole])[0] || '',
    );
  }

  private getSelectedSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
  ): string[] {
    return splitCsv(this.getActiveEntryClaim(claimKey))
      .filter((code) => getHealthcareSectionFamilyByCode(code) === family);
  }

  private setSelectedSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
    codes: readonly string[],
  ): this {
    const preserved = splitCsv(this.getActiveEntryClaim(claimKey))
      .filter((code) => getHealthcareSectionFamilyByCode(code) !== family);
    return this.setActiveEntryClaimList(claimKey, [...preserved, ...codes]);
  }

  private addSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
    codes: readonly string[],
  ): this {
    const next = [...this.getSelectedSectionCodesByFamily(claimKey, family), ...codes];
    return this.setSelectedSectionCodesByFamily(claimKey, family, next);
  }

  private removeSectionCodesByFamily(
    claimKey: string,
    family: HealthcareCanonicalSectionFamily,
    codes: readonly string[],
  ): this {
    const codesToRemove = new Set(normalizeCsvValues(codes));
    const next = this.getSelectedSectionCodesByFamily(claimKey, family)
      .filter((code) => !codesToRemove.has(code));
    return this.setSelectedSectionCodesByFamily(claimKey, family, next);
  }

  private setActiveEntryClaimList(key: string, values: readonly string[]): this {
    const normalized = normalizeCsvValues(values);
    if (normalized.length === 0) {
      return this.removeActiveEntryClaim(key);
    }
    return this.setActiveEntryClaim(key, normalized.join(CSV_SEPARATOR));
  }

  private addActiveEntryClaimList(key: string, values: readonly string[]): this {
    const next = normalizeCsvValues([
      ...splitCsv(this.getActiveEntryClaim(key)),
      ...values,
    ]);
    return this.setActiveEntryClaimList(key, next);
  }

  private removeActiveEntryClaimList(key: string, values: readonly string[]): this {
    const valuesToRemove = new Set(normalizeCsvValues(values));
    const next = splitCsv(this.getActiveEntryClaim(key))
      .filter((value) => !valuesToRemove.has(value));
    return this.setActiveEntryClaimList(key, next);
  }
}

/**
 * High-level factory for consent-access editing.
 *
 * Prefer this name in onboarding docs when the developer intent is:
 * "edit a Consent access bundle carried by a Communication".
 */
export function createConsentAccessEditor(
  options: CommunicationAttachedBundleSessionOptions = {},
): ConsentAccessEditor {
  return new ConsentAccessEditor(options);
}
