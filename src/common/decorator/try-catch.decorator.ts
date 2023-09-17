import { Response, NextFunction } from "express";
import util from "../util/response.util";
import { StatusCode } from "../../types/common";
import { instanceToPlain } from "class-transformer";

export function TryCatch(statusCode: StatusCode) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        const response: Response = args[args.length - 2];

        return response
          .status(statusCode)
          .send(util.success(statusCode, instanceToPlain(result)));
      } catch (error) {
        const nextFn: NextFunction = args[args.length - 1];
        nextFn(error);
      }
    };
  };
}
