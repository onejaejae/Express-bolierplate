import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import UserController from "../controller/user.controller";
import { createUserPropertiesValidator } from "../validation";

const userRouter: Router = Router();

const userController = Container.get(UserController);

userRouter.post(
  "/",
  createUserPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.createUser(req, res, next)
);

export default userRouter;
