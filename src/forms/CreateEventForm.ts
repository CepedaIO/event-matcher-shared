import {IAvailability} from "../availability";

export interface CreateEventForm {
  name: string;
  description: string;
  duration: {
    precision: string;
    factor: number;
  }
  displayName: string;
  availability: IAvailability;
}

export const CreatEventFormValidation = {
  name: [

  ]
}
