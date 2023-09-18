import { PoolConnection } from "mysql2/promise";
import { TransactionManager } from "../../database/transaction.manager";
import { Namespace, createNamespace, destroyNamespace } from "cls-hooked";
import { BadRequestException } from "../../../common/exception/badRequest.exception";
import { MySQLModule } from "../../database/module/mysql.module";
import { IAuthService } from "../interface/auth-service.interface";

describe("Auth Service Test", () => {
  let namespace: Namespace;
  let service: IAuthService;
  let conn: PoolConnection;

  //   beforeAll(async () => {
  //     const configService = new ConfigService();
  //     const mysql = new MySQLModule(configService);
  //     conn = await mysql.connection.getConnection();

  //     studentFactory = new StudentFactory();
  //     const txManager = new TransactionManager();
  //     const studentRepository = new StudentRepository(txManager);

  //     service = new AuthService(studentRepository);
  //   });

  //   beforeEach(() => {
  //     namespace = createNamespace(INFLEARN_NAMESPACE);
  //   });

  //   afterEach(async () => {
  //     await conn.query("DELETE FROM students;");
  //     await conn.query("ALTER TABLE students AUTO_INCREMENT = 1;");
  //     destroyNamespace(INFLEARN_NAMESPACE);
  //   });

  //   afterAll(async () => {
  //     await conn.destroy();
  //   });

  it("Should be defined", () => {
    expect(conn).toBeDefined();
    expect(namespace).toBeDefined();
    expect(service).toBeDefined();
  });

  //   describe("signUp", () => {
  //     it("signUp - 성공", async () => {
  //       // given
  //       const signUpDto = studentFactory.createStudentDto();

  //       // when
  //       const result = await namespace.runAndReturn(async () => {
  //         namespace.set(INFLEARN_CONNECTION_MANAGER, conn);
  //         return service.signUp(signUpDto);
  //       });

  //       // then
  //       expect(result).toBeTruthy();
  //     });

  //     it("가입하려는 이메일이 존재하는 경우 - 실패", async () => {
  //       // given
  //       const signUpDto = studentFactory.createStudentDto();
  //       const mockStudent = new Student(signUpDto.email, signUpDto.nickname);
  //       await studentFactory.createStudent(conn, mockStudent);

  //       const duplicateSignUpDto = signUpDto;

  //       // when
  //       // then
  //       await expect(
  //         namespace.runPromise(async () => {
  //           namespace.set(INFLEARN_CONNECTION_MANAGER, conn);
  //           await service.signUp(duplicateSignUpDto);
  //         })
  //       ).rejects.toThrowError(
  //         new BadRequestException(
  //           `email: ${duplicateSignUpDto.email} already exist`,
  //           Student.name,
  //           "signUp"
  //         )
  //       );
  //     });
  //   });
});
