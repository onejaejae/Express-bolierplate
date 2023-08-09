import { ResponseError } from "../../types/common/index";

export class BadRequestException extends ResponseError {
  constructor(readonly message: string) {
    super(message);
    this.status = 400;
  }
}
