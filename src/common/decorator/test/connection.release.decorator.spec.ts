import { createNamespace } from "cls-hooked";
import { PoolConnection } from "mysql2/promise";
import { InternalServerErrorException } from "../../exception/internalServer.error.exception";
import { Release } from "../connection.release.decorator";
import {
  EXPRESS_CONNECTION_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../constant/namespace.const";

class Mock {
  @Release()
  greeting() {}
}

describe("Release Connection Decorator Test", () => {
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

  it("should release connection after method execution", async () => {
    const releaseMock = jest.fn();
    const connMock: Partial<PoolConnection> = {
      release: releaseMock,
    };
    const namespace = createNamespace(EXPRESS_NAMESPACE);
    const mock = new Mock();

    await namespace.runPromise(async () => {
      //  given
      await Promise.resolve().then(() =>
        namespace.set(EXPRESS_CONNECTION_MANAGER, connMock)
      );

      // when
      await mock.greeting();

      //then
      expect(releaseMock).toHaveBeenCalled();
    });
  });
});
