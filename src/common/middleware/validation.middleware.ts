import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Service()
export class ValidationMiddleware {
  async use(req: Request, _res: Response, next: NextFunction, classType: any) {
    try {
      const instance = plainToInstance(classType, req.body);
      await validateOrReject(instance);

      req.body = instance;
      next();
    } catch (error: any) {
      next(...error);
    }
  }
}
