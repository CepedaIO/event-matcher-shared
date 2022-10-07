import {Demote, Tuple} from "../types";
import {DateTime, DurationLikeObject} from "luxon";
import {RangeUtils} from "../forms";
import {IAvailabilityEntity} from "../entities";

export const AvailabilityHelpers = [RangeUtils];
export const availabilityHelperFor = (form: IAvailabilityEntity | Demote<IAvailabilityEntity>) => AvailabilityHelpers.find((helper) => helper.applies(form) || helper.appliesDemoted(form))!

export const AvailabilityValidation = {
  ist: (obj:any): obj is IAvailabilityEntity[] =>
    typeof availabilityHelperFor(obj) !== "undefined",
  availableOnDate: (availability: IAvailabilityEntity[], date: DateTime): boolean =>
    availability.some((form) => availabilityHelperFor(form).dateValid(form, date)),
  durationInvalidIndexes: (availability: IAvailabilityEntity[], durLike: DurationLikeObject): number[] =>
    availability.map((form) =>
      availabilityHelperFor(form).durationValid(form, durLike)
    )
    .map((valid, index) => [valid, index] as Tuple<boolean,  number>)
    .filter(([valid]) => !valid)
    .map(([, index]) => index),
}
