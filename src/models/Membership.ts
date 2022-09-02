import {IAvailability} from "./Availability";

export interface IMembership {
  email: string;
  displayName: string;
  permissions: IMembershipPermissions;
  availabilities: IAvailability[];
}

export interface IMembershipPermissions {
  isOwner: boolean;
  canEdit: boolean;
  canKick: boolean;
  canBan: boolean;
  canMute: boolean;
}
