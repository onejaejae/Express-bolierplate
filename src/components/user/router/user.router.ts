import { Router, Request, Response } from "express";
import Container from "typedi";
import UserController from "../controller/user.controller";
import { createUserPropertiesValidator } from "../validation";

const userRouter: Router = Router();

const userController = Container.get(UserController);

userRouter.post(
  "/",
  createUserPropertiesValidator,
  (req: Request, res: Response) => userController.createUser(req, res)
);

export default userRouter;
