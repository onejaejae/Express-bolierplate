import { NextFunction, Response } from "express";
import { Service } from "typedi";
import UserService from "../service/user.service";
import statusCode from "../../../common/constant/statusCode";
import util from "../../../common/util/response.util";
import { tryCatch } from "../../../common/decorator/try-catch.decorator";
import { CustomRequest } from "../../../types/common";
import { instanceToPlain } from "class-transformer";

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
  async getUserWithPosts(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    if (!req.userId) throw new Error(`userId don't exist`);

    const result = await this.userService.getUserWithPosts(req.userId);
    const test = instanceToPlain(result);
    return res.status(statusCode.OK).send(util.success(statusCode.OK, test));
  }
}

export default UserController;
