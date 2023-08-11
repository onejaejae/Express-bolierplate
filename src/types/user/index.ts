import { Post } from "../../components/post/entity/post.entity";
import { BaseEntity } from "../common";

export interface IUser extends BaseEntity {
  email: string;
  password: string;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface IUserJoinWithPost extends IUserWithoutPassword {
  posts: Post[];
}

export interface IGetUserResponse extends IUser {}
