import {IAvailabilityBase} from "./Availability";
import {AsMut} from "../types";

export interface IMembershipBase {
  email: string;
  displayName: string;
  permissions: IMembershipPermissionsBase;
  availabilities: IAvailabilityBase[];
}

export interface IMembershipPermissionsBase {
  isAdmin: boolean;
}

export type IMembershipEntity = AsMut<IMembershipBase>;
export type IMembershipPermissionsEntity = AsMut<IMembershipPermissionsBase>;
