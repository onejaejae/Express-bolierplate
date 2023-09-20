import { Request, Response, NextFunction } from "express";
import { NotFoundExceptionFilter } from "../not-found.exception.filter";
import { ResponseError, StatusCode } from "../../../types/common";

describe("NotFoundExceptionFilter Test", () => {
  let notFoundExceptionFilter: NotFoundExceptionFilter;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    notFoundExceptionFilter = new NotFoundExceptionFilter();
    mockRequest = {} as Request;
    mockResponse = {
      req: {
        method: "GET",
        url: "/test",
      },
    } as any;
    mockNext = jest.fn();
  });

  it("should set status and send error response", () => {
    // given
    const error: ResponseError = new Error(
      `${mockResponse.req.method} ${mockResponse.req.url} Not Found`
    );
    error.status = StatusCode.NOT_FOUND;

    // when
    notFoundExceptionFilter.use(mockRequest, mockResponse, mockNext);

    // then
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
