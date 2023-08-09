import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import statusCode from "../constant/statusCode";
import util from "../util/response.util";

export const validatorErrorChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, errors.array()[0].msg));
  }
  next();
};
