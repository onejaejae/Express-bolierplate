import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import {
  createUserPropertiesValidator,
  getUserPropertiesValidator,
} from "../validation";
import { DependencyManager } from "../../../loaders/dependency.manager";
import { CustomRequest } from "../../../types/common";

const userRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const userController = dependencyManager.getUserController();
const parseIntPipe = dependencyManager.getParseIntPipe();

userRouter.get(
  "/:id",
  getUserPropertiesValidator,
  (req: CustomRequest, res: Response, next: NextFunction) =>
    parseIntPipe.use(req, res, next),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    userController.getUser(req, res, next)
);

userRouter.post(
  "/",
  createUserPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.createUser(req, res, next)
);

export default userRouter;
