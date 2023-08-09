import { BaseEntity } from "../common";

export interface IUser extends BaseEntity {
  name: string;
}

export interface IGetUserResponse extends IUser {}
