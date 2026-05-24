export const HL7_COMMUNICATION_CATEGORY_SYSTEM =
  'http://terminology.hl7.org/CodeSystem/communication-category' as const;

export type CommunicationCategoryDescriptor = Readonly<{
  system: typeof HL7_COMMUNICATION_CATEGORY_SYSTEM;
  code: string;
  claim: string;
}>;

function defineCommunicationCategory(code: string): CommunicationCategoryDescriptor {
  return Object.freeze({
    system: HL7_COMMUNICATION_CATEGORY_SYSTEM,
    code,
    claim: `${HL7_COMMUNICATION_CATEGORY_SYSTEM}|${code}`,
  });
}

export const CommunicationCategoryCodes = Object.freeze({
  Alert: defineCommunicationCategory('alert'),
  Notification: defineCommunicationCategory('notification'),
  Reminder: defineCommunicationCategory('reminder'),
  Instruction: defineCommunicationCategory('instruction'),
} as const);
