import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";

import statusCode from "../../../common/constant/statusCode";
import util from "../../../common/util/response.util";
import { tryCatch } from "../../../common/decorator/try-catch.decorator";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import AuthService from "../service/auth.service";

@Service()
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @tryCatch()
  async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const createUserDTO = new CreateUserDTO(email, password);

    await this.authService.signUp(createUserDTO);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED));
  }
}

export default AuthController;
