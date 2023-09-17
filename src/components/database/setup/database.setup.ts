import { ConfigService } from "../../config/config.service";
import { MySQLModule } from "../module/mysql.module";

const configService = new ConfigService();
const mysql = new MySQLModule(configService);

async function setupDatabase() {
  try {
    console.log("Creating tables...");
    await mysql.connection.query(
      "CREATE TABLE `users` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `email` VARCHAR(45) NOT NULL, `password` VARCHAR(100) NOT NULL, `refreshToken` VARCHAR(200) NULL, `role` ENUM('admin', 'member') NOT NULL, `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` DATETIME(6) NULL DEFAULT NULL,PRIMARY KEY (`id`), UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);"
    );
    await mysql.connection.query(
      "CREATE TABLE `posts` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `title` VARCHAR(45) NOT NULL, `content` MEDIUMTEXT NOT NULL, `authorId` INT UNSIGNED NULL, `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` DATETIME(6) NULL DEFAULT NULL, PRIMARY KEY (`id`), INDEX `post_user_fk_idx` (`authorId` ASC) VISIBLE, CONSTRAINT `post_user_fk` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);"
    );

    console.log("Database setup completed.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    // Close the database connection
    mysql.connection.end();
  }
}

setupDatabase();
