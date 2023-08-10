import { Service } from "typedi";
import { Transactional } from "../../../common/decorator/transaction.decorator";
import { IAuthService } from "../interface/auth-service.interface";
import { UserRepository } from "../../user/repository/user.repository";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import { User } from "../../user/entity/user.entity";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { createHash } from "../../../common/util/encrypt";

@Service()
export class AuthService implements IAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transactional()
  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    const { email, password } = createUserDTO;

    const isExist = await this.isEmailExist(email);
    if (isExist) throw new BadRequestException(`email: ${email} already exist`);

    const hashedPassword = await createHash(password);
    const user = new User(email, hashedPassword);
    return this.userRepository.create(user);
  }

  async isEmailExist(email: string) {
    const isEmailExist = await this.userRepository.findOne({
      email,
    });
    return isEmailExist !== null;
  }
}

export default AuthService;
