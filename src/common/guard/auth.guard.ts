import { Service } from "typedi";
import { TokenService } from "../../components/jwt/token.service";
import { Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/unauthorization.exception";
import { CustomRequest } from "../../types/common";
import { ExecutionContext } from "../exception/execution.context";

@Service()
export class AuthGuard extends ExecutionContext<AuthGuard> {
  constructor(private readonly tokenService: TokenService) {
    super(AuthGuard);
  }

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    try {
      // check token
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || authorizationHeader === "")
        throw new UnauthorizedException(
          "인증정보가 없습니다.",
          this.getClass()
        );

      const headerArray = authorizationHeader.split(" ");
      if (headerArray.length != 2)
        throw new UnauthorizedException(
          "인증정보가 형식이 옳바르지 않습니다",
          this.getClass()
        );

      const [_, token] = headerArray;
      const isVerify = this.tokenService.verifiedToken(token);

      if (!isVerify.success)
        throw new UnauthorizedException("AccessToken Invalid", this.getClass());

      req.userId = parseInt(isVerify.id, 10);
      next();
    } catch (error) {
      next(error);
    }
  }
}
