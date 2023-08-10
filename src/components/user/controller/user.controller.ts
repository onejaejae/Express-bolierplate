import { NextFunction, Response } from "express";
import { Service } from "typedi";
import UserService from "../service/user.service";
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
}

export default UserController;
