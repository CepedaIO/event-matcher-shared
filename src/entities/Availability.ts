import {IRangeForm} from "../forms";
import {DateTime, DurationLikeObject} from "luxon";
import {AsMut, Demote} from "../types";
import {availabilityHelperFor} from "../validation";

export type IAvailabilityBase = IRangeForm;
export type IAvailabilityEntity = AsMut<IAvailabilityBase>;

export interface IAvailabilityUtils<AvailabilityType extends IAvailabilityBase> {
  applies: (form: any) => form is AvailabilityType;
  appliesDemoted: (form: any) => form is Demote<AvailabilityType>;
  durationValid: (form: AvailabilityType, durLike: DurationLikeObject) => boolean;
  dateValid: (form: AvailabilityType, date: DateTime) => boolean;
  promote: (form: Demote<AvailabilityType>) => AvailabilityType;
}

export const Availability = {
  promote: (availabilities: Demote<IAvailabilityEntity>[]) => availabilities.map((form) => availabilityHelperFor(form).promote(form))
}
