import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { WinstonConfigService } from "../../components/config/winston-config.service";
import { ConfigService } from "../../components/config/config.service";

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
