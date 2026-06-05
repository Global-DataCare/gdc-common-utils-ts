/**
 * Canonical shared types and operation codes for consent permission templates.
 *
 * Implementation lives in `utils/consent-permission-templates.ts`; this model
 * module keeps the public type surface discoverable under `src/models`.
 */
export {
  PermissionTemplateActorTypes,
  PermissionTemplateTargetKinds,
  PermissionTemplateOperationCodes,
} from '../utils/consent-permission-templates.js';

export type {
  PermissionGrantDecision,
  PermissionGrantRequestDraft,
  PermissionTemplateActorType,
  PermissionTemplateOperationCode,
  PermissionTemplateRoleRef,
  PermissionTemplateTarget,
  PermissionTemplateTargetKind,
  ResolvedPermissionProfile,
  RolePermissionTemplate,
} from '../utils/consent-permission-templates.js';
