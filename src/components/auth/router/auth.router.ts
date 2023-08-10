import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { DependencyManager } from "../../../loaders/dependency.manager";
import { signUpPropertiesValidator } from "../validation/signUp.validation";

const authRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const authController = dependencyManager.getAuthController();

authRouter.post(
  "/sign-up",
  signUpPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.signUp(req, res, next)
);

export default authRouter;