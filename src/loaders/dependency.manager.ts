import { Container, Service } from "typedi";
import { TransactionMiddleware } from "../common/middleware/transaction.middleware";
import { LoggerMiddleware } from "../common/middleware/logger.middleware";
import { ConfigService } from "../components/config/config.service";
import { NotFoundExceptionFilter } from "../common/filter/not-found.exception.filter";
import { ForbiddenExceptionFilter } from "../common/filter/forbidden-exception.filter";
import { HttpExceptionFilter } from "../common/filter/http-exception.filter";
import { WinstonConfigService } from "../components/config/winston-config.service";
import UserController from "../components/user/controller/user.controller";
import { ParseIntPipe } from "../common/pipe/parse.int.pipe";
import AuthController from "../components/auth/controller/auth.controller";
import { AuthGuard } from "../common/guard/auth.guard";

@Service()
export class DependencyManager {
  getTransactionMiddleware(): TransactionMiddleware {
    return Container.get(TransactionMiddleware);
  }

  getWinstonLoggerService(): WinstonConfigService {
    return Container.get(WinstonConfigService);
  }

  getAuthGuard(): AuthGuard {
    return Container.get(AuthGuard);
  }

  getLoggerMiddleware(): LoggerMiddleware {
    return Container.get(LoggerMiddleware);
  }

  getConfigService(): ConfigService {
    return Container.get(ConfigService);
  }

  getNotFoundExceptionFilter(): NotFoundExceptionFilter {
    return Container.get(NotFoundExceptionFilter);
  }

  getForbiddenExceptionFilter(): ForbiddenExceptionFilter {
    return Container.get(ForbiddenExceptionFilter);
  }

  getHttpExceptionFilter(): HttpExceptionFilter {
    return Container.get(HttpExceptionFilter);
  }

  getParseIntPipe(): ParseIntPipe {
    return Container.get(ParseIntPipe);
  }

  getAuthController(): AuthController {
    return Container.get(AuthController);
  }

  getUserController(): UserController {
    return Container.get(UserController);
  }
}
