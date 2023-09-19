import { Service } from "typedi";
import { WinstonConfigService } from "../../components/config/winston-config.service";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types/common";
import { UserRepository } from "../../components/user/repository/user.repository";
import { BaseRoleGuard } from "./base.role.guard";
import { BadRequestException } from "../exception/badRequest.exception";
import { PostRepository } from "../../components/post/repository/post.repository";
import { Role } from "../types/role/role.type";

@Service()
export class PostOwnerRoleGuard extends BaseRoleGuard<PostOwnerRoleGuard> {
  constructor(
    protected readonly loggerService: WinstonConfigService,
    protected readonly userRepository: UserRepository,
    protected readonly postRepository: PostRepository
  ) {
    super(PostOwnerRoleGuard);
  }

  getPostId(req: CustomRequest) {
    const target = req.params;
    const postId = parseInt(target.id, 10);

    if (!postId)
      throw new BadRequestException(
        "postId don't exist",
        PostOwnerRoleGuard.name,
        "getPostId"
      );
    return postId;
  }

  async canActivate(
    req: CustomRequest,
    _res: Response,
    next: NextFunction,
    roles: Role[]
  ): Promise<void> {
    try {
      if (!req.userId)
        throw new BadRequestException(
          "userId don't exist",
          PostOwnerRoleGuard.name,
          "canActivate"
        );

      const postId = this.getPostId(req);
      const isOwnered = await super.isPostOwner(req.userId, postId);

      if (isOwnered) return next();
      await super.validateRole(req, next, roles);
    } catch (error) {
      next(error);
    }
  }
}
