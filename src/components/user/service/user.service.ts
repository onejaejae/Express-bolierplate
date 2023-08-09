import { Service } from "typedi";
import { User } from "../entity/user.entity";
import { UserRepository } from "../repository/user.repository";
import { CreateUserDTO } from "../dto/create.user.dto";
import { Transactional } from "../../../common/decorator/transaction.decorator";

@Service()
class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transactional()
  async createUser(createUserDTO: CreateUserDTO): Promise<boolean> {
    const user = new User(createUserDTO.name);

    return this.userRepository.create(user);
  }
}

export default UserService;
