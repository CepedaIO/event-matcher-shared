import {EventDuration, FormFactory} from "../types";
import {AvailabilityValidation, TextValidation} from "../validation";
import {IAvailability} from "../models";

export interface ICreateEventForm {
  name: string;
  description: string;
  duration: EventDuration
  displayName: string;
  availabilities: IAvailability[];
}

export const CreatEventForm:FormFactory<ICreateEventForm> = () => ({
  validation: {
    name: () => [
      [TextValidation.defined, 'Must provide event name'],
      [TextValidation.greaterThan(3), 'Must be greater than 3 characters']
    ],
    description:  () => [
      [TextValidation.defined, 'Must provide a description'],
      [TextValidation.greaterThan(5), 'Must be greater than 5 characters']
    ],
    duration: () => [
      [(val) =>  Object.keys(val).length > 2, 'Must provide precision'],
      [(val) => Object.values(val)[0] > 0, 'Factor must be greater than 0'],
    ],
    displayName: () => [
      [TextValidation.defined, 'Must provide a display name'],
      [TextValidation.greaterThan(3), 'Must be greater than 3 characters']
    ],
    availabilities: ({ duration }) => [
      [(value) => value.length > 0, 'Must select availability'],
      [(value) => AvailabilityValidation.durationInvalidIndexes(value, duration).length === 0, 'Invalid availabilities']
    ]
  }
});
