import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import hpp from "hpp";
import Container from "typedi";
import userRouter from "../components/user/router/user.router";
import { ResponseError } from "../types/common";
import { DependencyManager } from "./dependency.manager";

export default (app: Express) => {
  const dependencyManager = Container.get(DependencyManager);

  const transactionMiddleware = dependencyManager.getTransactionMiddleware();
  const loggerMiddleware = dependencyManager.getLoggerMiddleware();
  const configService = dependencyManager.getConfigService();
  const notFoundExceptionFilter =
    dependencyManager.getNotFoundExceptionFilter();
  const forbiddenExceptionFilter =
    dependencyManager.getForbiddenExceptionFilter();
  const httpExceptionFilter = dependencyManager.getHttpExceptionFilter();

  const appConfig = configService.getAppConfig();
  if (appConfig.ENV === "production") {
    app.use(hpp());
    app.use(helmet());
  }

  app.use(express.json());

  // global middlewares
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
