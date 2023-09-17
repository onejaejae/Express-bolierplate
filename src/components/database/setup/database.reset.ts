import { ConfigService } from "../../config/config.service";
import { MySQLModule } from "../module/mysql.module";

const configService = new ConfigService();
const mysql = new MySQLModule(configService);

async function setupDatabase() {
  try {
    console.log("Deleting tables if they exist...");
    await mysql.connection.query("DROP TABLE IF EXISTS `posts`;");
    await mysql.connection.query("DROP TABLE IF EXISTS `users`;");

    console.log("Database setup completed.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    // Close the database connection
    mysql.connection.end();
  }
}

setupDatabase();
