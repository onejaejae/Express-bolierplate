import { NextFunction, Request, Response } from "express";
import { createNamespace, getNamespace } from "cls-hooked";
import { EXPRESS_ENTITY_MANAGER, EXPRESS_NAMESPACE } from "./namespace.const";
import { Service } from "typedi";
import { MySQLModule } from "../../components/database/module/mysql.module";

@Service()
export class TransactionMiddleware {
  constructor(private readonly mysql: MySQLModule) {}

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
