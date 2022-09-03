import {IRangeForm} from "../forms";
import {DateTime, DurationLikeObject} from "luxon";
import {AsMut, Demote} from "../types";
import {availabilityHelperFor, AvailabilityHelpers} from "../validation";

export type IAvailability = IRangeForm;
export type IAvailabilityEntity = AsMut<IAvailability>;

export interface IAvailabilityUtils<AvailabilityType extends IAvailability> {
  applies: (form: any) => form is AvailabilityType;
  appliesDemoted: (form: any) => form is Demote<AvailabilityType>;
  durationValid: (form: AvailabilityType, durLike: DurationLikeObject) => boolean;
  dateValid: (form: AvailabilityType, date: DateTime) => boolean;
  promote: (form: Demote<AvailabilityType>) => AvailabilityType;
}

export const Availability = {
  promote: (availabilities: Demote<IAvailability>[]) => availabilities.map((form) => availabilityHelperFor(form).promote(form))
}
