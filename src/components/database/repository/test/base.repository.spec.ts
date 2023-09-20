import { PoolConnection } from "mysql2/promise";
import { TransactionManager } from "../../transaction.manager";
import { BaseRepository } from "../base.repository";
import { InternalServerErrorException } from "../../../../common/exception/internalServer.error.exception";
import {
  EXPRESS_CONNECTION_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../../../common/constant/namespace.const";
import { createNamespace } from "cls-hooked";
import { BadRequestException } from "../../../../common/exception/badRequest.exception";
import { BaseEntity } from "../../base.entity";
import { ConfigService } from "../../../config/config.service";
import { MySQLModule } from "../../module/mysql.module";
import { mock } from "node:test";

class Mock extends BaseEntity {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class MockRepository extends BaseRepository<Mock> {
  getName(): string {
    return Mock.name.toLowerCase().concat("s");
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Mock);
  }
}

const createMockTable = async (conn: PoolConnection) => {
  await conn.query(
    "CREATE TABLE `mocks` (`id` INT(11) AUTO_INCREMENT, `name` VARCHAR(50),  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` DATETIME(6) NULL DEFAULT NULL, PRIMARY KEY (`id`));"
  );
};

describe("BaseRepository", () => {
  jest.setTimeout(300_000);

  const mockName = "test";
  let conn: PoolConnection;
  let mockRepository: MockRepository;

  beforeAll(async () => {
    const configService = new ConfigService();
    const mysql = new MySQLModule(configService);
    conn = await mysql.connection.getConnection();
    await createMockTable(conn);

    const txManager = new TransactionManager();
    mockRepository = new MockRepository(txManager);
  });

  afterAll(async () => {
    await conn.query("DROP TABLE mocks;");
    await conn.destroy();
  });

  it("Should be defined", () => {
    expect(conn).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  it("NameSpace가 존재하지 않는 경우", async () => {
    //given
    const m = new Mock("test");

    //when
    //then
    await expect(mockRepository.create(m)).rejects.toThrowError(
      new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        TransactionManager.name,
        "getConnectionManager"
      )
    );
  });

  it("NameSpace가 있지만 active 상태가 아닌 경우", async () => {
    //given
    const m = new Mock(mockName);
    createNamespace(EXPRESS_NAMESPACE);

    //when
    //then
    await expect(mockRepository.create(m)).rejects.toThrowError(
      new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        TransactionManager.name,
        "getConnectionManager"
      )
    );
  });

  it("정상적으로 저장 with Create & FindOneAndThrow", async () => {
    //given
    const e = new Mock(mockName);
    const namespace = createNamespace(EXPRESS_NAMESPACE);

    //when
    await namespace.runPromise(async () => {
      //set EntityManager
      await Promise.resolve().then(async () => {
        return namespace.set(EXPRESS_CONNECTION_MANAGER, conn);
      });

      // save
      const result = await mockRepository.create(e);

      //then
      expect(result).toBeTruthy();

      // find
      const mock = await mockRepository.findByIdOrThrow(1);

      //then
      expect(mock.id).toBe(1);
      expect(mock.name).toBe(mockName);
    });
  });

  it("정상적으로 저장, findByIdOrThrow throw일 경우", async () => {
    //given
    const e = new Mock(mockName);
    const namespace = createNamespace(EXPRESS_NAMESPACE);
    const unExistMockId = 10;

    // when
    // then
    await expect(
      namespace.runPromise(async () => {
        namespace.set(EXPRESS_CONNECTION_MANAGER, conn);
        await mockRepository.findByIdOrThrow(unExistMockId);
      })
    ).rejects.toThrowError(
      new BadRequestException(
        `Item with id ${unExistMockId} not found.`,
        Mock.name,
        "findByIdOrThrow"
      )
    );
  });
});
