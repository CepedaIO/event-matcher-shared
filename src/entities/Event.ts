import {AsMut, IDuration} from "../types";

interface IEventBase {
  id: number;
  name: string;
  img: string;
  description: string;
  duration: IDuration;
}

export type IEventEntity = AsMut<IEventBase>;
