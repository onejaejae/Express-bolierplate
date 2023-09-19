import { PoolConnection } from "mysql2/promise";
import { TransactionManager } from "../../database/transaction.manager";
import { Namespace, createNamespace, destroyNamespace } from "cls-hooked";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { MySQLModule } from "../../database/module/mysql.module";
import { IAuthService } from "../interface/auth-service.interface";
import { ConfigService } from "../../config/config.service";
import { UserFactory } from "../../../../test/utils/factory/user.factory";
import { UserRepository } from "../../user/repository/user.repository";
import AuthService from "../service/auth.service";
import { TokenService } from "../../jwt/token.service";
import { JwtService } from "../../jwt/jwt.service";
import { WinstonConfigService } from "../../config/winston-config.service";
import { Bcrypt } from "../../../common/util/encrypt";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../../common/constant/namespace.const";
import { User } from "../../user/entity/user.entity";
import { Role } from "../../../common/types/role/role.type";

describe("Auth Service Test", () => {
  let namespace: Namespace;
  let service: IAuthService;
  let conn: PoolConnection;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const configService = new ConfigService();
    const mysql = new MySQLModule(configService);
    conn = await mysql.connection.getConnection();

    userFactory = new UserFactory();
    const txManager = new TransactionManager();
    userRepository = new UserRepository(txManager);
    const loggerService = new WinstonConfigService(configService);
    const jwtService = new JwtService(
      configService,
      loggerService,
      userRepository
    );
    const tokenService = new TokenService(jwtService, loggerService);
    const bcrypt = new Bcrypt();

    service = new AuthService(tokenService, userRepository, bcrypt);
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

  describe("signUp", () => {
    it("signUp - 성공", async () => {
      // given
      const signUpDto = userFactory.createUserDto();

      // when
      const result = await namespace.runAndReturn(async () => {
        namespace.set(EXPRESS_ENTITY_MANAGER, conn);
        return service.signUp(signUpDto);
      });

      // then
      expect(result).toBeTruthy();
    });

    it("가입하려는 이메일이 존재하는 경우 - 실패", async () => {
      // given
      const signUpDto = userFactory.createUserDto();
      const mockUser = new User(
        signUpDto.email,
        signUpDto.password,
        Role.MEMBER.enumName.toLocaleLowerCase()
      );
      await userFactory.createUser(conn, mockUser);

      const duplicateSignUpDto = signUpDto;

      // when
      // then
      await expect(
        namespace.runPromise(async () => {
          namespace.set(EXPRESS_ENTITY_MANAGER, conn);
          await service.signUp(duplicateSignUpDto);
        })
      ).rejects.toThrowError(
        new BadRequestException(
          `user email: ${duplicateSignUpDto.email} already exist`
        )
      );
    });
  });
});
