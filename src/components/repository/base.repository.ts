// we imported all types from mongodb driver, to use in code
import { IWrite } from "./interface/IWrite";
import { IRead } from "./interface/IRead";
import { ConnectMySQL } from "../database";
import { ResultSetHeader } from "mysql2";

// that class only can be extended
export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  protected abstract readonly mysql: ConnectMySQL;

  //we created constructor with arguments to manipulate mongodb operations
  constructor() {}

  abstract getName(): string;

  get connection() {
    return this.mysql.connection;
  }

  // we add to method, the async keyword to manipulate the insertOne result
  // of method.
  async create(item: T): Promise<boolean> {
    const [result] = await this.connection.query<ResultSetHeader>(
      `INSERT INTO ${this.getName()} SET ?`,
      item
    );
    return result.affectedRows > 0;
  }

  update(id: string, item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find(item: T): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  findOne(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
