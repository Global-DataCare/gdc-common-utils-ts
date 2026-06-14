import {
  buildDataCapabilityKey,
  DataCapabilityActions,
  DataCapabilityDomains,
  DataCapabilityRepresentations,
  ExampleDataCapabilities,
  parseDataCapabilityKey,
} from '../src/constants/data-capabilities.js';

describe('data capability modeling', () => {
  it('keeps data domain separate from the technical bundle envelope', () => {
    const appointmentBundle = buildDataCapabilityKey({
      action: DataCapabilityActions.Create,
      representation: DataCapabilityRepresentations.Bundle,
      domain: DataCapabilityDomains.Appointment,
    });
    const healthBundle = buildDataCapabilityKey({
      action: DataCapabilityActions.Create,
      representation: DataCapabilityRepresentations.Bundle,
      domain: DataCapabilityDomains.Health,
    });

    expect(appointmentBundle).toBe('Create.Bundle.Appointment');
    expect(healthBundle).toBe('Create.Bundle.Health');
    expect(appointmentBundle).not.toBe(healthBundle);
  });

  it('keeps the agreed reference examples in code', () => {
    expect(ExampleDataCapabilities.CreateBundleAppointment).toBe('Create.Bundle.Appointment');
    expect(ExampleDataCapabilities.SendBundleAppointment).toBe('Send.Bundle.Appointment');
    expect(ExampleDataCapabilities.ViewResourceHealth).toBe('View.Resource.Health');
    expect(ExampleDataCapabilities.ViewBundleHealth).toBe('View.Bundle.Health');
    expect(ExampleDataCapabilities.SendDocumentReferenceInsurance).toBe('Send.DocumentReference.Insurance');
    expect(ExampleDataCapabilities.ViewInvoiceBilling).toBe('View.Invoice.Billing');
    expect(ExampleDataCapabilities.SearchBundleResearch).toBe('Search.Bundle.Research');
  });

  it('parses the canonical string form back into a structured descriptor', () => {
    expect(parseDataCapabilityKey('Send.DocumentReference.Insurance')).toEqual({
      action: DataCapabilityActions.Send,
      representation: DataCapabilityRepresentations.DocumentReference,
      domain: DataCapabilityDomains.Insurance,
    });
    expect(parseDataCapabilityKey('Send.Bundle.UnknownDomain')).toBeUndefined();
    expect(parseDataCapabilityKey('')).toBeUndefined();
  });
});
