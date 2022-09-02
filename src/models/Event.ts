import {IMembership} from "./Membership";
import {IAvailability} from "./Availability";
import {Duration} from "luxon";

export interface ICreateEventInput {
  name: string;
  description: string;
  precision: string;
  factor: number;
  email: string;
  displayName: string;
  availabilities: IAvailability[]
}

export interface IEvent {
  name: string;
  description: string;
  precision: string;
  factor: number;
  memberships: IMembership[];
}

export const Event = {
  setDuration(event: IEvent, duration: Duration) {
    event.precision = Object.keys(duration)[0];
    event.factor = Object.values(duration)[0];
  },
  getDuration(event: IEvent): Duration {
    return Duration.fromDurationLike({
      [event.precision]: event.factor
    });
  }
}
