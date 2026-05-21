/**
 * English display labels for supported clinical document section codes.
 *
 * Notes:
 * - This file is intentionally separate from the section registry so apps can:
 *   - use these labels as a default (e.g., server-side rendering), and/or
 *   - override them via i18n resources keyed by `org.loinc.<CODE>`.
 * - Source layers:
 *   - Base / IPS-aligned sections: HL7 FHIR `doc-section-codes` for `Composition.section`.
 *   - Additional labels: project-specific additions and Excel-driven taxonomy entries.
 * - Keep section labels and document-type labels separate in UI permission filters to avoid duplicates.
 * - Broader data-space artifact families such as `RelatedPerson`, `Appointment`, `Communication`,
 *   or other sector-independent profiles should live in their own registries.
 */
export const clinicalSectionsBase = {
  // ---------------------------------------------------------------------------
  // Base / IPS-aligned section labels
  // Source: https://hl7.org/fhir/R4/valueset-doc-section-codes.html
  // These labels are normalized for section use: document suffixes such as
  // Narrative / Document / note are removed when the concept is used as a section.
  // ---------------------------------------------------------------------------
  '10157-6': 'History of family member diseases',
  '10160-0': 'History of Medication use',
  '11348-0': 'History of Past illness',
  '11369-6': 'History of Immunization',
  '11450-4': 'Problem list',
  '29762-2': 'Social history',
  '30954-2': 'Relevant diagnostic tests/laboratory data',
  '42348-3': 'Advance directives',
  '46240-8': 'History of Hospitalizations+Outpatient visits',
  '46264-8': 'History of medical device use',
  '47420-5': 'Functional status',
  '47519-4': 'History of Procedures',
  '48765-2': 'Allergies and adverse reactions',
  '56446-8': 'Appointment summary',
  '8716-3': 'Vital signs',
} as const;

export const clinicalDocTypes = {
  // ---------------------------------------------------------------------------
  // Document-oriented labels used as buckets or wrappers in the UI.
  // Source: FHIR/IPS document taxonomy and project-specific document buckets.
  // ---------------------------------------------------------------------------
  '10154-3': 'Chief complaint Narrative - Reported',
  '10164-2': 'History of Present illness',
  '10183-2': 'Hospital discharge medications',
  '10184-0': 'Hospital discharge physical findings',
  '10187-3': 'Review of systems',
  '10210-3': 'Physical findings of General status',
  '10216-0': 'Surgical operation note fluids Narrative',
  '10218-6': 'Surgical operation note postoperative diagnosis',
  '10222-8': 'Surgical operation note surgical complications [Interpretation]',
  '10223-6': 'Surgical operation note surgical procedure',
  '11329-0': 'History general',
  '48768-6': 'Payment sources Document',
  '51848-0': 'Evaluation note',
  '57852-6': 'Problem list Narrative - Reported',
  '18776-5': 'Plan of care note',
  '18841-7': 'Hospital consultations Document',
  '60591-5': 'Patient summary',
  '11493-4': 'Hospital discharge studies summary',
  '11535-2': 'Hospital discharge Dx',
  '11537-8': 'Surgical drains',
  '29299-5': 'Reason for visit Narrative',
  '29549-3': 'Medication administered',
  '29554-3': 'Procedure',
  '42344-2': 'Discharge diet',
  '42346-7': 'Medications on admission',
  '42349-1': 'Reason for referral',
  '46241-6': 'Hospital admission diagnosis',
  '55109-3': 'Complications Document',
  '55122-6': 'Surgical operation note implants',
  '59768-2': 'Procedure indications [Interpretation]',
  '59769-0': 'Postprocedure diagnosis',
  '59770-8': 'Procedure estimated blood loss',
  '59771-6': 'Procedure implants',
  '59772-4': 'Planned procedure',
  '59773-2': 'Procedure specimens taken',
  '59775-7': 'Procedure disposition',
  '59776-5': 'Procedure findings',
  '61149-1': 'Objective',
  '61150-9': 'Subjective',
  '69730-0': 'Instructions',
  '8648-8': 'Hospital course',
  '8653-8': 'Hospital Discharge instructions',
  '11503-0': 'Medical records (generic)',
  '56796-6': 'Healthcare (general)',
} as const;

export const clinicalSectionAdditional = {
  // ---------------------------------------------------------------------------
  // Additional Excel / project-driven sections
  // Source: local workbook derived from the LOINC ontology tables and product needs.
  // Keep these out of the base permission list to avoid duplicate section semantics.
  // ---------------------------------------------------------------------------
  '61144-2': 'Diet',
  '82810-3': 'History of pregnancy',
  '87520-3': 'Health insurance coverage',
  '10190-7': 'Mental status',
  '18726-0': 'Radiology studies',
} as const;

export const clinicalSectionTitleEn = {
  ...clinicalSectionsBase,
  ...clinicalDocTypes,
  ...clinicalSectionAdditional,
} as const;
