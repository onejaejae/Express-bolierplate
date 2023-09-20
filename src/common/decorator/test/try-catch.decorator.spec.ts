import { NextFunction, Response } from "express";
import { BadRequestException } from "../../exception/badRequest.exception";
import { TryCatch } from "../try-catch.decorator";
import { StatusCode } from "../../../types/common";
import util from "../../util/response.util";
import { instanceToPlain } from "class-transformer";

const successMessage = "success";
const statusCode = StatusCode.CREATED;

class Mock {
  @TryCatch(statusCode)
  signUp(_req: any, _res: any, _next: NextFunction) {
    return successMessage;
  }

  @TryCatch(statusCode)
  payment(_req: any, _res: any, _next: NextFunction) {
    throw new BadRequestException("Test Exception", Mock.name, "payment");
  }
}

describe("Try-Catch Decorator Test", () => {
  it("method가 정상적으로 실행 된 경우", async () => {
    // Given
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const mockNext = jest.fn();
    const mockInstance = new Mock();

    // When
    await mockInstance.signUp("", mockResponse, mockNext);

    // then
    expect(mockResponse.status).toBeCalledWith(statusCode);
    expect(mockResponse.send).toBeCalledWith(
      util.success(statusCode, instanceToPlain(successMessage))
    );
    expect(mockNext).not.toBeCalled();
  });

  it("method에서 Exception이 발생하는 경우", async () => {
    // Given
    const mockNext = jest.fn();
    const moclInstance = new Mock();

    // When
    moclInstance.payment("", "", mockNext);

    // then
    expect(mockNext).toBeCalledWith(
      new BadRequestException("Test Exception", Mock.name, "payment")
    );
  });
});
