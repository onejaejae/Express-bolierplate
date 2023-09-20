import { createNamespace } from "cls-hooked";
import { InternalServerErrorException } from "../../exception/internalServer.error.exception";
import { Transactional } from "../transaction.decorator";
import { MySQLModule } from "../../../components/database/module/mysql.module";
import {
  EXPRESS_CONNECTION_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../constant/namespace.const";
import { ConfigService } from "../../../components/config/config.service";

class Mock {
  @Transactional()
  greeting() {}
}

describe("Transactional Decorator Test", () => {
  it("NameSpace가 없이 실행되는 경우", async () => {
    //given
    const mock = new Mock();

    //when
    //then
    await expect(mock.greeting()).rejects.toThrowError(
      new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        Mock.name,
        "greeting"
      )
    );
  });

  it("NameSpace는 있지만 active 되지 않은 경우", async () => {
    //given
    createNamespace(EXPRESS_NAMESPACE);
    const mock = new Mock();

    //when
    //then
    await expect(mock.greeting()).rejects.toThrowError(
      new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        Mock.name,
        "greeting"
      )
    );
  });

  it("connection이 없는 경우", async () => {
    //given
    const mock = new Mock();
    const namespace = createNamespace(EXPRESS_NAMESPACE);

    //when
    //then
    await expect(
      namespace.runAndReturn(async () => await mock.greeting())
    ).rejects.toThrowError(
      new InternalServerErrorException(
        `Could not find connection in ${EXPRESS_NAMESPACE} nameSpace`,
        Mock.name,
        "greeting"
      )
    );
  });

  it("connection이 있는 경우 (정상)", async () => {
    //given
    const mock = new Mock();
    const namespace = createNamespace(EXPRESS_NAMESPACE);
    const configService = new ConfigService();
    const mysql = new MySQLModule(configService);
    const conn = await mysql.connection.getConnection();

    // when
    // then
    namespace.runAndReturn(async () => {
      namespace.set(EXPRESS_CONNECTION_MANAGER, conn);
      await expect(mock.greeting()).resolves.not.toThrowError();
      await conn.destroy();
    });
  });
});
