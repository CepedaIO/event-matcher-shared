import {DateTime, Duration} from "luxon";

const defined = (val: DateTime | undefined) =>
  DateTime.isDateTime(val);

const greaterThan = (time: DateTime, offset: Duration) =>
  (val: DateTime) => val > time.plus(offset);

const lessThan = (time: DateTime, offset: Duration) =>
  (val: DateTime) => val < time.plus(offset);

export const DateTimeValidation = {
  defined, greaterThan, lessThan
}
