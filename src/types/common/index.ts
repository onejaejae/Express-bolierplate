import { Request } from "express";

export interface BaseEntity {
  id: number;
}

export class ResponseError extends Error {
  status?: number;
}
export interface CustomRequest extends Request {
  parsedId?: number;
}
