import "reflect-metadata";

import express from "express";
import Container from "typedi";
import { ConfigService } from "./components/config/config.service";
import { WinstonConfigService } from "./components/config/winston-config.service";

const startServer = async () => {
  const app: express.Application = express();
  const configService = Container.get(ConfigService);
  const loggerService = Container.get(WinstonConfigService);

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
