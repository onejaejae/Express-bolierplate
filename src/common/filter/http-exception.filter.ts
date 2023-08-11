import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { ResponseError } from "../../types/common";
import statusCode from "../constant/statusCode";
import { WinstonConfigService } from "../../components/config/winston-config.service";
import util from "../util/response.util";
import { ConfigService } from "../../components/config/config.service";

@Service()
export class HttpExceptionFilter {
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
    response.status(err.status || statusCode.INTERNAL_SERVER_ERROR);
    if (this.env !== "production") {
      this.loggerService.logger.error(
        `${response.req.method} ${response.req.url} ${err.status} ${err.stack} Response: "success: false, msg: ${err.message}"`
      );
    }

    const returnObj: Record<string, any> = {
      message: err.message,
      stack: err.stack,
    };
    response.send(util.fail(err.status || 500, returnObj));
  }
}
