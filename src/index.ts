import "reflect-metadata";

import express, { Request, Response } from "express";
import userRouter from "./components/user/router/user.router";

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
