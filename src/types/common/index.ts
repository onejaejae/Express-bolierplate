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
  callClass?: string;
  callMethod?: string;
}
export interface CustomRequest extends Request {
  userId?: number;
  parsedId?: number;
}

export const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUEST: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  DB_ERROR: 600,
};
export type StatusCode = Union<typeof StatusCode>;
