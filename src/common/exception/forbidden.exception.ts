import { ResponseError } from "../../types/common/index";

export class ForbiddenException extends ResponseError {
  constructor(readonly message: string) {
    super(message);
    this.status = 403;
  }
}
