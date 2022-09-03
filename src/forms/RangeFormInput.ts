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
  promote: (range: Demote<IRangeForm>) => ({
    start: DateTime.fromISO(range.start),
    end: DateTime.fromISO(range.end)
  }),
  durationValid: (range: IRangeForm, durLike: DurationLikeObject) =>
    DateTimeValidation.greaterThan(range.start, Duration.fromDurationLike(durLike))(range.end),
  dateValid: (range: IRangeForm, date: DateTime) =>
    Interval.fromDateTimes(range.start.startOf('day'), range.end.endOf('day')).contains(date)
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
        [DateTimeValidation.greaterThan(start, duration), `Must be at least ${duration.toHuman()} before start`]
      ])
    ]
  }
});
