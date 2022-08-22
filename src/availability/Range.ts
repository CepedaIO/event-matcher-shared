import {DateTime, DurationLikeObject, Duration, Interval} from "luxon";
import {IAvailabilityUtils} from "./index";
import {ist} from "../utils";
import {DateTimeValidation} from "../validation";

export const RangeUtils: IAvailabilityUtils<IRangeForm> = {
  applies: ist<IRangeForm>((obj) => DateTime.isDateTime(obj.start) && DateTime.isDateTime(obj.end)),
  durationValid: (range: IRangeForm, durLike: DurationLikeObject) =>
    DateTimeValidation.greaterThan(range.start, Duration.fromDurationLike(durLike))(range.end),
  dateValid: (range: IRangeForm, date: DateTime) =>
    Interval.fromDateTimes(range.start.startOf('day'), range.end.endOf('day')).contains(date)
}

export interface IRangeForm {
  start: DateTime;
  end: DateTime;
}
