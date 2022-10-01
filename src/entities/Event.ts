import {IMembership} from "./Membership";
import {AsMut, IDuration} from "../types";

export interface IInviteSummary {
  uuid: string;
  key: string;
  event: {
    id: number,
    name: string;
  }
  from: string;
  expiresOn: Date;
}

export interface IEvent {
  name: string;
  img: string;
  description: string;
  duration: IDuration;
  memberships: IMembership[];
}

export type IEventEntity = AsMut<IEvent>;

export interface IEventSummary {
  id: number;
  name: string;
  img: string;
  duration: IDuration;
  admin: Pick<IMembership, 'displayName'>
  memberCount: number;
}
