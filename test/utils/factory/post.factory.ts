import { PoolConnection } from "mysql2/promise";
import { CreatePostDto } from "../../../src/components/post/dto/create.post.dto";

export class PostFactory {
  async createPostTable(conn: PoolConnection) {
    await conn.query(
      "CREATE TABLE `posts` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `title` VARCHAR(45) NOT NULL, `content` MEDIUMTEXT NOT NULL, `authorId` INT UNSIGNED NULL, `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` DATETIME(6) NULL DEFAULT NULL, PRIMARY KEY (`id`), INDEX `post_user_fk_idx` (`authorId` ASC) VISIBLE, CONSTRAINT `post_user_fk` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);"
    );
  }

  async creatPost(conn: PoolConnection, createPostDTO: CreatePostDto) {
    const query = "INSERT INTO `posts` SET ?";
    await conn.query(query, createPostDTO);
  }

  createPostDto(): CreatePostDto {
    return {
      authorId: 1,
      title: "test",
      content: "test",
    };
  }
}
