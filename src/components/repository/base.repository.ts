// we imported all types from mongodb driver, to use in code
import { IWrite } from "./interface/IWrite";
import { IRead } from "./interface/IRead";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TransactionManager } from "../database/transaction.manager";
import { BadRequestException } from "../../common/exception/badRequest.exception";
import { BaseEntity } from "../database";

// that class only can be extended
export abstract class BaseRepository<T extends BaseEntity>
  implements IWrite<T>, IRead<T>
{
  protected abstract readonly txManager: TransactionManager;

  //we created constructor with arguments to manipulate mongodb operations
  constructor() {}

  abstract getName(): string;

  get connection() {
    return this.txManager.getConnectionManager();
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

  async update(item: T): Promise<boolean> {
    const id = item.id;

    const [result] = await this.connection.query<ResultSetHeader>(
      `UPDATE ${this.getName()} SET ? WHERE id = ?`,
      [item, id]
    );

    return result.affectedRows > 0;
  }
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find(item: T): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async findOne(filters: Partial<T>): Promise<T | null> {
    const keys = Object.keys(filters);
    if (keys.length === 0) {
      throw new BadRequestException(
        "At least one filter parameter must be provided."
      );
    }

    const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
    const values = keys.map((key) => (filters as any)[key]);
    const query = `SELECT * FROM ${this.getName()} WHERE ${whereClause} LIMIT 1`;

    const [result] = await this.connection.query<RowDataPacket[]>(
      query,
      values
    );
    return result.length > 0 ? (result[0] as T) : null;
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const [result] = await this.connection.query<RowDataPacket[]>(
      `SELECT * FROM ${this.getName()} WHERE id = ? LIMIT 1`,
      [id]
    );

    if (result.length === 0) {
      throw new BadRequestException(`Item with id ${id} not found.`);
    }

    return result[0] as T;
  }
}
