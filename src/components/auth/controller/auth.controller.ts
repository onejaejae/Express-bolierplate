import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import statusCode from "../../../common/constant/statusCode";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import AuthService from "../service/auth.service";
import { LoginDTO } from "../dto/login.dto";
import { CustomRequest } from "../../../types/common";
import { TryCatch } from "../../../common/decorator/try-catch.decorator";

@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TryCatch(statusCode.CREATED)
  async refresh(req: CustomRequest, res: Response, next: NextFunction) {
    const { accessToken, refreshToken, userId } = req.body;
    return this.authService.refresh(accessToken, refreshToken, userId);
  }

  @TryCatch(statusCode.CREATED)
  async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const createUserDTO = new CreateUserDTO(email, password);

    return this.authService.signUp(createUserDTO);
  }

  @TryCatch(statusCode.OK)
  async JwtLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const loginDTO = new LoginDTO(email, password);

    return this.authService.jwtLogin(loginDTO);
  }
}

export default AuthController;
