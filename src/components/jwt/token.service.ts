import { Service } from "typedi";
import { JwtService } from "./jwt.service";
import { WinstonConfigService } from "../config/winston-config.service";
import { Logger } from "winston";
import { TokenPayload } from "./dto/token-payload.dto";
import { MethodNotAllowedException } from "../../common/exception/methodNotAllowed.exception";
import { BadRequestException } from "../../common/exception/badRequest.exception";
import { JwtPayload } from "../../types/common";

@Service()
export class TokenService {
  private logger: Logger;

  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerService: WinstonConfigService
  ) {
    this.logger = loggerService.logger;
  }

  /**
   * createToken
   *
   * @description User를 받아 새로운 AccessToken 및 RefreshToken을 생성
   * @returns JWT TOKEN (Access, Refresh)
   */
  async createToken(
    payload: JwtPayload
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.info(
      `Create Token with id: ${payload.sub}, email:${payload.email}`
    );

    // Create Token Id & AccessToken & Refresh Token
    const accessToken = this.jwtService.sign(
      new TokenPayload(payload.sub, payload.email).toPlain()
    );
    const refreshToken = this.jwtService.refresh();

    return { accessToken, refreshToken };
  }

  /**
   * verifiedToken
   *
   * @description argument로 입력받은 Token을 검증한 후 Token의 Claim을 Return
   */
  verifiedToken(token: string) {
    return this.jwtService.verify(token);
  }

  /**
   * refresh
   *
   * @description argument로 입력받은 Token들의 유효성을 검증 후 Token의 Claim을 기반으로 새로운 AccessToken을 만든다.
   * RefreshToken 또한 재 사용을 방지하기 위하여 새로 생성하여 Update 쳐준다.
   *
   * @throws argument로 받은 Token이 유효하지 않은 경우 {@link UnauthorizedException}
   * @throws RefreshToken이 존재하지 않는 경우 {@link NotFoundException}
   * @throws RefreshToken이 만료된 경우 {@link MethodNotAllowedException}
   */
  async refresh(
    accessToken: string,
    refreshToken: string,
    payload: JwtPayload
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessVerify = this.jwtService.verify(accessToken);
    const refreshVerify = this.jwtService.refreshVerify(
      refreshToken,
      parseInt(payload.sub, 10)
    );

    if (!refreshVerify)
      throw new MethodNotAllowedException(
        "RefreshToken이 이미 만료되었습니다."
      );

    if (accessVerify.success)
      throw new BadRequestException("Access Token이 유효합니다.");

    return this.createToken(payload);
  }
}
