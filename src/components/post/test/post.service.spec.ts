import { createNamespace, destroyNamespace, Namespace } from "cls-hooked";
import { PoolConnection } from "mysql2/promise";
import { IPostService } from "../interface/post-service.interface";
import { PostFactory } from "../../../../test/utils/factory/post.factory";
import PostService from "../post.service";
import { PostRepository } from "../repository/post.repository";
import { TransactionManager } from "../../database/transaction.manager";
import { ConfigService } from "../../config/config.service";
import { MySQLModule } from "../../database/module/mysql.module";
import {
  EXPRESS_ENTITY_MANAGER,
  EXPRESS_NAMESPACE,
} from "../../../common/constant/namespace.const";
import { UserFactory } from "../../../../test/utils/factory/user.factory";

describe("post service test", () => {
  let conn: PoolConnection;
  let namespace: Namespace;
  let service: IPostService;
  let userFactory: UserFactory;
  let postFactory: PostFactory;

  beforeAll(async () => {
    const configService = new ConfigService();
    const mysql = new MySQLModule(configService);
    conn = await mysql.connection.getConnection();

    const txManager = new TransactionManager();
    const postRepository = new PostRepository(txManager);
    service = new PostService(postRepository);
    userFactory = new UserFactory();
    postFactory = new PostFactory();
  });

  beforeEach(() => {
    namespace = createNamespace(EXPRESS_NAMESPACE);
  });

  afterEach(async () => {
    await conn.query("DELETE FROM posts;");
    await conn.query("ALTER TABLE posts AUTO_INCREMENT = 1;");
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

  describe("getPost", () => {
    it("post 단일 조회  - 성공", async () => {
      // given
      const createUserDto = userFactory.createUserDto();
      await userFactory.createUser(conn, createUserDto);

      const createPostDto = postFactory.createPostDto();
      await postFactory.creatPost(conn, createPostDto);

      // when
      const result = await namespace.runAndReturn(async () => {
        namespace.set(EXPRESS_ENTITY_MANAGER, conn);
        return service.getPost(1);
      });

      // then
      expect(result.authorId).toBe(createPostDto.authorId);
      expect(result.title).toBe(createPostDto.title);
      expect(result.content).toBe(createPostDto.content);
    });
  });

  describe("createPost", () => {
    it("post 단일 생성  - 성공", async () => {
      // given
      const createUserDto = userFactory.createUserDto();
      await userFactory.createUser(conn, createUserDto);

      const createPostDto = postFactory.createPostDto();

      // when
      const result = await namespace.runAndReturn(async () => {
        namespace.set(EXPRESS_ENTITY_MANAGER, conn);
        return service.createPost(createPostDto);
      });

      // then
      expect(result).toBeTruthy();
    });
  });

  describe("deletePost", () => {
    it("post 단일 삭제  - 성공", async () => {
      // given
      const createUserDto = userFactory.createUserDto();
      await userFactory.createUser(conn, createUserDto);

      const createPostDto = postFactory.createPostDto();
      await postFactory.creatPost(conn, createPostDto);

      // when
      const result = await namespace.runAndReturn(async () => {
        namespace.set(EXPRESS_ENTITY_MANAGER, conn);
        return service.deletePost(1);
      });

      // then
      expect(result).toBeTruthy();
    });
  });
});
