import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { DependencyManager } from "../../../loaders/dependency.manager";
import { signUpPropertiesValidator } from "../validation/signUp.validation";
import { loginPropertiesValidator } from "../validation/login.validation";
import { refreshPropertiesValidator } from "../validation/refresh.validator";

const authRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const authController = dependencyManager.getAuthController();

authRouter.put(
  "/refresh",
  refreshPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req, res, next)
);

authRouter.post(
  "/sign-up",
  signUpPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.signUp(req, res, next)
);

authRouter.post(
  "/login",
  loginPropertiesValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.JwtLogin(req, res, next)
);

export default authRouter;
