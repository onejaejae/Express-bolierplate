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
import PostController from "../components/post/post.controller";
import { PostOwnerRoleGuard } from "../common/guard/post.owner.role.guard";
import { ValidationExceptionFilter } from "../common/filter/validation-exception.filter";
import { ValidationMiddleware } from "../common/middleware/validation.middleware";

@Service()
export class DependencyManager {
  getTransactionMiddleware(): TransactionMiddleware {
    return Container.get(TransactionMiddleware);
  }

  getValidationMiddleware(): ValidationMiddleware {
    return Container.get(ValidationMiddleware);
  }

  getWinstonLoggerService(): WinstonConfigService {
    return Container.get(WinstonConfigService);
  }

  getAuthGuard(): AuthGuard {
    return Container.get(AuthGuard);
  }

  getPostOwnerRoleGuard(): PostOwnerRoleGuard {
    return Container.get(PostOwnerRoleGuard);
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

  getValidationExceptionFilter(): ValidationExceptionFilter {
    return Container.get(ValidationExceptionFilter);
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

  getPostController(): PostController {
    return Container.get(PostController);
  }
}
