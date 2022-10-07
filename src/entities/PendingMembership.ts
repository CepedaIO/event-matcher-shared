import {IAvailabilityBase} from "./Availability";
import {AsMut} from "../types";

export interface IPendingMembershipBase {
  email: string;
  displayName: string;
  availabilities: IAvailabilityBase[]
}

export type IPendingMembershipEntity = AsMut<IPendingMembershipBase>;
