import { BaseEntity } from "../common";

export interface IUser extends BaseEntity {
  email: string;
  password: string;
}

export interface IGetUserResponse extends IUser {}
