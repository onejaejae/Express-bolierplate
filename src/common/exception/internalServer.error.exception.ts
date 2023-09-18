import { ResponseError } from "../../types/common/index";

export class InternalServerErrorException extends ResponseError {
  constructor(
    readonly message: string,
    readonly callClass: string,
    readonly callMethod?: string
  ) {
    super(message);
    this.status = 500;
    this.callClass = callClass;
    if (this.callMethod) this.callMethod = callMethod;
  }
}
