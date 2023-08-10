import { Service } from "typedi";
import { Transactional } from "../../../common/decorator/transaction.decorator";
import { IAuthService } from "../interface/auth-service.interface";
import { UserRepository } from "../../user/repository/user.repository";
import { CreateUserDTO } from "../../user/dto/create.user.dto";
import { User } from "../../user/entity/user.entity";

@Service()
export class AuthService implements IAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transactional()
  async signUp(createUserDTO: CreateUserDTO): Promise<boolean> {
    const user = new User(createUserDTO.name);

    return this.userRepository.create(user);
  }
}

export default AuthService;
