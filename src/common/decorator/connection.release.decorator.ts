import { getNamespace } from "cls-hooked";
import {
  EXPRESS_CONNECTION_MANAGER,
  EXPRESS_NAMESPACE,
} from "../constant/namespace.const";
import { InternalServerErrorException } from "../exception/internalServer.error.exception";
import { PoolConnection } from "mysql2/promise";

export function Release() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Release Connection
    async function releaseConnWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(EXPRESS_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${EXPRESS_NAMESPACE} is not active`,
          "Release"
        );

      const conn = nameSpace.get(EXPRESS_CONNECTION_MANAGER) as PoolConnection;
      if (!conn)
        throw new InternalServerErrorException(
          `Could not find connection in ${EXPRESS_NAMESPACE} nameSpace`,
          "Release"
        );

      try {
        const result = await originMethod.apply(this, args);
        return result;
      } finally {
        conn.release();
      }
    }

    descriptor.value = releaseConnWrapped;
  };
}
