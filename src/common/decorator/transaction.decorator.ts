import { getNamespace } from "cls-hooked";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../middleware/namespace.const";
import { PoolConnection } from "mysql2/promise";

export function Transactional() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Transaction
    async function transactionWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(EXPRESS_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new Error(`${EXPRESS_NAMESPACE} is not active`);

      const conn = nameSpace.get(EXPRESS_ENTITY_MANAGER) as PoolConnection;
      if (!conn)
        throw new Error(
          `Could not find pool in ${EXPRESS_NAMESPACE} nameSpace`
        );

      return await nameSpace.runAndReturn(async () => {
        try {
          await conn.beginTransaction();
          const result = await originMethod.apply(this, args);
          await conn.commit();
          return result;
        } catch (error) {
          await conn.rollback();
          throw error;
        } finally {
          conn.release();
        }
      });
    }

    descriptor.value = transactionWrapped;
  };
}