import {FormFactory} from "../types";

export interface IInviteMemberInput {
  email: string;
  message: string;
  id: number;
}

export const InviteUserForm:FormFactory<IInviteMemberInput> = () => ({
  validation: {}
});
