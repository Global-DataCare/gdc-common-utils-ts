/**
 * File discipline note:
 * - Read `ARCHITECTURE.md` and `CONTRIBUTING.md` before changing this module.
 * - Keep exactly one exported class per file.
 * - Keep this file focused on one typed editor surface.
 * - Move shared helpers to reusable helper/base modules instead of duplicating logic here.
 */
import { ClinicalResourceEntryEditor } from './clinical-resource-entry-editor';
import { DocumentReferenceClaim } from '../models/interoperable-claims/document-reference-claims';
import { BundleEditableResourceTypes } from '../models/bundle-editor-types';
import { registerBundleEntryEditor } from './bundle-editor-registry';

/**
 * Typed editor for one staged DocumentReference resource entry.
 *
 * Use this surface when the frontend needs to attach one PDF, image, VC, or
 * other document-like payload to a clinical document or Communication flow.
 */
export class DocumentReferenceEntryEditor extends ClinicalResourceEntryEditor {
  /** Overrides the canonical identifier when import or migration logic needs one explicit public id. */
  public setIdentifier(identifier?: string | null): this { return this.setIdentifierValue(DocumentReferenceClaim.Identifier, identifier); }
  /** Returns the canonical identifier currently exposed for this document entry. */
  public getIdentifier(): string | undefined { return this.getIdentifierValue(DocumentReferenceClaim.Identifier); }
  /** Ensures the entry has one synchronized canonical identifier across public claim, `resource.id`, and `fullUrl`. */
  public ensureIdentifier(): string { return this.ensureIdentifierValue(DocumentReferenceClaim.Identifier); }
  /** Sets the subject reference for the attached document. */
  public setSubject(subject?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Subject, subject); }
  /** Returns the subject reference for the attached document. */
  public getSubject(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Subject); }
  /** Sets the coded document type. */
  public setType(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Type, value); }
  /** Returns the coded document type. */
  public getType(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Type); }
  /** Sets the document category. */
  public setCategory(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Category, value); }
  /** Returns the document category. */
  public getCategory(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Category); }
  /** Sets the MIME type of the attached payload, such as PDF or image content. */
  public setContentType(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.ContentType, value); }
  /** Returns the MIME type of the attached payload. */
  public getContentType(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.ContentType); }
  /** Sets the inline base64 payload when the document travels inside the bundle. */
  public setContentData(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.ContentData, value); }
  /** Returns the inline base64 payload when present. */
  public getContentData(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.ContentData); }
  /** Sets the content hash or CID-like value used for integrity and external retrieval. */
  public setContentHash(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.ContentHash, value); }
  /** Returns the content hash or CID-like value. */
  public getContentHash(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.ContentHash); }
  /** Sets the external location/URL when the payload is not embedded inline. */
  public setLocation(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Location, value); }
  /** Returns the external location/URL when present. */
  public getLocation(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Location); }
  /** Sets the user-facing description for the attached document. */
  public setDescription(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Description, value); }
  /** Returns the user-facing description for the attached document. */
  public getDescription(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Description); }
  /** Sets the document date. */
  public setDate(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Date, value); }
  /** Returns the document date. */
  public getDate(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Date); }
  /** Sets the document author reference. */
  public setAuthor(value?: string | null): this { return this.setScalarClaim(DocumentReferenceClaim.Author, value); }
  /** Returns the document author reference. */
  public getAuthor(): string | undefined { return this.getScalarClaim(DocumentReferenceClaim.Author); }
}

registerBundleEntryEditor(BundleEditableResourceTypes.documentReference, DocumentReferenceEntryEditor);
