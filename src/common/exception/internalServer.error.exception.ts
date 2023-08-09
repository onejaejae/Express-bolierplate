import { ResponseError } from "../../types/common/index";

export class InternalServerErrorException extends ResponseError {
  constructor(readonly message: string) {
    super(message);
    this.status = 500;
  }
}
