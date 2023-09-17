import { Service } from "typedi";
import { BaseRepository } from "../../database/repository/base.repository";
import {
  User,
  GenerateUserJoinWithPost,
  UserWithPassword,
  UserJoinWithPost,
} from "../entity/user.entity";
import { TransactionManager } from "../../database/transaction.manager";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { TransformPlainToInstance, plainToClass } from "class-transformer";

@Service()
export class UserRepository extends BaseRepository<User> {
  getName(): string {
    return User.name.toLowerCase().concat("s");
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(User);
  }

  @TransformPlainToInstance(UserWithPassword)
  async findByEmailOrThrow(email: string): Promise<UserWithPassword> {
    const query = `SELECT users.* FROM users WHERE users.email = ?`;
    const [results] = await this.queryRows(query, [email]);

    if (results.length === 0) {
      throw new BadRequestException(`Item with email ${email} not found.`);
    }

    return results[0] as any;
  }

  @TransformPlainToInstance(UserJoinWithPost)
  async findByIdJoinWithPost(userId: number): Promise<UserJoinWithPost> {
    const query = `
      SELECT users.*, posts.title AS postTitle, posts.content AS postContent, posts.id AS postId
      FROM users
      LEFT JOIN posts ON users.id = posts.authorId AND posts.deletedAt IS NULL
      WHERE users.id = ?;
    `;

    const [results] = await this.queryRows(query, [userId]);
    if (results.length === 0) {
      throw new BadRequestException(`userId: ${userId} don't exist`);
    }

    const userWithPosts: GenerateUserJoinWithPost[] = results.map((res) =>
      plainToClass(GenerateUserJoinWithPost, res)
    );

    const user = userWithPosts[0].generateUser();
    const posts = userWithPosts.map((user) => user.generatePost());
    user.posts = posts;

    return user as any;
  }
}
