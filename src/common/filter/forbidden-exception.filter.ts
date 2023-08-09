import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { ResponseError } from "../../types/config";
import statusCode from "../constant/statusCode";
import { WinstonConfigService } from "../../components/config/winston-config.service";
import util from "../util/response.util";

@Service()
export class ForbiddenExceptionFilter {
  constructor(private readonly loggerService: WinstonConfigService) {}

  use(
    err: ResponseError,
    _request: Request,
    response: Response,
    next: NextFunction
  ): Response<any, Record<string, any>> | void {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      this.loggerService.logger.error(
        `${response.req.method} ${response.req.url}  Response: "success: false, msg: ${err.message}"`
      );

      return response
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, err.message))
        .end();
    }

    return next(err);
  }
}