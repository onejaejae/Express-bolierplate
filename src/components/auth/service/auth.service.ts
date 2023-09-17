import { Service } from "typedi";
import { Transactional } from "../../../common/decorator/transaction.decorator";
import { IAuthService } from "../interface/auth-service.interface";
import { UserRepository } from "../../user/repository/user.repository";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import { User } from "../../user/entity/user.entity";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { LoginDTO } from "../dto/login.dto";
import { TokenService } from "../../jwt/token.service";
import { TokenPayload } from "../../jwt/dto/token-payload.dto";
import { Role } from "../../../common/types/role/role.type";
import { Bcrypt } from "../../../common/util/encrypt";

@Service()
export class AuthService implements IAuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly bcrypt: Bcrypt
  ) {}

  async refresh(
    accessToken: string,
    refreshToken: string,
    userId: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findByIdOrThrow(
      parseInt(userId, 10)
    );
    const payload = new TokenPayload(userId, user.email);
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
  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    const { email, password } = createUserDTO;

    const user = await this.userRepository.findOne({ email });
    if (user)
      throw new BadRequestException(`user email: ${email} already exist`);

    const hashedPassword = await this.bcrypt.createHash(password);
    const newUser = new User(
      email,
      hashedPassword,
      Role.MEMBER.enumName.toLocaleLowerCase()
    );
    return this.userRepository.create(newUser);
  }

  async jwtLogin(loginDTO: LoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginDTO;

    const user = await this.userRepository.findByEmailOrThrow(email);
    const isPasswordValid = await user.isPasswordValid(password, this.bcrypt);
    if (!isPasswordValid)
      throw new BadRequestException(`user passwond invalid`);

    const payloadDTO = new TokenPayload(user.id.toString(), user.email);
    const tokens = this.tokenService.createToken(payloadDTO.toPlain());

    user.refreshToken = tokens.refreshToken;
    await this.userRepository.update(user);

    return tokens;
  }
}

export default AuthService;
