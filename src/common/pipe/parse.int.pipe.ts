import { NextFunction, Response } from "express";
import { Service } from "typedi";
import { CustomRequest } from "../../types/common";
import { BadRequestException } from "../exception/badRequest.exception";
import { ExecutionContext } from "../exception/execution.context";

@Service()
export class ParseIntPipe extends ExecutionContext<ParseIntPipe> {
  constructor() {
    super(ParseIntPipe);
  }

  use(req: CustomRequest, _res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) throw new BadRequestException(`id must be need`, this.getClass());
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId))
      throw new BadRequestException(`Invalid id: ${id}`, this.getClass());

    req.parsedId = parsedId;
    next();
  }
}
