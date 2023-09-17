import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TransactionManager } from "../transaction.manager";
import { CountResult } from "../../../types/common";

export abstract class MySQL {
  protected abstract readonly txManager: TransactionManager;

  get connection() {
    return this.txManager.getConnectionManager();
  }
  /** For `SELECT` and `SHOW` */
  get queryRows() {
    return this.connection.query.bind(this.connection)<RowDataPacket[]>;
  }

  /** For `SELECT` and `SHOW` with `rowAsArray` as `true` */
  get queryRowsAsArray() {
    return this.connection.query.bind(this.connection)<RowDataPacket[][]>;
  }

  /** For `INSERT`, `UPDATE`, etc. */
  get queryResult() {
    return this.connection.query.bind(this.connection)<ResultSetHeader>;
  }

  /** For multiple `INSERT`, `UPDATE`, etc. with `multipleStatements` as `true` */
  get queryResults() {
    return this.connection.query.bind(this.connection)<ResultSetHeader[]>;
  }

  get queryCount() {
    return this.connection.query.bind(this.connection)<CountResult[]>;
  }
}
