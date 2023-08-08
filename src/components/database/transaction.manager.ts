import { getNamespace } from "cls-hooked";
import { PoolConnection } from "mysql2/promise";
import { Service } from "typedi";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../common/middleware/namespace.const";

@Service()
export class TransactionManager {
  getConnectionManager(): PoolConnection {
    const nameSpace = getNamespace(EXPRESS_NAMESPACE);
    if (!nameSpace || !nameSpace.active) {
      throw new Error(`${EXPRESS_NAMESPACE} is not active`);
    }
    return nameSpace.get(EXPRESS_ENTITY_MANAGER);
  }
}
