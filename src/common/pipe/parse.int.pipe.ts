import { NextFunction, Response } from "express";
import { Service } from "typedi";
import { CustomRequest } from "../../types/common";
import { BadRequestException } from "../exception/badRequest.exception";

@Service()
export class ParseIntPipe {
  use(req: CustomRequest, _res: Response, next: NextFunction) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    req.parsedId = parsedId;
    next();
  }
}
