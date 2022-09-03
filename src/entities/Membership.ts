import {IAvailability} from "./Availability";
import {AsMut} from "../types";

export interface IMembership {
  email: string;
  displayName: string;
  permissions: IMembershipPermissions;
  availabilities: IAvailability[];
}

export interface IMembershipPermissions {
  isAdmin: boolean;
}

export type IMembershipEntity = AsMut<IMembership>;
export type IMembershipPermissionsEntity = AsMut<IMembershipPermissions>;
