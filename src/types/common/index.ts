import { Request } from "express";

export interface BaseEntity {
  id: number;
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
