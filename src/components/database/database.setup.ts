import { ConnectMySQL } from ".";

const mysql = new ConnectMySQL();

async function setupDatabase() {
  try {
    console.log("Creating tables...");
    await mysql.queryResult(
      "CREATE TABLE `users` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `email` VARCHAR(45) NOT NULL, `password` VARCHAR(100) NOT NULL, `refreshToken` VARCHAR(200) NULL, PRIMARY KEY (`id`), UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);"
    );
    await mysql.queryResult(
      "CREATE TABLE `posts` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `title` VARCHAR(45) NOT NULL, `content` MEDIUMTEXT NOT NULL, `authorId` INT UNSIGNED NULL, PRIMARY KEY (`id`), INDEX `post_user_fk_idx` (`authorId` ASC) VISIBLE, CONSTRAINT `post_user_fk` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE);"
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
