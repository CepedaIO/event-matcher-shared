import {DateTime, Duration} from "luxon";

export const DateTimeValidation = {
  ist: DateTime.isDateTime,
  defined: (val: DateTime | undefined) =>
    DateTime.isDateTime(val),
  greaterThan: (time: DateTime, offset: Duration) => (val: DateTime) =>
    val > time.plus(offset),
  lessThan: (time: DateTime, offset: Duration) => (val: DateTime) =>
    val < time.plus(offset),
}
