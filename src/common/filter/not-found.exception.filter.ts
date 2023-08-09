import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { ResponseError } from "../../types/config";
import statusCode from "../constant/statusCode";

@Service()
export class NotFoundExceptionFilter {
  use(request: Request, response: Response, next: NextFunction): void {
    const err: ResponseError = new Error(
      `${response.req.method} ${response.req.url} Not Found`
    );

    err["status"] = statusCode.NOT_FOUND;
    next(err);
  }
}
