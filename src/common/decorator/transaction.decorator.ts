import { getNamespace } from "cls-hooked";
import {
  EXPRESS_CONNECTION_MANAGER,
  EXPRESS_NAMESPACE,
} from "../constant/namespace.const";
import { PoolConnection } from "mysql2/promise";
import { InternalServerErrorException } from "../exception/internalServer.error.exception";

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
        throw new InternalServerErrorException(
          `${EXPRESS_NAMESPACE} is not active`,
          "Transactional"
        );

      const conn = nameSpace.get(EXPRESS_CONNECTION_MANAGER) as PoolConnection;
      if (!conn)
        throw new InternalServerErrorException(
          `Could not find pool in ${EXPRESS_NAMESPACE} nameSpace`,
          "Transactional"
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
