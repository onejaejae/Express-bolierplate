import "reflect-metadata";

import express from "express";
import Container from "typedi";
import { ConfigService } from "./components/config/config.service";
import { WinstonConfigService } from "./components/config/winston-config.service";
import { DependencyManager } from "./loaders/dependency.manager";

const startServer = async () => {
  const app: express.Application = express();
  const dependencyManager = Container.get(DependencyManager);

  const loggerService = dependencyManager.getWinstonLoggerService();
  const configService = dependencyManager.getConfigService();
  const appConfig = configService.getAppConfig();

  await require("./loaders/express").default(app);

  await app.listen(appConfig.PORT);
  loggerService.logger.info(
    `🐁 [Express-API][${appConfig.ENV}] Started at: ${Date.now()}`
  );
  loggerService.logger.info(
    `🚀 Server open at ${appConfig.BASE_URL}:${appConfig.PORT}`
  );

  process.on("uncaughtException", function (err) {
    loggerService.logger.info(
      `uncaughtException (Node is alive): ${err.message}`
    );
  });
};

startServer();
