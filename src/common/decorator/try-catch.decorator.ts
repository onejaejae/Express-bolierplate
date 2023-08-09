import { NextFunction, Request, Response } from "express";

export function tryCatch() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        const nextFn: NextFunction = args[args.length - 1];
        nextFn(error);
      }
    };
  };
}
