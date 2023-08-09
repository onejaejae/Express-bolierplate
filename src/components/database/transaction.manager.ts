import { getNamespace } from "cls-hooked";
import { PoolConnection } from "mysql2/promise";
import { Service } from "typedi";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../common/middleware/namespace.const";
import { InternalServerErrorException } from "../../common/exception/internalServer.error.exception";

@Service()
export class TransactionManager {
  getConnectionManager(): PoolConnection {
    const nameSpace = getNamespace(EXPRESS_NAMESPACE);
    if (!nameSpace || !nameSpace.active) {
      throw new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`
      );
    }
    return nameSpace.get(EXPRESS_ENTITY_MANAGER);
  }
}
