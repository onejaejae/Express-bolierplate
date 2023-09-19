import { createNamespace, destroyNamespace, Namespace } from "cls-hooked";
import { PoolConnection } from "mysql2/promise";
import { TransactionManager } from "../../../database/transaction.manager";
import { UserRepository } from "../../repository/user.repository";
import UserService from "../user.service";
import { IUserService } from "../../interface/user-service.interface";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../../../common/constant/namespace.const";
import { BadRequestException } from "../../../../common/exception/badRequest.exception";
import { UserFactory } from "../../../../../test/utils/factory/user.factory";
import { User } from "../../entity/user.entity";
import { Role } from "../../../../common/types/role/role.type";
import { ConfigService } from "../../../config/config.service";
import { MySQLModule } from "../../../database/module/mysql.module";

describe("user service test", () => {
  let conn: PoolConnection;
  let namespace: Namespace;
  let service: IUserService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const configService = new ConfigService();
    const mysql = new MySQLModule(configService);
    conn = await mysql.connection.getConnection();

    const txManager = new TransactionManager();
    const userRepository = new UserRepository(txManager);
    service = new UserService(userRepository);
    userFactory = new UserFactory();
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
    await conn.destroy();
  });

  it("Should be defined", () => {
    expect(conn).toBeDefined();
    expect(namespace).toBeDefined();
    expect(service).toBeDefined();
  });

  it("getUser - user가 존재하지 않는 경우", async () => {
    // given
    const userId = 1;

    // when
    // then
    await expect(
      namespace.runPromise(async () => {
        namespace.set(EXPRESS_ENTITY_MANAGER, conn);
        await service.getUser(userId);
      })
    ).rejects.toThrowError(
      new BadRequestException(
        `Item with id ${userId} not found.`,
        User.name,
        "findByIdOrThrow"
      )
    );
  });

  it("getUser - user가 존재하는 경우", async () => {
    const createUserDto = userFactory.createUserDto();
    const newUser = new User(
      createUserDto.email,
      createUserDto.password,
      Role.MEMBER.enumName.toUpperCase()
    );
    // given
    userFactory.createUser(conn, newUser);

    // when
    const result = await namespace.runAndReturn(async () => {
      namespace.set(EXPRESS_ENTITY_MANAGER, conn);
      return service.getUser(1);
    });

    // then
    expect(result.id).toBe(1);
    expect(result.email).toBe(createUserDto.email);
    expect(result.refreshToken).toBeDefined();
    expect(result.password).not.toBe(createUserDto.password);
  });
});
