import { ParseIntPipe } from "../parse.int.pipe";
import { CustomRequest } from "../../../types/common";
import { NextFunction, Response } from "express";
import { BadRequestException } from "../../exception/badRequest.exception";

describe("parseIntPipe Test", () => {
  const id = "123";
  let pipe: ParseIntPipe;
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    pipe = new ParseIntPipe();
    req = {
      params: {
        id, // 테스트용 id 값
      },
    } as unknown as CustomRequest;
    res = {} as Response;
    next = jest.fn();
  });

  it("Number로 변환 할 수 없는 값이 들어올 경우", () => {
    const invalidId = "invalid-id";
    req.params.id = invalidId;

    expect(() => pipe.use(req, res, next)).toThrowError(
      new BadRequestException(`Invalid id: ${invalidId}`)
    );
    expect(next).not.toBeCalled();
  });

  it("NumberString이 들어올 경우", () => {
    pipe.use(req, res, next);

    expect(req.parsedId).toBe(parseInt(id, 10));
    expect(next).toBeCalledTimes(1);
  });
});
