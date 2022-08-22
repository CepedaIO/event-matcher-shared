import {DateTime, DurationLikeObject} from "luxon";
import {IRangeForm} from "./Range";

export type IAvailabilityForm = IRangeForm;
export type IAvailability = Array<IAvailabilityForm>;

export interface IAvailabilityUtils<AvailabilityType extends IAvailabilityForm> {
  applies: (form: IAvailabilityForm) => form is AvailabilityType;
  durationValid: (form: AvailabilityType, durLike: DurationLikeObject) => boolean;
  dateValid: (form: AvailabilityType, date: DateTime) => boolean;
}

export * from './Range';
