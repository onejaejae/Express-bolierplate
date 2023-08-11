import { Request } from "express";
import { ResultSetHeader } from "mysql2";

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
