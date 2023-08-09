import { Service } from "typedi";
import { BaseRepository } from "../../repository/base.repository";
import { User } from "../entity/user.entity";
import { TransactionManager } from "../../database/transaction.manager";

@Service()
export class UserRepository extends BaseRepository<User> {
  getName(): string {
    return User.name.toLowerCase().concat("s");
  }

  constructor(protected readonly txManager: TransactionManager) {
    super();
  }
}
