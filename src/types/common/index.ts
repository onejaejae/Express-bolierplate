import { Request } from "express";
import { ResultSetHeader } from "mysql2";

type ValueType = string | number | boolean;

export type Union<
  T extends { [key: string]: ValueType } | ReadonlyArray<ValueType>
> = T extends ReadonlyArray<ValueType>
  ? T[number]
  : T extends { [key: string]: infer U }
  ? U
  : never;

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CountResult extends ResultSetHeader {
  count: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export class ResponseError extends Error {
  status?: number;
}
export interface CustomRequest extends Request {
  userId?: number;
  parsedId?: number;
}
