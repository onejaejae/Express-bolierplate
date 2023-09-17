import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import statusCode from "../../../common/constant/statusCode";
import AuthService from "../service/auth.service";
import { CustomRequest } from "../../../types/common";
import { TryCatch } from "../../../common/decorator/try-catch.decorator";

@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TryCatch(statusCode.CREATED)
  async refresh(req: CustomRequest, res: Response, next: NextFunction) {
    return this.authService.refresh(req.body);
  }

  @TryCatch(statusCode.CREATED)
  async signUp(req: Request, _res: Response, _next: NextFunction) {
    return this.authService.signUp(req.body);
  }

  @TryCatch(statusCode.OK)
  async JwtLogin(req: Request, _res: Response, _next: NextFunction) {
    return this.authService.jwtLogin(req.body);
  }
}

export default AuthController;
