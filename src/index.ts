import "reflect-metadata";

import express from "express";
import Container from "typedi";
import { ConfigService } from "./components/config/config.service";

const startServer = async () => {
  const app: express.Application = express();
  const configService = Container.get(ConfigService);

  const appConfig = configService.getAppConfig();

  await require("./loaders/express").default(app);

  app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
  });

  process.on("uncaughtException", function (err) {
    console.log(`uncaughtException (Node is alive): ${err.message}`);
  });
};

startServer();
