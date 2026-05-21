# Clinical Sections Global Crosswalk (EHDS/EEDS, FHIR IPS, and LOINC Ontology)

This table is ordered as requested:
1. Base numeric LOINC sections
2. LOINC Ontology LP sections with EEDS correspondence
3. LOINC Ontology LP sections without EEDS correspondence

- Base catalog: `clinicalSectionsBase` in [src/models/clinical-sections.en.ts](../src/models/clinical-sections.en.ts)
- LP catalog: `clinicalWorkbookSummaryLabelI18nEn` in [src/models/clinical-workbook-summary.ts](../src/models/clinical-workbook-summary.ts)

## Domain tagging

- `human`: explicitly human-specific wording.
- `human+animal`: clinically applicable to both domains in this crosswalk context.
- `animal`: explicitly veterinary-only wording (none currently).

## Global table (73 total rows)

| Catalog | Code | Label | EEDS concept mapping | Coverage | Domain | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| base | `42348-3` | Advance directives | Advance directives | exact | human |  |
| base | `48765-2` | Allergies and adverse reactions | Allergies and adverse reactions | exact | human+animal |  |
| base | `56446-8` | Appointment summary | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| base | `47420-5` | Functional status | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| base | `10157-6` | History of family member diseases | History of family member diseases | exact | human |  |
| base | `46240-8` | History of Hospitalizations+Outpatient visits | History of Hospitalizations+Outpatient visits | exact | human |  |
| base | `11369-6` | History of Immunization | History of Immunization | exact | human+animal |  |
| base | `46264-8` | History of medical device use | History of medical device use | exact | human+animal |  |
| base | `10160-0` | History of Medication use | History of Medication use | exact | human+animal |  |
| base | `11348-0` | History of Past illness | History of Past illness | exact | human+animal |  |
| base | `47519-4` | History of Procedures | History of Procedures | exact | human+animal |  |
| base | `11450-4` | Problem list | Problem list | exact | human+animal |  |
| base | `30954-2` | Relevant diagnostic tests/laboratory data | Diagnostic test results (including laboratory and other diagnostic results) | exact | human+animal | Mapped to EEDS diagnostic test results category (not imaging studies). |
| base | `29762-2` | Social history | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| base | `8716-3` | Vital signs | Vital signs | exact | human+animal |  |
| lp | `org.loinc.LP200117-2` | Summary of encounters | History of Hospitalizations+Outpatient visits | semantic | human+animal | Nearest concept (Summary of encounters). |
| lp | `org.loinc.LP181119-1` | Action plan | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172911-2` | Acupuncture | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP447691-9` | Administrative information | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172918-7` | Anesthesiology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172919-5` | Audiology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP310260-7` | Care management | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173390-8` | Certificate | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172923-7` | Chiropractic medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP345049-3` | Cleft and Craniofacial | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173394-0` | Consent | - | no-match-in-current-EEDS-subset | human | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172934-4` | Dentistry | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172935-1` | Dermatology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172941-9` | Endocrinology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172943-5` | Family medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172894-0` | Forensic medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172945-0` | Gastroenterology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172946-8` | General medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172947-6` | Geriatric medicine | - | no-match-in-current-EEDS-subset | human | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP437010-4` | Goals, preferences, and priorities for care experience | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173404-7` | Health insurance card | - | no-match-in-current-EEDS-subset | human | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP175685-9` | Hematology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172951-8` | Infectious disease | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172956-7` | Medical genetics | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP175686-7` | Medical Oncology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172957-5` | Medical toxicology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172962-5` | Nephrology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172964-1` | Neurology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP203673-1` | Notification | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172968-2` | Nuclear medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172899-9` | Nutrition and dietetics | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172971-6` | Obstetrics and gynecology | - | no-match-in-current-EEDS-subset | human | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172973-2` | Occupational therapy | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172901-3` | Oncology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172974-0` | Ophthalmology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP434870-4` | Orthopaedic | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172979-9` | Orthotics prosthetics | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP434767-2` | Osteopathic medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172980-7` | Otolaryngology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172982-3` | Palliative care | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP172984-9` | Pathology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173002-9` | Pediatrics | - | no-match-in-current-EEDS-subset | human | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173004-5` | Physical medicine and rehabilitation | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173209-0` | Plan of care | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173008-6` | Podiatry | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP181204-1` | Prescription | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173011-0` | Psychiatry | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173012-8` | Psychology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173015-1` | Pulmonary disease | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173018-5` | Radiology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173421-1` | Report | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173023-5` | Rheumatology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP248728-0` | Sleep medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP417852-3` | Solid organ transplant | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173027-6` | Sports medicine | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP183499-5` | Trauma | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP173036-7` | Urology | - | no-match-in-current-EEDS-subset | human+animal | No direct match in the current EEDS concept subset used for crosswalk. |
| lp | `org.loinc.LP248732-2` | Womens health | - | no-match-in-current-EEDS-subset | human | No direct match in the current EEDS concept subset used for crosswalk. |
