import { Service } from "typedi";
import { WinstonConfigService } from "../../components/config/winston-config.service";
import { NextFunction, Request, Response } from "express";
import { Role } from "../types/role/role.type";
import { getNamespace } from "cls-hooked";
import { EXPRESS_NAMESPACE } from "../middleware/namespace.const";
import { InternalServerErrorException } from "../exception/internalServer.error.exception";
import { EXPRESS_ROLE } from "../middleware/role.middleware";
import { CustomRequest } from "../../types/common";
import { UnauthorizedException } from "../exception/unauthorization.exception";
import { UserRepository } from "../../components/user/repository/user.repository";
import { ForbiddenException } from "../exception/forbidden.exception";

@Service()
export class RoleGuard {
  private logger;

  constructor(
    private readonly loggerService: WinstonConfigService,
    private readonly userRepository: UserRepository
  ) {
    this.logger = loggerService.logger;
  }

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    try {
      const nameSpace = getNamespace(EXPRESS_NAMESPACE);

      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${EXPRESS_NAMESPACE} is not active`
        );

      const role: Role = nameSpace.get(EXPRESS_ROLE);
      if (!role) {
        this.logger.error("Could not define role where metaData");
        throw new InternalServerErrorException(
          "서버에 이상이 있습니다. 관리자에게 문의해주세요."
        );
      }

      if (!req.userId) throw new UnauthorizedException("인증정보가 없습니다.");

      const currentUser = await this.userRepository.findByIdOrThrow(req.userId);
      const currentUserRole = currentUser.role.toUpperCase();
      const userRole = Role.find((r) => r.role === currentUserRole);

      if (!userRole) throw new UnauthorizedException("role 정보가 없습니다.");

      const isAllow = role.isEquals(userRole);
      if (isAllow) next();

      throw new ForbiddenException("권한이 없습니다.");
    } catch (error) {
      next(error);
    }
  }
}
