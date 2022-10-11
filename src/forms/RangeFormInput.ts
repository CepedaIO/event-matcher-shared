import {DateTime, Duration, DurationLikeObject, Interval} from "luxon";
import {ist} from "../utils";
import {Demote, FormFactory} from "../types";
import {DateTimeValidation} from "../validation";
import {IAvailabilityUtils} from "../entities";

export interface IRangeForm {
  start: DateTime;
  end: DateTime;
}

export const RangeUtils: IAvailabilityUtils<IRangeForm> = {
  applies: ist<IRangeForm>((obj) => DateTime.isDateTime(obj.start) && DateTime.isDateTime(obj.end)),
  appliesDemoted: ist<Demote<IRangeForm>>((obj) => typeof obj.start === 'string' && typeof obj.end === 'string'),
  durationValid: (range: IRangeForm, durLike: DurationLikeObject) =>
    DateTimeValidation.greaterThan(range.start, Duration.fromDurationLike(durLike))(range.end),
  dateValid: (range: IRangeForm, date: DateTime) =>
    Interval.fromDateTimes(range.start.startOf('day'), range.end.endOf('day')).contains(date),
  intersection: (scopes: Interval[], form: IRangeForm) =>
    scopes.reduce((intervals, scope) => {
      const interval = scope.intersection(Interval.fromDateTimes(form.start, form.end))
      return interval ? intervals.concat(interval) : intervals;
    }, [] as Interval[])
}

interface RangeFormProps {
  duration: Duration
}

export const RangeFormFactory:FormFactory<IRangeForm, RangeFormProps> = ({ duration }) => ({
  validation: {
    start: ({ end }, { required }) => [
      [DateTimeValidation.defined, 'Must pick a time'],
      required('end', [
        [DateTimeValidation.lessThan(end, duration.negate()), `Must be at least ${duration.toHuman()} before end`]
      ])
    ],
    end: ({ start }, { required }) => [
      [DateTimeValidation.defined, 'Must pick a time'],
      required('start', [
        [DateTimeValidation.greaterThan(start, duration), `Must be at least ${duration.toHuman()} after start`]
      ])
    ]
  }
});
