import { Request, NextFunction } from "express";
import { ResponseError } from "../../../types/common";
import { HttpExceptionFilter } from "../http-exception.filter";
import { ConfigService } from "../../../components/config/config.service";
import { WinstonConfigService } from "../../../components/config/winston-config.service";
import statusCode from "../../constant/statusCode";

describe("HttpExceptionFilter Test", () => {
  let httpExceptionFilter: HttpExceptionFilter;
  let mockConfigService: ConfigService;
  let mockLoggerService: WinstonConfigService;
  let mockResponse: any;

  beforeAll(() => {
    mockConfigService = {
      getAppConfig: jest.fn(() => ({
        ENV: "test",
      })),
    } as unknown as ConfigService;

    mockLoggerService = {
      logger: { error: jest.fn() },
    } as unknown as WinstonConfigService;

    mockResponse = {
      status: jest.fn(),
      send: jest.fn(),
      req: {
        method: "GET",
        url: "/test",
      },
    };

    httpExceptionFilter = new HttpExceptionFilter(
      mockConfigService,
      mockLoggerService
    );
  });

  it("should set status and send error response", () => {
    // given
    const err: ResponseError = {
      name: "",
      status: 404,
      message: "Resource not found",
      callClass: "testClass",
      callMethod: "testMethod",
      stack: "testStack",
    } as unknown as ResponseError;
    const mockRequest: Request = {} as Request;
    const mockNext: NextFunction = {} as NextFunction;

    // when
    httpExceptionFilter.use(err, mockRequest, mockResponse, mockNext);

    // then
    expect(mockResponse.status).toHaveBeenCalledWith(statusCode.NOT_FOUND);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: err.message,
      callClass: err.callClass,
      callMethod: err.callMethod,
      stack: err.stack,
      status: err.status,
    });
    expect(mockLoggerService.logger.error).toBeCalledTimes(0);
  });
});
