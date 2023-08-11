import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { DependencyManager } from "../../loaders/dependency.manager";
import { createPostPropertiesValidator } from "./validation/create.post.validation";

const postRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const postController = dependencyManager.getPostController();
const authGuard = dependencyManager.getAuthGuard();

postRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    authGuard.use(req, res, next),
  createPostPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    postController.createPost(req, res, next)
);

export default postRouter;
