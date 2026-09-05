import { FhirCodeSystems } from './fhir-code-systems';

export const HL7_COMMUNICATION_CATEGORY_SYSTEM =
  FhirCodeSystems.CommunicationCategory;

export type CommunicationCategoryDescriptor = Readonly<{
  system: typeof HL7_COMMUNICATION_CATEGORY_SYSTEM;
  code: string;
  attributeValue: string;
  /**
   * @deprecated Use `attributeValue`.
   * Kept as compatibility alias because this token is a reusable attribute
   * value, not a claim key/attribute name.
   */
  claim: string;
}>;

function defineCommunicationCategory(code: string): CommunicationCategoryDescriptor {
  const attributeValue = `${HL7_COMMUNICATION_CATEGORY_SYSTEM}|${code}`;
  return Object.freeze({
    system: HL7_COMMUNICATION_CATEGORY_SYSTEM,
    code,
    attributeValue,
    claim: attributeValue,
  });
}

/**
 * The complete FHIR R4 Communication category value set.
 *
 * @see https://www.hl7.org/fhir/valueset-communication-category.html
 */
export const CommunicationCategoryCodes = Object.freeze({
  Alert: defineCommunicationCategory('alert'),
  Notification: defineCommunicationCategory('notification'),
  Reminder: defineCommunicationCategory('reminder'),
  Instruction: defineCommunicationCategory('instruction'),
} as const);

export type CommunicationTopicDescriptor = Readonly<{
  system: string;
  code: string;
  attributeValue: string;
}>;

function defineCommunicationTopic(system: string, code: string): CommunicationTopicDescriptor {
  return Object.freeze({ system, code, attributeValue: `${system}|${code}` });
}

/**
 * Non-LOINC Communication topics explicitly governed by an HL7 code system.
 * Clinical section and document topics continue to use the LOINC catalogs.
 *
 * `BTG` is the HL7 v3 ActReason override purpose used for break-glass alerts.
 * @see http://terminology.hl7.org/CodeSystem/v3-ActReason#v3-ActReason-BTG
 * @see https://profiles.ihe.net/ITI/PCF/Consent-ex-consent-advanced-normal-break-glass-restricted.json.html
 */
export const CommunicationTopicCodes = Object.freeze({
  BreakTheGlass: defineCommunicationTopic(FhirCodeSystems.ActReason, 'BTG'),
} as const);
