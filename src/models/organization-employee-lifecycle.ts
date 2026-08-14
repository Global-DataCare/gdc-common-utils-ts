import type { DeviceBindingStatus } from '../constants/device';
import type { EmployeeActivationGrantVersion, EmployeeDirectoryStatus } from '../constants/employee-lifecycle';

/** One installation in the controller-facing employee lifecycle projection. */
export type OrganizationEmployeeDeviceRecord = Readonly<{
  clientId: string;
  name: string;
  status: DeviceBindingStatus;
}>;

/** License state attached to one employee directory entry. */
export type OrganizationEmployeeLicenseRecord = Readonly<{
  id: string;
  status: string;
  maxDevices: number;
  activeDevices: number;
  devices: ReadonlyArray<OrganizationEmployeeDeviceRecord>;
}>;

/** Product-neutral employee, seat and installation lifecycle projection. */
export type OrganizationEmployeeLifecycleRecord = Readonly<{
  resourceId: string;
  email: string;
  roleCode: string;
  employeeDid: string;
  status: EmployeeDirectoryStatus;
  license?: OrganizationEmployeeLicenseRecord;
}>;

/** Typed wire request for revoking one installation without releasing its seat. */
export type EmployeeDeviceRevocationTarget = Readonly<{
  licenseId: string;
  clientId: string;
}>;

/** Tenant routing metadata bound to an employee activation credential digest. */
export type EmployeeActivationGrant = Readonly<{
  version: EmployeeActivationGrantVersion;
  employeeDid: string;
  employeeRoleCode: string;
  employeeActorIdentifier: string;
  providerDid: string;
  routeContext: Readonly<{ tenantId: string; jurisdiction: string; sector: string }>;
  createdAt: string;
  expiresAt: string;
}>;
