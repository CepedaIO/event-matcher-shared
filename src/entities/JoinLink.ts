import {DateTime} from "luxon";
import {AsEntity} from "../types";

export interface IJoinLinkBase {
  key: string;
  expiresOn?: DateTime;
  message: string;
  eventId: number;
}

export type IJoinLinkEntity = AsEntity<IJoinLinkBase>;
