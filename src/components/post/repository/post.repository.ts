import { Service } from "typedi";
import { BaseRepository } from "../../database/repository/base.repository";
import { TransactionManager } from "../../database/transaction.manager";
import { Post } from "../entity/post.entity";

@Service()
export class PostRepository extends BaseRepository<Post> {
  getName(): string {
    return Post.name.toLowerCase().concat("s");
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Post);
  }
}
