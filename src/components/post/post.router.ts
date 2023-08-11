import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { DependencyManager } from "../../loaders/dependency.manager";
import { createPostPropertiesValidator } from "./validation/create.post.validation";
import { CustomRequest } from "../../types/common";
import { Role } from "../../common/types/role/role.type";
import { RoleMiddleware } from "../../common/middleware/role.middleware";

const postRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const postController = dependencyManager.getPostController();
const authGuard = dependencyManager.getAuthGuard();
const postOwnerRoleGuard = dependencyManager.getPostOwnerRoleGuard();
const parseIntPipe = dependencyManager.getParseIntPipe();

postRouter.get(
  "/:id",
  (req: CustomRequest, res: Response, next: NextFunction) =>
    parseIntPipe.use(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    postController.getPost(req, res, next)
);

postRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    authGuard.use(req, res, next),
  createPostPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    postController.createPost(req, res, next)
);

postRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    authGuard.use(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    new RoleMiddleware(Role.ADMIN).use(req, res, next),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    postOwnerRoleGuard.canActivate(req, res, next),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    parseIntPipe.use(req, res, next),
  (req: CustomRequest, res: Response, next: NextFunction) =>
    postController.deletePost(req, res, next)
);

export default postRouter;
