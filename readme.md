## 설계 방향

![nest-request-lifecycle](https://github.com/onejaejae/learn_datastructure/assets/62149784/141fb046-adae-4eb3-bfc5-a0af980edfda)

<br>

Nest.js의 Request Lifecycle을 지향하며, 아키텍처를 설계하였습니다.

더 구조적이고 모듈화된 설계를 통해 코드의 유지보수성, 가독성, 확장성, 테스트 용이성을 강화하며 높은 품질의 애플리케이션을 개발하고자 하였습니다.

#### 설계 목표

1. 모듈화, 구조화의 강화

   Express에서 모두 미들웨어로 작동하지만, guard, interceptor, pipe, controller, service, exception filter 등과 같은 세분화된 미들웨어 개념을 도입하여, 기존의 Express Middleware 접근 방식보다 더 모듈화되고 구조화된 애플리케이션 설계를 목표로 하였습니다. 이를 통해 코드 관리의 편의성을 높이고, 각 구성 요소의 역할과 책임을 분명하게 정의하여 유지보수성을 향상시키고자 하였습니다.

2. 재사용성과 확장성의 증대

   각 Lifecycle 단계에서 사용되는 middleware, guard, interceptor, pipe, controller, service, exception filter 등을 재사용 가능한 컴포넌트로 개발하여, 새로운 기능 추가나 수정 시에도 기존 컴포넌트를 재사용하고 확장시키고자 하였습니다.

3. AOP 적용

   interceptor, pipe 등을 활용하여 AOP를 적용하고자 하였습니다. 예를 들어 로깅, 데이터 변환, 예외 처리, 트랜잭션과 같은 측면을 중앙에서 관리하고 필요한 부분에 적용하여, 코드의 재사용성과 가독성을 향상시키고자 하였습니다.

4. 테스트 용이성 강화

   테스트를 간편하게 수행할 수 있는 환경을 제공하기 위해 각 라이프사이클 요소를 모듈화하고 분리하여 테스트를 진행할 수 있도록 구현하였습니다.

#### TypeDI 도입

- 컴포넌트가 직접 의존성을 생성하거나 관리하지 않고 외부에서 주입받는 방식을 통해, 각 컴포넌트 간의 결합도를 낮춰 유지보수성을 향상시키고자 하였습니다.

- TypeDI를 통해 컴포넌트가 직접적으로 의존성을 생성하거나 관리하지 않고, 외부 컨테이너에서 의존성을 제공받음으로써 컴포넌트 간의 결합도를 낮추어 변경에 유연하게 대처할 수 있는 구조를 만들고자 하였습니다.

## Workflow 및 구현 패턴

### 1. Transactional decorator

#### 구현 방식

`cls-hooked`는 요청이 들어올 때 마다 Namespace라는 곳에 context를 생성하여 해당 요청만 접근할 수 있는 공간을 만들어줍니다. 이후 요청이 끝나면 해당 context를 닫아줍니다. 이를 이용해 요청이 들어오면 해당 요청에서만 사용할 connection을 생성하여 Namespace에 넣는 방식으로 transaction decorator를 구현하였습니다.

1. Namespace 생성 후 connection 심어주는 `TransactionMiddleware`

2. Namespace에 있는 connection에 접근할 수 있는 헬퍼 `TransactionManager`

3. origin method를 transaction wrapping 하는 `Transaction Decorator`

<Br>

#### flow

<img width="1111" alt="transaction derocator flow with cls" src="https://github.com/onejaejae/learn_datastructure/assets/62149784/85d7d9a3-d766-497f-80ac-afb673833d04">

<br>

1. 요청이 들어오면, Gloabal middleware로 설정한 TransactionMiddleware에서 cls-hooked를 사용해 해당 요청에 대한 namespace에 connection pool에서 connection을 꺼내와 등록

2. Service에서 Transactional decorator를 사용하는 method에 접근해 Origin method를 Transaction Method로 wrapping

3. TransactionManager를 통해 Repository에서 connection을 꺼내와 transaction 및 original Function 실행

#### Transaction Middleware example

1. 요청이 들어오면, 해당 요청에 대한 nameSpace가 존재하는 지 확인 후, 존재하지 않는다면, nameSpace를 생성합니다.

2. 해당 요청에 대한 nameSpace에 connection pool에서 connection을 꺼내와 등록합니다.

```js
@Service()
export class TransactionMiddleware {
  constructor(private readonly mysql: MySQLModule) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(EXPRESS_NAMESPACE) ?? createNamespace(EXPRESS_NAMESPACE);

    return namespace.runAndReturn(async () => {
      Promise.resolve()
        .then(async () => {
          await this.setEntityManager();
        })
        .then(next);
    });
  }

  private async setEntityManager() {
    const namespace = getNamespace(EXPRESS_NAMESPACE)!;
    const conn = await this.mysql.connection.getConnection();

    namespace.set(EXPRESS_ENTITY_MANAGER, conn);
  }
}
```

#### Transactional Decorator example

1. Transactional decorator를 사용하는 method에 접근합니다.

2. transactionWrapped function에서 해당 요청에 대한 nameSpace에 접근한 뒤, middleware에서 등록한 connection을 가져옵니다.

3. 가져온 connection을 통해 transaction 시작 및 종료 로직을 적용한 메서드를 실행합니다.

4. origin method를 Transaction Method로 변경해줍니다.

```js
export function Transactional() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Transaction
    async function transactionWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(EXPRESS_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${EXPRESS_NAMESPACE} is not active`,
          "Transactional"
        );

      const conn = nameSpace.get(EXPRESS_ENTITY_MANAGER) as PoolConnection;
      if (!conn)
        throw new InternalServerErrorException(
          `Could not find pool in ${EXPRESS_NAMESPACE} nameSpace`,
          "Transactional"
        );

      return await nameSpace.runAndReturn(async () => {
        try {
          await conn.beginTransaction();
          const result = await originMethod.apply(this, args);
          await conn.commit();
          return result;
        } catch (error) {
          await conn.rollback();
          throw error;
        } finally {
          conn.release();
        }
      });
    }

    descriptor.value = transactionWrapped;
  };
}
```

#### TransactionManager example

baseRepository에서는 TransactionManager를 통해 connection에 접근할 수 있도록 합니다.

```js
@Service()
@Service()
export class TransactionManager extends ExecutionContext<TransactionManager> {
  constructor() {
    super(TransactionManager);
  }

  getConnectionManager(): PoolConnection {
    const nameSpace = getNamespace(EXPRESS_NAMESPACE);
    if (!nameSpace || !nameSpace.active) {
      throw new InternalServerErrorException(
        `${EXPRESS_NAMESPACE} is not active`,
        this.getClass(),
        "getConnectionManager"
      );
    }
    return nameSpace.get(EXPRESS_ENTITY_MANAGER);
  }
}
```

ref: https://www.youtube.com/watch?v=AHSHjCVUsu8

### 2. Base Repository

#### 구현 방식

Base Repository를 구현해 공통적으로 사용되는 데이터베이스 작업을 캡슐화하여 코드의 중복을 줄이고 재사용성을 높이고자 하였습니다.

또한 Base Repository 내에서 Transaction Manager를 통해 connection에 접근 할 수 있도록 구현하여, 데이터베이스 작업이 모두 같은 트랜잭션 내에서 실행되도록 보장해 데이터 일관성과 안전성을 유지하고자 하였습니다.

마지막으로 class-transformer에서 제공하는 plainToInstance를 사용해 데이터베이스 결과를 classType으로 Mapping된 값으로 변환하였습니다.

#### BaseRepository example

- BaseRepository generic 타입을 BaseEntity 타입으로 제한하여 class의 instance만 받으면 update 기능을 수행할 수 있도록 update method를 구현하였습니다.

- BaseRepository를 상속받는 childRepository에서 classType을 넘겨받음으로써, object를 해당 classType으로 Mapping된 값으로 변환하였습니다.

- abstract getName method를 통해, 각 repository에 해당하는 table에 접근할 수 있도록 하였습니다.

- MySQL을 상속받고 있습니다. MySQL은 데이터베이스 작업을 위한 기본적인 기능을 추상화하고, SELECT, INSERT, UPDATE 등의 쿼리를 실행하고, 트랜잭션 관리 등의 작업을 간편하게 처리할 수 있습니다.

```js
export abstract class BaseRepository<T extends BaseEntity>
  extends MySQL
  implements IWrite<T>, IRead<T>
{
  constructor(private readonly classType: ClassConstructor<T>) {
    super();
  }

  abstract getName(): string;

  async create(item: T): Promise<boolean> {
    const [result] = await this.queryResult(
      `INSERT INTO ${this.getName()} SET ?`,
      item
    );
    return result.affectedRows > 0;
  }
}
```

```js
export abstract class MySQL {
  protected abstract readonly txManager: TransactionManager;

  get connection() {
    return this.txManager.getConnectionManager();
  }
  /** For `SELECT` and `SHOW` */
  get queryRows() {
    return this.connection.query.bind(this.connection)<RowDataPacket[]>;
  }

  /** For `SELECT` and `SHOW` with `rowAsArray` as `true` */
  get queryRowsAsArray() {
    return this.connection.query.bind(this.connection)<RowDataPacket[][]>;
  }

  /** For `INSERT`, `UPDATE`, etc. */
  get queryResult() {
    return this.connection.query.bind(this.connection)<ResultSetHeader>;
  }

  /** For multiple `INSERT`, `UPDATE`, etc. with `multipleStatements` as `true` */
  get queryResults() {
    return this.connection.query.bind(this.connection)<ResultSetHeader[]>;
  }

  get queryCount() {
    return this.connection.query.bind(this.connection)<CountResult[]>;
  }
}
```

### 3. Configuration

#### 구현 방식

환경 변수와 관련된 로직들을 Config domain에서 구현하였습니다. 환경 변수가 필요한 곳에서 ConfigService를 주입받아 사용할 수 있습니다.
<br>

또한 환경 변수 타입을 적용하여 환경 변수를 추가, 수정 삭제 시 보다 안전하게 관리할 수 있습니다.

#### ConfigService Example

```js
@Service()
export class ConfigService {
  getAppConfig(): AppConfig {
    return configurations().APP;
  }

  getDBConfig(): DBConfig {
    return configurations().DB;
  }

  getJwtConfig(): JwtConfig {
    return configurations().JWT;
  }
}
```

```js
export const configurations = (): Configurations => {
  const envFound = dotenv.config({
    path: `dotenv/.env.${process.env.NODE_ENV}`,
  });
  if (envFound.error) {
    throw new InternalServerErrorException(
      "⚠️  Couldn't find .env file  ⚠️",
      "Configurations"
    );
  }

  const currentEnv = process.env.NODE_ENV || "local";

  return {
    APP: {
      PORT: process.env.PORT || 6000,
      ENV: currentEnv,
      NAME: process.env.NAME || "Express",
      BASE_URL: process.env.BASE_URL || "http://localhost",
    },
    DB: {
      DB_USER_NAME: process.env.DB_USER_NAME || "",
      DB_PASSWORD: process.env.DB_PASSWORD || "",
      DB_DATABASE: process.env.DB_DATABASE || "",
      DB_PORT: process.env.DB_PORT || 3306,
    },
    JWT: {
      JWT_SECRET: process.env.JWT_SECRET || "",
    },
  };
};
```

### 4. Logger Middleware with winston

#### 구현 방식

Logger Middleware를 global middleware로 설정하여, 모든 요청에 대한 request log를 출력하고자 하였습니다.

또한 WinstonConfigService를 통해 winston-logger setUp 기능을 구현하여 Logger Middleware는 WinstonConfigService를 주입받아 winson에서 제공하는 Log를 사용할 수 있도록 구현하였습니다.

#### LoggerMiddleware Example

WinstonConfigService를 주입받아 winston-logger를 사용하고 있습니다.
조건문으로 dev 환경일때만 API가 호출될 때마다 로그가 출력되도록 하였습니다.

```js
@Service()
export class LoggerMiddleware {
  private readonly env: string;

  constructor(
    private readonly loggerService: WinstonConfigService,
    private readonly configService: ConfigService
  ) {
    const appConfig = this.configService.getAppConfig();
    this.env = appConfig.ENV;
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, path } = request;
    const userAgent = request.get("user-agent") || "";

    //request log
    if (this.env !== "production")
      this.loggerService.logger.info(
        `REQUEST [${method} ${originalUrl}] ${ip} ${userAgent} has been excuted`
      );

    next();
  }
}
```

### 5. Exception Handling

####

- `BadRequestException`, `InternalServerErrorException`을 구현하여 상황에 알맞는 Exception을 던질 수 있도록 구현하였습니다.

- `NotFoundException`, `BadRequestException`, `ForbiddenException`, `InternalServerErrorException`, `MethodNotAllowedException`, `UnauthorizedException`를 구현하여 Exception이 발생했을 때 해당 Exception을 적절하게 처리하고, 클라이언트에게 응답을 반환할 수 있도록 하였습니다.

#### BadRequestException Example

BadRequestException class는 생성자 인자로 message, callClass, callMethod를 받습니다.

해당 인자를 통해 디버깅 시, 어떤 class의 어떤 method에서 어떤 error가 발생했는 지 추적할 수 있도록 구현하였습니다.

```js
export class BadRequestException extends ResponseError {
  constructor(
    readonly message: string,
    readonly callClass: string,
    readonly callMethod?: string
  ) {
    super(message);
    this.status = 400;
    this.callClass = callClass;
    if (this.callMethod) this.callMethod = callMethod;
  }
}
```

#### HttpExceptionFilter Example

예외 객체(err)와 Express의 response 객체를 받아, 예외 처리를 수행합니다.

```js

@Service()
export class HttpExceptionFilter {
  private env;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: WinstonConfigService
  ) {
    this.env = this.configService.getAppConfig().ENV;
  }

  use(
    err: ResponseError,
    _request: Request,
    response: Response,
    _next: NextFunction
  ): Response<any, Record<string, any>> | void {
    response.status(err.status || statusCode.INTERNAL_SERVER_ERROR);
    if (this.env === "dev" || this.env === "local") {
      this.loggerService.logger.error(
        `${response.req.method} ${response.req.url} ${err.status} ${err.stack} Response: "success: false, msg: ${err.message}"`
      );
    }

    const returnObj: Record<string, any> = {
      message: err.message,
    };
    if (err.callClass) returnObj["callClass"] = err.callClass;
    if (err.callMethod) returnObj["callMethod"] = err.callMethod;
    if (err.stack) returnObj["stack"] = err.stack;

    response.send(util.fail(err.status || 500, returnObj));
  }
}
```

### 6. Authentication with JWT Access Token, Refresh token

#### 구현 방식

TokenService, JwtService를 통해 JWT 인증과 관련된 로직을 구현하였습니다. TokenService, JwtService에서 JWT 인증과 역할과 책임을 담당함으로써 코드의 가독성 및 유지보수성을 향상시키고자 하였습니다.

AuthGuard를 도입하여 JWT 토큰을 검증하여 사용자 인증을 처리하는 역할을 수행하도록 하였습니다.
인증과 관련된 코드를 하나의 재사용 가능한 모듈로 분리하고자 하였습니다. 이로써 여러 부분에서 동일한 인증 로직을 사용할 수 있으며, 중복 코드를 피하고 일관성 있는 인증 로직을 구현하고자 하였습니다.

AuthGuard를 통해 컨트롤러나 라우트 핸들러에서 각자의 역할에 집중하고, 인증과 권한 확인과 같은 보안 관련 로직을 가드로 분리함으로써, 응집도 높은 구조를 만들고자 하였습니다.

#### AuthGuard example

```JS
@Service()
export class AuthGuard extends ExecutionContext<AuthGuard> {
  constructor(private readonly tokenService: TokenService) {
    super(AuthGuard);
  }

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    try {
      // check token
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || authorizationHeader === "")
        throw new UnauthorizedException(
          "인증정보가 없습니다.",
          this.getClass()
        );

      const headerArray = authorizationHeader.split(" ");
      if (headerArray.length != 2)
        throw new UnauthorizedException(
          "인증정보가 형식이 옳바르지 않습니다",
          this.getClass()
        );

      const [_, token] = headerArray;
      const isVerify = this.tokenService.verifiedToken(token);

      if (!isVerify.success)
        throw new UnauthorizedException("AccessToken Invalid", this.getClass());

      req.userId = parseInt(isVerify.id, 10);
      next();
    } catch (error) {
      next(error);
    }
  }
}
```

### 7. Custom Decorator

#### 7.1 TryCatch Custom Decorator

- 여러 컨트롤러 메서드에서 반복되는 try-catch 블록을 TryCatch Decorator를 구현함으로써 코드의 중복을 줄이고자 하였습니다.

- statusCode를 인자로 받아, 각 controller method에 알맞는 HTTP 상태 코드로 응답 하도록 구현하였습니다.

- TryCatch Decorator에서 응답 객체의 형식을 포맷화합니다. 이로인해 controller 계층에 대한 테스팅 시, response 객체를 mocking하지 않아도 됩니다.

##### TryCatch Decorator example

```JS
export function TryCatch(statusCode: StatusCode) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        const response: Response = args[args.length - 2];

        return response
          .status(statusCode)
          .send(util.success(statusCode, instanceToPlain(result)));
      } catch (error) {
        const nextFn: NextFunction = args[args.length - 1];
        nextFn(error);
      }
    };
  };
}
```

#### 7.2 Release Custom Decorator

- 도입 배경

  Connection Pool에서 꺼낸 connection은 사용 후에 해제되어야 합니다. 그렇지 않으면 pool에서 사용할 수 있는 connection이 고갈되, 다른 요청의 처리에 영향을 줄 수 있습니다.

  Transaction Middleware를 global middleware로 설정하였기 때문에 모든 요청은 Connection Pool에서 연결을 가져오게 되는데, 일부 요청은 Transaction을 사용하지 않을 수 있기 때문에 해당 요청들에 대한 Connection 관리가 필요했습니다.

- 도입 시 얻은 이점

  Release Decorator를 구현함으로써 Transaction을 사용하지 않는 service method에서도 connection을 사용한 뒤 해제하여 Connection Pool을 관리 할 수 있게되었습니다.

  코드를 중복을 줄이고 모듈화된 방식으로 처리함으로써 코드의 응집성을 높이고 유지보수를 용이하게하고자 하였습니다.

##### Release Decorator example

```JS
export function Release() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Release Connection
    async function releaseConnWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(EXPRESS_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${EXPRESS_NAMESPACE} is not active`,
          "Release"
        );

      const conn = nameSpace.get(EXPRESS_ENTITY_MANAGER) as PoolConnection;
      if (!conn)
        throw new InternalServerErrorException(
          `Could not find pool in ${EXPRESS_NAMESPACE} nameSpace`,
          "Release"
        );

      try {
        const result = await originMethod.apply(this, args);
        return result;
      } finally {
        conn.release();
      }
    }

    descriptor.value = releaseConnWrapped;
  };
}
```

### 8. Validation

#### 구현 방식

class-transformer, class-validator 라이브러리를 사용하여 ValidationMiddleware를 구현하여 컨트롤러 또는 라우터에서 반복적으로 유효성 검사를 구현하는 코드 중복을 최소화하고자 하였습니다.

유효성 검사 실패 시 예외를 발생시키고, HttpExceptionFilter에서 이를 캐치하여 사용자에게 적절한 오류 응답을 제공합니다. 이로써 에러 처리 코드를 간소화하고, 응답 코드 및 메시지를 일관되게 관리할 수 있도록 구현하였습니다.

#### ValidationMiddleware example

```JS
@Service()
export class ValidationMiddleware {
  async use(req: Request, _res: Response, next: NextFunction, classType: any) {
    try {
      const instance = plainToInstance(classType, req.body);
      await validateOrReject(instance);

      req.body = instance;
      next();
    } catch (error: any) {
      next(...error);
    }
  }
}
```

### 9. Base Role Guard

#### 구현 방식

BaseRoleGuard를 구현해 여러 개의 permission 기반 guard에서 공통으로 사용되는 로직을 한 곳에 모아 코드 재사용성을 높이고 중복을 최소화하고자 하였습니다.

BaseRoleGuard를 상속하여 특정 guard에서 필요에 맞게 `abstract canActivate method`를 구현하여 특정 상황에 맞는 커스텀 로직을 구현하고자 하였습니다.

get method userRepository, postRepository를 `protected abstract method`로 구현하여, 해당 repository를 사용하고자 하는 permission guard에서만 접근 가능하도록 구현하였습니다.

#### BaseRoleGuard example

```JS
@Service()
export abstract class BaseRoleGuard<T> {
  private logger: Logger;
  protected abstract readonly loggerService: WinstonConfigService;
  protected abstract get userRepository(): UserRepository;
  protected abstract get postRepository(): PostRepository;

  constructor(private readonly classType: ClassConstructor<T>) {}

  protected async isPostOwner(userId: number, postId: number) {
    // ...
  }

  protected async validateRole(req: CustomRequest, next: NextFunction) {
    // ...
  }

  abstract canActivate(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
```

#### PostOwnerRoleGuard example

```js
@Service()
export class PostOwnerRoleGuard extends BaseRoleGuard<PostOwnerRoleGuard> {
  constructor(
    protected readonly loggerService: WinstonConfigService,
    protected readonly userRepository: UserRepository,
    protected readonly postRepository: PostRepository
  ) {
    super(PostOwnerRoleGuard);
  }

  protected getClass() {
    return PostOwnerRoleGuard.name;
  }

  getPostId(req: CustomRequest) {
    // ...
  }

  async canActivate(
    req: CustomRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId)
        throw new BadRequestException(
          "userId don't exist",
          PostOwnerRoleGuard.name,
          "canActivate"
        );

      const postId = this.getPostId(req);
      const isOwnered = await super.isPostOwner(req.userId, postId);

      if (isOwnered) return next();
      await super.validateRole(req, next);
    } catch (error) {
      next(error);
    }
  }
}
```
