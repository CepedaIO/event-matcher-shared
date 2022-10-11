import {IRangeForm} from "../forms";
import {DateTime, DurationLikeObject, Interval} from "luxon";
import {AsMut, Demote} from "../types";
import {availabilityHelperFor} from "../validation";

export type IAvailabilityBase = IRangeForm;
export type IAvailabilityEntity = AsMut<IAvailabilityBase>;

export interface IAvailabilityUtils<AvailabilityType extends IAvailabilityBase> {
  applies: (form: any) => form is AvailabilityType;
  appliesDemoted: (form: any) => form is Demote<AvailabilityType>;
  durationValid: (form: AvailabilityType, durLike: DurationLikeObject) => boolean;
  dateValid: (form: AvailabilityType, date: DateTime) => boolean;
  intersection: (scopes: Interval[], form: AvailabilityType) => Interval[];
}

export const AvailabilityUtils = {
  intersection: (scopes:Interval[], availabilities: IAvailabilityBase[]): Interval[] => {
    return availabilities.reduce((intervals, availability) => {
      const helper = availabilityHelperFor(availability);
      const interval = helper.intersection(scopes, availability);
      
      return intervals.concat(interval);
    }, [] as Interval[]);
  }
}
