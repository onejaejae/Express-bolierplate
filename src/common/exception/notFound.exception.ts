import { ResponseError } from "../../types/common/index";

export class NotFoundException extends ResponseError {
  constructor(readonly message: string) {
    super(message);
    this.status = 404;
  }
}
