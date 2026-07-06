/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ObservationClaim } from '../models/interoperable-claims/observation-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { normalizeOptionalIdentifier } from './bundle-editor-helpers';
import { VitalSignEntryEditor } from './vital-sign-entry-editor';
import { getClaimValues, setClaimValues } from '../claims/claim-list-helpers';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged Observation resource entry.
 *
 * Use this when a caller needs to stage one observation row with claims-first
 * accessors in a bundle authoring flow.
 */
export class ObservationEntryEditor extends VitalSignEntryEditor {
  /** Writes the based-on reference. */
  public setBasedOn(reference: string): this {
    return this.setClaim(ObservationClaim.BasedOn, String(reference).trim());
  }

  /** Reads the based-on reference. */
  public getBasedOn(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.BasedOn));
  }

  /** Writes the encounter reference. */
  public setEncounter(reference: string): this {
    return this.setClaim(ObservationClaim.Encounter, String(reference).trim());
  }

  /** Reads the encounter reference. */
  public getEncounter(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Encounter));
  }

  /** Writes the performer reference. */
  public setPerformer(reference: string): this {
    return this.setClaim(ObservationClaim.Performer, String(reference).trim());
  }

  /** Reads the performer reference. */
  public getPerformer(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.Performer));
  }

  /** Writes the has-member reference. */
  public setHasMember(reference: string): this {
    return this.setClaim(ObservationClaim.HasMember, String(reference).trim());
  }

  /** Reads the has-member reference. */
  public getHasMember(): string | undefined {
    return normalizeOptionalIdentifier(this.getClaim(ObservationClaim.HasMember));
  }

  /** Writes the has-member list. */
  public setHasMemberList(references: readonly string[]): this {
    const next = setClaimValues({}, ObservationClaim.HasMember, references);
    const normalized = normalizeOptionalIdentifier(next[ObservationClaim.HasMember]);
    if (!normalized) {
      this.removeClaim(ObservationClaim.HasMember);
      return this;
    }
    return this.setClaim(ObservationClaim.HasMember, normalized);
  }

  /** Reads the has-member list. */
  public getHasMemberList(): string[] {
    return getClaimValues(this.getClaims(), ObservationClaim.HasMember);
  }
}

registerBundleEntryEditor(BundleEditableResourceTypes.observation, ObservationEntryEditor);
