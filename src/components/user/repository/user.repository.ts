import { Service } from "typedi";
import { BaseRepository } from "../../repository/base.repository";
import { User } from "../entity/user.entity";
import { ConnectMySQL, MySQL } from "../../database";

@Service()
export class UserRepository extends BaseRepository<User> {
  getName(): string {
    return User.name.toLowerCase().concat("s");
  }

  constructor(protected readonly mysql: ConnectMySQL) {
    super();
  }
}
