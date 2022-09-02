import {IRangeForm} from "../forms";
import {DateTime, DurationLikeObject} from "luxon";

export type IAvailability = IRangeForm;

export interface IAvailabilityUtils<AvailabilityType extends IAvailability> {
  applies: (form: IAvailability) => form is AvailabilityType;
  durationValid: (form: AvailabilityType, durLike: DurationLikeObject) => boolean;
  dateValid: (form: AvailabilityType, date: DateTime) => boolean;
}
