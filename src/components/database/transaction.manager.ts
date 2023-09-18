import { getNamespace } from "cls-hooked";
import { PoolConnection } from "mysql2/promise";
import { Service } from "typedi";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../common/middleware/namespace.const";
import { InternalServerErrorException } from "../../common/exception/internalServer.error.exception";
import { ExecutionContext } from "../../common/exception/execution.context";

@Service()
export class TransactionManager extends ExecutionContext<TransactionManager> {
  constructor() {
    super(TransactionManager);
  }

  getConnectionManager(): PoolConnection {
    const nameSpace = getNamespace(EXPRESS_NAMESPACE);
    if (!nameSpace || !nameSpace.active) {
      throw new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        this.getClass(),
        "getConnectionManager"
      );
    }
    return nameSpace.get(EXPRESS_ENTITY_MANAGER);
  }
}
