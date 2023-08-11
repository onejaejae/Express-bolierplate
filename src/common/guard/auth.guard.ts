import { Service } from "typedi";
import { TokenService } from "../../components/jwt/token.service";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/unauthorization.exception";
import { UserRepository } from "../../components/user/repository/user.repository";
import { CustomRequest } from "../../types/common";

@Service()
export class AuthGuard {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository
  ) {}

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    try {
      // check token
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || authorizationHeader === "")
        throw new UnauthorizedException("인증정보가 없습니다.");

      const headerArray = authorizationHeader.split(" ");
      if (headerArray.length != 2)
        throw new UnauthorizedException("인증정보가 형식이 옳바르지 않습니다");

      const [_, token] = headerArray;
      const isVerify = this.tokenService.verifiedToken(token);

      if (!isVerify.success)
        throw new UnauthorizedException("AccessToken Invalid");

      req.userId = parseInt(isVerify.id, 10);
      next();
    } catch (error) {
      next(error);
    }
  }
}
