import {
  createPool,
  PoolOptions,
  Pool,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { Service } from "typedi";

export class MySQL {
  private conn: Pool;
  private credentials: PoolOptions;

  constructor(credentials: PoolOptions) {
    this.credentials = credentials;
    this.conn = createPool(this.credentials);
  }

  /** A random method to simulate a step before to get the class methods */
  private ensureConnection() {
    if (!this?.conn) this.conn = createPool(this.credentials);
  }

  /** For `SELECT` and `SHOW` */
  get queryRows() {
    this.ensureConnection();
    return this.conn.query.bind(this.conn)<RowDataPacket[]>;
  }

  /** For `SELECT` and `SHOW` with `rowAsArray` as `true` */
  get queryRowsAsArray() {
    this.ensureConnection();
    return this.conn.query.bind(this.conn)<RowDataPacket[][]>;
  }

  /** For `INSERT`, `UPDATE`, etc. */
  get queryResult() {
    this.ensureConnection();
    return this.conn.query.bind(this.conn)<ResultSetHeader>;
  }

  /** For multiple `INSERT`, `UPDATE`, etc. with `multipleStatements` as `true` */
  get queryResults() {
    this.ensureConnection();
    return this.conn.query.bind(this.conn)<ResultSetHeader[]>;
  }

  /** For `SELECT` and `SHOW` */
  get executeRows() {
    this.ensureConnection();
    return this.conn.execute.bind(this.conn)<RowDataPacket[]>;
  }

  /** For `SELECT` and `SHOW` with `rowAsArray` as `true` */
  get executeRowsAsArray() {
    this.ensureConnection();
    return this.conn.execute.bind(this.conn)<RowDataPacket[][]>;
  }

  /** For `INSERT`, `UPDATE`, etc. */
  get executeResult() {
    this.ensureConnection();
    return this.conn.execute.bind(this.conn)<ResultSetHeader>;
  }

  /** For multiple `INSERT`, `UPDATE`, etc. with `multipleStatements` as `true` */
  get executeResults() {
    this.ensureConnection();
    return this.conn.execute.bind(this.conn)<ResultSetHeader[]>;
  }

  /** Expose the Pool Connection */
  get connection() {
    return this.conn;
  }
}

@Service()
export class ConnectMySQL extends MySQL {
  constructor() {
    super({
      host: "localhost",
      user: "express",
      password: "1234",
      database: "express",
      port: 3306,
    });
  }
}

// (async () => {
//   const access: PoolOptions = {
//     host: "localhost",
//     user: "express",
//     password: "1234",
//     database: "express",
//     port: 3306,
//     debug: true,
//   };

//   const mysql = new MySQL(access);

//   /** Deleting the `users` table, if it exists */
//   await mysql.queryResult("DROP TABLE IF EXISTS `users`;");

//   /** Creating a minimal user table */
//   await mysql.queryResult(
//     "CREATE TABLE `users` (`id` INT(11) AUTO_INCREMENT, `name` VARCHAR(50), PRIMARY KEY (`id`));"
//   );

//   /** Inserting some users */
//   const [inserted] = await mysql.executeResult(
//     "INSERT INTO `users`(`name`) VALUES(?), (?), (?), (?);",
//     ["Josh", "John", "Marie", "Gween"]
//   );

//   console.log("Inserted:", inserted.affectedRows);

//   /** Getting users */
//   const [users] = await mysql.queryRows(
//     "SELECT * FROM `users` ORDER BY `name` ASC;"
//   );

//   users.forEach((user) => {
//     console.log("-----------");
//     console.log("id:  ", user.id);
//     console.log("name:", user.name);
//   });

//   await mysql.connection.end();
// })();
