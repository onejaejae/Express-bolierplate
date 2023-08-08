import { Router } from "express";
import Container from "typedi";
import UserController from "../controller/user.controller";

const userRouter: Router = Router();

const userController = Container.get(UserController);

userRouter.post("/", (req, res) => userController.createUser(req, res));

export default userRouter;
