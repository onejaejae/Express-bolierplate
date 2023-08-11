import { ConnectMySQL } from ".";

const mysql = new ConnectMySQL();

async function setupDatabase() {
  try {
    console.log("Deleting tables if they exist...");
    await mysql.queryResult("DROP TABLE IF EXISTS `users`;");
    await mysql.queryResult("DROP TABLE IF EXISTS `posts`;");

    console.log("Database setup completed.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    // Close the database connection
    mysql.connection.end();
  }
}

setupDatabase();
