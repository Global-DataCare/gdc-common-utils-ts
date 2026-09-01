import { ClaimsIndividualProductSchemaorg, ClaimsPersonSchemaorg } from '../constants/schemaorg';
import { DeviceBindingStatuses } from '../constants/device';
import { EmployeeDirectoryStatuses, type EmployeeDirectoryStatus } from '../constants/employee-lifecycle';
import {
  IdentityAuthRequestFields,
  IdentityAuthResponseEntryTypes,
} from '../constants/identity-auth';
import type {
  EmployeeDeviceRevocationTarget,
  OrganizationEmployeeLifecycleRecord,
} from '../models/organization-employee-lifecycle';
import { DEFAULT_LICENSE_DEVICE_ALLOWANCE } from './license';

/** Builds the exact identity/auth revoke request body from a typed target. */
export function buildEmployeeDeviceRevocationBody(
  target: EmployeeDeviceRevocationTarget,
): Readonly<Record<string, string>> {
  return Object.freeze({
    [IdentityAuthRequestFields.LicenseId]: target.licenseId,
    [IdentityAuthRequestFields.ClientId]: target.clientId,
  });
}

/** Reads an employee activation credential from canonical and legacy GW envelopes. */
export function readEmployeeActivationCode(value: unknown): string {
  for (const candidate of listNestedRecords(value)) {
    if (candidate.type === IdentityAuthResponseEntryTypes.LicenseIssued) {
      const issuedId = text(candidate.id);
      if (issuedId) return issuedId;
    }
    const claims = record(candidate.claims) || record(record(candidate.meta)?.claims);
    const serial = text(claims?.[ClaimsIndividualProductSchemaorg.serialNumber]);
    if (serial) return serial;
  }
  return '';
}

/**
 * Extracts primary resources from a DIDComm FHIR-like response Bundle.
 *
 * Canonical search matches live at `body.data[].resource`. The deprecated
 * `resource.{total,data}` aggregate remains a read-only compatibility path so
 * an SDK can survive a rolling GW deployment; producers must not emit it.
 */
export function extractBundleSearchResources(value: unknown): ReadonlyArray<Record<string, unknown>> {
  for (const candidate of listNestedRecords(value)) {
    if (!Array.isArray(candidate.data)) continue;
    const entries = candidate.data.map(record).filter(isRecord);
    if (entries.length === 0) return [];

    let recognizedSearchEnvelope = false;
    const resources = entries.flatMap((entry) => {
      const resource = record(entry.resource);
      if (!resource) return [];
      const legacyRows = resource.total !== undefined && Array.isArray(resource.data)
        ? resource.data.map(record).filter(isRecord)
        : undefined;
      if (legacyRows) recognizedSearchEnvelope = true;
      return legacyRows ?? [resource];
    });
    if (resources.length > 0) return resources;
    if (recognizedSearchEnvelope) return [];

    // Compatibility for older SDK fixtures that passed already-extracted rows.
    return entries;
  }

  for (const candidate of listNestedRecords(value)) {
    const legacyRows = record(candidate.resource)?.data;
    if (Array.isArray(legacyRows)) return legacyRows.map(record).filter(isRecord);
  }
  return [];
}

/** @deprecated Use the transport-neutral `extractBundleSearchResources`. */
export const extractGwSearchResources = extractBundleSearchResources;

/** Combines employee directory and license search results into one typed view. */
export function projectOrganizationEmployeeLifecycle(input: Readonly<{
  employeeResponse: unknown;
  licenseResponse: unknown;
}>): OrganizationEmployeeLifecycleRecord[] {
  const licenses = extractBundleSearchResources(input.licenseResponse);
  return extractBundleSearchResources(input.employeeResponse).map((employee) => {
    const claims = record(employee.claims) || record(record(employee.meta)?.claims) || {};
    const resourceId = text(employee.id);
    const employeeDid = text(claims[ClaimsPersonSchemaorg.identifier]);
    const license = licenses.find((candidate) => {
      const meta = record(candidate.meta) || {};
      const subjectId = text(meta.subjectId);
      return subjectId === resourceId || subjectId === employeeDid;
    });
    const status = normalizeEmployeeDirectoryStatus(text(employee.status) || text(record(employee.meta)?.status));
    if (!license) return {
      resourceId,
      email: text(claims[ClaimsPersonSchemaorg.email]),
      roleCode: text(claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue]),
      employeeDid,
      status,
    };
    const meta = record(license.meta) || {};
    const bindings = Array.isArray(meta.deviceBindings) ? meta.deviceBindings.map(record).filter(isRecord) : [];
    const devices = bindings.map((binding) => {
      const info = record(binding.deviceInfo) || {};
      const clientId = text(binding.clientId);
      return {
        clientId,
        name: text(info.model) || text(info.clientInstanceId) || clientId,
        status: binding.status === DeviceBindingStatuses.Revoked
          ? DeviceBindingStatuses.Revoked
          : DeviceBindingStatuses.Active,
      } as const;
    }).filter((device) => Boolean(device.clientId));
    return {
      resourceId,
      email: text(claims[ClaimsPersonSchemaorg.email]),
      roleCode: text(claims[ClaimsPersonSchemaorg.hasOccupationalRoleValue]),
      employeeDid,
      status,
      license: {
        id: text(license.id),
        status: text(meta.status),
        maxDevices: positiveInteger(meta.maxDevices) || DEFAULT_LICENSE_DEVICE_ALLOWANCE,
        activeDevices: devices.filter((device) => device.status === DeviceBindingStatuses.Active).length,
        devices,
      },
    };
  }).filter((employee) => Boolean(employee.resourceId));
}

function normalizeEmployeeDirectoryStatus(value: string): EmployeeDirectoryStatus {
  return Object.values(EmployeeDirectoryStatuses).includes(value as EmployeeDirectoryStatus)
    ? value as EmployeeDirectoryStatus
    : EmployeeDirectoryStatuses.Unknown;
}

function listNestedRecords(root: unknown): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  const pending: unknown[] = [root];
  const visited = new Set<object>();
  while (pending.length > 0) {
    const value = pending.shift();
    if (!value || typeof value !== 'object' || visited.has(value)) continue;
    visited.add(value);
    if (Array.isArray(value)) {
      pending.push(...value);
      continue;
    }
    const item = value as Record<string, unknown>;
    result.push(item);
    pending.push(...Object.values(item));
  }
  return result;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function isRecord(value: Record<string, unknown> | undefined): value is Record<string, unknown> {
  return Boolean(value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function positiveInteger(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
