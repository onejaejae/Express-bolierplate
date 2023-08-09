import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../service/user.service";
import { CreateUserDTO } from "../dto/create.user.dto";
import statusCode from "../../../common/constant/statusCode";
import util from "../../../common/util/response.util";
import { tryCatch } from "../../../common/decorator/try-catch.decorator";
import { CustomRequest } from "../../../types/common";

@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  @tryCatch()
  async getUser(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.parsedId) throw new Error(`parsedId don't exist`);

    const result = await this.userService.getUser(req.parsedId);
    return res.status(statusCode.OK).send(util.success(statusCode.OK, result));
  }

  @tryCatch()
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    const createUserDTO = new CreateUserDTO(name);

    await this.userService.createUser(createUserDTO);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED));
  }
}

export default UserController;
