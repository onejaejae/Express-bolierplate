import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { getUserPropertiesValidator } from "../validation";
import { DependencyManager } from "../../../loaders/dependency.manager";
import { CustomRequest } from "../../../types/common";

const userRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const userController = dependencyManager.getUserController();
const parseIntPipe = dependencyManager.getParseIntPipe();
const authGuard = dependencyManager.getAuthGuard();

userRouter.get(
  "/posts",
  (req: CustomRequest, res: Response, next: NextFunction) =>
    authGuard.use(req, res, next),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    userController.getUserWithPosts(req, res, next)
);

userRouter.get(
  "/:id",
  getUserPropertiesValidator,
  (req: CustomRequest, res: Response, next: NextFunction) =>
    parseIntPipe.use(req, res, next),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    userController.getUser(req, res, next)
);

export default userRouter;
