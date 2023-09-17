import { Service } from "typedi";
import { MySQL } from ".";
import { PoolOptions } from "mysql2/promise";
import { DBConfig } from "../../../types/config";
import { ConfigService } from "../../config/config.service";

@Service()
export class MySQLModule extends MySQL {
  private readonly dbConfig: DBConfig;

  constructor(private readonly configService: ConfigService) {
    super();
    this.dbConfig = this.configService.getDBConfig();
    this.connect();
  }

  private connect() {
    const credentials: PoolOptions = {
      host: "localhost",
      user: this.dbConfig.DB_USER_NAME,
      password: this.dbConfig.DB_PASSWORD,
      database: this.dbConfig.DB_DATABASE,
      port: Number(this.dbConfig.DB_PORT),
      connectionLimit: 10,
      queueLimit: 0,
    };
    this.initailize(credentials);
  }
}
