import { Service } from "typedi";
import { BaseRepository } from "../../database/repository/base.repository";
import {
  User,
  UserJoinWithPost,
  UserWithPassword,
} from "../entity/user.entity";
import { TransactionManager } from "../../database/transaction.manager";
import { IUserJoinWithPost } from "../../../types/user";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { TransformPlainToInstance } from "class-transformer";

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
  async findByIdJoinWithPost(userId: number): Promise<IUserJoinWithPost> {
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

    return results[0] as any;
    // const row = results[0];

    // const user = new UserJoinWithPost(row.email, row.role);
    // user.id = row.id;

    // const posts = results
    //   .filter((row) => row.postId)
    //   .map((row) => {
    //     const post = new Post(user.id, row.postTitle, row.postContent);
    //     post.id = row.postId;

    //     return post;
    //   });

    // user.posts = posts;
    // return user;
  }
}
