import { CreateUserDTO } from "../../user/dto/create.user.dto";

export interface IAuthService {
  signUp(createUserDTO: CreateUserDTO): Promise<boolean>;
}
