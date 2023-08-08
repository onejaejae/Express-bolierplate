import "reflect-metadata";

import express, { Request, Response } from "express";
import userRouter from "./components/user/router/user.router";
import Container from "typedi";
import { TransactionMiddleware } from "./common/middleware/transaction.middleware";
import { ConnectMySQL } from "./components/database";

const app = express();

app.use(express.json());

const transactionMiddleware = Container.get(TransactionMiddleware);

app.use((req, res, next) => {
  transactionMiddleware.use(req, res, next);
});
app.use("/api/users", userRouter);

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
