import { Service } from "typedi";
import { UserRepository } from "../repository/user.repository";
import { IUserService } from "../interface/user-service.interface";
import { IGetUserResponse } from "../../../types/user";

@Service()
class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(uesrId: number): Promise<IGetUserResponse> {
    return this.userRepository.findByIdOrThrow(uesrId);
  }

  async getUserWithPosts(uesrId: number): Promise<any> {
    return this.userRepository.findByIdJoinWithPost(uesrId);
  }
}

export default UserService;
