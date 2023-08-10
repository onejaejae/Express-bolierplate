import { Service } from "typedi";
import { Transactional } from "../../../common/decorator/transaction.decorator";
import { IAuthService } from "../interface/auth-service.interface";
import { UserRepository } from "../../user/repository/user.repository";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import { User } from "../../user/entity/user.entity";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { createHash, isSameAsHash } from "../../../common/util/encrypt";
import { LoginDTO } from "../dto/login.dto";
import { TokenService } from "../../jwt/token.service";
import { TokenPayload } from "../../jwt/dto/token-payload.dto";

@Service()
export class AuthService implements IAuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository
  ) {}

  @Transactional()
  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    const { email, password } = createUserDTO;

    const user = await this.findByEmail(email);
    if (user) throw new BadRequestException(`email: ${email} already exist`);

    const hashedPassword = await createHash(password);
    const newUser = new User(email, hashedPassword);
    return this.userRepository.create(newUser);
  }

  async jwtLogin(loginDTO: LoginDTO): Promise<any> {
    const { email, password } = loginDTO;

    const user = await this.findByEmail(email);
    if (!user) throw new BadRequestException(`email: ${email} don't exist`);

    const isPasswordValid: boolean = await this.isPasswordValidate(
      password,
      user.password
    );
    if (!isPasswordValid)
      throw new BadRequestException(`password를 확인해주세요.`);

    const payloadDTO = new TokenPayload(user.id.toString(), user.email);
    return this.tokenService.createToken(payloadDTO.toPlain());
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  async isPasswordValidate(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return isSameAsHash(plainPassword, hashedPassword);
  }
}

export default AuthService;
