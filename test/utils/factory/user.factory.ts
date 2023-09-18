import { PoolConnection } from "mysql2/promise";
import { SignUpDto } from "../../../src/components/auth/dto/signUp.dto";

export class UserFactory {
  async createUserTable(conn: PoolConnection) {
    await conn.query(
      "CREATE TABLE `users` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `email` VARCHAR(45) NOT NULL, `password` VARCHAR(100) NOT NULL, `refreshToken` VARCHAR(200) NULL, `role` ENUM('admin', 'member') NOT NULL, `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` DATETIME(6) NULL DEFAULT NULL,PRIMARY KEY (`id`), UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);"
    );
  }

  async createUser(conn: PoolConnection, signUpDto: SignUpDto) {
    const query = "INSERT INTO `users` SET ?";
    await conn.query(query, signUpDto);
  }

  createUserDto(): SignUpDto {
    return {
      email: "test@email.com",
      password: "1234",
    };
  }
}
