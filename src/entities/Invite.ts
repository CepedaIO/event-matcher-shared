import {DateTime} from "luxon";
import {AsEntity} from "../types";

export interface IInviteTokenBase {
  id: number;
  uuid: string;
  key: string;
  from: string;
  email: string;
  expiresOn: DateTime;
}

export type IInviteTokenEntity = AsEntity<IInviteTokenBase>;
