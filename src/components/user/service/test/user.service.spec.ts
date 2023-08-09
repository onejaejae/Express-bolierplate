import { createNamespace, destroyNamespace, Namespace } from "cls-hooked";
import { createPool, Pool } from "mysql2/promise";
import { MySqlContainer, StartedMySqlContainer } from "testcontainers";
import { TransactionManager } from "../../../database/transaction.manager";
import { UserRepository } from "../../repository/user.repository";
import UserService from "../user.service";
import { IUserService } from "../../interface/user-service.interface";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../../../common/middleware/namespace.const";
import { CreateUserDTO } from "../../dto/create.user.dto";
import { BadRequestException } from "../../../../common/exception/badRequest.exception";

describe("user service test", () => {
  // for testContainers
  jest.setTimeout(300_000);

  let container: StartedMySqlContainer;
  let conn: Pool;
  let namespace: Namespace;
  let service: IUserService;

  const createUserTable = async (conn: Pool) => {
    await conn.query(
      "CREATE TABLE `users` (`id` INT(11) AUTO_INCREMENT, `name` VARCHAR(50), PRIMARY KEY (`id`));"
    );
  };

  const createUser = async (conn: Pool, createUserDto: CreateUserDTO) => {
    const query = `INSERT INTO users (name) VALUES('${createUserDto.name}');`;
    await conn.query(query);
  };

  beforeAll(async () => {
    container = await new MySqlContainer().start();
    conn = await createPool({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getUserPassword(),
    });
    await createUserTable(conn);

    const txManager = new TransactionManager();
    const userRepository = new UserRepository(txManager);
    service = new UserService(userRepository);
  });

  beforeEach(() => {
    namespace = createNamespace(EXPRESS_NAMESPACE);
  });

  afterEach(async () => {
    await conn.query("DELETE FROM users;");
    await conn.query("ALTER TABLE users AUTO_INCREMENT = 1;");
    destroyNamespace(EXPRESS_NAMESPACE);
  });

  afterAll(async () => {
    await conn.end();
    await container.stop();
  });

  it("Should be defined", () => {
    expect(container).toBeDefined();
    expect(conn).toBeDefined();
    expect(namespace).toBeDefined();
    expect(service).toBeDefined();
  });

  it("createUser - 성공", async () => {
    // given
    const createUserDto = new CreateUserDTO("test");

    // when
    const result = await namespace.runAndReturn(async () => {
      const transactionConn = await conn.getConnection();
      namespace.set(EXPRESS_ENTITY_MANAGER, transactionConn);
      return service.createUser(createUserDto);
    });

    // then
    expect(result).toBeTruthy();
  });

  it("getUser - user가 존재하지 않는 경우", async () => {
    // given
    const userId = 1;

    // when
    // then
    await expect(
      namespace.runPromise(async () => {
        const transactionConn = await conn.getConnection();
        namespace.set(EXPRESS_ENTITY_MANAGER, transactionConn);
        await service.getUser(userId);
      })
    ).rejects.toThrowError(
      new BadRequestException(`Item with id ${userId} not found.`)
    );
  });

  it("getUser - user가 존재하는 경우", async () => {
    const createUserDto = new CreateUserDTO("test");
    // given
    createUser(conn, createUserDto);

    // when
    const result = await namespace.runAndReturn(async () => {
      const transactionConn = await conn.getConnection();
      namespace.set(EXPRESS_ENTITY_MANAGER, transactionConn);
      return service.getUser(1);
    });

    // then
    expect(result.id).toBe(1);
    expect(result.name).toBe(createUserDto.name);
  });
});
