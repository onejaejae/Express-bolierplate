import { IUserJoinWithPost } from "../../../types/user";
import { BaseEntity } from "../../database";
import { Post } from "../../post/entity/post.entity";

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

export class UserWithoutPassword extends BaseEntity {
  email: string;

  constructor(email: string) {
    super();
    this.email = email;
  }
}

export class UserJoinWithPost
  extends UserWithoutPassword
  implements IUserJoinWithPost
{
  posts: Post[];

  constructor(email: string) {
    super(email);
  }
}
