import { Service } from "typedi";
import { Transactional } from "../../../common/decorator/transaction.decorator";
import { IAuthService } from "../interface/auth-service.interface";
import { UserRepository } from "../../user/repository/user.repository";
import { User } from "../../user/entity/user.entity";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { TokenService } from "../../jwt/token.service";
import { TokenPayload } from "../../jwt/dto/token-payload.dto";
import { Role } from "../../../common/types/role/role.type";
import { Bcrypt } from "../../../common/util/encrypt";
import { RefreshTokenDto } from "../dto/refresh.dto";
import { SignUpDto } from "../dto/signUp.dto";
import { LoginDto } from "../dto/login.dto";
import { IJwtLoginResponse, IRefreshTokenResponse } from "../../../types/auth";
import { ExecutionContext } from "../../../common/exception/execution.context";
import { Release } from "../../../common/decorator/connection.release.decorator";

@Service()
export class AuthService
  extends ExecutionContext<AuthService>
  implements IAuthService
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly bcrypt: Bcrypt
  ) {
    super(AuthService);
  }

  @Release()
  async refresh(
    refreshTokenDto: RefreshTokenDto
  ): Promise<IRefreshTokenResponse> {
    const { userId, accessToken, refreshToken } = refreshTokenDto;

    const user = await this.userRepository.findByIdOrThrow(userId);

    const payload = new TokenPayload(userId.toString(), user.email);
    const tokens = await this.tokenService.refresh(
      accessToken,
      refreshToken,
      payload
    );

    user.refreshToken = tokens.refreshToken;
    await this.userRepository.update(user);

    return tokens;
  }

  @Transactional()
  async signUp(signUpDto: SignUpDto): Promise<boolean> {
    const { email, password } = signUpDto;

    const user = await this.userRepository.findOne({ email });
    if (user)
      throw new BadRequestException(
        `user email: ${email} already exist`,
        this.getClass(),
        "signUp"
      );

    const hashedPassword = await this.bcrypt.createHash(password);
    const newUser = new User(
      email,
      hashedPassword,
      Role.MEMBER.enumName.toLocaleLowerCase()
    );
    return this.userRepository.create(newUser);
  }

  @Release()
  async jwtLogin(loginDTO: LoginDto): Promise<IJwtLoginResponse> {
    const { email, password } = loginDTO;

    const user = await this.userRepository.findByEmailOrThrow(email);
    const isPasswordValid = await user.isPasswordValid(password, this.bcrypt);
    if (!isPasswordValid)
      throw new BadRequestException(
        `user passwond invalid`,
        this.getClass(),
        "jwtLogin"
      );

    const payloadDTO = new TokenPayload(user.id.toString(), user.email);
    const tokens = this.tokenService.createToken(payloadDTO.toPlain());

    user.refreshToken = tokens.refreshToken;
    await this.userRepository.update(user);

    return tokens;
  }
}

export default AuthService;
