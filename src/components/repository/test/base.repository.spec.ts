import { Pool, createPool } from "mysql2/promise";
import { BaseEntity } from "../../database";
import { TransactionManager } from "../../database/transaction.manager";
import { BaseRepository } from "../base.repository";
import { MySqlContainer, StartedMySqlContainer } from "testcontainers";
import { InternalServerErrorException } from "../../../common/exception/internalServer.error.exception";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../../common/middleware/namespace.const";
import { createNamespace } from "cls-hooked";
import { BadRequestException } from "../../../common/exception/badRequest.exception";

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
    super();
  }
}

const createMockTable = async (conn: Pool) => {
  await conn.query(
    "CREATE TABLE `mocks` (`id` INT(11) AUTO_INCREMENT, `name` VARCHAR(50), PRIMARY KEY (`id`));"
  );
};

describe("BaseRepository", () => {
  jest.setTimeout(300_000);

  const mockName = "test";
  let container: StartedMySqlContainer;
  let conn: Pool;
  let mockRepository: MockRepository;

  beforeAll(async () => {
    container = await new MySqlContainer().start();
    conn = await createPool({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getUserPassword(),
    });
    await createMockTable(conn);

    const txManager = new TransactionManager();
    mockRepository = new MockRepository(txManager);
  });

  afterAll(async () => {
    await conn.end();
    await container.stop();
  });

  it("Should be defined", () => {
    expect(container).toBeDefined();
    expect(conn).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  it("NameSpace가 존재하지 않는 경우", async () => {
    //given
    const m = new Mock("test");

    //when
    //then
    await expect(mockRepository.create(m)).rejects.toThrowError(
      new InternalServerErrorException(`${EXPRESS_NAMESPACE} is not active`)
    );
  });

  it("NameSpace가 있지만 active 상태가 아닌 경우", async () => {
    //given
    const m = new Mock(mockName);
    createNamespace(EXPRESS_NAMESPACE);

    //when
    //then
    await expect(mockRepository.create(m)).rejects.toThrowError(
      new InternalServerErrorException(`${EXPRESS_NAMESPACE} is not active`)
    );
  });

  it("NameSpace가 있지만 active 상태가 아닌 경우", async () => {
    //given
    const m = new Mock(mockName);
    createNamespace(EXPRESS_NAMESPACE);

    //when
    //then
    await expect(mockRepository.create(m)).rejects.toThrowError(
      new InternalServerErrorException(`${EXPRESS_NAMESPACE} is not active`)
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
        const transactionConn = await conn.getConnection();
        return namespace.set(EXPRESS_ENTITY_MANAGER, transactionConn);
      });

      // save
      const result = await mockRepository.create(e);

      //then
      expect(result).toBeTruthy();

      // find
      const mock = await mockRepository.findOneAndThrow(1);

      //then
      expect(mock.id).toBe(1);
      expect(mock.name).toBe(mockName);
    });
  });

  it("정상적으로 저장, FindOneAndThrow throw일 경우", async () => {
    //given
    const e = new Mock(mockName);
    const namespace = createNamespace(EXPRESS_NAMESPACE);
    const unExistMockId = 10;

    // when
    // then
    await expect(
      namespace.runPromise(async () => {
        const transactionConn = await conn.getConnection();
        namespace.set(EXPRESS_ENTITY_MANAGER, transactionConn);
        await mockRepository.findOneAndThrow(unExistMockId);
      })
    ).rejects.toThrowError(
      new BadRequestException(`Item with id ${unExistMockId} not found.`)
    );
  });
});
