import { Pool, PoolOptions, createPool } from "mysql2/promise";

export class MySQL {
  private conn: Pool;
  private credentials: PoolOptions;

  protected initailize(credentials: PoolOptions) {
    this.credentials = credentials;
    this.conn = createPool(this.credentials);
  }

  get connection() {
    return this.conn;
  }
}
