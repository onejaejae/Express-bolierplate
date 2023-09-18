import { getNamespace } from "cls-hooked";
import { EXPRESS_NAMESPACE } from "./namespace.const";
import { InternalServerErrorException } from "../exception/internalServer.error.exception";
import { Role as ERole } from "../types/role/role.type";
import { NextFunction, Request, Response } from "express";

export const EXPRESS_ROLE = "namespace/express-role";

export class RoleMiddleware {
  constructor(private readonly role: ERole) {}

  use(request: Request, response: Response, next: NextFunction) {
    if (!this.role)
      throw new InternalServerErrorException(
        "role이 설정되지 않았습니다.",
        RoleMiddleware.name
      );

    const nameSpace = getNamespace(EXPRESS_NAMESPACE);

    if (!nameSpace || !nameSpace.active)
      throw new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        RoleMiddleware.name
      );

    nameSpace.set(EXPRESS_ROLE, this.role);

    next();
  }
}
