import { Service } from "typedi";
import { BaseRepository } from "../../database/repository/base.repository";
import { User, UserJoinWithPost } from "../entity/user.entity";
import { TransactionManager } from "../../database/transaction.manager";
import { RowDataPacket } from "mysql2/promise";
import { Post } from "../../post/entity/post.entity";
import { IUserJoinWithPost } from "../../../types/user";
import { BadRequestException } from "../../../common/exception/badRequest.exception";

@Service()
export class UserRepository extends BaseRepository<User> {
  getName(): string {
    return User.name.toLowerCase().concat("s");
  }

  constructor(protected readonly txManager: TransactionManager) {
    super();
  }

  async findByIdJoinWithPost(userId: number): Promise<IUserJoinWithPost> {
    const query = `
      SELECT users.*, posts.title AS postTitle, posts.content AS postContent, posts.id AS postId
      FROM users
      LEFT JOIN posts ON users.id = posts.authorId
      WHERE users.id = ?;
    `;

    const [results] = await this.connection.query<RowDataPacket[]>(query, [
      userId,
    ]);

    if (results.length === 0) {
      throw new BadRequestException(`userId: ${userId} don't exist`);
    }

    const row = results[0];

    const user = new UserJoinWithPost(row.email);
    user.id = row.id;

    const posts = results
      .filter((row) => row.postId)
      .map((row) => {
        const post = new Post(user.id, row.postTitle, row.postContent);
        post.id = row.postId;

        return post;
      });

    user.posts = posts;
    return user;
  }
}
