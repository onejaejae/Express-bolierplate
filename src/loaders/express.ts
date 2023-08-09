import express, { Express } from "express";
import helmet from "helmet";
import hpp from "hpp";
import Container from "typedi";
import { TransactionMiddleware } from "../common/middleware/transaction.middleware";
import { ConfigService } from "../components/config/config.service";
import userRouter from "../components/user/router/user.router";

export default (app: Express) => {
  const transactionMiddleware = Container.get(TransactionMiddleware);
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

  app.use("/api/users", userRouter);
};
