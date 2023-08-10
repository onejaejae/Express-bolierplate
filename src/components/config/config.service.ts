import { Service } from "typedi";
import { AppConfig, DBConfig, JwtConfig } from "../../types/config";
import { configurations } from "./configuration";

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
