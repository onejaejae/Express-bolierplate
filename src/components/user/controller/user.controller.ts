import { NextFunction, Response } from "express";
import { Service } from "typedi";
import UserService from "../service/user.service";
import statusCode from "../../../common/constant/statusCode";
import { CustomRequest } from "../../../types/common";
import { TryCatch } from "../../../common/decorator/try-catch.decorator";

@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  @TryCatch(statusCode.OK)
  async getUser(req: CustomRequest, _res: Response, _next: NextFunction) {
    if (!req.parsedId) throw new Error(`parsedId don't exist`);

    return this.userService.getUser(req.parsedId);
  }

  @TryCatch(statusCode.OK)
  async getUserWithPosts(
    req: CustomRequest,
    _res: Response,
    _next: NextFunction
  ) {
    if (!req.userId) throw new Error(`userId don't exist`);

    return await this.userService.getUserWithPosts(req.userId);
  }
}

export default UserController;
