import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

import statusCode from "../../../common/constant/statusCode";
import util from "../../../common/util/response.util";
import { tryCatch } from "../../../common/decorator/try-catch.decorator";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import AuthService from "../service/auth.service";
import { LoginDTO } from "../dto/login.dto";
import { CustomRequest } from "../../../types/common";

@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @tryCatch()
  async refresh(req: CustomRequest, res: Response, next: NextFunction) {
    const { accessToken, refreshToken, userId } = req.body;
    const tokens = await this.authService.refresh(
      accessToken,
      refreshToken,
      userId
    );
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, tokens));
  }

  @tryCatch()
  async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const createUserDTO = new CreateUserDTO(email, password);

    await this.authService.signUp(createUserDTO);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED));
  }

  @tryCatch()
  async JwtLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const loginDTO = new LoginDTO(email, password);

    const result = await this.authService.jwtLogin(loginDTO);
    return res.status(statusCode.OK).send(util.success(statusCode.OK, result));
  }
}

export default AuthController;
