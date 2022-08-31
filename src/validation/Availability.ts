import {IAvailability, IAvailabilityForm, Tuple} from "../types";
import {DateTime, DurationLikeObject} from "luxon";
import {RangeUtils} from "../forms/RangeForm";

export const helpers = [RangeUtils];
const helperFor = (form: IAvailabilityForm) => helpers.find((helper) => helper.applies(form))!

export const AvailabilityValidation = {
  ist: (obj:any): obj is IAvailability =>
    typeof helperFor(obj) !== "undefined",
  availableOnDate: (availability: IAvailability, date: DateTime): boolean =>
    availability.some((form) => helperFor(form).dateValid(form, date)),
  durationInvalidIndexes: (availability: IAvailability, durLike: DurationLikeObject): number[] =>
    availability.map((form) =>
      helperFor(form).durationValid(form, durLike)
    )
    .map((valid, index) => [valid, index] as Tuple<boolean,  number>)
    .filter(([valid]) => !valid)
    .map(([, index]) => index),
}
