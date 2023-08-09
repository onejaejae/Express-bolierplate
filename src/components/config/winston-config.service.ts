import { Service } from "typedi";
import { createLogger, transports, format, Logger } from "winston";
import winstonDaily from "winston-daily-rotate-file";
import { ConfigService } from "./config.service";

const { combine, timestamp, colorize, simple, printf, label } = format;

@Service()
export class WinstonConfigService {
  public logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const appService = this.configService.getAppConfig();

    this.logger = createLogger({
      format: this.printLogFormat().file,
      transports: [this.opt().error, this.opt().debug],
    });

    // 개발중일 때는 console에도 log를 출력해야하므로 file, console 두개를 생성
    // 운영중일 때는 file만 필요
    if (appService.ENV !== "production") {
      this.logger.add(this.opt().console);
    }
  }

  private printFormat() {
    return printf(({ timestamp, label, level, message }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });
  }

  private printLogFormat() {
    return {
      file: combine(
        label({
          label: "atant",
        }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        this.printFormat()
      ),
      console: combine(colorize(), simple()),
    };
  }

  private opt() {
    return {
      //   file: new transports.File({
      //     filename: "access.log",
      //     dirname: "./logs",
      //     level: "info",
      //     format: printLogFormat.file,
      //   }),
      error: new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: "./logs",
        filename: "%DATE%.error.log",
        maxSize: "50m",
        maxFiles: "30d",
        zippedArchive: true,
      }),
      // 모든 레벨 로그를 저장할 파일 설정
      debug: new winstonDaily({
        level: "debug",
        datePattern: "YYYY-MM-DD",
        dirname: "./logs",
        filename: "%DATE%.all.log",
        maxSize: "50m",
        maxFiles: "7d",
        zippedArchive: true,
      }),
      console: new transports.Console({
        level: "info",
        format: this.printLogFormat().console,
      }),
    };
  }
}
