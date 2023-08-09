import { Request } from "express";

export class ResponseError extends Error {
  status?: number;
}
export interface CustomRequest extends Request {
  parsedId?: number;
}
