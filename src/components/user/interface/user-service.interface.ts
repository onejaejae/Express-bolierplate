import { IGetUserResponse } from "../../../types/user";
import { CreateUserDTO } from "../dto/create.user.dto";

export interface IUserService {
  getUser(uesrId: number): Promise<IGetUserResponse>;
  createUser(createUserDTO: CreateUserDTO): Promise<boolean>;
}
