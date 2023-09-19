import { IWrite } from "../interface/IWrite";
import { IRead } from "../interface/IRead";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { MySQL } from "./abstract.repository";
import { BaseEntity } from "../base.entity";
import { ClassConstructor, plainToInstance } from "class-transformer";

export abstract class BaseRepository<T extends BaseEntity>
  extends MySQL
  implements IWrite<T>, IRead<T>
{
  constructor(private readonly classType: ClassConstructor<T>) {
    super();
  }

  abstract getName(): string;

  async create(item: T): Promise<boolean> {
    const [result] = await this.queryResult(
      `INSERT INTO ${this.getName()} SET ?`,
      item
    );
    return result.affectedRows > 0;
  }

  async update(item: T): Promise<boolean> {
    const isSoftDeleted = await this.isSoftDeleted(item.id);
    if (isSoftDeleted)
      throw new BadRequestException(
        `id: ${item.id} deleted Item`,
        this.classType.name,
        "update"
      );

    const id = item.id;

    const [result] = await this.queryResult(
      `UPDATE ${this.getName()} SET ? WHERE id = ?`,
      [item, id]
    );

    return result.affectedRows > 0;
  }

  async isSoftDeleted(id: number): Promise<boolean> {
    const [result] = await this.queryCount(
      `SELECT COUNT(*) as count FROM ${this.getName()} WHERE id = ? AND deletedAt IS NOT NULL`,
      [id]
    );

    return result[0].count > 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const isSoftDeleted = await this.isSoftDeleted(id);
    if (isSoftDeleted)
      throw new BadRequestException(
        `id: ${id} already deleted Item`,
        this.classType.name,
        "softDelete"
      );

    const [result] = await this.queryResult(
      `UPDATE ${this.getName()} SET deletedAt = NOW() WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

  find(item: T): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async findOne(filters: Partial<T>): Promise<T | null> {
    const keys = Object.keys(filters);
    if (keys.length === 0) {
      throw new BadRequestException(
        "At least one filter parameter must be provided.",
        this.classType.name,
        "findOne"
      );
    }

    const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
    const values = keys.map((key) => (filters as any)[key]);
    const query = `SELECT * FROM ${this.getName()} WHERE ${whereClause} AND deletedAt IS NULL LIMIT 1`;

    const [result] = await this.queryRows(query, values);
    return result.length > 0
      ? plainToInstance(this.classType, result[0])
      : null;
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const [result] = await this.queryRows(
      `SELECT * FROM ${this.getName()} WHERE id = ? AND deletedAt IS NULL LIMIT 1`,
      [id]
    );

    if (result.length === 0) {
      throw new BadRequestException(
        `Item with id ${id} not found.`,
        this.classType.name,
        "findByIdOrThrow"
      );
    }

    return plainToInstance(this.classType, result[0]);
  }
}
