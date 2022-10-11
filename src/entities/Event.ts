import {AsMut, IDuration} from "../types";
import {IAvailabilityBase} from "./Availability";

export interface IEventBase {
  id: number;
  name: string;
  img: string;
  description: string;
  duration: IDuration;
  availabilities?: IAvailabilityBase[];
}

export type IEventEntity = AsMut<IEventBase>;
