import { ResponseError } from "../../types/common/index";

export class UnauthorizedException extends ResponseError {
  constructor(
    readonly message: string,
    readonly callClass: string,
    readonly callMethod?: string
  ) {
    super(message);
    this.status = 401;
    this.callClass = callClass;
    if (this.callMethod) this.callMethod = callMethod;
  }
}
