import { ResponseError } from "../../types/common/index";

export class MethodNotAllowedException extends ResponseError {
  constructor(readonly message: string) {
    super(message);
    this.status = 405;
  }
}
