import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import hpp from "hpp";
import Container from "typedi";
import { TransactionMiddleware } from "../common/middleware/transaction.middleware";
import { ConfigService } from "../components/config/config.service";
import userRouter from "../components/user/router/user.router";
import { LoggerMiddleware } from "../common/middleware/logger.middleware";
import { ResponseError } from "../types/config";
import { WinstonConfigService } from "../components/config/winston-config.service";
import statusCode from "../common/constant/statusCode";
import util from "../common/util/response.util";

export default (app: Express) => {
  const transactionMiddleware = Container.get(TransactionMiddleware);
  const loggerService = Container.get(WinstonConfigService);
  const loggerMiddleware = Container.get(LoggerMiddleware);
  const configService = Container.get(ConfigService);

  const appConfig = configService.getAppConfig();
  if (appConfig.ENV === "production") {
    app.use(hpp());
    app.use(helmet());
  }

  app.use(express.json());
  app.use((req, res, next) => {
    transactionMiddleware.use(req, res, next);
  });
  app.use((req, res, next) => {
    loggerMiddleware.use(req, res, next);
  });

  app.use("/api/users", userRouter);

  /// error handlers
  app.use(
    (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
      /**
       * Handle 401 thrown by express-jwt library
       */
      if (err.name === "UnauthorizedError") {
        loggerService.logger.error(
          `${res.req.method} ${res.req.url}  Response: "success: false, msg: ${err.message}"`
        );

        return res
          .status(statusCode.UNAUTHORIZED)
          .send(util.fail(statusCode.UNAUTHORIZED, err.message))
          .end();
      }
      return next(err);
    }
  );

  app.use(
    (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || statusCode.INTERNAL_SERVER_ERROR);
      if (appConfig.ENV !== "production") {
        loggerService.logger.error(
          `${res.req.method} ${res.req.url} ${err.status} ${err.stack} Response: "success: false, msg: ${err.message}"`
        );
      }

      res.send(util.fail(err.status || 500, err.message));
    }
  );
};
