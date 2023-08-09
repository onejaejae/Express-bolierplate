import { BaseEntity } from "../../database";

export class User extends BaseEntity {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
