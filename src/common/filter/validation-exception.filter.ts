import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { ResponseError } from "../../types/common";
import statusCode from "../constant/statusCode";
import util from "../util/response.util";
import { ValidationError } from "class-validator";
import { ConfigService } from "../../components/config/config.service";
import { WinstonConfigService } from "../../components/config/winston-config.service";

@Service()
export class ValidationExceptionFilter {
  private env;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: WinstonConfigService
  ) {
    this.env = this.configService.getAppConfig().ENV;
  }

  use(
    err: ResponseError,
    _request: Request,
    response: Response,
    next: NextFunction
  ): Response<any, Record<string, any>> | void {
    if (!(err instanceof ValidationError)) return next();

    response.status(statusCode.BAD_REQUEST);
    if (this.env !== "production") {
      this.loggerService.logger.error(
        `${response.req.method} ${response.req.url} ${statusCode.BAD_REQUEST} ${err.target} Response: "success: false, msg: validation Error property: ${err.property}"`
      );
    }

    const returnObj: Record<string, any> = {
      target: err.target,
      property: err.property,
      value: err.value,
      constraints: err.constraints,
    };
    if (err.children && err.children.length > 0)
      returnObj.children = err.children;
    response.send(util.fail(statusCode.BAD_REQUEST, returnObj));
  }
}
