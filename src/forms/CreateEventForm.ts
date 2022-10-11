import {IDuration, FormFactory} from "../types";
import {AvailabilityValidation, TextValidation} from "../validation";
import {IAvailabilityBase} from "../entities";

export interface ICreateEventInput {
  name: string;
  img: string;
  description: string;
  duration: IDuration;
  displayName: string;
  availabilities: IAvailabilityBase[];
  eventAvailabilities: IAvailabilityBase[];
}

export const CreatEventForm:FormFactory<ICreateEventInput> = () => ({
  validation: {
    name: () => [
      [TextValidation.defined, 'Must provide event name'],
      [TextValidation.greaterThan(3), 'Must be greater than 3 characters']
    ],
    img: () => [
      [TextValidation.defined, 'Must provide an image'],
      [TextValidation.isURL, 'Must be a URL']
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
