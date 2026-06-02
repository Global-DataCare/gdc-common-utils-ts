export const HL7_COMMUNICATION_CATEGORY_SYSTEM =
  'http://terminology.hl7.org/CodeSystem/communication-category' as const;

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

export const CommunicationCategoryCodes = Object.freeze({
  Alert: defineCommunicationCategory('alert'),
  Notification: defineCommunicationCategory('notification'),
  Reminder: defineCommunicationCategory('reminder'),
  Instruction: defineCommunicationCategory('instruction'),
} as const);
