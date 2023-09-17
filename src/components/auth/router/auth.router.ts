import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { DependencyManager } from "../../../loaders/dependency.manager";
import { signUpPropertiesValidator } from "../validation/signUp.validation";
import { loginPropertiesValidator } from "../validation/login.validation";
import { RefreshTokenDto } from "../dto/refresh.dto";
import { SignUpDto } from "../dto/signUp.dto";
import { LoginDto } from "../dto/login.dto";

const authRouter: Router = Router();

const dependencyManager = Container.get(DependencyManager);

const authController = dependencyManager.getAuthController();
const validationMiddleware = dependencyManager.getValidationMiddleware();

authRouter.put(
  "/refresh",
  (req: Request, res: Response, next: NextFunction) =>
    validationMiddleware.use(req, res, next, RefreshTokenDto),
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req, res, next)
);

authRouter.post(
  "/sign-up",
  (req: Request, res: Response, next: NextFunction) =>
    validationMiddleware.use(req, res, next, SignUpDto),
  (req: Request, res: Response, next: NextFunction) =>
    authController.signUp(req, res, next)
);

authRouter.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) =>
    validationMiddleware.use(req, res, next, LoginDto),
  (req: Request, res: Response, next: NextFunction) =>
    authController.JwtLogin(req, res, next)
);

export default authRouter;
