import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { ConfigService } from "../config/config.service";
import { WinstonConfigService } from "../config/winston-config.service";
import { UnauthorizedException } from "../../common/exception/unauthorization.exception";
import { UserRepository } from "../user/repository/user.repository";
import { Logger } from "winston";
import { JwtPayload } from "../../types/common";
import { NotFoundException } from "../../common/exception/notFound.exception";

@Service()
export class JwtService {
  private jwtSecret: string;
  private logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: WinstonConfigService,
    private readonly userRepository: UserRepository
  ) {
    this.jwtSecret = configService.getJwtConfig().JWT_SECRET;
    this.logger = loggerService.logger;
  }

  sign(tokenPayload: JwtPayload) {
    const payload: JwtPayload = {
      // access token에 들어갈 payload
      sub: tokenPayload.sub,
      email: tokenPayload.email,
    };

    return jwt.sign(payload, this.jwtSecret, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: "1h", // 유효기간
    });
  }

  verify(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return {
        success: true,
        id: decoded.sub,
      };
    } catch (err: any) {
      this.logger.error(`verify error ${err.message}`);

      return {
        success: false,
        message: err.message,
      };
    }
  }

  refresh() {
    return jwt.sign({}, this.jwtSecret, {
      // refresh token은 payload 없이 발급
      algorithm: "HS256",
      expiresIn: "365d",
    });
  }

  async refreshVerify(refreshToken: string, userId: number) {
    // refresh token 검증
    const user = await this.userRepository.findByIdOrThrow(userId);

    if (refreshToken === user.refreshToken) {
      try {
        jwt.verify(refreshToken, this.jwtSecret);
        return true;
      } catch (err) {
        if (err instanceof Error)
          this.logger.error(`token error ${err.message}`);
        return false;
      }
    } else {
      throw new NotFoundException(`RefreshToken이 존재하지 않습니다.`);
    }
  }
}
