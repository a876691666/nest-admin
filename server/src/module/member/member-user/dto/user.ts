import { MemberUserEntity } from '../member-user.entity';

export type MemberUserType = {
  token: string;
  user: MemberUserEntity;
};
