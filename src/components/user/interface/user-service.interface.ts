import { CreateUserDTO } from "../dto/create.user.dto";

export interface IUserService {
  createUser(createUserDTO: CreateUserDTO): Promise<boolean>;
}
