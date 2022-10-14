import {AsMut, IDuration} from "../types";
import {IAvailabilityBase} from "./Availability";
import {DateTime} from "luxon";

export interface IEventBase {
  id: number;
  name: string;
  img: string;
  description: string;
  duration: IDuration;
  availabilities?: IAvailabilityBase[];
}

export interface IEventResolutionBase {
  start: DateTime;
  end: DateTime;
}

export type IEventEntity = AsMut<IEventBase>;
export type IEventResolutionEntity = AsMut<IEventResolutionBase>;
