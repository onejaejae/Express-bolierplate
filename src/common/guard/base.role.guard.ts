import { Service } from "typedi";
import { WinstonConfigService } from "../../components/config/winston-config.service";
import { NextFunction, Response } from "express";
import { Role } from "../types/role/role.type";
import { CustomRequest } from "../../types/common";
import { UnauthorizedException } from "../exception/unauthorization.exception";
import { UserRepository } from "../../components/user/repository/user.repository";
import { ForbiddenException } from "../exception/forbidden.exception";
import { Logger } from "winston";
import { PostRepository } from "../../components/post/repository/post.repository";
import { ClassConstructor } from "class-transformer";

@Service()
export abstract class BaseRoleGuard<T> {
  private logger: Logger;
  protected abstract readonly loggerService: WinstonConfigService;
  protected abstract get userRepository(): UserRepository;
  protected abstract get postRepository(): PostRepository;

  constructor(private readonly classType: ClassConstructor<T>) {}

  protected async isPostOwner(userId: number, postId: number) {
    try {
      const post = await this.postRepository.findByIdOrThrow(postId);

      return post.authorId === userId;
    } catch (error) {
      throw error;
    }
  }

  protected async validateRole(
    req: CustomRequest,
    next: NextFunction,
    roles: Role[]
  ) {
    try {
      this.logger = this.loggerService.logger;

      if (!req.userId)
        throw new UnauthorizedException(
          "인증정보가 없습니다.",
          this.classType.name,
          "validateRole"
        );

      const currentUser = await this.userRepository.findByIdOrThrow(req.userId);
      const currentUserRole = currentUser.role.toUpperCase();
      const userRole = Role.find((r) => r.role === currentUserRole);

      if (!userRole)
        throw new UnauthorizedException(
          "role 정보가 없습니다.",
          this.classType.name,
          "validateRole"
        );

      const isAllow = roles.some((role) => role.isEquals(userRole));
      if (isAllow) return next();

      throw new ForbiddenException("권한이 없습니다.");
    } catch (error) {
      throw error;
    }
  }

  abstract canActivate(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
    roles: Role[]
  ): Promise<void>;
}
