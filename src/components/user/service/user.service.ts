import { Service } from "typedi";
import { User } from "../entity/user.entity";
import { UserRepository } from "../repository/user.repository";
import { CreateUserDTO } from "../dto/create.user.dto";
import { Transactional } from "../../../common/decorator/transaction.decorator";
import { IUserService } from "../interface/user-service.interface";
import { IGetUserResponse } from "../../../types/user";

@Service()
class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(uesrId: number): Promise<IGetUserResponse> {
    return this.userRepository.findOneAndThrow(uesrId);
  }

  @Transactional()
  async createUser(createUserDTO: CreateUserDTO): Promise<boolean> {
    const user = new User(createUserDTO.name);

    return this.userRepository.create(user);
  }
}

export default UserService;
