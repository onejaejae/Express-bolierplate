import { Post } from "../../components/post/entity/post.entity";
import { BaseEntity, Union } from "../common";

export interface IUser extends BaseEntity {
  email: string;
  password: string;
  role: RoleType;
}

export const RoleType = {
  ADMIN: "admin",
  MEMBER: "member",
};
export type RoleType = Union<typeof RoleType>;

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface IUserJoinWithPost extends IUserWithoutPassword {
  posts: Post[];
}

export interface IGetUserResponse extends IUser {}
