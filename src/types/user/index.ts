import { BaseEntity, Union } from "../common";

export interface IUser extends BaseEntity {
  email: string;
  password: string;
  refreshToken: string;
  role: RoleType;
}

export interface IJoinedPost {
  postTitle: string;
  postContent: string;
  postId: number;
}

export const RoleType = {
  ADMIN: "admin",
  MEMBER: "member",
};
export type RoleType = Union<typeof RoleType>;

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface IUserJoinWithPost extends IUserWithoutPassword {
  posts: IJoinedPost[];
}

export interface IGetUserResponse extends IUser {}
