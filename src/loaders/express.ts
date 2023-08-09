import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import hpp from "hpp";
import Container from "typedi";
import { TransactionMiddleware } from "../common/middleware/transaction.middleware";
import { ConfigService } from "../components/config/config.service";
import userRouter from "../components/user/router/user.router";
import { LoggerMiddleware } from "../common/middleware/logger.middleware";
import { ResponseError } from "../types/config";
import { NotFoundExceptionFilter } from "../common/filter/not-found.exception.filter";
import { ForbiddenExceptionFilter } from "../common/filter/forbidden-exception.filter";
import { HttpExceptionFilter } from "../common/filter/http-exception.filter";

export default (app: Express) => {
  const transactionMiddleware = Container.get(TransactionMiddleware);
  const loggerMiddleware = Container.get(LoggerMiddleware);
  const configService = Container.get(ConfigService);
  const notFoundExceptionFilter = Container.get(NotFoundExceptionFilter);
  const forbiddenExceptionFilter = Container.get(ForbiddenExceptionFilter);
  const httpExceptionFilter = Container.get(HttpExceptionFilter);

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

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    notFoundExceptionFilter.use(req, res, next);
  });

  /// forbidden error handlers
  app.use(
    (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
      forbiddenExceptionFilter.use(err, req, res, next);
    }
  );

  /// http error handlers
  app.use(
    (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
      httpExceptionFilter.use(err, req, res, next);
    }
  );
};
