import { createNamespace } from "cls-hooked";
import { TransactionManager } from "./transaction.manager";
import { InternalServerErrorException } from "../../common/exception/internalServer.error.exception";
import { MySQLModule } from "./module/mysql.module";
import {
  EXPRESS_CONNECTION_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../common/constant/namespace.const";
import { ConfigService } from "../config/config.service";

describe("TransactionManager Test", () => {
  it("NameSpace가 없는 경우", () => {
    // given
    const manager = new TransactionManager();

    // when
    // then
    expect(() => manager.getConnectionManager()).toThrowError(
      new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        TransactionManager.name
      )
    );
  });

  it("NameSpace가 있지만 Active가 아닌 경우", () => {
    // given
    const manager = new TransactionManager();
    createNamespace(EXPRESS_NAMESPACE);

    // when
    // then
    expect(() => manager.getConnectionManager()).toThrowError(
      new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        TransactionManager.name
      )
    );
  });

  it("정상 작동", async () => {
    // given
    const manager = new TransactionManager();
    const namespace = createNamespace(EXPRESS_NAMESPACE);

    const configService = new ConfigService();
    const mysql = new MySQLModule(configService);
    const conn = await mysql.connection.getConnection();

    // when
    // then
    await namespace.runPromise(async () => {
      namespace.set(EXPRESS_CONNECTION_MANAGER, conn);
      const getConnection = manager.getConnectionManager();
      expect(getConnection).toStrictEqual(conn);

      await conn.destroy();
    });
  });
});
