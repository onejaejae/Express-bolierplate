import { NextFunction, Request, Response } from "express";
import { createNamespace, getNamespace } from "cls-hooked";
import { EXPRESS_ENTITY_MANAGER, EXPRESS_NAMESPACE } from "./namespace.const";
import { Service } from "typedi";
import { ConnectMySQL } from "../../components/database";
import { AsyncLocalStorage } from "async_hooks";
import { Pool } from "mysql2";

@Service()
export class TransactionMiddleware {
  private readonly poolLocalStorage = new AsyncLocalStorage<{
    pool: Pool;
  }>();

  constructor(private readonly mysql: ConnectMySQL) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(EXPRESS_NAMESPACE) ?? createNamespace(EXPRESS_NAMESPACE);

    return namespace.runAndReturn(async () => {
      Promise.resolve()
        .then(async () => {
          await this.setEntityManager();
        })
        .then(next);
    });
  }

  private async setEntityManager() {
    const namespace = getNamespace(EXPRESS_NAMESPACE)!;
    const conn = await this.mysql.connection.getConnection();

    namespace.set(EXPRESS_ENTITY_MANAGER, conn);
  }
}
