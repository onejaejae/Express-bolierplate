import { Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../service/user.service";
import { CreateUserDTO } from "../dto/create.user.dto";

@Service()
class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: Request, res: Response) {
    const { name } = req.body;

    const createUserDTO = new CreateUserDTO(name);

    const result = await this.userService.createUser(createUserDTO);
    return res.json(result);
  }
}

export default UserController;
