import { ResponseError } from "../../types/common/index";

export class UnauthorizedException extends ResponseError {
  constructor(readonly message: string) {
    super(message);
    this.status = 401;
  }
}
