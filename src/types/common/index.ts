import { Request } from "express";

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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
