import { BaseEntity } from "../../database";

export class User extends BaseEntity {
  email: string;
  password: string;
  refreshToken: string;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }
}
