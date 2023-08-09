import { Request } from "express";

export interface CustomRequest extends Request {
  parsedId?: number;
}

export interface ResponseError extends Error {
  status?: number;
}
